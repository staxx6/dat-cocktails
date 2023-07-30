import { Directive } from '@angular/core';
import { IApiService, IngredientFilter } from "../services/i-api-service";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, distinctUntilChanged, map, Observable, of, Subject, switchMap, take, tap } from "rxjs";
import { Ingredient, MeasuringUnit, Recipe, RecipeIngredient } from 'dat-cocktails-types';
import { Location } from "@angular/common";

@Directive({
  selector: "recipe-card",
  standalone: true
})
export class RecipeCardComponent {

  private _recipe: Recipe | undefined = undefined;

  get recipe(): Recipe | undefined {
    return this._recipe;
  }

  set recipe(recipe: Recipe) {
    this._recipe = recipe;
    this.recipeChanged.next(recipe);
  }

  recipeChanged = new BehaviorSubject<Recipe | undefined>(this.recipe);

  constructor(
    protected _apiService: IApiService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _location: Location
  ) {
    const recipeId = _route.snapshot.paramMap.get('id')!;
    _apiService.getRecipes$({id: parseInt(recipeId)}).pipe(
      take(1),
      tap(recipes => {
        if (recipes.length !== 1) {
          // Show error site
          throw new Error(`Too many or no matches for recipe with id: ${recipeId}!`)
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
    return this._apiService.getCachedIngredientsRequest$({id: recipeIngredient.ingredientId}).pipe(
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

  getMeasuringUnitName$(measuringUnitId: number): Observable<string> {
    return this._apiService.getCachedMeasuringUnitRequest$({id: measuringUnitId}).pipe(
      map(measuringUnit => {
        if (!measuringUnit) {
          return 'n.a.';
        }
        if (measuringUnit.length !== 1) {
          return 'n.a too many matches'; // TODO: ERROR Handling!
        }
        return measuringUnit[0].name;
      })
    );
  }

  // getDCName$(measuringUnit: MeasuringUnit): Observable<string> {
  //   return this._apiService.get
  // }

  getRecipePicture(): string | undefined {
    if (this.recipe?.pictureFileIdWithExt) {
      return `${this._apiService.getBasePictureUrl()}/${this.recipe?.pictureFileIdWithExt}`;
    }
    return undefined;
  }

  moveToIngredientId(ingredientId: number): void {
    this._router.navigate(['ingredient', ingredientId])
  }
}
