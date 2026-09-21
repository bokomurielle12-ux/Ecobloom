import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import {
  DB,
  User,
  Payment,
  ActivityEvent,
  Notification,
  Feedback,
  Formule,
  FeedbackType,
  DUREE_MOIS,
  JOURS_PAR_MOIS,
  FORMULE_PRICES,
} from "./types";

// ---------- Storage layer ----------
// Two backends behind the same async readDB()/writeDB() pair, so every
// function below is written once and works in both places:
//
// - Local dev (no Redis env vars set): a plain JSON file at data/db.json.
//   Nothing to configure, works offline, easy to inspect/reset.
// - Deployed on Vercel: Upstash Redis (Vercel Marketplace → Storage →
//   Upstash for Redis → Connect to Project). Vercel's serverless
//   filesystem can't persist writes, so the file backend would silently
//   lose every registration/payment/confirmation in production — Redis
//   is what makes those durable once deployed.
//
// The whole database is kept as one JSON blob under a single Redis key,
// which keeps this migration a pure swap of *where* the data lives, not
// *how* the app is written — no schema, no SQL, no other file changes.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const REDIS_KEY = "ecobloom:db";

const redis = REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const EMPTY_DB: DB = { users: [], payments: [], activity: [], notifications: [], feedback: [] };

async function readDB(): Promise<DB> {
  if (redis) {
    const db = await redis.get<DB>(REDIS_KEY);
    if (!db) return { ...EMPTY_DB };
    db.notifications ??= [];
    db.feedback ??= [];
    return db;
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(EMPTY_DB, null, 2));
    return { ...EMPTY_DB };
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const db = JSON.parse(raw) as DB;
  db.notifications ??= [];
  db.feedback ??= [];
  return db;
}

async function writeDB(db: DB): Promise<void> {
  if (redis) {
    await redis.set(REDIS_KEY, db);
    return;
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function addNotification(db: DB, userId: string, message: string) {
  db.notifications.unshift({
    id: uid(),
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

function addActivity(db: DB, type: ActivityEvent["type"], userId: string, message: string) {
  db.activity.unshift({ id: uid(), type, userId, message, createdAt: new Date().toISOString() });
}

// ---------- Users ----------

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await readDB();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// Self-provisioning admin account. Without this, a fresh deployment (or a
// local copy where `npm run seed` was skipped) has no admin user at all,
// which looks exactly like "I can't log into the admin space" with no
// error message explaining why. This runs on every login attempt — cheap,
// idempotent (does nothing once an admin exists), and works the same way
// whether the data lives in the local file or in Redis.
export async function ensureAdminAccount(): Promise<void> {
  const db = await readDB();
  if (db.users.some((u) => u.role === "ADMIN")) return;

  const email = process.env.ADMIN_EMAIL || "ecobloom60@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "admin1234";

  const admin: User = {
    id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    prenom: "Admin",
    nom: "EcoBloom",
    name: "Admin EcoBloom",
    email,
    phone: "+229 01 52 03 09 40",
    passwordHash: bcrypt.hashSync(password, 10),
    role: "ADMIN",
    status: "CONFIRMED",
    formule: "CONFORT",
    autresInfos: "",
    whatsappJoined: false,
    createdAt: new Date().toISOString(),
    confirmedAt: new Date().toISOString(),
  };
  db.users.push(admin);
  await writeDB(db);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await readDB();
  return db.users.find((u) => u.id === id);
}

export async function getWaitlist(): Promise<User[]> {
  const db = await readDB();
  return db.users
    .filter((u) => u.role === "CLIENT" && u.status === "PENDING")
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export async function getConfirmedClients(): Promise<User[]> {
  const db = await readDB();
  return db.users.filter((u) => u.role === "CLIENT" && u.status === "CONFIRMED");
}
export const getConfirmedMembers = getConfirmedClients;

export async function getAllClients(): Promise<User[]> {
  const db = await readDB();
  return db.users.filter((u) => u.role === "CLIENT");
}

export async function createWaitlistUser(input: {
  prenom: string;
  nom: string;
  email: string;
  phone: string;
  passwordHash: string;
  formule: Formule;
  autresInfos?: string;
  role?: "CLIENT" | "ADMIN";
}): Promise<User> {
  const db = await readDB();
  const name = `${input.prenom} ${input.nom}`.trim();
  const user: User = {
    id: uid(),
    prenom: input.prenom,
    nom: input.nom,
    name,
    email: input.email,
    phone: input.phone,
    passwordHash: input.passwordHash,
    role: input.role ?? "CLIENT",
    formule: input.formule,
    autresInfos: input.autresInfos ?? "",
    status: input.role === "ADMIN" ? "CONFIRMED" : "PENDING",
    whatsappJoined: false,
    createdAt: new Date().toISOString(),
    confirmedAt: input.role === "ADMIN" ? new Date().toISOString() : null,
  };
  db.users.push(user);

  if (user.role === "CLIENT") {
    addActivity(db, "SIGNUP", user.id, `${user.name} a rejoint la liste d'attente (${input.formule})`);
    addNotification(
      db,
      user.id,
      "Merci pour votre inscription ! Votre demande est en attente de validation par l'équipe EcoBloom."
    );
  }

  await writeDB(db);
  return user;
}

export async function confirmUser(userId: string) {
  const db = await readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  user.status = "CONFIRMED";
  user.confirmedAt = new Date().toISOString();

  // Create the 11 monthly payment slots now that she's confirmed.
  const amount = FORMULE_PRICES[user.formule];
  const already = db.payments.some((p) => p.userId === userId);
  if (!already) {
    for (let month = 1; month <= DUREE_MOIS; month++) {
      const dueDate = new Date(user.confirmedAt);
      dueDate.setDate(dueDate.getDate() + (month - 1) * JOURS_PAR_MOIS);
      db.payments.push({
        id: uid(),
        userId,
        month,
        amount,
        status: "PENDING",
        method: null,
        paidAt: null,
        transactionId: null,
        dueDate: dueDate.toISOString(),
      });
    }
  }

  addActivity(db, "CONFIRMED", userId, `${user.name} a été confirmée dans le programme`);
  addNotification(
    db,
    userId,
    "Bonne nouvelle : votre inscription EcoBloom est confirmée ! Vous pouvez maintenant cotiser et rejoindre le groupe WhatsApp."
  );

  await writeDB(db);
  return user;
}

export async function refuseUser(userId: string) {
  const db = await readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  user.status = "REFUSED";
  addActivity(db, "REFUSED", userId, `La demande de ${user.name} a été refusée`);
  addNotification(
    db,
    userId,
    "Votre demande d'inscription n'a pas pu être retenue pour cette édition. N'hésitez pas à nous contacter pour en savoir plus."
  );

  await writeDB(db);
  return user;
}

export async function markWhatsappJoined(userId: string): Promise<void> {
  const db = await readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;
  user.whatsappJoined = true;
  addActivity(db, "WHATSAPP_JOIN", userId, `${user.name} a rejoint le groupe WhatsApp`);
  await writeDB(db);
}

// ---------- Payments ----------

export async function getPaymentsForUser(userId: string): Promise<Payment[]> {
  const db = await readDB();
  return db.payments.filter((p) => p.userId === userId).sort((a, b) => a.month - b.month);
}

export async function getAllPayments(): Promise<Payment[]> {
  return (await readDB()).payments;
}

export async function getPaymentById(paymentId: string): Promise<Payment | undefined> {
  const db = await readDB();
  return db.payments.find((p) => p.id === paymentId);
}

export async function markPaymentProcessing(paymentId: string, method: Payment["method"]) {
  const db = await readDB();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) return null;
  payment.status = "PROCESSING";
  payment.method = method;

  const user = db.users.find((u) => u.id === payment.userId);
  addActivity(
    db,
    "PAYMENT",
    payment.userId,
    `${user?.name ?? "Un membre"} déclare avoir payé le mois ${payment.month} par ${method} — à vérifier`
  );
  addNotification(
    db,
    payment.userId,
    `Votre paiement du mois ${payment.month} est en cours de vérification par notre équipe.`
  );

  await writeDB(db);
  return payment;
}

export async function markPaymentPaid(paymentId: string, method: Payment["method"], transactionId: string | null) {
  const db = await readDB();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) return null;
  payment.status = "PAID";
  payment.method = method;
  payment.paidAt = new Date().toISOString();
  payment.transactionId = transactionId;

  const user = db.users.find((u) => u.id === payment.userId);
  addActivity(
    db,
    "PAYMENT",
    payment.userId,
    `${user?.name ?? "Un membre"} a payé le mois ${payment.month} (${payment.amount.toLocaleString("fr-FR")} FCFA)`
  );
  addNotification(db, payment.userId, `Paiement du mois ${payment.month} bien reçu. Merci !`);

  await writeDB(db);
  return payment;
}

export async function getMemberSummary(userId: string) {
  const payments = await getPaymentsForUser(userId);
  const paidCount = payments.filter((p) => p.status === "PAID").length;
  const totalPaid = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
  const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
  const late = payments.filter((p) => p.status === "PENDING" && new Date(p.dueDate) < new Date()).length;
  return { paidCount, totalPaid, totalDue, monthsTotal: DUREE_MOIS, late };
}

// ---------- Admin stats ----------

export async function getAdminStats() {
  const db = await readDB();
  const clients = db.users.filter((u) => u.role === "CLIENT");
  const waitlist = clients.filter((u) => u.status === "PENDING").length;
  const confirmed = clients.filter((u) => u.status === "CONFIRMED").length;
  const refused = clients.filter((u) => u.status === "REFUSED").length;

  const now = new Date();
  const paidThisMonth = db.payments.filter(
    (p) =>
      p.status === "PAID" &&
      p.paidAt &&
      new Date(p.paidAt).getMonth() === now.getMonth() &&
      new Date(p.paidAt).getFullYear() === now.getFullYear()
  );
  const latePayments = db.payments.filter((p) => p.status === "PENDING" && new Date(p.dueDate) < now);
  const totalCollected = db.payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalExpected = db.payments.reduce((s, p) => s + p.amount, 0);

  return {
    waitlist,
    confirmed,
    refused,
    activeParticipants: confirmed, // "actives" = confirmées et en cours de cotisation
    paidThisMonthCount: paidThisMonth.length,
    paidThisMonthAmount: paidThisMonth.reduce((s, p) => s + p.amount, 0),
    lateCount: latePayments.length,
    totalCollected,
    totalExpected,
  };
}

export async function getActivity(limit = 20): Promise<ActivityEvent[]> {
  return (await readDB()).activity.slice(0, limit);
}

export async function getPaymentsThisMonth(): Promise<Payment[]> {
  const now = new Date();
  return (await readDB()).payments.filter(
    (p) =>
      p.status === "PAID" &&
      p.paidAt &&
      new Date(p.paidAt).getMonth() === now.getMonth() &&
      new Date(p.paidAt).getFullYear() === now.getFullYear()
  );
}

export async function getLatePayments(): Promise<Payment[]> {
  const now = new Date();
  return (await readDB()).payments.filter((p) => p.status === "PENDING" && new Date(p.dueDate) < now);
}

// ---------- Notifications ----------

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  const db = await readDB();
  return db.notifications.filter((n) => n.userId === userId).slice(0, 30);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const db = await readDB();
  db.notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  await writeDB(db);
}

// ---------- Feedback (suggestions & questions) ----------

export async function createFeedback(userId: string, type: FeedbackType, message: string): Promise<Feedback> {
  const db = await readDB();
  const item: Feedback = {
    id: uid(),
    userId,
    type,
    message,
    status: "OUVERT",
    response: null,
    createdAt: new Date().toISOString(),
  };
  db.feedback.unshift(item);
  await writeDB(db);
  return item;
}
export const createMessage = createFeedback;

export async function getFeedbackForUser(userId: string): Promise<Feedback[]> {
  const db = await readDB();
  return db.feedback.filter((f) => f.userId === userId);
}
export const getMessagesForUser = getFeedbackForUser;

export async function getAllFeedback(): Promise<Feedback[]> {
  return (await readDB()).feedback;
}
export const getAllMessages = getAllFeedback;

export async function respondToFeedback(feedbackId: string, response: string) {
  const db = await readDB();
  const item = db.feedback.find((f) => f.id === feedbackId);
  if (!item) return null;
  item.response = response;
  item.status = "REPONDU";

  addNotification(db, item.userId, `L'équipe EcoBloom a répondu à votre ${item.type === "QUESTION" ? "question" : "suggestion"}.`);
  await writeDB(db);
  return item;
}
