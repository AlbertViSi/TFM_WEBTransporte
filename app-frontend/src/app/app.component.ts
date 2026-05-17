import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './layout/navbar/topbar.component';
import { MainNavbarComponent } from './layout/main-navbar/main-navbar.component';
import { AuthService } from './core/services/auth.service';
import { FooterComponent } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    MainNavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class App {
  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.init();;
  } 
  protected readonly title = signal('app-frontend');
}
