import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../category';
import { FlashcardService } from '../flashcard.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Observable<Category[]>;
  categoryName = "";
  
  constructor(private flashcardService: FlashcardService) {
    this.categories = flashcardService.getCategories();
  }
  
  ngOnInit() {
  }
  
  onSubmit() {
    this.flashcardService.createCategory(this.categoryName);
    this.categoryName = "";
  }

}
