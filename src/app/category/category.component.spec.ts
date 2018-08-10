import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { CategoryComponent } from './category.component';
import { FlashcardService } from '../flashcard.service';

const fakeActivatedRoute = {
  snapshot: {
    data: {
      
    },
    paramMap: {
      get: (param: string) => {
        return "0";
      }
    }
  }
} as ActivatedRoute;

const flashcardServiceMock = {
  getCategories: () => {
    
  },
  getCategory: (id: string) => {
    
  },
  getFlashcards: () => {
    
  }
} as FlashcardService;

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryComponent
      ],
      imports: [
        RouterModule
      ],
      providers: [
        { provide: FlashcardService, useValue: flashcardServiceMock },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
