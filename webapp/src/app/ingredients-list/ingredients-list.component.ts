import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from "dat-cocktails-types";
import { IngredientsListItemComponent } from "../ingredients-list-item/ingredients-list-item.component";
import { IApiService } from "../services/i-api-service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: 'dc-ingredients-list',
  standalone: true,
  imports: [CommonModule, IngredientsListItemComponent],
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.scss']
})
export class IngredientsListComponent {

  ingredients$: Observable<Ingredient[]>;
  isBartenderUser: boolean;

  constructor(
    private _apiService: IApiService,
    private _router: Router
  ) {
    this.ingredients$ = _apiService.getAllIngredients$();
    this.isBartenderUser = _router.url.includes('bartender');
  }
}
