import type { QuizData, Score } from '../types'

interface Props {
  data: QuizData
  scores: Record<string, Score>
  ui: { introTitle: string; questionsSuffix: string; scoredSuffix: string; footer: string }
  onPick: (index: number) => void
}

export default function CategoryGrid({ data, scores, ui, onPick }: Props) {
  return (
    <>
      <div className="intro-card">
        <h2>{ui.introTitle}</h2>
        <p>{data.description}</p>
      </div>
      <div className="grid">
        {data.categories.map((cat, i) => {
          const sc = scores[cat.id]
          return (
            <button key={cat.id} className="cat-tile" onClick={() => onPick(i)}>
              <div className="icon">{cat.icon}</div>
              <div className="title">{cat.title}</div>
              <div className="meta">{cat.intro}</div>
              {sc ? (
                <span className="score-pill done">
                  {sc.correct}/{sc.total} {ui.scoredSuffix}
                </span>
              ) : (
                <span className="score-pill">
                  {cat.questions.length} {ui.questionsSuffix}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div className="footer-note">{ui.footer}</div>
    </>
  )
}
