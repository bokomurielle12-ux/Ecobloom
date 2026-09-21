# EcoBloom — Next.js

Communauté féminine d'épargne, bien-être et évasion (édition pilote 2027, Bénin).

## Démarrage

```bash
npm install
cp .env.example .env      # puis renseigne AUTH_SECRET et tes clés KKiaPay
npm run seed               # crée un admin + 3 membres de démo dans data/db.json
npm run dev
```

Ouvre http://localhost:3000

## Comptes de démonstration (après `npm run seed`)

| Rôle              | Email                  | Mot de passe |
|-------------------|-------------------------|--------------|
| Admin             | ecobloom60@gmail.com        | admin1234    |
| Confirmée         | aicha@example.com        | client1234   |
| Confirmée         | marie@example.com        | client1234   |
| Confirmée         | fatima@example.com       | client1234   |
| Liste d'attente   | grace@example.com        | client1234   |
| Liste d'attente   | nadia@example.com        | client1234   |

## Parcours

1. Une visiteuse remplit le formulaire "Rejoindre la liste d'attente" (nom, prénom, téléphone, email, formule, infos complémentaires).
2. Elle peut se connecter immédiatement pour suivre le statut de sa demande (`/dashboard`), mais l'espace est limité tant qu'elle n'est pas confirmée.
3. L'admin (`/admin`) voit la demande dans "Demandes en attente" et peut **Confirmer** ou **Refuser**.
4. Une fois confirmée, la participante voit automatiquement la confirmation dans son espace, débloque le suivi des cotisations, l'historique de paiement, et le bouton pour rejoindre le groupe WhatsApp.
5. Elle paie chaque mois via KKiaPay (MTN MoMo). Chaque paiement apparaît dans son historique et met à jour les statistiques admin (montant collecté, paiements du mois, retards).
6. Elle peut à tout moment poser une question ou envoyer une suggestion depuis son espace ; l'admin y répond depuis la boîte de réception (`/admin`).

## Paiement Mobile Money (MTN MoMo, Moov Money, Celtiis)

Le site utilise **KKiaPay** (agrégateur béninois) pour le paiement Mobile Money. Pour ce MVP, seul **MTN Mobile Money** est activement proposé (Moov Money et Celtiis Cash restent gérés dans le code pour une extension future).

1. Crée un compte gratuit sur https://kkiapay.me
2. Récupère ta clé publique et ta clé privée (mode "sandbox" pour tester sans vrai argent)
3. Renseigne-les dans `.env` :
   ```
   NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY=...
   KKIAPAY_PRIVATE_KEY=...
   NEXT_PUBLIC_KKIAPAY_SANDBOX=true
   ```
4. Une fois prête à encaisser réellement, passe `NEXT_PUBLIC_KKIAPAY_SANDBOX=false`.

L'espace admin permet aussi de marquer un mois "payé" manuellement (utile pour un versement reçu autrement, ou en cas de souci de vérification automatique).

## Groupe WhatsApp

Renseigne le lien d'invitation de ton groupe WhatsApp dans `.env` :
```
NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/xxxxxxxx
```
Il s'affiche automatiquement à l'inscription et dans le tableau de bord client.

## Où sont les données ?

`lib/db.ts` bascule automatiquement entre deux backends, selon ce qu'il trouve dans l'environnement :

- **En local (`npm run dev`)** : un simple fichier `data/db.json`, sans rien à configurer.
- **Une fois déployé sur Vercel** : Redis (Upstash), dès que les variables `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (ou `KV_REST_API_URL` / `KV_REST_API_TOKEN`) sont présentes — voir la section Déploiement ci-dessous. Sans ça, le système de fichiers de Vercel étant en lecture seule, les inscriptions et paiements ne seraient jamais sauvegardés.

Le reste du code ne connaît que des fonctions comme `getUserById()` ou `markPaymentPaid()` — aucune page ni route API n'a besoin de savoir où vivent les données.

## Structure

```
app/
  page.tsx              -> Landing page publique
  login/, register/     -> Authentification
  dashboard/             -> Espace client (protégé)
  admin/, admin/[id]/    -> Espace admin (protégé)
  api/                    -> Routes API (auth, paiements, whatsapp, admin)
components/
  dashboard/              -> Composants de l'espace client
  admin/                  -> Composants de l'espace admin
  payment/                -> Bouton KKiaPay
lib/
  db.ts                   -> Couche de données (fichier local ou Redis, automatique)
  auth.ts                 -> Sessions (cookie JWT signé)
  kkiapay.ts               -> Vérification serveur des transactions KKiaPay
proxy.ts                  -> Protection des routes /dashboard et /admin
scripts/seed.mjs           -> Génère des données de démo (fichier local uniquement)
```

## Déploiement sur Vercel

1. **Pousse le projet sur GitHub**, puis importe le dépôt sur https://vercel.com/new
2. **Ajoute le stockage Redis** avant le premier déploiement réel : dans ton projet Vercel → onglet **Storage** → **Create Database** → **Upstash for Redis** → connecte-le au projet. Vercel ajoute automatiquement les variables `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` — rien à copier-coller.
3. **Ajoute les autres variables d'environnement** dans Project Settings → Environment Variables : `AUTH_SECRET` (une longue chaîne aléatoire), `ADMIN_EMAIL` / `ADMIN_PASSWORD` si tu veux changer les identifiants par défaut, tes clés KKiaPay, et `NEXT_PUBLIC_WHATSAPP_GROUP_LINK`.
4. **Déploie.** Le premier login crée automatiquement le compte admin (voir plus haut) — cette fois-ci directement dans Redis, donc ça persiste réellement.
5. **Connecte ton domaine** (ex. acheté sur AfriRegister) : Project Settings → Domains → ajoute ton nom de domaine. Vercel te donne soit des enregistrements DNS à ajouter chez AfriRegister (A/CNAME), soit propose de changer les serveurs de noms — les deux fonctionnent, le premier est plus simple si tu veux garder d'autres services (email...) chez AfriRegister.

`npm run seed` reste utile uniquement en local (il écrit dans `data/db.json`) — inutile et sans effet une fois déployé sur Redis.

