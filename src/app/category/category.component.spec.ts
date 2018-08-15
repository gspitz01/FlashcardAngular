import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Observable, of } from 'rxjs';

import { CategoryComponent } from './category.component';
import { FlashcardService } from '../flashcard.service';
import { Flashcard } from '../flashcard';
import { Category } from '../category';
import { fakeAsyncResponse } from '../util-functions';

const categoryId = "CategoryId";
const fakeCategory = new Category("Name", 5, categoryId);
const fakeFlashcard = new Flashcard("Front", "Back", "CategoryName", categoryId, "Key");
const fakeFlashcards: Flashcard[] = [fakeFlashcard];

const fakeRoute = {
  snapshot: {
    paramMap: {
      get: (name) => {
        return categoryId;
      }
    }
  }
};

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let flashcardService: jasmine.SpyObj<FlashcardService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let hostElement: DebugElement;
  let frontInput: any;
  let backInput: any;
  const newFront = "New Front";
  const newBack = "New Back";
  const newFlashcard = new Flashcard(newFront, newBack, fakeCategory.name, fakeCategory.key, "TempKey");

  beforeEach(async(() => {
    const serviceSpy = jasmine.createSpyObj("FlashcardService",
        ['getCategory', 'getCategoryFlashcards', 'createFlashcard', 'deleteFlashcard', 'deleteCategory']);
    serviceSpy.getCategoryFlashcards.and.returnValue(of(fakeFlashcards));
    serviceSpy.getCategory.and.returnValue(of(fakeCategory));

    spyOn(fakeRoute.snapshot.paramMap, 'get').and.returnValue(categoryId);

    TestBed.configureTestingModule({
      declarations: [
        CategoryComponent
      ],
      imports: [
        RouterModule,
        FormsModule
      ],
      providers: [
        { provide: FlashcardService, useValue: serviceSpy },
        { provide: ActivatedRoute, useValue: fakeRoute }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    flashcardService = TestBed.get(FlashcardService);
    activatedRoute = TestBed.get(ActivatedRoute);
    hostElement = fixture.debugElement;
    frontInput = hostElement.query(By.css("input.front")).nativeElement;
    backInput = hostElement.query(By.css("input.back")).nativeElement;
    fixture.detectChanges();
  });

  it('should create and call getCategory on FlashcardService', async(() => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
      expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith("id");
      expect(flashcardService.getCategoryFlashcards).toHaveBeenCalledWith(categoryId);
      expect(flashcardService.getCategory).toHaveBeenCalledWith(categoryId);
    });
  }));

  it('should show the category name in h2', async(() => {
    fixture.whenStable().then(() => {
      const titleTag = hostElement.query(By.css("h2")).nativeElement;
      expect(titleTag.textContent).toBe(fakeCategory.name + "x");
    });
  }));

  it('should show the category count in .count', async(() => {
    fixture.whenStable().then(() => {
      const countElement = hostElement.query(By.css(".count")).nativeElement;
      expect(countElement.textContent).toContain(fakeCategory.count);
    });
  }));

  it('should call createFlashcard on onSubmit', async(() => {
    fixture.whenStable().then(() => {
      frontInput.value = newFront;
      backInput.value = newBack;

      frontInput.dispatchEvent(new Event("input"));
      backInput.dispatchEvent(new Event("input"));

      component.onSubmit();

      expect(flashcardService.createFlashcard).toHaveBeenCalledWith(newFlashcard, fakeCategory);
    });
  }));

  it('should call createFlashcard on submit button clicked', async(() => {
    fixture.whenStable().then(() => {
      const submitButton = hostElement.query(By.css("button")).nativeElement;

      frontInput.value = newFront;
      backInput.value = newBack;

      frontInput.dispatchEvent(new Event("input"));
      backInput.dispatchEvent(new Event("input"));

      submitButton.click();

      expect(flashcardService.createFlashcard).toHaveBeenCalledWith(newFlashcard, fakeCategory);
    });
  }));

  it('should call deleteFlashcard on delete-flashcard span click', async(() => {
      fixture.whenStable().then(() => {
        const deleteSpan = hostElement.query(By.css("span.delete-flashcard")).nativeElement;

        deleteSpan.click();

        expect(flashcardService.deleteFlashcard).toHaveBeenCalledWith(fakeFlashcard.key, fakeCategory);
      });
  }));

  it('should call deleteCategory and move to categories on delete-category span click', async(() => {
    fixture.whenStable().then(() => {
      const deleteSpan = hostElement.query(By.css("span.delete-category")).nativeElement;

      deleteSpan.click();

      expect(flashcardService.deleteCategory).toHaveBeenCalledWith(fakeCategory);
    });
  }));
});
