export const LOCALES = ['de', 'en', 'fr', 'no', 'vi'] as const
export type Locale = (typeof LOCALES)[number]
/** Im MVP in der UI waehlbar. */
export const ACTIVE_LOCALES = ['de', 'en'] as const satisfies readonly Locale[]
export type ActiveLocale = (typeof ACTIVE_LOCALES)[number]

export type LocalizedText = Partial<Record<Locale, string>> & { de: string }

export type Topic = 'e-invoicing'
export type Difficulty = 'basic' | 'intermediate' | 'advanced'

export type Option = { id: string; label: LocalizedText }

export type BaseQuestion = {
  id: string
  topic: Topic
  difficulty: Difficulty
  prompt: LocalizedText
  explanation: LocalizedText
}

export type SingleChoiceQuestion = BaseQuestion & {
  type: 'single'
  options: Option[]
  correctOptionId: string
}

export type MultiSelectQuestion = BaseQuestion & {
  type: 'multi'
  options: Option[]
  correctOptionIds: string[]
}

export type SliderQuestion = BaseQuestion & {
  type: 'slider'
  min: number
  max: number
  step: number
  unit: LocalizedText
  target: number
  /** volle Punkte innerhalb +/- tolerance */
  tolerance: number
  /** ab dieser absoluten Abweichung 0 Punkte */
  zeroAt: number
}

export type MatchingQuestion = BaseQuestion & {
  type: 'matching'
  left: Option[]
  right: Option[]
  /** leftId -> rightId */
  pairs: Record<string, string>
}

export type Question = SingleChoiceQuestion | MultiSelectQuestion | SliderQuestion | MatchingQuestion
export type QuestionType = Question['type']

export type Answer =
  | { type: 'single'; optionId: string }
  | { type: 'multi'; optionIds: string[] }
  | { type: 'slider'; value: number }
  | { type: 'matching'; pairs: Record<string, string> }

export type AnswerMap = Record<string, Answer | undefined>

export const POINTS_PER_QUESTION = 100
