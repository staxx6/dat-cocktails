import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeIngredient } from "dat-cocktails-types";
import { RouterLink } from "@angular/router";
import { IApiService, IngredientFilter } from "../services/i-api-service";
import { catchError, map, Observable, tap, throwError } from "rxjs";

@Component({
  selector: 'recipe-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a *ngIf="recipe"
       [routerLink]="['cocktail', recipe.id]"
       class="card card-side bg-base-300 shadow-md m-5 hover:scale-110 transition duration-150"
    >
      <figure>
        <img *ngIf="recipe.pictureFileIdWithExt"
             [src]="getRecipePicture()"
             alt="Cover"
             class="w-28 object-cover h-full"
        />
      </figure>
      <div class="card-body p-4">
        <h2 class="card-title text-accent">{{ recipe.name }}</h2>
        <ul *ngIf="!isBartenderUser" class="">
          <li *ngFor="let ingredient of recipe.recipeIngredients" class="">
            {{getIngredientName$(ingredient) | async}}
          </li>
        </ul>
      </div>
    </a>

  `,
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

  getRecipePicture(): string {
    return `${this._apiService.getBasePictureUrl()}/${this.recipe?.pictureFileIdWithExt}`;
  }
}
