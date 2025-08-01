import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginType: 'citizen' | 'celebrant' = 'citizen';
  citizenForm: FormGroup;
  celebrantForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.citizenForm = this.fb.group({
      reservationCode: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.celebrantForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchLoginType(type: 'citizen' | 'celebrant'): void {
    this.loginType = type;
    this.errorMessage = '';
    this.resetForms();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  resetForms(): void {
    this.citizenForm.reset();
    this.celebrantForm.reset();
  }

  onCitizenSubmit(): void {
    if (this.citizenForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        reservationCode: this.citizenForm.value.reservationCode.toUpperCase(),
        lastName: this.citizenForm.value.lastName
      };

      this.authService.loginCitizen(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/citizen-dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erreur lors de la connexion';
        }
      });
    }
  }

  onCelebrantSubmit(): void {
    if (this.celebrantForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.loginCelebrant(this.celebrantForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Erreur lors de la connexion';
        }
      });
    }
  }
}
