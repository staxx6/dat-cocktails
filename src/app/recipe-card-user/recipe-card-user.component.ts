import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApiService } from '../services/i-api-service';
import { Recipe, RecipeIngredient } from '../shared/i-recipe';

@Component({
  selector: 'app-recipe-card-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card-user.component.html',
  styleUrls: ['./recipe-card-user.component.scss']
})
export class RecipeCardUserComponent {

  recipe: Recipe;

  constructor(
    private _apiService: IApiService
  ) {
    const firstRecipe = _apiService.getRecipes({ id: 1 })
    this.recipe = firstRecipe[0];
  }

  // Nicht irgendwo speichern?
  getIngredientName(recipeIngredient: RecipeIngredient): string {
    const ingredients = this._apiService.getIngredients({ id: recipeIngredient.ingredientId });
    return ingredients[0].name;
  }
}
