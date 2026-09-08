# Calories V1

PWA mobile/tablette de suivi des calories, protéines et du poids.

## Fonctionnalités V1

- Profil initial : 73 ans, 74 kg, objectif 72,5 kg.
- Calcul du besoin calorique par Mifflin-St Jeor + facteur d'activité.
- Déficit par défaut : 225 kcal/jour, modifiable.
- Objectif protéines configurable en g/kg/jour (1,0 par défaut).
- Photo depuis l'appareil photo ou la galerie.
- Analyse photo IA : aliments, portions estimées, kcal, protéines.
- Ajout manuel rapide.
- Cumul journalier calories + protéines.
- Comparaison à l'objectif et au besoin de maintien.
- Historique des repas.
- Suivi du poids avec courbe simple.
- Données enregistrées localement sur l'appareil.
- Installation PWA sur Android/Samsung.

## Important : GitHub Pages ou Vercel ?

GitHub Pages peut héberger l'interface mais ne peut pas conserver une clé API secrète. L'analyse automatique des photos nécessite donc un petit backend.

La solution la plus simple pour obtenir la V1 complète est de déployer ce même dépôt sur **Vercel** et d'y ajouter la variable d'environnement `OPENAI_API_KEY`.

L'interface et l'API `/api/analyze` fonctionneront alors sur la même adresse.

Si vous souhaitez garder l'interface sur GitHub Pages, vous pouvez déployer uniquement le backend sur Vercel puis renseigner son adresse complète dans **Réglages > Adresse API d'analyse**.

## Test sans IA

Même sans backend, l'application est utilisable : profil, objectifs, saisie manuelle, calories, protéines, historique et poids fonctionnent immédiatement.

## Données et photos

Les données de suivi sont stockées dans `localStorage` sur l'appareil. La photo sert à l'analyse mais n'est pas conservée dans l'historique V1, afin d'éviter de saturer le stockage du navigateur.

## Note

Les calories et protéines déduites d'une photo restent des estimations. Les huiles, sauces, ingrédients cachés et portions sont particulièrement difficiles à évaluer visuellement.
