# Tourne-Bride — Design System & Guide des pages

Guide de référence pour construire les pages du site **Centre Protestant Tourne-Bride** (asbl).
La page d'accueil (`src/pages/index.astro`) est déjà faite et sert de vitrine du système.
Ce document sert à créer les **autres pages** de façon cohérente.

---

## 1. Marque & ton

- **Qui** : Centre Protestant Tourne-Bride ASBL (« L'Évangile Aux Enfants »), centre chrétien pour enfants, fondé **1964**, à Sars-la-Buissière (Thudinie, Belgique), sur un domaine de **5 hectares** dans le parc naturel de la Haute Sambre.
- **Activités** : camps/colonies (7-11 ans, séjours bibliques résidentiels), **Internat Sportif Marie Durand**, **locations** de bâtiments, accueil d'urgence.
- **Figures** : Oncle Yvan (Yvan Dussart) & Tante Nadine.
- **Ton** : chaleureux, familial, rassurant, ancré dans la nature et la foi — sans lourdeur. Français de Belgique. Tutoiement des enfants possible dans les accroches, vouvoiement des parents dans l'informatif.
- **Contact** : Château Grignard, Chevesne 95, 6542 Sars-la-Buissière · 071 59 19 61 / 0496 18 14 14 · yvan.dussart@tourne-bride.be
- **IBAN dons/camps** : BE52 0882 1037 5009.

> Note : issu d'un clone pixel-perfect du template Framer « Starlight Camp ». Références visuelles dans `_reference/`.

---

## 2. Stack technique

- **Astro 5** (pages dans `src/pages/`, composants dans `src/components/`).
- **Tailwind CSS v4** via `@tailwindcss/vite` — tokens définis dans `src/styles/global.css` (`@theme`).
- **Motion** (motion.dev) pour les animations — piloté par attributs `data-*`, initialisé dans `src/scripts/animations.js` (importé par `Layout.astro`).
- **Polices** self-hosted (Fontsource) : **Luckiest Guy** (display), **Gabarito** + **Inter** (corps).
- Dev : `npm run dev` (port 4321, bascule 4322 si occupé). Build : `npm run build`.

Toute page utilise `src/layouts/Layout.astro` (props `title`, `description`) qui inclut la nav globale ? Non — actuellement `Navbar` et `Footer` sont ajoutés dans chaque page. **Pour les nouvelles pages : importer `Navbar` en haut et `Footer` en bas** (voir §7).

---

## 3. Design tokens

Définis dans `src/styles/global.css` sous `@theme`. Utiliser les classes Tailwind correspondantes (`bg-forest`, `text-moss`, `font-display`…).

### Couleurs
| Token | Hex | Usage |
|---|---|---|
| `forest` | `#1C4425` | Vert principal (fonds sombres, texte sur clair) |
| `forest-deep` | `#123D25` | Vert profond (overlays, contours) |
| `orange` | `#FF5C00` | CTA principal (survol `#e05200`) |
| `lime` | `#93D35C` | Accent (tags, section dates) |
| `amber` | `#FEB835` | Highlight (tags, tente logo) |
| `cream` | `#F1F8E7` | Fond clair principal |
| `cream-2` | `#E5F0D5` | Fond clair alterné / cartes |
| `pale` | `#D5EABD` | Vert le plus pâle |
| `moss` | `#46664E` | Texte gris-vert sur fond clair |
| `mist` | `#D0D8D3` | Texte clair sur fond sombre |

**Alternance de fonds entre sections** (rythme visuel) : cream → cream → forest → cream-2 → cream → forest → cream → cream-2 → lime → cream → forest(footer).

### Typographie
- **Titres (H1/H2/H3 display)** : `font-display` (Luckiest Guy). Toujours en capitales de fait (la police est tout-en-caps). H2 de section ≈ `text-[44px] lg:text-[72px] lg:leading-[76px]`.
- **Corps / boutons / labels** : `font-heading` (Gabarito). Corps 20/32, petit texte 18/28.
- **Paragraphes longs** : `font-body` (Inter) possible, sinon Gabarito.
- Couleur titre : `text-forest` sur clair, `text-white` sur sombre.

### Layout
- Conteneur centré : classe **`.container-site`** (max-width 1360px, padding-inline 20px, `mx-auto`).
- Rayons : cartes `rounded-[28px]`, images rect `rounded-[20px]`, pilules `rounded-full`, tags `rounded-md`.
- Padding vertical section : `py-[100px]` à `py-[120px]` (≈ `pt-[120px] pb-[60px]` quand une grande image cale la hauteur).
- **Décor absolu calé sur le canvas** : pour des éléments flottants positionnés en px (calibrés à 1440), les envelopper dans `<div class="relative mx-auto h-full w-[1440px] max-w-full">` pour qu'ils suivent le contenu centré sur écrans larges (cf. Hero/Mission).

---

## 4. Patterns réutilisables (copier-coller)

### Bouton orange (CTA principal)
```html
<a href="#" class="group relative inline-block overflow-hidden rounded-full bg-orange px-8 py-[18px]">
  <span class="relative z-10 font-heading text-[20px] font-bold text-white">Libellé</span>
  <span class="absolute inset-0 z-0 origin-bottom scale-y-0 bg-[#e05200] transition-transform duration-300 ease-out group-hover:scale-y-100"></span>
</a>
```

### Bouton ghost (contour)
```html
<a href="#" class="rounded-full border-2 border-forest px-8 py-[16px] font-heading text-[20px] font-bold text-forest transition-colors duration-300 hover:bg-forest hover:text-white">Libellé</a>
```

### Bouton blanc (sur fond sombre — footer/nav)
`bg-white` + texte `text-forest`, wipe `bg-orange` (voir Navbar/Footer).

### Tag / label incliné (eyebrow)
```html
<span class="inline-block -rotate-3 rounded-md bg-amber px-3 py-1 font-display text-[18px] leading-none text-forest">Le domaine</span>
```
Variantes de fond : `bg-amber` (jaune), `bg-lime` (vert). Rotation `-rotate-3` / `rotate-2`.

### En-tête de section (tag + H2 + doodle)
```html
<span class="... tag ...">Eyebrow</span>
<h2 data-reveal class="relative mt-4 font-display text-[44px] leading-[1.05] text-forest lg:text-[72px] lg:leading-[76px]">
  Titre de section
  <img src="/images/qi6XErSOH5xNf7R979ZatYl9rPE.svg" alt="" aria-hidden="true" class="absolute -right-8 -top-6 hidden h-[37px] w-[45px] lg:block" />
</h2>
```
Doodles décoratifs disponibles : `qi6XErS…svg` (étincelle orange), `bp8cD6Z…svg` (étincelle verte).

### Image en arche (arch)
Coins hauts très arrondis : `rounded-t-[218px] rounded-b-[24px]` (adapter le rayon haut ≈ moitié de la largeur). Voir `About.astro`, `ChooseUs.astro`, `Families.astro`.

### Carte image + titre en bas (Facilities)
`relative h-[480px] overflow-hidden rounded-[28px]` + `<img object-cover>` + gradient bas + `<h3 absolute bottom-7 left-7>`.

---

## 5. Système d'animation (`data-*`)

Ajouter ces attributs dans le markup ; `animations.js` fait le reste.

| Attribut | Effet |
|---|---|
| `data-reveal` | Apparition fade + montée au scroll (défaut) |
| `data-reveal="left" \| "right" \| "scale" \| "down"` | Variantes d'apparition |
| `data-reveal-delay="0.1"` | Délai (secondes) |
| `data-stagger` (sur un parent) | Ses enfants `data-reveal` apparaissent en cascade |
| `data-marquee` + `data-marquee-track` (enfant flex) | Défilement horizontal continu (dupliqué auto). Options : `data-marquee-speed="45"`, `data-marquee-reverse` |
| `data-timeline` + `data-timeline-fill` + `data-timeline-dot` | Ligne de progression pilotée au scroll (cf. Steps) |
| `data-countdown="YYYY-MM-DD"` + enfant `data-count-days` | Compte à rebours en jours (dispo mais non utilisé actuellement) |

Respect de `prefers-reduced-motion` intégré. Nouveaux composants animés : réutiliser ces hooks, ne pas réinventer.

---

## 6. Composants existants (réutilisables sur d'autres pages)

`Navbar`, `Hero`, `Mission`, `About`, `Steps`, `Facilities`, `Programs` (marquee), `ChooseUs`, `Testimonials`, `CampMap`, `Dates`, `Families`, `Instagram`, `Footer`.

Beaucoup sont réutilisables tels quels ou en variantes (ex. `Steps` pour un « comment s'inscrire », `Facilities`/`Programs` pour lister des espaces/activités, `ChooseUs` pour un bloc 2-colonnes texte+image, `Dates` pour un bloc infos, `Testimonials` pour un avis).

**Nav & liens** : la nav pointe déjà vers `/le-centre`, `/camps`, `/internat`, `/contact` + dropdown « Plus ». Le footer pointe vers `/locations`, `/enquiers-toi`, `/chainon`, `/soutiens`, `/calendrier`, `/mentions-legales`, `/confidentialite`. **Créer ces routes** (fichiers `src/pages/*.astro`).

---

## 7. Squelette d'une nouvelle page

```astro
---
import Layout from "../layouts/Layout.astro";
import Navbar from "../components/Navbar.astro";
import Footer from "../components/Footer.astro";
---
<Layout title="Nos camps — Tourne-Bride" description="…">
  <Navbar />
  <main>
    <!-- Bandeau de titre (sous la nav fixe : prévoir un pt suffisant, la nav fait 96px) -->
    <section class="bg-forest pt-[160px] pb-[80px]">
      <div class="container-site">
        <span class="tag…">Eyebrow</span>
        <h1 class="font-display text-white text-[56px] lg:text-[88px] …">Titre de page</h1>
      </div>
    </section>
    <!-- sections de contenu … -->
  </main>
  <Footer />
</Layout>
```
> La `Navbar` est `position: fixed` (h-24 / 96px) et transparente : sur les pages sans grande image en fond, commencer par un bandeau **sombre** (`bg-forest`) avec `pt-[160px]` pour que les liens blancs restent lisibles. (Amélioration possible plus tard : variante de nav à fond plein au scroll.)

---

## 8. Pages à créer (contenu source : http://tourne-bride.wifeo.com/)

Priorité suggérée : Camps → Le domaine → Contact → Internat → Locations → Soutiens → le reste.

| Route | Titre | Contenu clé (source wifeo) | Composants à réutiliser |
|---|---|---|---|
| `/camps` | Nos camps | Colonies/séjours bibliques résidentiels 7-11 ans ; prix 115€ (215€ fratrie), « le prix n'est jamais un obstacle » ; trousseau ; talon d'inscription ; thèmes (nature, écriture/impression, partages bibliques, veillées) | Hero léger + `Steps` (inscription) + `Programs`/`Facilities` (activités) + `Families` |
| `/le-centre` | Le domaine | 5 Ha, promontoire sur la Sambre, parc naturel Haute Sambre, 12 km de la France ; château + centre d'hébergement + maison canadienne (chalet « Sur le Roc ») ; bosquet, plaine de jeux, ravin (escalade), verger, boulodrome, basket, bergerie ; faune/flore, abeilles/miel depuis 2015 ; alentours (Lobbes, Thuin, Binche, Aulne, Eau d'Heure…) | `About` + `Facilities` + `CampMap` |
| `/internat` | Internat sportif Marie Durand | Internat pour primaire, année scolaire, cadre sportif | `ChooseUs` + `Facilities` |
| `/locations` | Locations | 3 bâtiments (château, centre d'hébergement, maison canadienne) ; agréés normes sécurité/hygiène FWB ; capacités/tarifs à confirmer | `Facilities` (cards par bâtiment) + `Contact` |
| `/enquiers-toi` | Enquiers-toi | Méditation mensuelle (« Enquiers-toi aujourd'hui de la Parole de Dieu »), textes courts d'Oncle Yvan (calendrier « Méditations Quotidiennes ») ; **change chaque mois** | Page éditoriale simple (texte centré) |
| `/chainon` | Le Chaînon | Éditorial/bulletin ; anciens numéros | Liste d'articles |
| `/soutiens` | Nous soutenir | Dons, IBAN BE52 0882 1037 5009, bénévolat, vestiaire « Adonaï Jireh » | Bloc don + `ChooseUs` |
| `/calendrier` | Calendrier | Agenda des camps/événements | Bloc `Dates` étendu / liste |
| `/contact` | Contact | Oncle Yvan & Tante Nadine ; tél 071 59 19 61 / 0496 18 14 14 ; email yvan.dussart@tourne-bride.be ; adresse ; formulaire ; « Venir ici » (accès/itinéraire) | Formulaire + carte/plan + coordonnées |
| `/venir-ici` | Venir ici | Itinéraire, transports, GR129, Ravel | Peut fusionner avec Contact |
| `/mentions-legales`, `/confidentialite` | Légal | À rédiger | Texte simple |

---

## 9. Assets & à faire

- **Photos** : la page d'accueil utilise encore les photos stock du template (nature/enfants — cohérentes mais génériques). **À remplacer par de vraies photos de Tourne-Bride** quand disponibles (`public/images/`).
- **Illustration carte** (`4jxNIUkG…png`) : carte de camp générique — à remplacer par un vrai plan du domaine si souhaité.
- **Témoignage** (Testimonials) : texte placeholder attribué à « Une maman » — **remplacer par un vrai témoignage** (avec accord).
- **Réseaux sociaux** (footer) : icônes en place mais liens `#` — brancher ou retirer selon les comptes réels.
- **Formulaire de contact** : à brancher (mailto simple, ou webhook n8n comme d'autres projets).
- **Nav fixe** : envisager une variante à fond plein au scroll pour les pages internes.
- **Dates réelles** des prochains camps : mettre à jour la section `Dates` / `/calendrier`.

---

_Dernière mise à jour : page d'accueil complète (design + contenu Tourne-Bride). Prochaine étape : créer les pages ci-dessus en réutilisant les composants._
