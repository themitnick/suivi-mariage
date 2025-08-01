export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'celebrant' | 'citizen';
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface Marriage {
  id: string;
  reservationCode: string; // Code de 10 caractères
  groomFirstName: string;
  groomLastName: string;
  groomEmail: string;
  groomPhone: string;
  brideFirstName: string;
  brideLastName: string;
  brideEmail: string;
  bridePhone: string;
  weddingDate: Date;
  weddingTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  celebrantId?: string;
  celebrant?: User;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  date: Date;
  time: string;
  isAvailable: boolean;
  marriageId?: string;
}

export interface Message {
  id: string;
  marriageId: string;
  senderId: string;
  senderName: string;
  senderRole: 'celebrant' | 'citizen';
  content: string;
  createdAt: Date;
}

export interface LoginRequest {
  email?: string;
  password?: string;
  // Pour les citoyens
  reservationCode?: string;
  lastName?: string;
}

export interface CitizenLoginRequest {
  reservationCode: string;
  lastName: string;
}

export interface CelebrantLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  marriage?: Marriage; // Pour les citoyens
}
