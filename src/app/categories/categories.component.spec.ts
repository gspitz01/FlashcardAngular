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
const fakeCategories = [testCategory];

class ComponentMock extends Component {}

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let location: Location;
  let flashcardService: jasmine.SpyObj<FlashcardService>;
  let submitButton: DebugElement;
  let inputField: DebugElement;
  const catName = "CatName";

  beforeEach(async(() => {
    const serviceSpy = jasmine.createSpyObj("FlashcardService", ["createCategory", "getCategories"]);
    serviceSpy.getCategories.and.returnValue(of(fakeCategories));

    TestBed.configureTestingModule({
      declarations: [ CategoriesComponent ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: "key", component: ComponentMock }
        ])
      ],
      providers: [
        { provide: FlashcardService, useValue: serviceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    flashcardService = TestBed.get(FlashcardService);
    submitButton = fixture.debugElement.query(By.css("button"));
    inputField = fixture.debugElement.query(By.css("input"));
    fixture.detectChanges();
  });

  it('should create and call getCategories on FlashcardService', () => {
    expect(component).toBeTruthy();
    expect(component.categories).toBeTruthy();
    expect(flashcardService.getCategories).toHaveBeenCalled();
  });

  it("should call createCategory on FlashcardService with categoryName onSubmit", () => {
    component.categoryName = catName;
    component.onSubmit();
    expect(flashcardService.createCategory).toHaveBeenCalledWith(catName);
  });

  it("should call createCategory on FlashcardService with categoryName on submit button click", () => {
    component.categoryName = catName;
    submitButton.nativeElement.click();
    expect(flashcardService.createCategory).toHaveBeenCalledWith(catName);
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
