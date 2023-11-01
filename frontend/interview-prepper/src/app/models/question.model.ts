export interface Question {
  id: number;
  question_text: string;
  user_id: number;
  category_id: number;
  is_default: boolean;
  answers?: Answer[];
  showAnswerInput?: boolean;
  newAnswerText?: string;
}

export interface Answer {
  id: number;
  answer_text: string;
  question_id: number;
  user_id: number;
}
