import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApiService } from '../services/i-api-service';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";

@Component({
  selector: 'recipe-card-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RecipeCardComponent
  ],
  template: `
    <div class="flex flex-wrap mt-4 bg-base-300 rounded-2xl w-full">
      <figure class="w-48"><img [src]="getRecipePicture()"/></figure>
      <div class="flex flex-col p-4">
        <h2 class="text-xl mb-4 text-primary">{{recipe?.name ?? 'Loading ...'}}</h2>
        <ul class="flex flex-col">
          <li *ngFor="let ingredient of recipe?.recipeIngredients"
              class="flex-auto">
            <a href="#" class="btn btn-outline btn-sm m-1 normal-case btn-accent border">
              {{getIngredientName$(ingredient) | async}}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <a class="btn btn-secondary m-4" routerLink="../..">Zurück</a>
  `,
  styleUrls: ['./recipe-card-user.component.scss']
})
export class RecipeCardUserComponent extends RecipeCardComponent {

  constructor(
    apiService: IApiService,
    route: ActivatedRoute
  ) {
    super(
      apiService,
      route
    );
  }
}
