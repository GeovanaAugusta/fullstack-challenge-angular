import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { cpfValidator } from '../../utils/cpf-validator';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weight-calculator',
  templateUrl: './weight-calculator.component.html',
  styleUrls: ['./weight-calculator.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class WeightCalculatorComponent {
  personForm: FormGroup;
  selectedPerson: boolean = false;

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      born: ['', [Validators.required, this.dateValidator()]],
      document: ['', [Validators.required, cpfValidator()]],
      gender: ['M'],
      height: [null, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
      weight: [null, [Validators.required, Validators.min(30), Validators.max(300)]]
    });
  }

  formatCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) value = value.substring(0, 11);

    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    input.value = value;
    this.personForm.controls['document'].setValue(value);
  }

  formatDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 8) value = value.substring(0, 8);

    value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    input.value = value;
    this.personForm.controls['born'].setValue(value);
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value.replace(/\D/g, '');
      return value.length === 8 && this.isDateValid(value) ? null : { 'invalidDate': true };
    };
  }

  isDateValid(value: string): boolean {
    const day = parseInt(value.substring(0, 2), 10);
    const month = parseInt(value.substring(2, 4), 10);
    const year = parseInt(value.substring(4, 8), 10);
    return day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900;
  }

  getErrorMessage(controlName: string): string {
    const control = this.personForm.get(controlName);
    if (control?.hasError('required')) {
      return 'O campo é obrigatório';
    } else if (control?.hasError('minlength')) {
      return 'Campo inválido';
    } else if (control?.hasError('invalidDate')) {
      return 'Data inválida';
    } else if (control?.hasError('cpf') || control?.hasError('invalidCPF')) {
      return 'CPF inválido';
    }
    return '';
  }

  convertCommaToDot(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(',', '.');

    this.personForm.controls[controlName].setValue(value);
  }

  prepareFormValues() {
    let height = this.personForm.controls['height'].value;
    let weight = this.personForm.controls['weight'].value;

    height = height ? height.replace(',', '.') : height;
    weight = weight ? weight.replace(',', '.') : weight;

    this.personForm.controls['height'].setValue(height);
    this.personForm.controls['weight'].setValue(weight);
  }

  search() {
    if (this.personForm.valid) {
      console.log('Formulário válido', this.personForm.value);
    } else {
      console.log('Formulário inválido', this.personForm.value);
    }
  }

  add() {
    if (this.personForm.valid) {
      console.log('Formulário válido', this.personForm.value);
    } else {
      console.log('Formulário inválido', this.personForm.value);
    }
  }
  
  update() {
  }

  delete() {
  }
}
