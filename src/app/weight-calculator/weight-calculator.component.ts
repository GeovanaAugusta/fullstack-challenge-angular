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
