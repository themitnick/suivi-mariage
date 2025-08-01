import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MarriageService } from '../../services/marriage.service';
import { MessageService } from '../../services/message.service';
import { Marriage, User, Message } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  marriages: Marriage[] = [];
  filteredMarriages: Marriage[] = [];
  recentMarriages: Marriage[] = [];
  selectedStatus = '';
  selectedDate = '';
  searchText = '';
  
  // Navigation
  activeTab: 'overview' | 'marriages' | 'calendar' | 'messages' | 'reports' = 'overview';
  
  // Notifications
  unreadNotifications = 0;
  unreadMessages = 0;
  showNotifications = false;
  
  // Messagerie
  selectedMarriageForMessaging: Marriage | null = null;
  currentMessages: Message[] = [];
  allMessages: Message[] = [];
  newMessageContent = '';

  // Calendrier
  currentMonth = new Date();
  calendarDays: any[] = [];
  calendar: any[] = [];

  // Rapports
  reportPeriod = 'month';
  reportData: any = null;

  constructor(
    private authService: AuthService,
    private marriageService: MarriageService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser || this.currentUser.role !== 'celebrant') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMarriages();
  }

  private loadMarriages(): void {
    this.marriageService.getAllMarriages().subscribe({
      next: (marriages) => {
        this.marriages = marriages;
        this.filterMarriages();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des mariages:', error);
      }
    });
  }

  filterMarriages(): void {
    let filtered = [...this.marriages];

    // Filtrer par statut
    if (this.selectedStatus) {
      filtered = filtered.filter(marriage => marriage.status === this.selectedStatus);
    }

    // Filtrer par recherche textuelle
    if (this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(marriage =>
        marriage.groomFirstName.toLowerCase().includes(searchLower) ||
        marriage.groomLastName.toLowerCase().includes(searchLower) ||
        marriage.brideFirstName.toLowerCase().includes(searchLower) ||
        marriage.brideLastName.toLowerCase().includes(searchLower)
      );
    }

    this.filteredMarriages = filtered.sort((a, b) => 
      new Date(a.weddingDate).getTime() - new Date(b.weddingDate).getTime()
    );
  }

  getMarriageStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthMarriages = this.marriages.filter(m => {
      const marriageDate = new Date(m.weddingDate);
      return marriageDate.getMonth() === currentMonth && marriageDate.getFullYear() === currentYear;
    });

    return {
      total: this.marriages.length,
      pending: this.marriages.filter(m => m.status === 'pending').length,
      confirmed: this.marriages.filter(m => m.status === 'confirmed').length,
      completed: this.marriages.filter(m => m.status === 'completed').length,
      thisMonth: thisMonthMarriages.length
    };
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  }

  updateStatus(marriageId: string, newStatus: Marriage['status']): void {
    this.marriageService.updateMarriageStatus(marriageId, newStatus).subscribe({
      next: (updatedMarriage) => {
        // Mettre à jour la liste locale
        const index = this.marriages.findIndex(m => m.id === marriageId);
        if (index !== -1) {
          this.marriages[index] = updatedMarriage;
          this.filterMarriages();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
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
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
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

  openMessaging(marriage: Marriage): void {
    this.selectedMarriageForMessaging = marriage;
    this.loadMessages(marriage.id);
  }

  closeMessaging(): void {
    this.selectedMarriageForMessaging = null;
    this.currentMessages = [];
    this.newMessageContent = '';
  }

  private loadMessages(marriageId: string): void {
    this.messageService.getMessagesByMarriage(marriageId).subscribe({
      next: (messages) => {
        this.currentMessages = messages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
      error: (error) => {
        console.error('Erreur lors du chargement des messages:', error);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim() || !this.selectedMarriageForMessaging || !this.currentUser) {
      return;
    }

    const messageData = {
      marriageId: this.selectedMarriageForMessaging.id,
      senderId: this.currentUser.id,
      senderName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      senderRole: this.currentUser.role,
      content: this.newMessageContent.trim()
    };

    this.messageService.sendMessage(messageData).subscribe({
      next: (newMessage) => {
        this.currentMessages.push(newMessage);
        this.newMessageContent = '';
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    });
  }

  // Navigation entre onglets
  setActiveTab(tab: 'overview' | 'marriages' | 'calendar' | 'messages' | 'reports'): void {
    this.activeTab = tab;
    
    // Charger les données spécifiques à l'onglet
    switch (tab) {
      case 'calendar':
        this.generateCalendar();
        break;
      case 'messages':
        this.loadAllMessages();
        break;
      case 'reports':
        this.generateReports();
        break;
    }
  }

  // Notifications
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Calendrier
  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const marriagesForDay = this.marriages.filter(marriage => {
        const marriageDate = new Date(marriage.weddingDate);
        return marriageDate.toDateString() === date.toDateString();
      });

      this.calendarDays.push({
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        marriages: marriagesForDay
      });
    }
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  // Messages
  loadAllMessages(): void {
    // Pour l'instant, on utilise les messages existants du mariage sélectionné
    if (this.marriages.length > 0) {
      // Simuler des messages pour tous les mariages
      const allMessages: Message[] = [];
      this.marriages.forEach(marriage => {
        this.messageService.getMessagesByMarriage(marriage.id).subscribe({
          next: (messages: Message[]) => {
            allMessages.push(...messages);
            this.currentMessages = allMessages.sort((a: Message, b: Message) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            this.unreadMessages = allMessages.filter((m: Message) => m.senderRole !== 'celebrant').length;
          },
          error: (error: any) => {
            console.error('Erreur lors du chargement des messages:', error);
          }
        });
      });
    }
  }

  // Rapports
  generateReports(period?: string): void {
    if (period) {
      this.reportPeriod = period;
    }
    
    const now = new Date();
    let startDate: Date;
    
    switch (this.reportPeriod) {
      case 'monthly':
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        // Pour le rapport personnalisé, on peut utiliser les 30 derniers jours par défaut
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const periodMarriages = this.marriages.filter(marriage => 
      new Date(marriage.weddingDate) >= startDate && new Date(marriage.weddingDate) <= now
    );

    this.reportData = {
      totalMarriages: periodMarriages.length,
      confirmedMarriages: periodMarriages.filter(m => m.status === 'confirmed').length,
      pendingMarriages: periodMarriages.filter(m => m.status === 'pending').length,
      cancelledMarriages: periodMarriages.filter(m => m.status === 'cancelled').length,
      completedMarriages: periodMarriages.filter(m => m.status === 'completed').length,
      averagePerDay: Math.round(periodMarriages.length / this.getDaysBetween(startDate, now) * 10) / 10
    };
  }

  private getDaysBetween(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  exportReport(): void {
    // Simulation d'export de rapport
    const data = JSON.stringify(this.reportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-mariages-${this.reportPeriod}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
