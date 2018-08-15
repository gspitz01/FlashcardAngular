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
  const fakeCategory = new Category("Name", 4, fakeCategoryKey);
  const fakeCategories = of([fakeCategory, new Category("Name2", 5, "OtherKey")]);
  const fakeFlashcards = of([{front: "Front", back: "Back", category_name: "Name", category_id: fakeCategoryKey,
                                key: "fKey"},
                            {front: "DiffFront", back: "Aback", category_name: "Name2", category_id: "OtherKey",
                             key: "fKey2"}]);
  const categoriesListStub = {
    snapshotChanges: () => {
      return {
        pipe: () => {
          return fakeCategories;
        }
      }
    },
    push: (category) => {}
  };
  const flashcardsListStub = {
    snapshotChanges: () => {
      return {
        pipe: () => {
          return fakeFlashcards;
        }
      }
    },
    push: (flashcard) => {}
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AngularFireDatabase', ['list', 'object']);

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

  // TODO: Make these tests async
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

  it('should push new category to database on createCategory', () => {
    const newCategoryName = "New Category Name";
    spyOn(categoriesListStub, 'push');
    flashcardService.createCategory(newCategoryName)
    expect(categoriesListStub.push).toHaveBeenCalledWith({name: newCategoryName, count: 0});
  });

  it('should push new flashcard to database and update category count on createFlashcard', () => {
    const categoryName = "CategoryName";
    const categoryKey = "Key";
    const categoryCount = 3;
    const category = new Category(categoryName, categoryCount, categoryKey);
    const newFlashcard = new Flashcard("Front", "Back", categoryName, categoryKey, "Id");

    spyOn(flashcardsListStub, 'push');
    const objectStub = {
      update: (category) => {}
    }
    fireDatabaseSpy.object.and.returnValue(objectStub);
    spyOn(objectStub, 'update');

    flashcardService.createFlashcard(newFlashcard, category);
    expect(flashcardsListStub.push).toHaveBeenCalledWith({
      front: newFlashcard.front,
      back: newFlashcard.back,
      category_name: newFlashcard.categoryName,
      category_id: newFlashcard.categoryId
    });

    expect(fireDatabaseSpy.object).toHaveBeenCalledWith('/categories/' + category.key);
    expect(objectStub.update).toHaveBeenCalledWith({count: categoryCount + 1});
  });

  it('should call remove on database on deleteCategory', () => {
    const objectStub = {
      remove: () => {}
    };
    fireDatabaseSpy.object.and.returnValue(objectStub);
    spyOn(objectStub, 'remove');

    flashcardService.deleteCategory(fakeCategory);

    expect(fireDatabaseSpy.object).toHaveBeenCalledWith('/categories/' + fakeCategoryKey);
    expect(objectStub.remove).toHaveBeenCalled();

    // Should have removed 1 local category, so only 1 remains
    flashcardService.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(1);
    });

    // Should have removed 1 local flashcard, so only 1 remains
    flashcardService.getFlashcards().subscribe(flashcards => {
      expect(flashcards.length).toBe(1);
    });
  });

  it('should call remove on database on deleteFlashcard', () => {
    const flashcardKey = "Key";
    const categoryName = "CategoryName";
    const categoryKey = "Key";
    const categoryCount = 3;
    const category = new Category(categoryName, categoryCount, categoryKey);

    const objectFlashcardsStub = {
      remove: () => {}
    };
    const objectCategoriesStub = {
      update: (category) => {}
    }
    fireDatabaseSpy.object.and.callFake(route => {
      if (route.includes("flashcards")) {
        return objectFlashcardsStub;
      } else {
        return objectCategoriesStub;
      }
    });
    spyOn(objectFlashcardsStub, 'remove');
    spyOn(objectCategoriesStub, 'update');

    flashcardService.deleteFlashcard(flashcardKey, category);

    expect(fireDatabaseSpy.object).toHaveBeenCalledWith('/flashcards/' + flashcardKey);
    expect(objectFlashcardsStub.remove).toHaveBeenCalled();
    // Should also update category count
    expect(fireDatabaseSpy.object).toHaveBeenCalledWith('/categories/' + categoryKey);
    expect(objectCategoriesStub.update).toHaveBeenCalledWith({count: categoryCount - 1});
  });
});
