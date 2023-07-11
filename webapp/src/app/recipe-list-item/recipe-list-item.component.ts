import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeIngredient } from "../shared/i-recipe";
import { RouterLink } from "@angular/router";
import { IApiService } from "../services/i-api-service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'recipe-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent {
  @Input() recipe?: Recipe;
  @Input() isBartenderUser?: boolean;

  constructor(
    private _apiService: IApiService,
  ) {
  }

  // Nicht irgendwo speichern?
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
