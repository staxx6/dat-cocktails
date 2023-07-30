import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { IngredientCardComponent } from "../ingredient-card/ingredient-card.component";
import { BackButtonDirective } from "../directives/back-button.directive";

@Component({
  selector: 'dc-ingredient-card-user',
  standalone: true,
	imports: [CommonModule, RouterLink, BackButtonDirective],
  template: `
    <div class="flex flex-wrap mt-4 bg-base-300 rounded-2xl w-full">
      <figure *ngIf="getIngredientPicture()" class="w-48"><img [src]="getIngredientPicture()"/></figure>
      <div class="flex flex-col p-4">
        <h2 class="text-xl mb-4 text-primary">{{ingredient?.name ?? 'Loading ...'}}</h2>
        <p>
          {{getDescription()}}
        </p>
      </div>
    </div>
    <button class="btn btn-secondary m-4" backButton>Zurück</button>
  `
})
export class IngredientCardUserComponent extends IngredientCardComponent {
}
