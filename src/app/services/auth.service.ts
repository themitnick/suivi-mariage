import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, CelebrantLoginRequest, CitizenLoginRequest, AuthResponse } from '../models';
import { MarriageService } from './marriage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private marriageService: MarriageService) {
    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  loginCelebrant(credentials: CelebrantLoginRequest): Observable<AuthResponse> {
    // Simulation d'une authentification célébrant
    const mockCelebrants: User[] = [
      {
        id: '1',
        email: 'celebrant@mairie-plateau.ci',
        role: 'celebrant',
        firstName: 'Jean',
        lastName: 'Kouassi',
        createdAt: new Date()
      },
      {
        id: '2',
        email: 'marie.diabate@mairie-plateau.ci',
        role: 'celebrant',
        firstName: 'Marie',
        lastName: 'Diabaté',
        createdAt: new Date()
      }
    ];

    const user = mockCelebrants.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password123') {
      const authResponse: AuthResponse = {
        user,
        token: 'mock-jwt-token-celebrant'
      };
      
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', authResponse.token);
      
      return of(authResponse);
    }
    
    return throwError(() => new Error('Identifiants incorrects'));
  }

  loginCitizen(credentials: CitizenLoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      this.marriageService.getMarriageByCode(credentials.reservationCode).subscribe({
        next: (marriage: any) => {
          if (marriage && marriage.groomLastName.toLowerCase() === credentials.lastName.toLowerCase()) {
            // Créer un utilisateur temporaire pour le citoyen
            const citizenUser: User = {
              id: `citizen-${marriage.id}`,
              email: marriage.groomEmail,
              role: 'citizen',
              firstName: marriage.groomFirstName,
              lastName: marriage.groomLastName,
              createdAt: new Date()
            };

            const authResponse: AuthResponse = {
              user: citizenUser,
              token: 'mock-jwt-token-citizen',
              marriage
            };

            this.currentUserSubject.next(citizenUser);
            localStorage.setItem('currentUser', JSON.stringify(citizenUser));
            localStorage.setItem('currentMarriage', JSON.stringify(marriage));
            localStorage.setItem('token', authResponse.token);

            observer.next(authResponse);
            observer.complete();
          } else {
            observer.error(new Error('Code de réservation ou nom de famille incorrect'));
          }
        },
        error: (error: any) => {
          observer.error(new Error('Erreur lors de la vérification du code'));
        }
      });
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMarriage');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentMarriage(): any {
    const savedMarriage = localStorage.getItem('currentMarriage');
    return savedMarriage ? JSON.parse(savedMarriage) : null;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isCelebrant(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'celebrant';
  }

  isCitizen(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'citizen';
  }
}
