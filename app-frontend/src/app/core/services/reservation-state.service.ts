import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservationStateService {

  private storageKey = 'reservation_state';

  originId?: number;
  destinationId?: number;
  date?: string;
  originName?: string;
  destinationName?: string;
  routeId?: number;
  routeName?: string;
  price?: number;
  distance?: number;
  dni?: string;
  referenceNumber?: string;
  paymentMethod?: string;

  constructor() {
    this.load();
  }

  save() {
    sessionStorage.setItem(
      this.storageKey,
      JSON.stringify({
        originId: this.originId,
        destinationId: this.destinationId,
        date: this.date,
        originName: this.originName,
        destinationName: this.destinationName,
        routeId: this.routeId,
        routeName: this.routeName,
        price: this.price,
        distance: this.distance,
        dni: this.dni,
        referenceNumber: this.referenceNumber,
        paymentMethod: this.paymentMethod
      })
    );
  }

  load() {
    const data = sessionStorage.getItem(this.storageKey);

    if (data) {
      const parsed = JSON.parse(data);

      Object.assign(this, parsed);
    }
  }

  clear() {
    sessionStorage.removeItem(this.storageKey);
  }
}