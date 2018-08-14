import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { FlashcardService } from './flashcard.service';
import { Category } from './category';
import { Flashcard } from './flashcard';


describe('FlashcardService', () => {
  let flashcardService: FlashcardService;
  let fireDatabaseSpy: jasmine.SpyObj<AngularFireDatabase>;
  const fakeCategoryKey = "key";
  const fakeCategories = of([new Category("Name", 4, fakeCategoryKey), new Category("Name2", 5, "OtherKey")]);
  const fakeFlashcards = of([{front: "Front", back: "Back", category_name: "Name", category_id: fakeCategoryKey,
                                key: "fKey"},
                            {front: "DiffFront", back: "Aback", category_name: "Name2", category_id: "OtherKey",
                             key: "fKey2"}]);
  const categoriesListStub = { snapshotChanges: () => {
    return {
      pipe: () => {
        return fakeCategories;
      }
    }
  }};
  const flashcardsListStub = { snapshotChanges: () => {
    return {
      pipe: () => {
        return fakeFlashcards;
      }
    }
  }};
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireDatabase', ['list']);
    
    // FlashcardService calls list on the database in the constructor
    // so setup the spy before construction
    spy.list.and.callFake((name) => {
      if (name === 'categories') {
        return categoriesListStub;
      } else {
        return flashcardsListStub;
      }
    });
    
    TestBed.configureTestingModule({
      providers: [
        FlashcardService,
        { provide: AngularFireDatabase, useValue: spy }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    
    flashcardService = TestBed.get(FlashcardService);
    fireDatabaseSpy = TestBed.get(AngularFireDatabase);
  });

  // TODO: Make these test async
  it('should be created and call list on database', () => {
    expect(flashcardService).toBeTruthy();
    expect(fireDatabaseSpy.list).toHaveBeenCalledWith("categories");
    expect(fireDatabaseSpy.list).toHaveBeenCalledWith("flashcards");
  });
  
  it('should return categories on getCategories', () => {
    flashcardService.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
    });
  });
  
  it('should return flashcards on getFlashcards', () => {
    flashcardService.getFlashcards().subscribe((flashcards) => {
      expect(flashcards.length).toBe(2);
    });
  });
  
  it('should filter flashcards on getCategory', () => {
    flashcardService.getCategory(fakeCategoryKey).subscribe((flashcards) => {
      expect(flashcards.length).toBe(1);
    });
  });
});
