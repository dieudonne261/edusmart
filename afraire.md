À faire maintenant côté Dashboards (10 min)
1️⃣ Inviter ton compte UAZ — Supabase (2 min)
1. Aller sur https://supabase.com/dashboard/project/heuaaqjrrctamhmrsecu/auth/users
2. Cliquer "Add user" → "Send magic link"
3. Email : randrianarison.d@zurcher.edu.mg
4. Confirmer
⚠️ Si tu ne reçois pas l'email : le SMTP par défaut Supabase est limité à 4 mails/heure. Pour produire de manière fiable, configurer Resend dans Settings → Auth → SMTP Settings :

Host: smtp.resend.com · Port: 465 · User: resend · Password: ta clé Resend · Sender: noreply@edusmart.site
Le trigger DB créera automatiquement ton profile super_admin lié à UAZ dès la création du user. Tu pourras te connecter sur uaz.edusmart.site/admin (et sur edusmart.site/admin une fois le domaine en place).

2️⃣ Créer le projet Vercel edusmart (vitrine) — 5 min
1. Aller sur https://vercel.com/new
2. Import Git Repository → choisir "dieudonne261/edusmart"
3. Project Name : edusmart  (ou edusmart-vitrine)
4. Framework Preset : Next.js (auto-détecté)
5. Root Directory : apps/vitrine
6. Build & Output Settings :
   • Build Command   : pnpm turbo run build --filter=@edusmart/admin
   • Install Command : pnpm install --frozen-lockfile
   • Output Directory: .next  (laisser vide pour défaut)
7. Environment Variables (cliquer Add) :
Variables à coller (toutes en environnement Production + Preview + Development) :

Nom	Valeur
NEXT_PUBLIC_SUPABASE_URL	https://heuaaqjrrctamhmrsecu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldWFhcWpycmN0YW1obXJzZWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzIwNzQsImV4cCI6MjA5NDYwODA3NH0.viTcuaWs8GvLXG9q1YJ80lj0hL99ICpYngzgcZKbMrQ
SUPABASE_SERVICE_ROLE_KEY	(copier depuis Dashboard Supabase → Settings → API → service_role)
NEXT_PUBLIC_ROOT_DOMAIN	edusmart.site
NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL	https://edusmart.site/auth/callback
→ Deploy. Le 1ᵉʳ build prend ~3-4 min.

3️⃣ Attacher le domaine edusmart.site (3 min)
1. Dans le nouveau projet Vercel → Settings → Domains
2. Add → edusmart.site         → Vercel te donne une valeur CNAME/A
3. Add → www.edusmart.site     → idem
4. Add → *.edusmart.site       → wildcard pour strelitzia.edusmart.site, uaz.edusmart.site...
Ensuite chez LWS (Zone DNS) :

Le A @ pointe déjà vers Vercel (existant via edusmart-test)
Vérifier que CNAME * pointe bien sur 7c280f9aadf5f882.vercel-dns-017.com. (ou la nouvelle valeur que Vercel affiche)
Garder le A mail 213.255.195.65 explicite (sinon mail.edusmart.site casse)
Garder les MX, TXT SPF/DKIM/DMARC
4️⃣ Configurer Supabase Auth Redirect URLs (1 min)
Dashboard Supabase → Authentication → URL Configuration :

Site URL : https://edusmart.site
Redirect URLs (ajouter) :
https://edusmart.site/**
https://*.edusmart.site/**
http://localhost:3001/**
http://localhost:3002/**
🧪 Test après déploiement
1. https://edusmart.site           → page marketing avec STRELITZIA + UAZ listées ✅
2. https://uaz.edusmart.site       → vitrine UAZ avec ton tagline violet/jaune ✅
3. https://strelitzia.edusmart.site → vitrine STRELITZIA verte/or ✅
4. https://uaz.edusmart.site/admin  → redirige /login (page Magic Link)
5. Saisis ton email randrianarison.d@zurcher.edu.mg → reçois Magic Link
6. Click → /auth/callback → /post-login → dashboard UAZ avec les vrais élèves ✅
🎯 État final récapitulatif
Brique	État
Schéma DB (33 tables + RLS)	✅
Trigger auto-profile pour ton email	✅
Code auth (login, callback, middleware)	✅ pushé
Vitrine multi-tenant DB	✅ pushée
Type-check toutes apps	✅ vert
GitHub push	✅ commit 2d97111
Vercel edusmart-test re-build	✅ READY
Vercel projet vitrine edusmart	📋 à créer (5 min)
Domaine edusmart.site + wildcard	📋 à attacher (3 min)
Invitation user UAZ	📋 à faire (2 min)
Dis-moi quand tu as terminé les 4 étapes Dashboard et je teste les redirections multi-tenant avec toi en live ! 🚀