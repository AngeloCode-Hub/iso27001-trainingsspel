# Response ISO 27001 Awareness Game

A multiple-choice scenario game about information security, based on Response B.V.'s ISMS (Information Security Management System). Employees pick a topic and work through realistic work situations — phishing, passwords, clean desk, data sharing, remote work, incident reporting, and social media — each with instant feedback and an explanation grounded in company policy.

Available in Dutch and English (toggle in the app).

## Try it

Open `index.html` in any browser — no build step, no server needed. It's a single self-contained HTML file.

## Project structure

```
response-iso27001-awareness-game/
├── index.html                              # the playable game (NL/EN, self-contained)
├── data/
│   ├── iso27001-quiz-data-nl.json          # Dutch question set (source of truth)
│   ├── iso27001-quiz-data-en.json          # English question set
│   └── iso27001-quiz-data-bilingual.json   # both languages combined, keyed by { "nl": ..., "en": ... }
│                                            # (this is what's embedded in index.html)
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

## Roadmap / integration notes

This started as a standalone HTML prototype. Planned next steps:

- **React rewrite**: the current screens (topic grid → scenario/quiz screen → result screen) map cleanly onto three components (`CategoryGrid`, `QuizScreen`, `ResultScreen`), consuming the same JSON shape via props/state.
- **C# / ASP.NET Core backend**: to integrate into the Cirxion application — serving the question set via an API, and persisting per-employee scores/completion as training-record evidence for ISO 27001 awareness training (see the ISMS's employee-facing information security policy and Handboek Mensgerichte maatregelen for the training-registration requirement this could help satisfy).

## Attribution

Scenarios are derived from Response B.V.'s internal ISMS documentation (information security policy for employees, technical/organizational/physical/human-focused measures handbooks, and the incident register). Intended for internal use only.
