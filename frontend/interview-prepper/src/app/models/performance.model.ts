import { Interview } from "./interview.model";
import { Question } from "./question.model";

export interface Performance {
  id: number;
  interview_id: number;
  confidence_rating: number;
  technical_rating: number;
  behavioral_rating: number;
  overall_feeling?: number;
  summary?: string;
  struggled_question_id?: number;
  well_answered_question_id?: number;
  struggledQuestion?: Question;
  wellAnsweredQuestion?: Question;
  interview?: Interview;
}
