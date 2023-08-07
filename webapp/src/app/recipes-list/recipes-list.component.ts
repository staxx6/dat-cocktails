import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from "dat-cocktails-types";
import { IApiService, IngredientFilter } from "../services/i-api-service";
import { RecipeListItemComponent } from "../recipe-list-item/recipe-list-item.component";
import { Router } from "@angular/router";
import { map, Observable, of, switchMap, take, tap } from "rxjs";

@Component({
  selector: 'recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeListItemComponent],
  template: `
    <ul class="cocktails-list p-2">
      <ng-container *ngIf="(recipes$ | async) as recipes">
        <ng-container *ngFor="let recipe of recipes">
          <!-- TODO: This generates unused HTML isBartenderUser? -->
          <ng-container *ngIf="isBartenderUser ? true : recipe.active">
            <li>
              <recipe-list-item
                [recipe]="recipe"
                [isBartenderUser]="isBartenderUser"
              >
              </recipe-list-item>
            </li>
          </ng-container>
        </ng-container>
        <li *ngIf="!recipes.length">No cocktails available.</li>
      </ng-container>
    </ul>
    <ng-container *ngIf="isBartenderUser">
      <button type="button" (click)="addRecipe()" class="btn m-3 btn-info">Rezept hinzufügen</button>
    </ng-container>

  `,
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  recipes$: Observable<Recipe[]>;
  private _ingredientFilters: IngredientFilter[] = []
  isBartenderUser: boolean;

  constructor(
    private _apiService: IApiService,
    private router: Router
  ) {
    this.recipes$ = this._apiService.getAllRecipes$().pipe(
      switchMap(() => this.loadAllCachedRecipes())
    );

    this.isBartenderUser = router.url.includes('bartender');

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
