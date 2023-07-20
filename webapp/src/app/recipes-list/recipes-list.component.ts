import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from "../shared/i-recipe";
import { IApiService, IngredientFilter } from "../services/i-api-service";
import { RecipeListItemComponent } from "../recipe-list-item/recipe-list-item.component";
import { Router } from "@angular/router";
import { map, Observable, of, switchMap, take, tap } from "rxjs";

@Component({
  selector: 'recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeListItemComponent],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  recipes$: Observable<Recipe[]>;
  private _ingredientFilters: IngredientFilter[] = []
  isBartenderUser: boolean;

  constructor(
    private _apiService: IApiService,
    private _router: Router
  ) {
    this.recipes$ = this._apiService.getAllRecipes$().pipe(
      switchMap(() => this.loadAllCachedRecipes())
    );

    this.isBartenderUser = _router.url.includes('bartender');

    _apiService.getRecipeChangedSubject().pipe(
      // This won't work cus loadAllRecipes is saved in cache with the origin stuff
      // it's clearing now, but loadAllRecipes is not getting fresh data?
      switchMap(() => this.recipes$ = this.loadAllCachedRecipes())
    ).subscribe();
  }

  private fetchAllRecipes(): Observable<Recipe[]> {
    return this._apiService.getAllRecipes$();
  }

  private loadAllCachedRecipes(): Observable<Recipe[]> {
    return this._apiService.getAllCachedRecipes$().pipe(
      tap(recipes => {
        recipes.forEach(recipe => {
          recipe.recipeIngredients?.forEach(ingredient => {
            if (!this._ingredientFilters.find(ingredientFilter => ingredientFilter.id === ingredient.ingredientId)) {
              this._ingredientFilters.push({id: ingredient.ingredientId});
            }
          });
        })
      }),
      switchMap(recipes => {
        if (recipes.length > 0) {
          return this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(this._ingredientFilters)).pipe(
            map(() => recipes)
          );
        }
        return of(recipes);
      }),
      take(1)
    );
  }

  ngOnInit() {
    // this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(this._ingredientFilters)).subscribe();
  }

  private _createCurrentIngredientRequests(): void {
    const ingredientFilters: IngredientFilter[] = []
    this.recipes$.pipe(
      map(recipes => {
        recipes.forEach(recipe => {
          recipe.recipeIngredients?.forEach(ingredient => {
            ingredientFilters.push({id: ingredient.ingredientId});
          });
        })
      })
    ).subscribe();
    this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(ingredientFilters)).subscribe();
  }

  addRecipe() {
    this._apiService.newRecipeDummy('Dein neues Rezept');
  }
}
