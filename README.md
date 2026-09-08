# Calories V1.7

PWA mobile/tablette de suivi des calories, protéines, activité et poids avec analyse photo assistée par IA.

## Nouveauté V1.7 — base alimentaire personnelle

La V1.7 permet d'ajouter directement des références alimentaires à partir des valeurs inscrites sur les emballages.

Dans **Réglages → Base alimentaire locale**, l'utilisateur peut enregistrer :

- nom du produit / aliment ;
- kcal pour 100 g ;
- protéines pour 100 g ;
- poids total du paquet (facultatif) ;
- nombre d'unités / portions (facultatif) ;
- nom de l'unité : rond, tranche, pot, etc. (facultatif).

Si poids total + nombre d'unités sont renseignés, l'application affiche automatiquement le poids approximatif d'une unité.

### Ordre de priorité nutritionnel

Lorsqu'un nom d'aliment est corrigé après une analyse photo :

1. **Base personnelle de l'utilisateur** ;
2. **Base générale intégrée** ;
3. **Luna**, seulement si aucune référence locale ne correspond.

La base personnelle apparaît également en premier dans le menu d'ajout manuel. Cela permet de limiter les appels API et d'utiliser les valeurs exactes de l'étiquette pour les produits habituels.

Les références personnelles peuvent être modifiées ou supprimées. La suppression d'une référence ne modifie jamais les repas déjà enregistrés.

## Compatibilité

La même clé de stockage local (`caloriesV1State`) est conservée. Les données V1.6 existantes sont donc préservées lors de la mise à jour.

## Déploiement

L'API serveur n'est pas modifiée par rapport à la V1.5/V1.6. Pour la mise à jour GitHub, remplacer seulement :

- `index.html`
- `app.js`
- `styles.css`
- `service-worker.js`

Le dossier `api`, la clé OpenAI et les réglages Vercel restent inchangés.

## Remise à zéro avant un test réel

La rubrique **Réglages → Données** distingue désormais :

- **Effacer les saisies de test** : supprime repas, activités et pesées, mais conserve le profil, les réglages et la base alimentaire personnelle ;
- **Réinitialiser complètement l'application** : efface aussi la base personnelle et le profil.

Pour repartir avec un journal vide tout en gardant les références d'étiquettes déjà saisies, utiliser **Effacer les saisies de test**.

Lors de la correction du nom d'un aliment après analyse photo, les noms de la base personnelle et de la base générale sont proposés comme suggestions. Choisir une référence personnelle existante évite un appel de recalcul texte à Luna.
