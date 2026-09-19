# Response ISO 27001 Awareness Game

A multiple-choice scenario game about information security, based on Response B.V.'s ISMS (Information Security Management System). Employees pick a topic and work through realistic work situations — phishing, passwords, clean desk, data sharing, remote work, incident reporting, and social media — each with instant feedback and an explanation grounded in company policy.

Available in Dutch and English (toggle in the app).

## Try it

Open `index.html` in any browser — no build step, no server needed. It's a single self-contained HTML file.

## Project structure

```
response-iso27001-awareness-game/
├── index.html                              # standalone playable demo (NL/EN, self-contained, no server needed)
├── data/
│   ├── iso27001-quiz-data-nl.json          # Dutch question set (source of truth)
│   ├── iso27001-quiz-data-en.json          # English question set
│   └── iso27001-quiz-data-bilingual.json   # both languages combined, keyed by { "nl": ..., "en": ... }
├── backend/                                 # ASP.NET Core minimal API
│   ├── Program.cs                          # serves quiz data, logs scores
│   ├── Data/iso27001-quiz-data-bilingual.json
│   └── Iso27001Game.Api.csproj
├── frontend/                                # React + TypeScript + Vite
│   └── src/
│       ├── App.tsx                         # screen state, language toggle, name input
│       └── components/                     # CategoryGrid, QuizScreen, ResultScreen
└── README.md
```

## Data format

Each language file follows this structure:

```json
{
  "title": "...",
  "description": "...",
  "categories": [
    {
      "id": "phishing",
      "title": "Phishing & Social Engineering",
      "icon": "🎣",
      "intro": "...",
      "questions": [
        {
          "id": "phishing-1",
          "scenario": "...",
          "options": [
            { "text": "...", "correct": false, "feedback": "..." },
            { "text": "...", "correct": true,  "feedback": "..." }
          ],
          "explanation": "..."
        }
      ]
    }
  ]
}
```

Category `id`s and question `id`s are identical across the NL and EN files, so scores are tracked consistently regardless of which language is being played.

## Current content

7 categories, 28 scenario questions total:

- 🎣 Phishing & Social Engineering
- 🔑 Passwords & Access
- 🗄️ Clean Desk & Clear Screen
- ☁️ Data Sharing & Cloud
- 📱 Remote Work & Mobile Devices
- 🚨 Reporting Incidents
- 💬 Social Media & Work/Personal Boundaries

## Running the full-stack version (React + C#)

Two terminals, from the repo root:

```bash
cd backend
dotnet run
```

```bash
cd frontend
npm install
npm run dev
```

The frontend (http://localhost:5173) fetches questions from the backend (http://localhost:5199) via `/api/quiz?lang=nl|en`, and logs a score record to `backend/Data/scores.json` each time an employee finishes a category via `POST /api/scores`. That log is kept out of git (see `backend/.gitignore`) since it fills up with real usage data — export or migrate it to a proper database before relying on it for actual ISO 27001 training-record evidence.

### Backend API

- `GET /api/quiz?lang=nl|en` — the question set for one language
- `POST /api/scores` — records `{ employeeName, categoryId, correct, total, lang }`
- `GET /api/scores` — all recorded scores (for an overview/export)

### Known limitation

`employeeName` is currently typed in by hand in the app (a plain text field, no validation) — it isn't tied to a real login yet. Swap it for Cirxion's actual authenticated user once this is wired into the real application, so scores can't be misattributed.

## Next steps for Cirxion integration

- Replace the free-text name field with Cirxion's real authenticated user identity.
- Move score storage from a flat JSON file to a proper database (the existing `/api/scores` endpoints can stay the same; only the storage layer needs to change).
- Add an admin view for HR/the Security Officer to see completion status per employee — this is what would satisfy the training-registration requirement described in the ISMS (Handboek Mensgerichte maatregelen, §4.3).

- **React rewrite**: the current screens (topic grid → scenario/quiz screen → result screen) map cleanly onto three components (`CategoryGrid`, `QuizScreen`, `ResultScreen`), consuming the same JSON shape via props/state.
- **C# / ASP.NET Core backend**: to integrate into the Cirxion application — serving the question set via an API, and persisting per-employee scores/completion as training-record evidence for ISO 27001 awareness training (see the ISMS's employee-facing information security policy and Handboek Mensgerichte maatregelen for the training-registration requirement this could help satisfy).

## Attribution

Scenarios are derived from Response B.V.'s internal ISMS documentation (information security policy for employees, technical/organizational/physical/human-focused measures handbooks, and the incident register). Intended for internal use only.
