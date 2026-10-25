"""Extract participant-facing definitions from the supplied Qualtrics export."""
import json
from pathlib import Path
root = Path(__file__).resolve().parent.parent
source = json.loads((root / 'LEAP-Q_full.qsf').read_text())
elements = source['SurveyElements']
questions = {e['PrimaryAttribute']: e['Payload'] for e in elements if e['Element'] == 'SQ'}
blocks = next(e['Payload'] for e in elements if e['Element'] == 'BL')
flow = next(e['Payload'] for e in elements if e['Element'] == 'FL')['Flow']
options = next(e['Payload'] for e in elements if e['Element'] == 'SO')
pages = []
for block_ref in flow:
    block = next(b for b in blocks.values() if b['ID'] == block_ref['ID'])
    page = []
    loop = block.get('Options', {}).get('Looping') == 'Question'
    for item in block['BlockElements']:
        if item['Type'] == 'Page Break':
            pages.append({'loop': loop, 'questions': page})
            page = []
        elif item['Type'] == 'Question':
            page.append(item['QuestionID'])
        else:
            raise ValueError(f'Unsupported block element: {item}')
    if page:
        pages.append({'loop': loop, 'questions': page})
used = {qid for p in pages for qid in p['questions']}
keep = ['QuestionID', 'QuestionText', 'QuestionType', 'Selector', 'Choices', 'ChoiceOrder', 'Validation', 'Configuration', 'Labels', 'ClarifyingSymbol', 'DataExportTag']
data = {
    'name': source['SurveyEntry']['SurveyName'],
    'surveyId': source['SurveyEntry']['SurveyID'],
    'options': {k: options[k] for k in ['BackButton', 'SaveAndContinue', 'ProgressBarDisplay', 'NextButton', 'PartialData']},
    'pages': pages,
    'questions': {qid: {k: p[k] for k in keep if k in p} for qid, p in questions.items() if qid in used},
}
(root / 'qsf-data.js').write_text('// Generated from LEAP-Q_full.qsf. Run python3 scripts/build-questionnaire.py after source changes.\n'
                                  'globalThis.LEAPQ_SOURCE = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
