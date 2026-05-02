import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservationStateService } from '../../core/services/reservation-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

  private fb = inject(FormBuilder);

  constructor(
    private reservationState: ReservationStateService,
    private router: Router
  ) {}

  form = this.fb.group({
    dni: ['', [Validators.required, dniValidator]],
    paymentMethod: ['card', Validators.required]
  });

  submit() {

    if (this.form.invalid) return;

    this.reservationState.dni = this.form.value.dni!;
    this.reservationState.paymentMethod = this.form.value.paymentMethod!;

    this.reservationState.save();

    // siguiente pantalla (más adelante)
    this.router.navigate(['/payment-method']);
  }

}

function dniValidator(control: AbstractControl): ValidationErrors | null {

  const value = control.value;

  if (!value) return null;

  const dniRegex = /^[0-9]{8}[A-Za-z]$/;

  if (!dniRegex.test(value)) {
    return { invalidFormat: true };
  }

  const number = value.substring(0, 8);
  const letter = value.substring(8).toUpperCase();

  const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const correctLetter = letters[parseInt(number, 10) % 23];

  if (letter !== correctLetter) {
    return { invalidLetter: true };
  }

  return null;
}