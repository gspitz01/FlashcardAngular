import { NO_ERRORS_SCHEMA, DebugElement, Component } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CategoriesComponent } from './categories.component';
import { FlashcardService } from '../flashcard.service';
import { Category } from '../category';

const testCategory = new Category("name", 3, "key");

const flashcardServiceMock = {
  getCategories: () => {
    return of([testCategory]);
  },
  createCategory: (name: string) => {
  }
} as FlashcardService;

class ComponentMock extends Component {}

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let location: Location;
  let service: FlashcardService;
  let submitButton: DebugElement;
  let inputField: DebugElement;
  const catName = "CatName";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesComponent ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: "key", component: ComponentMock }
        ])
      ],
      providers: [
        { provide: FlashcardService, useValue: flashcardServiceMock }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    service = TestBed.get(FlashcardService);
    submitButton = fixture.debugElement.query(By.css("button"));
    inputField = fixture.debugElement.query(By.css("input"));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it("should get categories from FlashcardService on creation", () => {
    expect(component.categories).toBeTruthy();
  });
  
  it("should call createCategory on FlashcardService with categoryName onSubmit", () => {
    component.categoryName = catName;
    spyOn(service, 'createCategory');
    component.onSubmit();
    expect(service.createCategory).toHaveBeenCalledWith(catName);
  });
  
  it("should call createCategory on FlashcardService with categoryName on submit button click", () => {
    component.categoryName = catName;
    spyOn(service, 'createCategory');
    submitButton.nativeElement.click();
    expect(service.createCategory).toHaveBeenCalledWith(catName);
  });
  
  it ("should change categoryName on input to text field", async(() => {
    fixture.whenStable().then(() => {
      inputField.nativeElement.value = catName;
      inputField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.categoryName).toBe(catName);
    });
  }));
  
  it("should change route to category of id on category click", async(() => {
    let categoryLi = fixture.debugElement.query(By.css("li"));
    categoryLi.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe(`/${testCategory.key}`);
    });
  }));
});
