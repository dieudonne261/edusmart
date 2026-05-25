# ADR-010 — DNS LWS conservé (ns21..ns24)

**Statut** : ✅ Acté
**Date** : 2026-05-17
**Auteur** : Randrianarison Dieu Donné

## Contexte
Le domaine `edusmart.site` est acheté chez LWS. LWS fournit aussi la boîte mail métier (`mail.edusmart.site`). Vercel propose ses propres nameservers (recommandé pour la simplicité). Que choisir ?

## Options envisagées
- **A** : Changer les nameservers du domaine pour ceux de Vercel → tout est géré dans le dashboard Vercel.
- **B** : Garder les nameservers LWS (`ns21..ns24.lwsdns.com`) et configurer manuellement les enregistrements DNS dans la zone LWS.

## Décision
**Option B** : Garder NS LWS.

## Conséquences
- ✅ **Boîte mail `mail.edusmart.site` continue de fonctionner** sans migration.
- ✅ **Garde la flexibilité** : Vercel pour le web, LWS pour le mail, possibilité d'autres services tiers (Resend, etc.).
- ✅ **Backup DNS LWS** déjà téléchargé (`2026-05-25___backup_zone_edusmart.site.txt`).
- ❌ **Configuration manuelle** des enregistrements DNS (CNAME wildcard, MX, TXT vérification Vercel, DKIM Resend, DMARC, SPF).
- ❌ **Wildcard CNAME intercepte les sous-domaines** non explicitement déclarés → nécessité d'un A explicite pour `mail` (voir [BUG #2](../12-bugs/BUGS_AND_FIXES.md#3-bug-2--outlook-imap-ne-joint-pas-mailedusmartsite)).
- ❌ **Si Vercel change sa valeur CNAME** (déjà arrivé : `cname.vercel-dns.com` → `7c280f9aadf5f882.vercel-dns-017.com`), il faut mettre à jour manuellement chez LWS.

## Configuration DNS LWS actuelle

| Type | Nom | Valeur |
|---|---|---|
| A | @ | `<Vercel IP>` |
| A | mail | `213.255.195.65` (LWS) ← gagne sur wildcard |
| CNAME | * | `7c280f9aadf5f882.vercel-dns-017.com.` |
| CNAME | test | `7c280f9aadf5f882.vercel-dns-017.com.` |
| MX | @ | `mail.edusmart.site.` priority 10 |
| TXT | _vercel | `<token vérification>` |
| TXT | @ | `v=spf1 include:_spf.mail.lws.fr include:_spf.resend.com -all` |
| TXT | resend._domainkey | `<DKIM resend>` |
| TXT | _dmarc | `v=DMARC1; p=quarantine; rua=mailto:contact@edusmart.site` |

## Alternatives à revoir si...
- Migration vers `edusmart.mg` (TLD malgache) prévue plus tard ([NEXT_ACTIONS P3](../10-roadmap/NEXT_ACTIONS.md)).
- LWS deviendrait limitant (perf, support) → migration vers Cloudflare DNS (gratuit, plus rapide).
