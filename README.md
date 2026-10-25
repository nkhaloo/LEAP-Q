# LEAP-Q (full) — QSF-based HTML survey

The HTML survey follows the supplied **[LEAP-Q_full.qsf](LEAP-Q_full.qsf)**. That file is the source of truth for question wording, controls, response options, validation, page breaks, and language loops. The earlier Word-based questionnaire has been replaced.

## Required update to your existing Apps Script deployment

Your deployment URL is already in [config.js](config.js) and has been preserved. The receiver must be updated because the QSF uses a different response schema:

1. Open the Apps Script project for your existing deployment.
2. Replace all of `Code.gs` with the entire updated **[apps-script.txt](apps-script.txt)** and save.
3. Choose **Deploy → Manage deployments → Edit → New version → Deploy**. Keep **Execute as: Me** and **Who has access: Anyone**. Updating the existing deployment keeps the same `/exec` URL.
4. Push the updated website files to GitHub. Pages should serve from **main**, **/ (root)**.
5. Submit a test response and check the new **LEAP-Q QSF** tab in [your spreadsheet](https://docs.google.com/spreadsheets/d/121p3XrVm4ssktWA2lbexkFAHo-MPBnNENyMQOrvL78A/edit).

The receiver creates that dedicated tab automatically. It preserves any previous questionnaire data in the original tab. A mismatched header in the QSF tab causes a save error rather than overwriting data. The spreadsheet itself can remain private. The old deployed receiver will reject the new questionnaire version until you update it.

Expected Pages URL: **https://nkhaloo.github.io/LEAP-Q/**.

## Participant-facing structure

| Page | QSF questions, in order |
| --- | --- |
| 1 | Age; gender (Male, Female, Other with text); five languages in dominance order; five languages in acquisition order |
| 2 | Current exposure percentages; reading preference percentages; speaking preference percentages; five cultures; formal education years; education level checkboxes; USA immigration; other immigration; health checkboxes with a separate text entry for each condition |
| One page per listed language | Language introduction; four age milestone text entries; three language-environment text entries; separate speaking, understanding, and reading proficiency radio groups; learning-factor sliders; current-exposure sliders; foreign-accent radio group; non-native-identification radio group |

The language block loops over nonempty dominance entries in their original order, including entries after gaps. Language names are piped into the questions. The QSF has no randomization. Each percentage group has all five piped rows, even if some names are blank.

The original QSF controls are retained: single-choice radio buttons; multi-choice education and health checkboxes; text inputs for ages, durations, and immigration; 0–10 sliders for learning and exposure; and the original 0–10 radio labels for proficiency and accent. Sliders have the source's near-midpoint start positions and three anchor labels, do not show a numeric readout, and are optional. An untouched slider is stored as blank; moving it to 0 stores a numeric zero. Responses use zero decimal places as configured in the QSF.

There is no Back button, review page, progress indicator, name, birth date, date-of-survey question, culture-identification scale, or native/second-language selector. These are absent from the supplied QSF. Next is the source's right arrow. The page uses a plain survey layout; Qualtrics' proprietary theme assets are not bundled in a QSF export, so the website recreates the structure and controls rather than loading the hosted Qualtrics skin.

## Validation mirrors the file

- Age and gender are required. Age is a text entry without a numeric restriction, matching its QSF settings.
- The first dominance, acquisition, and culture entries are required by the QSF's custom validation. The QSF does not require matching language lists, reject duplicates, or prevent gaps; this HTML version does not add those rules.
- Each percentage group must total 100. Blank cells contribute 0. Per-cell range enforcement is disabled in the QSF and is not added here.
- Education years must be a number; at least one education checkbox is required. The education question is multi-select in the source, even though its wording asks for the highest level.
- Each language's speaking, understanding, reading, perceived accent, and identification-frequency radio answers are required.
- Language ages, environment durations, both slider groups, immigration, health, and extra text beside choices are optional. The QSF has no force-text rule for “Other” or checked health items.
- Environment durations use one free-text input per environment (for example, “2 years, 6 months”), as in the QSF, rather than separate years/months fields.

## Saving and resuming

The QSF enables Save and Continue. The HTML version saves the current draft on this browser/device for up to one week since last activity. Reloading resumes the current page. Successful submission removes the local draft. Avoid a shared browser for participant responses; local drafts can include health explanations. If browser storage is unavailable, the page reports that it cannot save progress locally.

Only completed submissions go to Google Sheets. Qualtrics-specific infrastructure such as server-side partial response closure after a week, its cookies, account settings, proprietary rendering, and its network/location metadata are not reproduced by a static GitHub Pages site. The participant questions and survey flow come directly from the QSF.

The receiver acknowledges the actual spreadsheet write. Failed or unconfirmed submissions retain answers for retry. The same unchanged response uses the same submission ID, including after a reload, to avoid duplicate rows. A save is never reported as successful solely from an opaque `no-cors` request.

The public receiver's allowed page origins are `https://nkhaloo.github.io`, `http://localhost:8000`, and `http://127.0.0.1:8000`. Change `ALLOWED_ORIGINS` if the website origin changes, then redeploy. This origin list controls acknowledgement destinations; it is not authentication for the public survey endpoint.

## Data format

One row per response in **LEAP-Q QSF**, starting with `received_at_utc`, `submission_id`, and `questionnaire_version`. Field names use QSF IDs because its `DataExportTag` names are not unique (for example, `Q25` is reused).

| Key format | Meaning |
| --- | --- |
| `QID2`, `QID3` | Age text and gender choice ID |
| `QID3_3_TEXT` | Gender “Other” text |
| `QID4_N`, `QID5_N` | Dominance and acquisition entries, N = 1–5 |
| `QID6_N`, `QID7_N`, `QID8_N` | Numeric current-exposure, reading, and speaking percentages |
| `QID9_N` | Culture names |
| `QID10` | Numeric formal education years |
| `QID11_N`, `QID11_9_TEXT` | Education checkbox values (`Yes`/`No`) and Other text |
| `QID43`, `QID44` | USA and other-country immigration text |
| `QID12_N`, `QID12_N_TEXT` | Health checkbox values (`Yes`/`No`) and separate explanations |
| `LS_QID22_N` | Age milestone text, N = 1–4, for dominance slot S |
| `LS_QID23_N` | Country, family, school/work duration text, N = 1–3 |
| `LS_QID24`, `LS_QID39`, `LS_QID38` | Speaking, understanding, reading radio choice IDs |
| `LS_QID25_N`, `LS_QID40_N` | Learning/exposure slider numeric values 0–10 |
| `LS_QID41`, `LS_QID42` | Accent and identification-frequency radio choice IDs |

S is the original dominance row, 1–5. Only nonempty dominance rows generate language pages. Inactive language columns remain blank. Both slider groups use this row order: friends, family, reading, language apps or websites/self instruction, TV, radio/music.

**Radio responses store original QSF choice IDs.** Gender is 1 = Male, 2 = Female, 3 = Other. The 0–10 radio scales use IDs **1–11**, so **choice ID minus one is the displayed rating**. Slider responses already contain the displayed 0–10 rating. Choice labels and the complete field mapping are available in [DATA_DICTIONARY.md](DATA_DICTIONARY.md). Free-text cells that could execute as spreadsheet formulas are escaped.

## Development and checks

No build or package installation is needed to serve the website:

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. The configured deployment still needs the updated receiver before it can accept submissions.

If the source QSF or shared validation changes, regenerate the bundled data and paste-ready script:

```sh
python3 scripts/build-questionnaire.py
python3 scripts/build-apps-script.py
node scripts/build-data-dictionary.cjs
node --check app.js
node --check questionnaire.js
node --test tests/questionnaire.test.cjs
```

The optional Playwright checks in `tests/browser.cjs` require Chromium and a local preview server. With Playwright available to Node, run `node tests/browser.cjs`. They test page order, loops, controls, saved progress, simulated receiver failures/retries, mobile widths, and safe language-name substitution. They do not write to the live spreadsheet.

Key files: `LEAP-Q_full.qsf` (supplied source), `qsf-data.js` (generated definitions), `questionnaire.js` (shared schema/validation), `app.js` (HTML renderer and submission), `scripts/apps-script-backend.js` (receiver), `apps-script.txt` (complete copy/paste receiver), and `config.js` (existing deployment URL).
