import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ingredient, Recipe} from "dat-cocktails-types";
import { IngredientsListItemComponent } from "../ingredients-list-item/ingredients-list-item.component";
import { IApiService } from "../services/i-api-service";
import { Router } from "@angular/router";
import {map, Observable, of, switchMap, take, tap} from "rxjs";

@Component({
  selector: 'dc-ingredients-list',
  standalone: true,
  imports: [CommonModule, IngredientsListItemComponent],
  template: `
    <ng-container *ngIf="isBartenderUser">
      <button type="button" (click)="addIngredient()" class="btn m-3 btn-info">Zutat hinzufügen</button>
    </ng-container>
    <ul class="list">
      <ng-container *ngIf="(ingredients$ | async) as ingredients">
        <ng-container *ngIf="isBartenderUser ? true : true"> <!-- ingredient.active ist auch noch falsche stelle! -->
          <li *ngFor="let ingredient of ingredients">
            <dc-ingredients-list-item
              [ingredient]="ingredient"
              [isBartenderUser]="isBartenderUser"
            >
            </dc-ingredients-list-item>
          </li>
        </ng-container>
        <li *ngIf="!ingredients.length">No cocktails available.</li>
      </ng-container>
    </ul>
  `,
  styleUrls: ['./ingredients-list.component.scss']
})
export class IngredientsListComponent {

  ingredients$: Observable<Ingredient[]>;
  isBartenderUser: boolean;

  constructor(
    private _apiService: IApiService,
    private _router: Router
  ) {
    this.ingredients$ = _apiService.getAllIngredients$().pipe(
      switchMap(() => this.loadAllCachedIngredients())
    );

    this.isBartenderUser = _router.url.includes('bartender');

    _apiService.getIngredientChangedSubject().pipe(
      switchMap(() => this.ingredients$ = this.loadAllCachedIngredients())
    ).subscribe();
  }

  private loadAllCachedIngredients(): Observable<Ingredient[]> {
    return this._apiService.getAllCachedIngredients$().pipe(
      take(1)
    );
  }

  addIngredient() {
    this._apiService.newIngredientDummy('Deine neue Zutat');
    this._router.navigate(['/bartender', 'ingredient', -2]);
  }
}
