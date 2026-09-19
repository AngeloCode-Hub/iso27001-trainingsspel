import { useState } from 'react'
import type { Category, Lang } from '../types'

interface Props {
  category: Category
  lang: Lang
  onBack: () => void
  onFinish: (correct: number, total: number) => void
}

const LABELS: Record<Lang, {
  backToTopics: string
  questionOf: (i: number, n: number) => string
  next: string
  result: string
  correctVerdict: string
  incorrectVerdict: string
}> = {
  nl: {
    backToTopics: '← Onderwerpen',
    questionOf: (i, n) => `Vraag ${i} van ${n}`,
    next: 'Volgende vraag →',
    result: 'Bekijk resultaat →',
    correctVerdict: '✅ Goed geantwoord!',
    incorrectVerdict: '❌ Niet helemaal.'
  },
  en: {
    backToTopics: '← Topics',
    questionOf: (i, n) => `Question ${i} of ${n}`,
    next: 'Next question →',
    result: 'See result →',
    correctVerdict: '✅ Correct!',
    incorrectVerdict: '❌ Not quite.'
  }
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuizScreen({ category, lang, onBack, onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const t = LABELS[lang]
  const q = category.questions[qIndex]
  const total = category.questions.length
  const pct = Math.round((qIndex / total) * 100)
  const answered = selected !== null

  function pick(i: number) {
    if (answered) return
    setSelected(i)
    if (q.options[i].correct) setCorrectCount((c) => c + 1)
  }

  function next() {
    if (qIndex + 1 < total) {
      setQIndex(qIndex + 1)
      setSelected(null)
    } else {
      onFinish(correctCount, total)
    }
  }

  return (
    <>
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>{t.backToTopics}</button>
        <div className="cat-label">{category.icon} {category.title}</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="q-counter">{t.questionOf(qIndex + 1, total)}</div>
      <div className="scenario-card"><p>{q.scenario}</p></div>
      <div className="options">
        {q.options.map((opt, i) => {
          let cls = 'option-btn'
          if (answered) {
            if (opt.correct) cls += ' correct'
            else if (i === selected) cls += ' incorrect'
            else cls += ' dim'
          }
          return (
            <button key={i} className={cls} disabled={answered} onClick={() => pick(i)}>
              <span className="letter">{LETTERS[i]}</span>
              <span>{opt.text}</span>
            </button>
          )
        })}
      </div>
      {answered && selected !== null && (
        <>
          <div className={`feedback-box ${q.options[selected].correct ? 'correct' : 'incorrect'}`}>
            <span className="verdict">
              {q.options[selected].correct ? t.correctVerdict : t.incorrectVerdict}
            </span>
            {q.options[selected].feedback}
            <div className="explain">{q.explanation}</div>
          </div>
          <button className="next-btn" onClick={next}>
            {qIndex + 1 < total ? t.next : t.result}
          </button>
        </>
      )}
    </>
  )
}
