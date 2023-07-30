import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientCardBartenderComponent } from './ingredient-card-bartender.component';

describe('IngredientCardBartenderComponent', () => {
  let component: IngredientCardBartenderComponent;
  let fixture: ComponentFixture<IngredientCardBartenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IngredientCardBartenderComponent]
    });
    fixture = TestBed.createComponent(IngredientCardBartenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
