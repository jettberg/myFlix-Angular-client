import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreDialog } from './genre-dialog';

describe('GenreDialog', () => {
  let component: GenreDialog;
  let fixture: ComponentFixture<GenreDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
