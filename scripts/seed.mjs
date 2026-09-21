import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const PRICES = { ESSENTIEL: 25000, CONFORT: 30000, PREMIUM: 35000 };

async function main() {
  const adminHash = await bcrypt.hash("admin1234", 10);
  const clientHash = await bcrypt.hash("client1234", 10);

  const users = [];
  const payments = [];
  const activity = [];
  const notifications = [];
  const messages = [];

  const admin = {
    id: uid(),
    name: "Admin EcoBloom",
    email: "ecobloom60@gmail.com",
    phone: "+229 00 00 00 00",
    passwordHash: adminHash,
    role: "ADMIN",
    formule: "CONFORT",
    status: "CONFIRMED",
    notes: "",
    whatsappJoined: false,
    createdAt: new Date().toISOString(),
    confirmedAt: new Date().toISOString(),
  };
  users.push(admin);

  function addClient({ name, email, phone, formule, status, paidMonths, notes, daysAgo, whatsappJoined }) {
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const confirmedAt =
      status === "CONFIRMED"
        ? new Date(Date.now() - Math.max(daysAgo - 2, 0) * 24 * 60 * 60 * 1000).toISOString()
        : null;

    const user = {
      id: uid(),
      name,
      email,
      phone,
      passwordHash: clientHash,
      role: "CLIENT",
      formule,
      status,
      notes: notes ?? "",
      whatsappJoined: !!whatsappJoined,
      createdAt,
      confirmedAt,
    };
    users.push(user);

    for (let month = 1; month <= 11; month++) {
      const paid = month <= paidMonths;
      const payment = {
        id: uid(),
        userId: user.id,
        month,
        amount: PRICES[formule],
        status: paid ? "PAID" : "PENDING",
        method: paid ? "MTN_MOMO" : null,
        paidAt: paid
          ? new Date(Date.now() - (paidMonths - month + 1) * 25 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        transactionId: paid ? "demo_" + uid() : null,
      };
      payments.push(payment);
      if (paid) {
        activity.push({
          id: uid(),
          type: "PAYMENT",
          userId: user.id,
          message: `${name} a payé le mois ${month} (${PRICES[formule].toLocaleString("fr-FR")} FCFA)`,
          createdAt: payment.paidAt,
        });
      }
    }

    activity.push({
      id: uid(),
      type: status === "CONFIRMED" ? "SIGNUP" : "SIGNUP",
      userId: user.id,
      message: `${name} a rejoint la liste d'attente (${formule})`,
      createdAt,
    });

    if (status === "CONFIRMED") {
      activity.push({
        id: uid(),
        type: "CONFIRMED",
        userId: user.id,
        message: `${name} a été confirmée par l'administration`,
        createdAt: confirmedAt,
      });
      notifications.push({
        id: uid(),
        userId: user.id,
        message: "Bonne nouvelle : votre inscription à EcoBloom est confirmée !",
        read: true,
        createdAt: confirmedAt,
      });
    } else {
      notifications.push({
        id: uid(),
        userId: user.id,
        message: "Votre demande a bien été reçue ! Elle est en cours d'examen par notre équipe.",
        read: false,
        createdAt,
      });
    }

    return user;
  }

  const aicha = addClient({
    name: "Aïcha Koné",
    email: "aicha@example.com",
    phone: "+229 61 11 22 33",
    formule: "ESSENTIEL",
    status: "CONFIRMED",
    paidMonths: 3,
    daysAgo: 95,
    whatsappJoined: true,
  });

  const marie = addClient({
    name: "Marie-Claire Dossou",
    email: "marie@example.com",
    phone: "+229 62 22 33 44",
    formule: "CONFORT",
    status: "CONFIRMED",
    paidMonths: 5,
    daysAgo: 150,
    whatsappJoined: true,
  });

  addClient({
    name: "Fatima Sanni",
    email: "fatima@example.com",
    phone: "+229 63 33 44 55",
    formule: "PREMIUM",
    status: "CONFIRMED",
    paidMonths: 1,
    daysAgo: 40,
    whatsappJoined: false,
  });

  addClient({
    name: "Grace Adjovi",
    email: "grace@example.com",
    phone: "+229 64 44 55 66",
    formule: "CONFORT",
    status: "PENDING",
    paidMonths: 0,
    daysAgo: 2,
    notes: "Disponible seulement à partir de juin, est-ce compatible ?",
  });

  addClient({
    name: "Nadia Houngbo",
    email: "nadia@example.com",
    phone: "+229 65 55 66 77",
    formule: "ESSENTIEL",
    status: "PENDING",
    paidMonths: 0,
    daysAgo: 1,
  });

  // Demo suggestions / questions
  messages.push({
    id: uid(),
    userId: aicha.id,
    type: "QUESTION",
    content: "Est-ce que je peux changer de formule en cours de route si mon budget évolue ?",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    adminReply: "Oui, contactez-nous avant le prélèvement du mois suivant pour ajuster votre formule.",
    repliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  });
  messages.push({
    id: uid(),
    userId: marie.id,
    type: "SUGGESTION",
    content: "Ce serait super d'avoir un atelier cuisine locale pendant le séjour !",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    adminReply: null,
    repliedAt: null,
  });

  activity.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  notifications.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const db = { users, payments, activity, notifications, messages };
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log("Seed OK -> data/db.json");
  console.log("  Admin           : ecobloom60@gmail.com / admin1234");
  console.log("  Confirmées      : aicha@example.com, marie@example.com, fatima@example.com / client1234");
  console.log("  Liste d'attente : grace@example.com, nadia@example.com / client1234");
}

main();
