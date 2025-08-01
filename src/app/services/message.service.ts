import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Message } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.initializeMockMessages();
  }

  private initializeMockMessages(): void {
    const mockMessages: Message[] = [
      {
        id: '1',
        marriageId: '1',
        senderId: '1',
        senderName: 'Jean Kouassi',
        senderRole: 'celebrant',
        content: 'Bonjour, votre dossier de mariage a été reçu. Pouvez-vous confirmer la date et l\'heure souhaitées ?',
        createdAt: new Date('2025-08-01T10:00:00')
      }
    ];

    this.messagesSubject.next(mockMessages);
  }

  getMessagesByMarriage(marriageId: string): Observable<Message[]> {
    const messages = this.messagesSubject.value.filter(m => m.marriageId === marriageId);
    return of(messages);
  }

  sendMessage(message: Omit<Message, 'id' | 'createdAt'>): Observable<Message> {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);

    return of(newMessage);
  }
}
