import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { Category } from './category';
import { Flashcard } from './flashcard';

const CATEGORES: Category[] = [
  new Category("The name", 1, "-45453"),
  new Category("Another nme", 2, "0343243"),
  new Category("A third name", 0, "434234")
];

const FLASHCARDS: Flashcard[] = [
  new Flashcard("The front", "The back", "The name", "-45453", "fdasdf"),
  new Flashcard("A different front", "A different back", "Another name", "0343243", "dsflaksj"),
  new Flashcard("What's in a front", "What's on a back", "A third name", "0343243", "falkjerq")
];

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private categories: Observable<any[]>;
  private flashcards: Observable<any[]>;

  constructor(private db: AngularFireDatabase) { 
    this.categories = this.db.list('categories').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.flashcards = this.db.list('flashcards').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
//    this.categories = of(CATEGORES);
//    this.flashcards = of(FLASHCARDS);
  }
  
  getCategories(): Observable<Category[]> {
    return this.categories;
  }
  
  getCategory(key: string): Observable<Flashcard[]> {
    return this.flashcards.pipe(
      map(flashcards => flashcards.filter(flashcard => flashcard.category_id === key))
    );
  }
  
  getFlashcards(): Observable<Flashcard[]> {
    return this.flashcards;
  }
  
  createCategory(name: string) {
    
  }
}
