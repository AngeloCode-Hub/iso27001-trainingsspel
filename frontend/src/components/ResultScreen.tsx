import type { Category, Lang, Score } from '../types'

interface Props {
  category: Category
  score?: Score
  lang: Lang
  onRetry: () => void
  onHome: () => void
}

const LABELS: Record<Lang, {
  backToTopics: string
  topicDone: string
  tryAgain: string
  otherTopic: string
  msg: (ratio: number) => string
}> = {
  nl: {
    backToTopics: '← Onderwerpen',
    topicDone: 'Onderdeel afgerond',
    tryAgain: 'Opnieuw proberen',
    otherTopic: 'Ander onderwerp',
    msg: (r) =>
      r === 1
        ? 'Perfect! Je kent dit onderdeel van het ISMS uit je hoofd.'
        : r >= 0.75
        ? 'Sterk gedaan — bijna alles goed.'
        : r >= 0.5
        ? 'Goede basis, met ruimte om te verdiepen.'
        : "Goed om deze scenario's nog eens door te nemen."
  },
  en: {
    backToTopics: '← Topics',
    topicDone: 'Topic completed',
    tryAgain: 'Try again',
    otherTopic: 'Different topic',
    msg: (r) =>
      r === 1
        ? 'Perfect! You know this part of the ISMS by heart.'
        : r >= 0.75
        ? 'Well done — almost everything correct.'
        : r >= 0.5
        ? 'Good foundation, with room to go deeper.'
        : 'Worth reviewing these scenarios again.'
  }
}

export default function ResultScreen({ category, score, lang, onRetry, onHome }: Props) {
  const t = LABELS[lang]
  const correct = score?.correct ?? 0
  const total = score?.total ?? category.questions.length
  const ratio = total ? correct / total : 0
  const icon = ratio === 1 ? '🏆' : ratio >= 0.75 ? '💪' : ratio >= 0.5 ? '👍' : '🌱'

  return (
    <>
      <div className="quiz-header">
        <button className="back-btn" onClick={onHome}>{t.backToTopics}</button>
        <div className="cat-label">{category.icon} {category.title}</div>
      </div>
      <div className="result-card">
        <div className="big-icon">{icon}</div>
        <h2>{t.topicDone}</h2>
        <div className="score-big">{correct} / {total}</div>
        <p className="msg">{t.msg(ratio)}</p>
        <div className="result-actions">
          <button onClick={onRetry}>{t.tryAgain}</button>
          <button className="primary" onClick={onHome}>{t.otherTopic}</button>
        </div>
      </div>
    </>
  )
}
