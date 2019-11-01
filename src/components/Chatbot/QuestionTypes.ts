export type QuestionType =
  | 'choice_question'
  | 'rating_question'
  | 'free_type_question';

export interface IAnswerPlaceholder {
  id: number;
  text: string;
}

export interface IQuestion {
  text: string;
  type: QuestionType;
  id: number;
  answer_placeholders: Array<IAnswerPlaceholder>;
  is_prompt: boolean;
  is_name_prompt: boolean;
  button_text: string;
  skip_answer: boolean;
}
