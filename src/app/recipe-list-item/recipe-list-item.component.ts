import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from "../shared/i-recipe";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'recipe-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent {
  @Input() recipe?: Recipe;
}
