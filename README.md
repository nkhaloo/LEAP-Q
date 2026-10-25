# LEAP-Q online questionnaire

A build-free HTML, CSS, and JavaScript survey for GitHub Pages. It contains the English LEAP-Q background questions (1–9) and language questions (1–7), repeated for each language listed, up to five. There are no audio tasks, attention checks, or other experiment questions.

The source is the [official English LEAP-Q](https://bilingualism.northwestern.edu/leapq/) by Marian, Blumenfeld, & Kaushanskaya (2007). An unchanged copy of the downloaded English Word questionnaire is in [reference/LEAPQ2007-official.docx](reference/LEAPQ2007-official.docx). The web version changes the layout, replaces references to Word menus with web controls, substitutes “this language” for language-name blanks, and repeats the language section for all listed languages. It preserves the questionnaire items and all original 0–10 response labels, including the original Male/Female options. It does not add study-specific questions.

## 1. Connect the spreadsheet

The receiver already points to spreadsheet **121p3XrVm4ssktWA2lbexkFAHo-MPBnNENyMQOrvL78A**, tab **gid=0**:

[Open the target spreadsheet](https://docs.google.com/spreadsheets/d/121p3XrVm4ssktWA2lbexkFAHo-MPBnNENyMQOrvL78A/edit?gid=0#gid=0)

1. Open that spreadsheet under the Google account that can edit it. Choose **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with the **entire contents of [apps-script.txt](apps-script.txt)**. Save. No additional Apps Script files or libraries are needed.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Authorize the script and deploy. Participants should not need to sign in to Google. If your organization does not allow anonymous web apps, its policy must be resolved before this setup can collect public responses.
4. Copy the **Web app URL**, ending in `/exec` (not `/dev`).
5. Paste it into [config.js](config.js):

   ```js
   window.LEAPQ_CONFIG = {
     appsScriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   };
   ```

Do not paste the spreadsheet URL into `config.js`. Do not reuse the earlier accent experiment's receiver. This questionnaire has its own data schema.

The tab with `gid=0` must be empty on the first submission. The script creates a header row automatically. If that tab already has unrelated data, the receiver refuses to append responses to mismatched headers; use a new empty tab and change `TARGET_SHEET_ID` to that tab's numeric gid in the script. Existing rows are never cleared. Keep the spreadsheet private; only the web app needs anonymous access.

## 2. Host on GitHub Pages

1. Commit and push these files to this repository's default branch.
2. In the GitHub repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, the default branch, and **/ (root)**; save.
4. The expected URL for this repo is **https://nkhaloo.github.io/LEAP-Q/** once GitHub finishes deployment.

No npm install, bundler, or build is needed. All assets are local and paths work under the `/LEAP-Q/` project path. `.nojekyll` is included.

If you use a different GitHub account or a custom domain, update `ALLOWED_ORIGINS` in Apps Script to match the exact site origin, without a trailing slash or repo path, and redeploy. This allowlist controls which page receives acknowledgements; it is not authentication for the public receiver. The browser sends responses via a hidden form/iframe and receives an explicit, nonce-bound `postMessage` after the sheet write succeeds. It does not use an opaque `fetch(no-cors)` response as evidence of a save.

## 3. Verify before collecting responses

1. Open the deployed survey in a private browser window.
2. Complete a test response, including a 0 rating, an N/A age milestone, and a second language. Confirm that percentages must total 100 in each group.
3. Submit and confirm that the page says **Your questionnaire has been saved**.
4. Check that exactly one new row appears in the target sheet and that the answers match. Delete only your test response row afterward.
5. Test on a phone as well. If the receiver changes, choose **Deploy → Manage deployments → Edit → New version → Deploy**; saving Apps Script alone does not update the deployed version.

The repository does not include a deployed Apps Script URL or claim a live spreadsheet write has been verified. Completing the deployment steps above is required for collection.

## Survey behavior

- Dominance and acquisition lists must contain the same languages, without duplicates or skipped rows. One to five languages are supported.
- Each percentage group must total 100%; 0 and decimal percentages are accepted.
- Original 0–10 rating labels are shown in dropdowns, with no default responses. A blank rating is different from 0.
- Language ages accept a numeric age (including decimals) or `N/A`. This avoids forcing a literacy or fluency milestone that has not occurred. Language environment durations accept years and months; months range from 0 to 11.
- Personal details, education, immigration, cultures, and health checkboxes may be left blank. A named culture requires an identification rating; checked health items require an explanation; “Other” education requires text. Language percentages and each language's ratings, ages, and environment durations are required.
- Back navigation retains answers. Reordering the dominance list keeps existing language answers attached to their language; a renamed/new language starts with blank language answers.
- Answers exist only in memory in the current tab. There are no cookies, analytics, or local storage. Reloading or closing the tab loses unsubmitted answers. The page warns before leaving with answers entered.
- The server confirms successful saves. Failed or unconfirmed saves keep the answers in the tab. Retrying an unchanged submission reuses its ID so it does not create another row. A 60-second timeout is reported as unconfirmed rather than success.

## Spreadsheet layout

One row per complete response. The first three columns are `received_at_utc`, `submission_id`, and `questionnaire_version`, followed by stable field keys:

| Columns | Meaning |
| --- | --- |
| `last_name`, `first_name`, `today`, `age`, `birth_date`, `sex` | Original personal details |
| `dominance_1` … `dominance_5` | Language names, in dominance order |
| `acquisition_1` … `acquisition_5` | Language names, in acquisition order |
| `current_N`, `reading_N`, `speaking_N` | Q3–Q5 percentages for language in dominance slot N |
| `culture_N`, `culture_rating_N` | Q6 cultural identification |
| `education_*`, `immigration_*`, `health_*` | Q7–Q9 background responses |
| `lN_order`, `lN_age_0` … `lN_age_3` | Language N's acquisition position and age milestones |
| `lN_environment_J_years`, `lN_environment_J_months` | Environment J: 0 country, 1 family, 2 school/work |
| `lN_proficiency_J` | 0 speaking, 1 understanding spoken language, 2 reading |
| `lN_learning_J` | 0 friends, 1 family, 2 reading, 3 tapes/self instruction, 4 TV, 5 radio |
| `lN_exposure_J` | 0 friends, 1 family, 2 TV, 3 radio/music, 4 reading, 5 language-lab/self-instruction |
| `lN_accent`, `lN_identified` | Perceived foreign accent and frequency of identification as a non-native speaker |

N is 1–5 and corresponds to `dominance_N`. All five slots have columns; unused language cells are blank. Checked health conditions are `Yes`; unchecked conditions are `No`. An unchecked box does not distinguish a negative answer from a skipped question. Free-text values that could execute as spreadsheet formulas are escaped. Ratings, percentages, age, education years, and environment durations are numeric spreadsheet cells; age milestones remain text to support `N/A`.

## Local preview and maintenance

```sh
python3 -m http.server 8000
```

Open **http://localhost:8000**. That origin and `http://127.0.0.1:8000` are already allowed by the receiver. Submission still requires a deployed Apps Script URL.

`questionnaire.js` defines fields, scale labels, and validation shared with Apps Script. If it changes, regenerate the paste-ready file and rerun checks:

```sh
python3 scripts/build-apps-script.py
node --check app.js
node --check questionnaire.js
node --test tests/questionnaire.test.cjs
```

Optional browser integration checks are in `tests/browser.cjs`. They require Playwright with Chromium installed and the local server running. Run `node tests/browser.cjs` in an environment that can resolve the `playwright` package. These checks use a simulated receiver to test confirmed saves and retries; they do not write test data to Google Sheets.

The receiver source is `scripts/apps-script-backend.js`. Regenerate `apps-script.txt` after changes, paste it into Apps Script, and deploy a new version. Changing field keys requires a matching new empty sheet tab (or a deliberate data migration); the receiver checks headers rather than mixing schemas.

## Citation

Marian, V., Blumenfeld, H. K., & Kaushanskaya, M. (2007). The Language Experience and Proficiency Questionnaire (LEAP-Q): Assessing language profiles in bilinguals and multilinguals. *Journal of Speech, Language, and Hearing Research, 50*(4), 940–967.
