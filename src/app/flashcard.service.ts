import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
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
  private categoriesRef: AngularFireList<any>;
  private flashcardsRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.categoriesRef = this.db.list('categories');
    this.flashcardsRef = this.db.list('flashcards');
    this.categories = this.categoriesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.flashcards = this.flashcardsRef.snapshotChanges().pipe(
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

  getCategory(key: string): Observable<Category> {
    return this.categories.pipe(
      map(categories => categories.filter(category => category.key === key)[0])
    );
  }

  getCategoryFlashcards(key: string): Observable<Flashcard[]> {
    return this.flashcards.pipe(
      map(flashcards => flashcards.filter(flashcard => flashcard.category_id === key))
    );
  }

  getFlashcards(): Observable<Flashcard[]> {
    return this.flashcards;
  }

  createCategory(name: string) {
    this.categoriesRef.push({name: name, count: 0});
  }

  createFlashcard(flashcard: Flashcard, category: Category) {
    this.flashcardsRef.push({
      front: flashcard.front,
      back: flashcard.back,
      category_name: category.name,
      category_id: category.key
    });
    this.db.object('/categories/' + category.key)
      .update({count: category.count + 1});
  }

  deleteCategory(categoryToRemove: Category) {
    // Remove category locally
    this.categories = this.categories.pipe(
      map(categories => categories.filter(category => category.key !== categoryToRemove.key))
    );
    // Remove flashcards locally
    this.flashcards = this.flashcards.pipe(
      map(flashcards => flashcards.filter(flashcard => flashcard.category_id !== categoryToRemove.key))
    );

    // Remove category from remote database
    this.db.object('/categories/' + categoryToRemove.key).remove();

    // Remove flashcards in that category from remote database
    this.getCategoryFlashcards(categoryToRemove.key).subscribe((flashcards) => {
      flashcards.forEach((flashcard) => {
        this.deleteFlashcard(flashcard.key, categoryToRemove);
      });
    });
  }

  deleteFlashcard(flashcardKey: string, category: Category) {
    this.db.object('/flashcards/' + flashcardKey).remove();
    // Update category count
    this.db.object('/categories/' + category.key).update({count: category.count - 1});
  }
}
