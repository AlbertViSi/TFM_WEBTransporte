import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-autofill',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './autofill.component.html'
})
export class AutofillComponent {

  @Input() label = '';
  @Input() options: any[] = [];

  @Output() selected = new EventEmitter<any>();

  control = new FormControl('');

  filteredOptions!: Observable<any[]>;

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
  }

  private filter(value: string): any[] {
    if (typeof value !== 'string') {
      return this.options;
    }
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  select(option: any) {
    this.selected.emit(option);
  }

  displayFn(option: any): string {
    return option && option.name ? option.name : '';
  }
  
  resetFilter() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );

    this.control.setValue('');
  }
}