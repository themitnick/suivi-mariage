import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  showMobileMenu = false;
  openFaq: number | null = null;

  stats = {
    totalMarriages: 1247,
    averageTime: '15min',
    satisfaction: 98
  };

  features = [
    {
      icon: 'time',
      title: 'Gain de temps',
      description: 'Fini les files d\'attente ! Réservez votre date de mariage en quelques clics, 24h/24 et 7j/7.',
      badge: '• Réservation instantanée'
    },
    {
      icon: 'check',
      title: 'Suivi transparent',
      description: 'Suivez en temps réel l\'avancement de votre dossier avec des notifications automatiques.',
      badge: '• Notifications SMS & Email'
    },
    {
      icon: 'message',
      title: 'Communication directe',
      description: 'Échangez facilement avec votre célébrant via notre messagerie intégrée sécurisée.',
      badge: '• Chat en temps réel'
    },
    {
      icon: 'security',
      title: 'Sécurité garantie',
      description: 'Vos données personnelles sont protégées et traitées selon les standards de sécurité les plus élevés.',
      badge: '• Données chiffrées'
    },
    {
      icon: 'document',
      title: 'Dossier numérique',
      description: 'Tous vos documents sont numérisés et accessibles à tout moment depuis votre espace personnel.',
      badge: '• Accès permanent'
    },
    {
      icon: 'support',
      title: 'Support dédié',
      description: 'Notre équipe vous accompagne à chaque étape pour garantir la réussite de votre mariage civil.',
      badge: '• Assistance personnalisée'
    }
  ];

  testimonials = [
    {
      name: 'Adama & Fatou',
      text: 'Un service exceptionnel ! Nous avons pu organiser notre mariage sans stress.',
      rating: 5
    },
    {
      name: 'Kouame & Akissi',
      text: 'Très pratique, plus besoin de faire la queue à la mairie.',
      rating: 5
    },
    {
      name: 'Jean & Marie',
      text: 'Interface simple et intuitive. Je recommande vivement !',
      rating: 5
    }
  ];

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }

  getFeatureIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      time: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      check: 'M9 12l2 2 4-4m5.414-4.414a2 2 0 112.828 2.828L9 20.414l-7-7a2 2 0 012.828-2.828L9 14.586z',
      message: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      security: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      document: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0a2 2 0 002-2h4a2 2 0 002 2m-6 0h6',
      support: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 002.25 12 9.75 9.75 0 0012 21.75 9.75 9.75 0 0021.75 12 9.75 9.75 0 0012 2.25z',
      clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z'
    };
    return icons[iconName] || icons['support'];
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
