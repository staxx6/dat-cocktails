import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from "dat-cocktails-types";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'dc-ingredients-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ingredients-list-item.component.html',
  styleUrls: ['./ingredients-list-item.component.scss']
})
export class IngredientsListItemComponent {
  @Input() ingredient?: Ingredient;
  @Input() isBartenderUser?: boolean;
}
