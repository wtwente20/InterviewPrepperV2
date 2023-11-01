import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  createQuestionForm = this.fb.group({
    question_text: ['', Validators.required],
    category_id: ['', Validators.required]
  });
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private questionService: QuestionService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      data => this.categories = data,
      error => console.error('Error loading categories:', error)
    );
  }

  onSubmit() {
    if (this.createQuestionForm.valid) {
      this.questionService.createQuestion(this.createQuestionForm.value).subscribe(
        (response) => {
          console.log('Question created:', response);
          this.router.navigate(['/questions']);
        },
        (error) => {
          console.error('Error creating question:', error);
        }
      );
    }
  }
}
