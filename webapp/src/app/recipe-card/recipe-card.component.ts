import { Directive } from '@angular/core';
import { Recipe, RecipeIngredient } from "../shared/i-recipe";
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, tap } from "rxjs";

@Directive({
  selector: "recipe-card",
  standalone: true
})
export class RecipeCardComponent {

  recipe: Recipe | undefined;

  constructor(
    protected _apiService: IApiService,
    private _route: ActivatedRoute
  ) {
    const recipeId = _route.snapshot.paramMap.get('id')!;
    _apiService.getRecipes$({ id: parseInt(recipeId) }).pipe(
      tap(recipes => {
        if (recipes.length !== 1) {
          throw new Error(`too many matches for recipe id ${recipeId}!`)
        }
        this.recipe = recipes[0];
      })
    ).subscribe();
  }

  // Nicht irgendwo speichern?
  // Doppelt auch in card component!
  getIngredientName$(recipeIngredient: RecipeIngredient): Observable<string> {
    return this._apiService.getIngredients$({ id: recipeIngredient.ingredientId }).pipe(
      map(ingredients => {
        if (ingredients.length !== 1) {
          return 'n.a too many matches' // TODO: ERROR Handling!
        }
        return ingredients[0].name;
      })
    );
  }
}
