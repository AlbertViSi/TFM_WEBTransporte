import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesService } from '../../../core/services/routes.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-routes',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin-routes.component.html',
  styleUrl: './admin-routes.component.scss',
})
export class AdminRoutesComponent {

  routes: any[] = [];

  constructor(
    private routesService: RoutesService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routesService.getAllRoutes()
      .subscribe((data) => {
        this.routes = data;
        this.cd.detectChanges();
      });
  }

  goToNodes(routeId: number) {
    this.router.navigate(['/admin-routes/nodes', routeId]);
  }

  goToComments(routeId: number) {
    //console.log(routeId)
    this.router.navigate(['/admin-routes/comments', routeId]);
  }

  goToAllNodes() {
    this.router.navigate(['/admin-routes/all-nodes']);
  }
}
