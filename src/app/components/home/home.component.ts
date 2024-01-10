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
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  router = inject(Router);
  authServ = inject(AuthService);

  isConnected: WritableSignal<boolean> = signal(false);
  user: Signal<any> = signal(null);


  ngOnInit() {
    this.authServ.checkConnection();
    this.isConnected = this.authServ.isConnected;
    
    this.user = computed(() => {
      if (this.isConnected()) {
        return this.authServ.getUser();
      }
      return null;
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
  register() {
    this.router.navigate(['/register']);
  }

  goToPortfolios(){
    this.router.navigate(['/portfolios/', this.user().Id]);
  }

  goToPortfolioCreation(){
    this.router.navigate(['/portfolioCreation']);
  }
}
