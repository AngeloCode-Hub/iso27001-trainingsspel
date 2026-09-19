import { useEffect, useState } from 'react'
import CategoryGrid from './components/CategoryGrid'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import type { Lang, QuizData, Score } from './types'

type Screen = 'home' | 'quiz' | 'result'

const UI: Record<Lang, {
  subtitle: string
  introTitle: string
  questionsSuffix: string
  scoredSuffix: string
  footer: string
}> = {
  nl: {
    subtitle: 'Kies een onderwerp om te starten',
    introTitle: 'Hoe goed ken jij het ISMS?',
    questionsSuffix: 'vragen',
    scoredSuffix: 'gescoord',
    footer: 'Gebaseerd op het informatiebeveiligingsbeleid en de handboeken van Response B.V. · Alleen voor intern gebruik'
  },
  en: {
    subtitle: 'Choose a topic to get started',
    introTitle: 'How well do you know the ISMS?',
    questionsSuffix: 'questions',
    scoredSuffix: 'scored',
    footer: "Based on Response B.V.'s information security policy and handbooks · For internal use only"
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem('r27001_lang') as Lang) || 'nl'
  )
  const [data, setData] = useState<QuizData | null>(null)
  const [screen, setScreen] = useState<Screen>('home')
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null)
  const [scores, setScores] = useState<Record<string, Score>>(() => {
    try {
      return JSON.parse(localStorage.getItem('r27001_scores') || '{}')
    } catch {
      return {}
    }
  })

  // Fetch the question set for the current language from the C# backend.
  useEffect(() => {
    fetch(`/api/quiz?lang=${lang}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
  }, [lang])

  useEffect(() => {
    localStorage.setItem('r27001_lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('r27001_scores', JSON.stringify(scores))
  }, [scores])

  if (!data) {
    return (
      <div id="app">
        <p style={{ padding: 24 }}>
          Loading quiz data… (is the backend running on http://localhost:5199?)
        </p>
      </div>
    )
  }

  const t = UI[lang]

  function handlePickCategory(i: number) {
    setCategoryIndex(i)
    setScreen('quiz')
  }

  function handleFinishCategory(categoryId: string, correct: number, total: number) {
    setScores((prev) => ({ ...prev, [categoryId]: { correct, total } }))

    // Fire-and-forget: log the result to the backend as training-record evidence.
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeName: 'anonymous', // replace with the logged-in user once Cirxion auth is wired in
        categoryId,
        correct,
        total,
        lang
      })
    }).catch(() => {
      /* non-blocking: a failed log shouldn't block the UI */
    })

    setScreen('result')
  }

  return (
    <div id="app">
      <div className="header">
        <div className="logo">R</div>
        <div className="titles">
          <h1>{data.title}</h1>
          {screen === 'home' && <p>{t.subtitle}</p>}
        </div>
        <div className="lang-toggle">
          <button className={lang === 'nl' ? 'active' : ''} onClick={() => setLang('nl')}>NL</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>

      {screen === 'home' && (
        <CategoryGrid data={data} scores={scores} ui={t} onPick={handlePickCategory} />
      )}

      {screen === 'quiz' && categoryIndex !== null && (
        <QuizScreen
          category={data.categories[categoryIndex]}
          lang={lang}
          onBack={() => setScreen('home')}
          onFinish={(correct, total) =>
            handleFinishCategory(data.categories[categoryIndex!].id, correct, total)
          }
        />
      )}

      {screen === 'result' && categoryIndex !== null && (
        <ResultScreen
          category={data.categories[categoryIndex]}
          score={scores[data.categories[categoryIndex].id]}
          lang={lang}
          onRetry={() => setScreen('quiz')}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  )
}
