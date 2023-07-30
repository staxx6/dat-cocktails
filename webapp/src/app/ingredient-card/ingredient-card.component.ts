import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, take, tap } from "rxjs";
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute } from "@angular/router";
import { Ingredient } from 'dat-cocktails-types';

@Component({
  selector: 'dc-ingredient-card',
  standalone: true,
  imports: [CommonModule],
  template: `
  `
})
export class IngredientCardComponent {

  private _ingredient: Ingredient | undefined = undefined;

  get ingredient(): Ingredient | undefined {
    return this._ingredient;
  }

  set ingredient(ingredient: Ingredient) {
    this._ingredient = ingredient;
    this.ingredientChanged.next(ingredient);
  }

  ingredientChanged = new BehaviorSubject<Ingredient | undefined>(this.ingredient);

  constructor(
    protected _apiService: IApiService,
    protected _route: ActivatedRoute
  ) {
    const ingredientId = _route.snapshot.paramMap.get('id')!;
    if (!ingredientId) {
      throw new Error("No ingredient id found in URL");
    }
    _apiService.getIngredients$({id: parseInt(ingredientId)}).pipe(
      take(1),
      tap(ingredient => {
        if (ingredient.length !== 1) {
          // Show error site
          throw new Error(`Too many or no matches for ingredient with id: ${ingredientId}!`)
        }
        this.ingredient = ingredient[0];
      })
    ).subscribe();
  }

  getIngredientPicture(): string {
    if (this.ingredient?.pictureFileIdWithExt) {
      return `${this._apiService.getBasePictureUrl()}/${this.ingredient?.pictureFileIdWithExt}`;
    }
    return '';
  }

  getDescription(): string {
    return this.ingredient?.description ?? 'Sorry, keine Beschreibung vorhanden.';
  }
}
