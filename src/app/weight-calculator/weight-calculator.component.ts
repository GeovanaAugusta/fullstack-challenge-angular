import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { cpfValidator } from '../../utils/cpf-validator';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PersonService } from '../service/api/weight-calculator';
import { people } from './mock';
import { Person } from '../../utils/interface';

@Component({
  selector: 'app-weight-calculator',
  templateUrl: './weight-calculator.component.html',
  styleUrls: ['./weight-calculator.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class WeightCalculatorComponent implements OnInit {
  personForm: FormGroup;
  selectedPerson: boolean = false;
  selectedPersonId: number | undefined;
  availablePeople: Person[] = people

  constructor(private fb: FormBuilder, private pessoaService: PersonService) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      born: ['', [Validators.required, this.dateValidator()]],
      document: ['', [Validators.required, cpfValidator()]],
      gender: ['M'],
      height: [null, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
      weight: [null, [Validators.required, Validators.min(30), Validators.max(300)]]
    });
  }

  ngOnInit(): void {
    this.pessoaService.allPeople().subscribe({
      next: (response) => console.log(response),
      error: (err) => console.error('Erro ao adicionar pessoa:', err)
    });

    console.log(this.availablePeople);


  }

  formatCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    input.value = value;
    this.personForm.controls['document'].setValue(value);
  }

  formatHTMLCPF(cpf: string): string {
    return cpf
      .replace(/\D+/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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

  selectPerson(person: Person) {
    this.selectedPersonId = person.id;
    console.log(this.selectedPersonId);

    this.personForm.patchValue({
      name: person.nome,
      born: person.data_nasc.split('-').reverse().join('/'),
      document: person.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
      gender: person.sexo,
      height: person.altura,
      weight: person.peso
    });

    this.update();
  }

  deselectPerson() {
    this.selectedPersonId = undefined;
    this.personForm.reset({
      name: '',
      born: '',
      document: '',
      gender: 'M', 
      height: null,
      weight: null
    });
    console.log('Pessoa desmarcada');
  }


  search() {
    if (this.personForm.get('document')?.valid) {
      const cpf = this.personForm.get('document')?.value.replace(/\D/g, '');
      this.pessoaService.searchPerson(cpf).subscribe({
        next: (data) => {
          console.log('Pessoa encontrada:', data);
          this.selectedPerson = true;
          this.selectedPersonId = data.id;
        },
        error: (err) => console.error(err)
      });
    } else {
      console.log(this.personForm.value);
    }
  }

  add() {
    if (this.personForm.valid) {
      const payload = {
        nome: this.personForm.value.name,
        data_nasc: this.personForm.value.born.split('/').reverse().join('/'),
        cpf: this.personForm.value.document.replace(/\D/g, ''),
        sexo: this.personForm.value.gender,
        altura: Number(this.personForm.value.height),
        peso: Number(this.personForm.value.weight)
      };

      this.pessoaService.addPerson(payload).subscribe({
        next: (response) => console.log(response),
        error: (err) => console.error(err)
      });
    } else {
      console.log(this.personForm.value);
    }
  }

  update() {
    if (this.selectedPersonId && this.personForm.valid) {
      const formValue = this.personForm.value;
      const payload = {
        nome: formValue.name,
        data_nasc: formValue.born.split('/').reverse().join('/'),
        cpf: formValue.document.replace(/\D/g, ''),
        sexo: formValue.gender,
        altura: Number(formValue.height),
        peso: Number(formValue.weight)
      };

      this.pessoaService.updatePerson(payload, this.selectedPersonId).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.log('Formulário inválido ou nenhuma pessoa selecionada');
    }
  }

  delete() {
    if (this.selectedPersonId) {
      this.pessoaService.deletePerson(this.selectedPersonId).subscribe({
        next: (response) => {
          this.selectedPerson = false;
          this.selectedPersonId = undefined;
          this.personForm.reset();
        },
        error: (err) => console.error(err)
      });
    } else {
    }
  }
}
