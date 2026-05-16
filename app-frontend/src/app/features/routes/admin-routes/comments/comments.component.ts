import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RoutesService } from '../../../../core/services/routes.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-route-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './comments.component.html',
  styleUrl:'./comments.component.scss',
})
export class CommentsComponent implements OnInit {

  comments: any[] = [];
  routeId!: number;

  constructor(
    private route: ActivatedRoute,
    private routesService: RoutesService,
    private cd: ChangeDetectorRef,
    public auth: AuthService,
    private location: Location
  ) {}

  routeName = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('route_id');
    //console.log('ROUTE ID:', id);
    if (!id) return;
    this.routeId = Number(id);
    this.loadRouteName();
    this.loadComments();
  }

  loadComments() {
    this.routesService
      .getCommentsByRoute(this.routeId)
      .subscribe((data: any) => {
        this.comments = data;
        this.cd.detectChanges();
      });
  }

  deleteComment(commentId: number) {
    if (!confirm('¿Eliminar comentario?')) {
      return;
    }
    this.routesService
      .deleteComment(commentId)
      .subscribe(() => {
        this.comments = this.comments.filter(
          c => c.id !== commentId
        );
        this.cd.detectChanges();
      });
  }

  loadRouteName() {
    this.routesService
      .getRouteDetail(this.routeId)
      .subscribe((data: any) => {
        this.routeName = data.route.name;
        this.cd.detectChanges();
      });
  }

  goBack() {
    this.location.back();
  }
}
