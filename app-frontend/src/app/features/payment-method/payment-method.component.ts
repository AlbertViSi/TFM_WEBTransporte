import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
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
    cardNumber: ['', [Validators.required,(control: AbstractControl) => 
      {const raw = control.value?.replace(/\s/g, '') || '';return raw.length === 16 ? null : { invalidLength: true };}
    ]],
    holder: ['', Validators.required],
    expiry: ['', [Validators.required, this.expiryValidator.bind(this)]],
    cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
  });

  bizumForm = this.fb.group({
    phone: ['', [Validators.required, Validators.minLength(9)]]
  });

  formatCardNumber() {
    let value = this.cardForm.get('cardNumber')?.value || '';

    value = value.replace(/\D/g, '');

    value = value.match(/.{1,4}/g)?.join(' ') || value;

    this.cardForm.get('cardNumber')?.setValue(value, { emitEvent: false });
  }

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

  formatExpiry() {
    let value = this.cardForm.get('expiry')?.value || '';
    value = value.replace(/\D/g, '');
    value = value.substring(0, 4);
    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    this.cardForm.get('expiry')?.setValue(value, { emitEvent: false });
  }

  expiryValidator(control: AbstractControl) {
    const value = control.value;

    if (!value) return null;

    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) {
      return { invalidFormat: true };
    }

    const month = Number(match[1]);
    const year = Number(match[2]);

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      return { expired: true };
    }

    return null;
  }
}