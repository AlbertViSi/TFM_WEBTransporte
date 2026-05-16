import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RoutesService } from '../../../../core/services/routes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logistics-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './logistics-edit.component.html',
  styleUrl:'./logistics-edit.component.scss',
})
export class LogisticsEditComponent {

  @Input() routeId!: number;
  @Input() currentCapacity!: number;
  @Input() currentPrice!: number;

  @Output() updated = new EventEmitter();

  newCapacity!: number;
  newPrice!: number;

  showForm = false;

  constructor(
    private routesService: RoutesService
  ) {}

  toggle() {
    this.showForm = !this.showForm;
  }

  updateCapacity() {
    if (!this.newCapacity) return;
    this.routesService
      .updateCapacity(this.routeId, this.newCapacity)
      .subscribe(() => {
        alert('Capacidad actualizada');
        this.currentCapacity = this.newCapacity;
        this.newCapacity = 0;
        this.updated.emit()
      });
  }

  updatePrice() {
    if (!this.newPrice) return;

    this.routesService
      .updateBasePrice(this.routeId, this.newPrice)
      .subscribe(() => {
        alert('Precio actualizado');
        this.currentPrice = this.newPrice;
        this.newPrice = 0;
        this.updated.emit()
      });
  }
}