import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../core/services/rating.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rate-route',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './rate-route.component.html'
})
export class RateRouteComponent {

  routeId!: number;
  rating = 0;
  comment = '';

  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  submit() {

    forkJoin([
      this.ratingService.createRating(this.routeId, this.rating),
      this.ratingService.createComment(this.routeId, this.comment)
    ]).subscribe(() => {
      this.router.navigate(['/my-reservations']);
    });
  }
}
