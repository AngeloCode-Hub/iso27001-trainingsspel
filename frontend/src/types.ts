export interface Option {
  text: string
  correct: boolean
  feedback: string
}

export interface Question {
  id: string
  scenario: string
  options: Option[]
  explanation: string
}

export interface Category {
  id: string
  title: string
  icon: string
  intro: string
  questions: Question[]
}

export interface QuizData {
  title: string
  description: string
  categories: Category[]
}

export type Lang = 'nl' | 'en'

export interface Score {
  correct: number
  total: number
}
