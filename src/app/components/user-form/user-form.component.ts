import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AddressResponseDto, User} from '../../models';
import {UserService} from '../../services/user.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  error: string | null = null;

  private readonly API_CEP_URL = 'http://localhost:8080/zipCode';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      console.log(this.userId)
      this.isEditMode = true;
      this.loadUser();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      age: [null],

      addressDto: this.fb.group({
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
        street: ['', Validators.required],
        number: ['', Validators.required],
        city: ['', Validators.required],
        uf: ['', Validators.required],
      }),
      professionDto: this.fb.group({
        professionName: ['', Validators.required],
        professionLevel: ['', Validators.required],
        salary: [null]
      })
    });
  }

  loadUser(): void {
    if (!this.userId) return;
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        console.log('Usuário carregado:', user); // Debug
        this.userForm.patchValue(user);
        console.log('Form após patchValue:', this.userForm.value); // Debug
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar usuário';
        this.loading = false;
        console.error('Erro ao carregar usuário:', error);
      }
    });
  }


  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.error = null;

      const user: User = this.userForm.value;

      const operation =
        this.isEditMode
          ? this.userService.updateUser(this.userId!, user)
          : this.userService.createUser(user);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.error = this.isEditMode
            ? 'Erro ao atualizar usuário'
            : 'Erro ao criar usuário';
          this.loading = false;
          console.error('Erro ao salvar usuário:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({onlySelf: true});
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength']) return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  pesquisacep() {
    // Pegue o valor do campo zipCode dentro do addressDto
    const zipControl = this.userForm.get('addressDto.zipCode');
    const cep = zipControl?.value?.replace(/\D/g, '');

    if (cep && cep.length === 8) {
      this.error = null;
      this.http.get<AddressResponseDto>(`${this.API_CEP_URL}/${cep}`).subscribe({
        next: (addressData) => {
          this.userForm.get('addressDto')?.patchValue({
            street: addressData.street,
            city: addressData.city,
            uf: addressData.uf
          });
          this.loading = false;
          console.log(addressData.uf);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'CEP não encontrado ou erro na busca.';
          this.userForm.get('addressDto')?.patchValue({
            street: '',
            city: '',
            uf: ''
          });
        }
      });
    }
  }
}
