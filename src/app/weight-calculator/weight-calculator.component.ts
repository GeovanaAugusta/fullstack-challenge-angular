import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { cpfValidator } from '../../utils/cpf-validator';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PersonService } from '../service/api/weight-calculator';
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

  availablePeople: Person[] = [];

  showPeople = true;

  showPopup = false;

  popupMessage = '';

  popupClass = '';

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

  }

  deselectPerson() {
    this.selectedPersonId = undefined;
    this.resetForm();
  }

  toggleVisibility() {
    this.showPeople = !this.showPeople;
    this.deselectPerson();
    this.availablePeople = [];
  }

  resetForm() {
    this.personForm.reset({
      name: '',
      born: '',
      document: '',
      gender: 'M',
      height: null,
      weight: null
    });
  }

  showNotification(message: string, type: 'success' | 'warning' | 'error' | 'weight') {
    this.popupMessage = message;
    this.popupClass = `popup-${type}`;
    this.showPopup = true;
    setTimeout(() => this.closePopup(), 1000);
  }

  closePopup() {
    this.showPopup = false;
  }

  search() {
    this.showPeople = true;

    if (this.personForm.get('document')?.valid) {
      const cpf = this.personForm.get('document')?.value.replace(/\D/g, '');
      this.pessoaService.searchPerson(cpf).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.showNotification('Usuários carregados com sucesso!', 'success');
            this.selectedPerson = true;
            this.selectedPersonId = data.id;
            this.availablePeople = data;
          } else {
            this.showNotification('Nenhum usuário encontrado!', 'success');
          }
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Ocorreu um erro.', 'error');
        }
      });
    } else {
      this.pessoaService.allPeople().subscribe({
        next: (response) => {
          this.availablePeople = response;
          this.availablePeople = response;
          if (this.availablePeople.length > 0) {
            this.showNotification('Usuários carregados com sucesso!', 'success');
          } else {
            this.showNotification('Nenhum usuário encontrado!', 'success');
          }
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Erro ao carregar usuários!', 'error');
        }
      });
    }
  }

  add() {
    this.personForm.markAllAsTouched();
    if (this.personForm.valid) {
      this.prepareFormValues();
      const payload = {
        nome: this.personForm.value.name,
        data_nasc: this.personForm.value.born.split('/').reverse().join('-'),
        cpf: this.personForm.value.document.replace(/\D/g, ''),
        sexo: this.personForm.value.gender,
        altura: Number(this.personForm.value.height),
        peso: Number(this.personForm.value.weight)
      };

      this.pessoaService.addPerson(payload).subscribe({
        next: (response) => {
          this.showNotification('Pessoa adicionada com sucesso.', 'success');
          this.deselectPerson();
          this.showPeople = false;
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Erro ao adicionar pessoa.', 'error');
        }
      });
    } else {

    }
  }

  update() {
    if (this.selectedPersonId && this.personForm.valid) {
      const payload = {
        id: this.selectedPersonId,
        nome: this.personForm.value.name,
        data_nasc: this.personForm.value.born.split('/').reverse().join('-'),
        cpf: this.personForm.value.document.replace(/\D/g, ''),
        sexo: this.personForm.value.gender,
        altura: Number(this.personForm.value.height),
        peso: Number(this.personForm.value.weight)
      };

      this.pessoaService.updatePerson(payload, this.selectedPersonId).subscribe({
        next: (response) => {
          this.showNotification('Pessoa atualizada com sucesso!', 'success');
          this.deselectPerson();
          this.showPeople = false;
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Erro ao atualizar a pessoa!', 'error');
        }
      });
    }
  }

  delete() {
    if (this.selectedPersonId) {
      this.pessoaService.deletePerson(this.selectedPersonId).subscribe({
        next: () => {
          this.showNotification('Pessoa excluída com sucesso!', 'success');
          this.deselectPerson();
          this.showPeople = false;
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Erro ao excluir a pessoa!', 'error');
        }
      });
    }
  }


  calculateWeight(gender: string, cpf: string) {
    if (this.selectedPersonId) {
      this.pessoaService.calculateWeight(cpf).subscribe({
        next: (response) => {
          this.showNotification(`
            FÓRMULA DO PESO IDEAL:
            ${gender === 'M' ? `( 72,7 * altura ) - 58 = ${response}` : ` • para mulheres = ( 62,1 * altura ) - 44,7 = ${response}`} `, 'weight');
          this.deselectPerson();
          this.showPeople = false;
        },
        error: (err) => {
          console.error(err);
          this.showNotification('Erro ao calcular o peso ideal!', 'error');
        }
      });
    }
  }
}


