import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'dc-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
      <div class="bg-base-300/80 flex flex-auto">
          <nav class="navbar bg-base-100 rounded-2xl flex flex-auto flex-wrap m-2 pb-2.5 pl-3">
              <a [routerLink]="['']"
                 class="btn btn-ghost normal-case text-xl mr-2 text-gray-50"
              >
                  Home Cocktails
              </a>

              <a [routerLink]="['']"
                 class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
              >
                  Gäste-Ansicht
              </a>

              <a [routerLink]="['/bartender']"
                 class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
              >
                  Bartender-Ansicht
              </a>

              <a [routerLink]="['/ingredients']"
                 class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
              >
                  Zutaten
              </a>

              <a [routerLink]="['/bartender/ingredients']"
                 class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
              >
                  Bartender-Ansicht für Zutaten
              </a>
          </nav>
      </div>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

}
