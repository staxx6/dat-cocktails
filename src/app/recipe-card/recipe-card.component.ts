import { Component, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeIngredient } from "../shared/i-recipe";
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute } from "@angular/router";

@Directive({
  selector: "recipe-card",
  standalone: true
})
export class RecipeCardComponent {

  recipe: Recipe;

  constructor(
    private _apiService: IApiService,
    private _route: ActivatedRoute
  ) {
    const recipeId = _route.snapshot.paramMap.get('id')!;
    this.recipe = _apiService.getRecipes({ id: parseInt(recipeId) })[0];
  }

  // Nicht irgendwo speichern?
  // Doppelt auch in card component!
  getIngredientName(recipeIngredient: RecipeIngredient): string {
    const ingredients = this._apiService.getIngredients({ id: recipeIngredient.ingredientId });
    if (ingredients.length !== 1) {
      return 'n.a'
    }
    return ingredients[0].name;
  }
}
