import {
  Component,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    SplitButtonModule,
    MenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  isConnected: WritableSignal<boolean> = signal(false);
  user: Signal<any>;

  items: Signal<MenuItem[]>
  endItems: MenuItem[] = [];

  constructor() {
    this.isConnected = this.authService.isConnected;

    this.items = computed(() => {
      if (this.isConnected()) {
        return [
        {
          label: undefined,
          items: [
            {
              label: 'Mon Profil',
              command: () => {
                this.goToProfile();
              },
            },
          ],
        },
        {
          label: 'Portfolios',
          items: [
            {
              label: 'Créer Portfolio',
              routerLink: '/portfolioCreation',
            },
            {
              label: 'Mes portfolios',
              routerLink: ['portfolios/', this.user().Id],
            },
          ],
        },
        {
          items: [
            {
              label: 'Se déconnecter',
              icon: 'pi pi-sign-out',
              command: () => {
                this.logout();
              },
            },
          ],
        },
      ];
      }

      return [];
    });

    this.user = computed(() => {
      if (this.isConnected()) {
        return this.authService.getUser();
      }
      return null;
    });
  }

  ngOnInit() {
    this.authService.checkConnection();
  }

  goToProfile() {
    //TODO: Creer la page de profil de l'utilisateur + modification mdp
    throw new Error('Method not implemented.');
  }

  login() {
    this.router.navigate(['/login']);
  }
  register() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['']);
  }
}
