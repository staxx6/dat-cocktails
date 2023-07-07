import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsListItemComponent } from './ingredients-list-item.component';

describe('IngredientsListItemComponent', () => {
  let component: IngredientsListItemComponent;
  let fixture: ComponentFixture<IngredientsListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IngredientsListItemComponent]
    });
    fixture = TestBed.createComponent(IngredientsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
