import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationStateService } from '../../core/services/reservation-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent implements OnInit {

  private fb = inject(FormBuilder);

  paymentMethod = '';

  constructor(
    private reservationState: ReservationStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.paymentMethod = this.reservationState.paymentMethod || '';
  }

  cardForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    holder: ['', Validators.required],
    expiry: ['', Validators.required, this.expiryValidator.bind(this)],
    cvv: ['', [Validators.required, Validators.minLength(3)]]
  });

  bizumForm = this.fb.group({
    phone: ['', [Validators.required, Validators.minLength(9)]]
  });

  payCard() {

    if (this.cardForm.invalid) return;

    //console.log("CARD DATA", this.cardForm.value);

    this.router.navigate(['/payment-result']);
  }

  payBizum() {

    if (this.bizumForm.invalid) return;

    //console.log("BIZUM DATA", this.bizumForm.value);

    this.router.navigate(['/payment-result']);
  }

  expiryValidator(control: any) {

    if (!control.value) return null;

    const today = new Date();
    const expiry = new Date(control.value);

    return expiry > today ? null : { expired: true };
  }

}