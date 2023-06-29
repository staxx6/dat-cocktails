import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardBartenderComponent } from './recipe-card-bartender.component';

describe('RecipeCardBartenderComponent', () => {
  let component: RecipeCardBartenderComponent;
  let fixture: ComponentFixture<RecipeCardBartenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecipeCardBartenderComponent]
    });
    fixture = TestBed.createComponent(RecipeCardBartenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
