import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { AngularFireDatabase } from 'angularfire2/database';

import { FlashcardService } from './flashcard.service';

class AngularFireDatabaseMock {
  list() {
    return {
      snapshotChanges: () => {
        return {
          pipe: () => {
            
          }
        }
      }
    }
  }
}

describe('FlashcardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FlashcardService,
        { provide: AngularFireDatabase, useClass: AngularFireDatabaseMock }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  it('should be created', inject([FlashcardService], (service: FlashcardService) => {
    expect(service).toBeTruthy();
  }));
});
