# Rapport de tests - Simulateur Batterie GPX Yamaha V1.2.1

## Résultat global
**PASS** pour les contrôles automatiques disponibles dans l'environnement.

## Tests moteur (`node tests/test-core.js`)
10/10 réussis :
1. arrondi half-even ;
2. distance Haversine ;
3. absence de distance fantôme entre deux `<trkseg>` ;
4. passage en Turbo au seuil et formule Yamaha ;
5. mode Tour et correction par vitesse ;
6. recharge placée exactement au cumul 200 Wh ;
7. interpolation du km de recharge dans un tronçon ;
8. recharge à l'arrivée si la consommation totale est inférieure à 200 Wh ;
9. bandes batterie validées : >20 % vert, 20 % à 10 % inclus jaune, <10 % rouge ;
10. rejet d'une consommation négative.

## Parité avec la version reçue (`node tests/test-parity-v1.js`)
100 parcours synthétiques ont été calculés par :
- une reproduction du moteur reçu V1.1.4 ;
- le nouveau `simulator-core.js` V1.2.1.

Comparaison effectuée sur :
- nombre de tronçons ;
- distance brute et distance arrondie ;
- D+ ;
- mode Tour/Turbo ;
- consommation de chaque tronçon ;
- consommation totale ;
- activation de la recharge ;
- km de recharge ;
- énergie ajoutée ;
- batterie avant recharge ;
- batterie finale.

**Résultat : 100/100 en parité calculatoire.**

Exceptions volontaires :
- le libellé `Tours` devient `Tour` ;
- le correctif multi-`trkseg` change volontairement le résultat d'un GPX qui contenait auparavant une liaison artificielle entre segments.

## Contrôles statiques
- `node --check simulator-core.js` : PASS ;
- `node --check app.js` : PASS ;
- `node --check sw.js` : PASS ;
- JSON du manifeste : PASS ;
- IDs HTML uniques : PASS ;
- tous les IDs appelés par `app.js` existent dans le HTML : PASS ;
- toutes les icônes du manifeste existent : PASS ;
- tous les assets préchargés par le service worker existent : PASS.

## Test navigateur
Tentative automatisée avec Chromium : non exécutable dans cet environnement, car la politique du navigateur bloque `localhost` et `file://` (« Your organization doesn't allow you to view this site »).

### Test manuel recommandé sur PC
1. Décompresser le ZIP.
2. Double-cliquer sur `index.html`.
3. Charger un GPX Yamaha de référence.
4. Vérifier qu'apparaissent les deux scénarios.
5. Vérifier le graphique sans recharge depuis km 0.
6. Vérifier le graphique avec saut à 100 % au km calculé.
7. Modifier `Recharge = 0 Wh` et vérifier que le scénario 2 se désactive.
8. Réinitialiser sur « Valeurs Yamaha / Excel V1 ».
9. Exporter le CSV et vérifier les colonnes Tour/Turbo et les deux soldes batterie.

## Critère de validation conseillé avant publication
Utiliser au moins un GPX Yamaha déjà calculé avec la version historique et comparer : distance, D+, modes, consommation totale, batterie finale et km du plein. La tolérance attendue est **0** sur le moteur, hors correction multi-`trkseg` documentée.
