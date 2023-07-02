import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardUserComponent } from './recipe-card-user.component';

describe('ReceiptCardUserComponent', () => {
  let component: RecipeCardUserComponent;
  let fixture: ComponentFixture<RecipeCardUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecipeCardUserComponent]
    });
    fixture = TestBed.createComponent(RecipeCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
