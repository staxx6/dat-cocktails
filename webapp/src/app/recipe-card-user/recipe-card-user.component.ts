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
  templateUrl: './recipe-card-user.component.html',
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
