import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from "dat-cocktails-types";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'dc-ingredients-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- FIXME: routerLink could be done better -->
    <a *ngIf="ingredient" 
         class="card card-side bg-base-300 shadow-md m-2 hover:scale-110 transition duration-150"
         [routerLink]="isBartenderUser ? ['../ingredient', ingredient.id] : ['/ingredient', ingredient.id]"
    >
      <div class="card-body p-3">
        <h2 class="card-title text-accent">
          {{ ingredient.name }}
        </h2>
      </div>
    </a>
  `,
  styleUrls: ['./ingredients-list-item.component.scss']
})
export class IngredientsListItemComponent {
  @Input() ingredient?: Ingredient;
  @Input() isBartenderUser?: boolean;
}
