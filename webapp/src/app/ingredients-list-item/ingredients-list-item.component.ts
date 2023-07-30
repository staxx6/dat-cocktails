import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from "dat-cocktails-types";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'dc-ingredients-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="ingredient" class="list-item">
      <a [routerLink]="['/ingredient', ingredient.id]" class="list-item-header-link">
        <h2 class="list-item-header-text">{{ ingredient.name }}</h2>
      </a>
    </div>
  `,
  styleUrls: ['./ingredients-list-item.component.scss']
})
export class IngredientsListItemComponent {
  @Input() ingredient?: Ingredient;
  @Input() isBartenderUser?: boolean;
}
