import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from "../shared/i-recipe";
import { IApiService } from "../services/i-api-service";
import { RecipeListItemComponent } from "../recipe-list-item/recipe-list-item.component";

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeListItemComponent],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent {

  recipes: Recipe[];

  constructor(
    private _apiService: IApiService
  ) {
    this.recipes = _apiService.getAllRecipes();
  }
}
