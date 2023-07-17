import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Recipe, RecipeIngredient} from "../shared/i-recipe";
import {RouterLink} from "@angular/router";
import {IApiService, IngredientFilter} from "../services/i-api-service";
import {catchError, map, Observable, tap, throwError} from "rxjs";

@Component({
  selector: 'recipe-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent implements OnDestroy, OnInit {
  @Input() recipe?: Recipe;
  @Input() isBartenderUser?: boolean;

  constructor(
    private _apiService: IApiService,
  ) {

  }

  ngOnInit() {
    // Handled in recipes-list component
    // this._createCurrentIngredientRequests();
  }

  ngOnDestroy() {
    // console.log("list item destroyed");
  }

  private _createCurrentIngredientRequests(): void {
    const ingredientFilters: IngredientFilter[] = []
    this.recipe?.recipeIngredients?.forEach(ingredient => {
      ingredientFilters.push({id: ingredient.ingredientId});
    });
    this._apiService.getIngredients$(this._apiService.createBundledRequestFilter(ingredientFilters)).subscribe();
  }

  getIngredientName$(recipeIngredient: RecipeIngredient): Observable<string> {
    return this._apiService.getCachedIngredientsRequest$({id: recipeIngredient.ingredientId}).pipe(
      map(ingredients => ingredients ?? []),
      map(ingredients => {
        if (ingredients.length !== 1) {
          return 'n.a result is != 1' // TODO: ERROR Handling!
        }
        return ingredients[0].name;
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }
}
