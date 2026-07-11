// ─────────────────────────────────────────────────────────────────────────────
//  AGENDA TOURNE-BRIDE — source unique des camps & événements
//
//  👉 C'EST ICI qu'on ajoute / modifie / supprime les camps et événements.
//     Ces données alimentent À LA FOIS la page « Nos camps » ET le « Calendrier ».
//
//  Format d'une entrée :
//    {
//      id:          identifiant unique (texte libre, sans espace)
//      title:       nom affiché
//      type:        "Camp"  ou  "Événement"
//      start:       "AAAA-MM-JJ"  (date de début)
//      end:         "AAAA-MM-JJ"  (date de fin ; = start si un seul jour)
//      ageMin/ageMax: tranche d'âge (camps)
//      price:       prix / enfant (nombre, €)          — optionnel
//      priceFratrie: prix pour 2 enfants (même fratrie) — optionnel
//      places:      nombre de places                    — optionnel
//      place:       lieu
//      description: petit texte
//    }
//
//  ⚠️ Les entrées ci-dessous sont des EXEMPLES — remplace-les par les vrais camps.
//     Les camps déjà passés disparaissent automatiquement de « Nos camps ».
// ─────────────────────────────────────────────────────────────────────────────

export const agenda = [
  {
    id: "toussaint-2026",
    title: "Camp de Toussaint",
    type: "Camp",
    start: "2026-11-02",
    end: "2026-11-07",
    ageMin: 7,
    ageMax: 11,
    price: 115,
    priceFratrie: 215,
    places: 14,
    place: "Château Grignard",
    description:
      "Un séjour résidentiel plein de jeux, de nature et de partages, pendant le congé d'automne.",
  },
  {
    id: "detente-2027",
    title: "Camp de détente",
    type: "Camp",
    start: "2027-02-15",
    end: "2027-02-20",
    ageMin: 7,
    ageMax: 11,
    price: 115,
    priceFratrie: 215,
    places: 14,
    place: "Château Grignard",
    description:
      "Grands jeux d'intérieur, ateliers créatifs et veillées pendant le congé de Carnaval.",
  },
  {
    id: "resto-2027",
    title: "Restaurant de soutien",
    type: "Événement",
    start: "2027-06-05",
    end: "2027-06-05",
    place: "Tourne-Bride",
    description:
      "Une journée conviviale, pour soutenir l'œuvre autour d'un bon repas. Réservation conseillée.",
  },
  {
    id: "ete-2027",
    title: "Camp d'été",
    type: "Camp",
    start: "2027-07-06",
    end: "2027-07-11",
    ageMin: 7,
    ageMax: 11,
    price: 115,
    priceFratrie: 215,
    places: 14,
    place: "Château Grignard",
    description:
      "Le grand rendez-vous de l'année, en plein cœur de la Haute Sambre.",
  },
];

// ── Helpers de dates (utilisés par les pages, pas besoin d'y toucher) ──────────
const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export const toDate = (s) => new Date(s + "T00:00:00");

/** "2 – 7 novembre 2026" / "5 juin 2027" / "30 avril – 3 mai 2027" */
export function formatRange(e) {
  const s = toDate(e.start);
  const en = toDate(e.end || e.start);
  const y = en.getFullYear();
  if (e.start === (e.end || e.start)) {
    return `${s.getDate()} ${MOIS[s.getMonth()]} ${y}`;
  }
  if (s.getMonth() === en.getMonth()) {
    return `${s.getDate()} – ${en.getDate()} ${MOIS[en.getMonth()]} ${y}`;
  }
  return `${s.getDate()} ${MOIS[s.getMonth()]} – ${en.getDate()} ${MOIS[en.getMonth()]} ${y}`;
}

export const moisNom = (m) => MOIS[m];
