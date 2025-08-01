import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Marriage, TimeSlot } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MarriageService {
  private marriagesSubject = new BehaviorSubject<Marriage[]>([]);
  public marriages$ = this.marriagesSubject.asObservable();

  private timeSlotsSubject = new BehaviorSubject<TimeSlot[]>([]);
  public timeSlots$ = this.timeSlotsSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockMarriages: Marriage[] = [
      {
        id: '1',
        reservationCode: 'ABC1234DEF',
        groomFirstName: 'Kouamé',
        groomLastName: 'Yao',
        groomEmail: 'kouame.yao@email.com',
        groomPhone: '+225 07 12 34 56 78',
        brideFirstName: 'Akissi',
        brideLastName: 'Kouassi',
        brideEmail: 'akissi.kouassi@email.com',
        bridePhone: '+225 05 98 76 54 32',
        weddingDate: new Date('2025-09-15'),
        weddingTime: '10:00',
        status: 'confirmed',
        celebrantId: '1',
        createdAt: new Date('2025-08-01'),
        updatedAt: new Date('2025-08-01')
      }
    ];

    const mockTimeSlots: TimeSlot[] = this.generateTimeSlots();
    
    this.marriagesSubject.next(mockMarriages);
    this.timeSlotsSubject.next(mockTimeSlots);
  }

  private generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const today = new Date();
    
    // Générer des créneaux pour les 60 prochains jours
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Ignorer les dimanches (jour 0)
      if (date.getDay() === 0) continue;
      
      // Créneaux de 9h à 16h
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      
      times.forEach(time => {
        slots.push({
          id: `${date.toISOString().split('T')[0]}-${time}`,
          date,
          time,
          isAvailable: Math.random() > 0.3 // 70% de chances d'être disponible
        });
      });
    }
    
    return slots;
  }

  getAvailableTimeSlots(): Observable<TimeSlot[]> {
    const availableSlots = this.timeSlotsSubject.value.filter(slot => slot.isAvailable);
    return of(availableSlots);
  }

  createMarriage(marriage: Omit<Marriage, 'id' | 'createdAt' | 'updatedAt' | 'reservationCode'>): Observable<Marriage> {
    const reservationCode = this.generateReservationCode();
    
    const newMarriage: Marriage = {
      ...marriage,
      id: Date.now().toString(),
      reservationCode,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentMarriages = this.marriagesSubject.value;
    this.marriagesSubject.next([...currentMarriages, newMarriage]);

    // Marquer le créneau comme non disponible
    this.markTimeSlotAsUnavailable(marriage.weddingDate, marriage.weddingTime);

    // Simuler l'envoi du code par SMS/Email
    this.sendReservationCode(newMarriage);

    return of(newMarriage);
  }

  private generateReservationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private sendReservationCode(marriage: Marriage): void {
    // Simulation d'envoi de SMS/Email
    console.log(`Code de réservation envoyé à ${marriage.groomEmail} et ${marriage.brideEmail}:`);
    console.log(`Votre code de réservation: ${marriage.reservationCode}`);
    console.log(`Nom de famille pour connexion: ${marriage.groomLastName}`);
    
    // En production, ici on ferait appel à un service SMS/Email
    // this.smsService.send(marriage.groomPhone, `Votre code de réservation: ${marriage.reservationCode}`);
    // this.emailService.send(marriage.groomEmail, 'Code de réservation', template);
  }

  getMarriageByCode(reservationCode: string): Observable<Marriage | null> {
    const marriage = this.marriagesSubject.value.find(m => m.reservationCode === reservationCode);
    return of(marriage || null);
  }

  getMarriagesByCelebrant(celebrantId: string): Observable<Marriage[]> {
    const marriages = this.marriagesSubject.value.filter(m => m.celebrantId === celebrantId);
    return of(marriages);
  }

  getAllMarriages(): Observable<Marriage[]> {
    return this.marriages$;
  }

  updateMarriageStatus(marriageId: string, status: Marriage['status']): Observable<Marriage> {
    const marriages = this.marriagesSubject.value;
    const marriageIndex = marriages.findIndex(m => m.id === marriageId);
    
    if (marriageIndex !== -1) {
      marriages[marriageIndex] = {
        ...marriages[marriageIndex],
        status,
        updatedAt: new Date()
      };
      
      this.marriagesSubject.next([...marriages]);
      return of(marriages[marriageIndex]);
    }
    
    throw new Error('Mariage non trouvé');
  }

  assignCelebrant(marriageId: string, celebrantId: string): Observable<Marriage> {
    const marriages = this.marriagesSubject.value;
    const marriageIndex = marriages.findIndex(m => m.id === marriageId);
    
    if (marriageIndex !== -1) {
      marriages[marriageIndex] = {
        ...marriages[marriageIndex],
        celebrantId,
        status: 'confirmed',
        updatedAt: new Date()
      };
      
      this.marriagesSubject.next([...marriages]);
      return of(marriages[marriageIndex]);
    }
    
    throw new Error('Mariage non trouvé');
  }

  private markTimeSlotAsUnavailable(date: Date, time: string): void {
    const timeSlots = this.timeSlotsSubject.value;
    const slotIndex = timeSlots.findIndex(slot => 
      slot.date.toDateString() === date.toDateString() && slot.time === time
    );
    
    if (slotIndex !== -1) {
      timeSlots[slotIndex].isAvailable = false;
      this.timeSlotsSubject.next([...timeSlots]);
    }
  }
}
