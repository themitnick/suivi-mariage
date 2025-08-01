import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { Marriage, User, Message } from '../../models';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './citizen-dashboard.component.html'
})
export class CitizenDashboardComponent implements OnInit {
  currentUser: User | null = null;
  marriage: Marriage | null = null;
  messages: Message[] = [];
  newMessageContent = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.marriage = this.authService.getCurrentMarriage();
    
    if (!this.currentUser || this.currentUser.role !== 'citizen' || !this.marriage) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMessages();
  }

  private loadMessages(): void {
    if (this.marriage) {
      this.messageService.getMessagesByMarriage(this.marriage.id).subscribe({
        next: (messages) => {
          this.messages = messages.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        },
        error: (error) => {
          console.error('Erreur lors du chargement des messages:', error);
        }
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim() || !this.marriage || !this.currentUser) {
      return;
    }

    const messageData = {
      marriageId: this.marriage.id,
      senderId: this.currentUser.id,
      senderName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      senderRole: this.currentUser.role,
      content: this.newMessageContent.trim()
    };

    this.messageService.sendMessage(messageData).subscribe({
      next: (newMessage) => {
        this.messages.push(newMessage);
        this.newMessageContent = '';
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getStatusClass(status: Marriage['status']): string {
    const baseClasses = 'inline-flex px-3 py-1 text-sm font-semibold rounded-full';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getStatusLabel(status: Marriage['status']): string {
    switch (status) {
      case 'pending': return 'En attente de validation';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Célébré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
