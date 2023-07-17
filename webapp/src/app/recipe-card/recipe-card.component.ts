import { Directive } from '@angular/core';
import { Recipe, RecipeIngredient } from "../shared/i-recipe";
import {IApiService, IngredientFilter} from "../services/i-api-service";
import { ActivatedRoute } from "@angular/router";
import {map, Observable, of, switchMap, tap} from "rxjs";

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
      }),
      switchMap(recipes => {
        const ingredientFilters: IngredientFilter[] = [];
        recipes.forEach(recipe => {
          recipe.recipeIngredients?.forEach(ingredient => {
            if (!ingredientFilters.find(ingredientFilter => ingredientFilter.id === ingredient.ingredientId)) {
              ingredientFilters.push({id: ingredient.ingredientId});
            }
          });
        });
        if (recipes.length > 0) {
          return this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(ingredientFilters)).pipe(
            map(() => recipes)
          );
        }
        return of(undefined);
      })
    ).subscribe();
  }

  // Nicht irgendwo speichern?
  // Doppelt auch in card component!
  getIngredientName$(recipeIngredient: RecipeIngredient): Observable<string> {
    return this._apiService.getCachedIngredientsRequest$({ id: recipeIngredient.ingredientId }).pipe(
      map(ingredients => {
        if (!ingredients) {
          return 'n.a.';
        }
        if (ingredients.length !== 1) {
          return 'n.a too many matches'; // TODO: ERROR Handling!
        }
        return ingredients[0].name;
      })
    );
  }
}
