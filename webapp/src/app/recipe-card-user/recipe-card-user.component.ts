import { Component, HostBinding } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IApiService } from '../services/i-api-service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
    <div class="w-5/6">
      <div class="flex flex-col">
        <div class="flex mt-4 bg-base-300 rounded-2xl overflow-hidden">
          <figure class="object-cover w-36 h-full" *ngIf="getRecipePicture()">
            <img [src]="getRecipePicture()"/>
          </figure>
          <div class="flex flex-col p-4 items-center justify-center">
            <h2 class="text-xl mb-4 text-secondary font-bold ">{{recipe?.name ?? 'Loading ...'}}</h2>
          </div>
        </div>
        <div class="mt-4 bg-base-300 rounded-2xl p-4">
          <ul class="flex flex-wrap">
            <li *ngFor="let ingredient of recipe?.recipeIngredients"
                class="">
              <button type="button" (click)="moveToIngredientId(ingredient.ingredientId)"
                      class="btn btn-outline btn-sm m-1 normal-case btn-accent border">
                {{getIngredientName$(ingredient) | async}}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <ng-container *ngIf="recipe?.description">
        <div class="flex flex-wrap mt-4 bg-base-300 rounded-2xl overflow-hidden p-4">
          <h3 class="text-accent mb-3">Beschreibung</h3>
          <p class="">
            {{recipe?.description}}
          </p>
        </div>
      </ng-container>
      <ng-container *ngIf="recipe?.history">
        <div class="flex flex-wrap mt-4 bg-base-300 rounded-2xl overflow-hidden p-4">
          <h3 class="text-accent mb-3">Geschichte</h3>
          <p class="">
            {{recipe?.history}}
          </p>
        </div>
      </ng-container>
    </div>
    <a class="btn btn-secondary m-4" routerLink="../..">Zurück</a>
  `,
  styles: [``]
})
export class RecipeCardUserComponent extends RecipeCardComponent {

  @HostBinding('class') classes = 'flex w-full flex-col items-center';

  constructor(
    apiService: IApiService,
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(
      apiService,
      route,
      router,
      location
    );
  }
}
