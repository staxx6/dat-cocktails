import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientCardUserComponent } from './ingredient-card-user.component';

describe('IngredientCardUserComponent', () => {
  let component: IngredientCardUserComponent;
  let fixture: ComponentFixture<IngredientCardUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IngredientCardUserComponent]
    });
    fixture = TestBed.createComponent(IngredientCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
