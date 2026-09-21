export type Role = "CLIENT" | "ADMIN";
export type Formule = "ESSENTIEL" | "CONFORT" | "PREMIUM";
export type PaymentStatus = "PENDING" | "PAID" | "PROCESSING";
export type MemberStatus = "PENDING" | "CONFIRMED" | "REFUSED";
export type FeedbackType = "SUGGESTION" | "QUESTION";
export type MessageType = FeedbackType;
export type FeedbackStatus = "OUVERT" | "REPONDU";

export const FORMULE_PRICES: Record<Formule, number> = {
  ESSENTIEL: 25000,
  CONFORT: 30000,
  PREMIUM: 35000,
};

export const FORMULE_LABELS: Record<Formule, string> = {
  ESSENTIEL: "Bloom Essentiel",
  CONFORT: "Bloom Confort",
  PREMIUM: "Bloom Premium",
};

export const FORMULE_HEBERGEMENT: Record<Formule, string> = {
  ESSENTIEL: "Chambre partagée (4 personnes)",
  CONFORT: "Chambre partagée (2 personnes)",
  PREMIUM: "Chambre individuelle",
};

export const DUREE_MOIS = 11;
export const JOURS_PAR_MOIS = 30;

export interface User {
  id: string;
  prenom: string;
  nom: string;
  name: string; // prenom + nom, kept for display convenience
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  formule: Formule;
  autresInfos: string;
  status: MemberStatus;
  whatsappJoined: boolean;
  createdAt: string;
  confirmedAt: string | null;
}

export interface Payment {
  id: string;
  userId: string;
  month: number; // 1..11
  amount: number;
  status: PaymentStatus;
  method: "MTN_MOMO" | "MOOV_MONEY" | "CELTIIS_CASH" | "MANUEL" | null;
  paidAt: string | null;
  transactionId: string | null;
  dueDate: string;
}

export interface ActivityEvent {
  id: string;
  type: "SIGNUP" | "PAYMENT" | "WHATSAPP_JOIN" | "CONFIRMED" | "REFUSED";
  userId: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  response: string | null;
  createdAt: string;
}
export type Message = Feedback;

export interface DB {
  users: User[];
  payments: Payment[];
  activity: ActivityEvent[];
  notifications: Notification[];
  feedback: Feedback[];
}
