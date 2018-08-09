import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Flashcard } from '../flashcard';
import { FlashcardService } from '../flashcard.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  flashcards: Observable<Flashcard[]>;
  
  constructor(private flashcardService: FlashcardService,
              private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    this.flashcards = flashcardService.getCategory(id);
  }
  
  ngOnInit() {
  }
  
  onSubmit() {
  }
}
