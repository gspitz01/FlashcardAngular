import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Flashcard } from '../flashcard';
import { FlashcardService } from '../flashcard.service';
import { Category } from '../category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  flashcards: Observable<Flashcard[]>;
  category: Observable<Category>;
  front = "";
  back = "";

  constructor(private flashcardService: FlashcardService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.flashcards = this.flashcardService.getCategoryFlashcards(id);
    this.category = this.flashcardService.getCategory(id);
  }

  onSubmit() {
    this.category.subscribe(category => {
      const flashcard = new Flashcard(this.front, this.back, category.name, category.key, "TempKey");
      this.flashcardService.createFlashcard(flashcard, category);
      this.front = "";
      this.back = "";
    });
  }

  deleteFlashcard(flashcardKey: string) {
    this.category.subscribe(category => {
      this.flashcardService.deleteFlashcard(flashcardKey, category);
    });
  }

  deleteCategory() {
    this.category.subscribe(category => {
      this.flashcardService.deleteCategory(category);
    });
  }
}
