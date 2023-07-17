import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from "../shared/i-recipe";
import {IApiService, IngredientFilter} from "../services/i-api-service";
import { RecipeListItemComponent } from "../recipe-list-item/recipe-list-item.component";
import { Router } from "@angular/router";
import {finalize, forkJoin, map, Observable, switchMap, tap} from "rxjs";

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
    this.recipes$ = _apiService.getAllRecipes$().pipe(
      tap(recipes => {
        recipes.forEach(recipe => {
          recipe.recipeIngredients?.forEach(ingredient => {
            this._ingredientFilters.push({id: ingredient.ingredientId});
          });
        })
      }),
      for(recipes => {
        return this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(this._ingredientFilters))
      })
    );
    this.isBartenderUser = _router.url.includes('bartender');
  }

  ngOnInit() {
    this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(this._ingredientFilters)).subscribe();
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
}
