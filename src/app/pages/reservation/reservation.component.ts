import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarriageService } from '../../services/marriage.service';
import { TimeSlot } from '../../models';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reservation.component.html'
})
export class ReservationComponent implements OnInit {
  reservationForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  availableTimes: string[] = [];
  minDate: string;
  uploadedFiles: { [key: string]: File } = {};
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private marriageService: MarriageService,
    private router: Router
  ) {
    // Date minimale : demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      groomFirstName: ['', [Validators.required, Validators.minLength(2)]],
      groomLastName: ['', [Validators.required, Validators.minLength(2)]],
      groomEmail: ['', [Validators.required, Validators.email]],
      groomPhone: ['', [Validators.required, Validators.pattern(/^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/)]],
      brideFirstName: ['', [Validators.required, Validators.minLength(2)]],
      brideLastName: ['', [Validators.required, Validators.minLength(2)]],
      brideEmail: ['', [Validators.required, Validators.email]],
      bridePhone: ['', [Validators.required, Validators.pattern(/^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/)]],
      weddingDate: ['', [Validators.required]],
      weddingTime: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Charger les créneaux disponibles
    this.loadAvailableTimeSlots();
  }

  onDateChange(): void {
    const selectedDate = this.reservationForm.get('weddingDate')?.value;
    if (selectedDate) {
      this.loadAvailableTimesForDate(new Date(selectedDate));
      // Réinitialiser l'heure sélectionnée
      this.reservationForm.patchValue({ weddingTime: '' });
    }
  }

  private loadAvailableTimeSlots(): void {
    this.marriageService.getAvailableTimeSlots().subscribe({
      next: (timeSlots) => {
        // Si une date est déjà sélectionnée, filtrer les heures
        const selectedDate = this.reservationForm.get('weddingDate')?.value;
        if (selectedDate) {
          this.loadAvailableTimesForDate(new Date(selectedDate));
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des créneaux:', error);
      }
    });
  }

  private loadAvailableTimesForDate(date: Date): void {
    this.marriageService.getAvailableTimeSlots().subscribe({
      next: (timeSlots) => {
        // Filtrer les créneaux pour la date sélectionnée
        const availableSlots = timeSlots.filter(slot => 
          slot.date.toDateString() === date.toDateString() && slot.isAvailable
        );
        
        this.availableTimes = availableSlots.map(slot => slot.time).sort();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des créneaux pour la date:', error);
        this.availableTimes = [];
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.reservationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return 'Veuillez saisir une adresse email valide';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['pattern']) {
        return 'Format de téléphone invalide (ex: +225 XX XX XX XX XX)';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.reservationForm.valid && this.validateRequiredDocuments()) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.reservationForm.value;
      const marriageData = {
        ...formData,
        weddingDate: new Date(formData.weddingDate),
        documents: this.uploadedFiles
      };

      this.marriageService.createMarriage(marriageData).subscribe({
        next: (marriage) => {
          this.isLoading = false;
          this.successMessage = 'Votre réservation a été enregistrée avec succès ! Vous recevrez une confirmation par email.';
          
          // Réinitialiser le formulaire après un délai
          setTimeout(() => {
            this.resetForm();
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Une erreur est survenue lors de la réservation';
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.reservationForm.reset();
    this.availableTimes = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.uploadedFiles = {};
    this.uploadProgress = 0;
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Le fichier est trop volumineux. Taille maximale : 5MB';
        return;
      }

      // Vérification du type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Format de fichier non supporté. Utilisez PDF, JPG ou PNG';
        return;
      }

      // Simulation de l'upload avec progress
      this.uploadProgress = 0;
      this.uploadedFiles[fileType] = file;
      
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.uploadProgress = 0;
          this.successMessage = `Document "${file.name}" téléchargé avec succès`;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      }, 100);

      this.errorMessage = '';
    }
  }

  private validateRequiredDocuments(): boolean {
    const requiredDocs = ['groomId', 'groomBirth', 'brideId', 'brideBirth'];
    const missingDocs = requiredDocs.filter(doc => !this.uploadedFiles[doc]);
    
    if (missingDocs.length > 0) {
      this.errorMessage = 'Veuillez télécharger tous les documents obligatoires';
      return false;
    }
    
    return true;
  }
}
