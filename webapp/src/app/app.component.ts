import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IApiService } from './services/i-api-service';
import { RecipeCardUserComponent } from './recipe-card-user/recipe-card-user.component';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RecipeCardUserComponent, HeaderComponent],
  template: `
    <div class="flex flex-col">
      <dc-header/>
      <main>
          <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dat-cocktails';

  constructor(
  ) {
  }
}
