import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cpfValidator } from '../../utils/cpf-validator';

@Component({
  selector: 'app-weight-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './weight-calculator.component.html',
  styleUrls: ['./weight-calculator.component.scss']
})
export class WeightCalculatorComponent {
  personForm: FormGroup;
  personData = {
    name: '',
    born: '',
    document: '',
    gender: 'M',
    height: null,
    weight: null
  };

  messageError: string = 'O campo é obrigatório';

  selectedPerson: boolean = false;

  formattedBornDate: string = '';

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      born: ['', Validators.required],
      document: ['', [Validators.required, cpfValidator()]],
      gender: ['M'],
      height: [null],
      weight: [null]
    });

    console.log(cpfValidator());

  }

  formatCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      let value = input.value.replace(/\D/g, '');

      if (value.length > 11) value = value.substring(0, 11);

      if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,2})/, '$1.$2-$3');
      } else {
        value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2');
      }

      input.value = value;
      this.personData.document = value;
      this.personForm.controls['document'].setValue(this.personData.document, { emitEvent: false });
    }
  }

  formatDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); 
    if (value.length > 8) value = value.substring(0, 8); 
    if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }

    input.value = value;
    this.personData.born = value;
    this.personForm.controls['born'].setValue(this.personData.born, { emitEvent: false });
    this.personForm.controls['born'].markAsTouched();
  }

  dateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value.replace(/\D/g, '');
      const isValid = value.length === 8 && this.isDateValid(value);
      return isValid ? null : { 'invalidDate': true };
    };
  }

  isDateValid(value: string): boolean {
    const day = parseInt(value.substring(0, 2), 10);
    const month = parseInt(value.substring(2, 4), 10);
    const year = parseInt(value.substring(4, 8), 10);

    if (month < 1 || month > 12) return false;

    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > daysInMonth[month - 1]) return false;

    return true;
  }


  search(form: NgForm) {
    console.log(form.control.value, this.personForm.value);
    this.personForm.markAllAsTouched();
    form.control.markAllAsTouched();
    if (form.valid && this.personForm.valid) {
      this.selectedPerson = true;
    } else {
      // api
      console.log(this.personForm.value);

    }
  }

  add() {
  }

  update() {
    if (this.selectedPerson) {
    }
  }

  delete() {
    if (this.selectedPerson) {
    }
  }
}
