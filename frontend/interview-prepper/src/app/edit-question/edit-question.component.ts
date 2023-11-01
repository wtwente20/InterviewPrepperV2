import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  questionId: number | null = null;
  editQuestionForm: FormGroup;
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private categoryService: CategoryService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editQuestionForm = this.fb.group({
      question_text: ['', Validators.required],
      category_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.subscribe(params => {
      this.questionId = +params.get('id')!;
      if (this.questionId) {
        this.loadQuestion(this.questionId);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      data => this.categories = data,
      error => console.error('Error loading categories:', error)
    );
  }

  loadQuestion(questionId: number): void {
    this.questionService.getQuestionById(questionId).subscribe(
      (data) => {
        this.editQuestionForm.patchValue({
          question_text: data.question_text,
          category_id: data.category_id
        });
      },
      (error) => {
        console.error('Error loading question:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editQuestionForm.valid && this.questionId) {
      this.questionService.updateQuestion(this.questionId, this.editQuestionForm.value).subscribe(
        () => {
          this.router.navigate(['/questions']);
        },
        (error) => {
          console.error('Error updating question:', error);
        }
      );
    }
  }
}
