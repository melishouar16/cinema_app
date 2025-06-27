import json
import google.generativeai as genai # type: ignore
from django.conf import settings
import logging
from typing import Dict, Any
import random

logger = logging.getLogger(__name__)

class InvestigationAIService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')







    def build_prompt(self, film_title: str, film_description: str, author_name: str) -> str:
        return f"""
    Tu es un créateur d'enquêtes policières expertes. Crée une enquête ORIGINALE et IMPRÉVISIBLE inspirée du film "{film_title}" de {author_name}.

    Description du film: {film_description}

    RÈGLES POUR UN SCÉNARIO IMPRÉVISIBLE:
    1. Le coupable ne doit PAS être le suspect le plus évident
    2. Chaque indice doit avoir un RÔLE PRÉCIS dans la résolution
    3. Plusieurs fausses pistes doivent mener à d'autres suspects
    4. La solution doit être surprenante mais LOGIQUE
    5. Les alibis doivent créer de vrais doutes
    6. Le mobile du vrai coupable doit être inattendu mais cohérent

    TECHNIQUES DE SURPRISE:
    - Le suspect le moins probable au début
    - Mobile caché derrière une façade respectable
    - Indices qui semblent accuser quelqu'un d'autre
    - Faux témoignages qui protègent le vrai coupable
    - Double identité ou mensonge sur le passé
    - Alliance secrète entre suspects
    - Mobile qui remonte à bien avant le crime

    RÈGLES SPÉCIALES POUR ÉQUILIBRER LES SOUPÇONS:
    - Répartir les soupçons sur TOUS les 6 suspects de façon équilibrée
    - Éviter que seuls 2-3 suspects soient suspectés
    - Chaque suspect doit avoir au moins 1-2 indices qui le rendent suspect
    - Brouiller vraiment les pistes pour que chaque suspect soit crédible
    - Le vrai coupable ne doit pas être plus suspecté que les autres au début
    - Créer une progression où les soupçons se déplacent entre TOUS les suspects

    RÈGLES IMPORTANTES POUR LES ALIBIS:
    - Chaque alibi doit être CONCRET et VÉRIFIABLE
    - Indiquer le lieu EXACT, les horaires PRÉCIS, et les témoins éventuels
    - Varier entre alibis solides et alibis fragiles pour créer le doute
    - Exemples d'alibis concrets : "Au restaurant La Bonne Table de 19h30 à 22h15 avec sa femme", "Travaillait au bureau jusqu'à 21h45, badge d'accès confirme", "Seul chez lui sans témoin de 20h à 23h"

    STRUCTURE OBLIGATOIRE - JSON uniquement:

    {{
        "titre": "Mystère (donner un titre original) - Inspiré de {film_title}",
        "contexte": "Contexte en 2-3 phrases dans l'univers du film",
        "crime": "Crime principal à élucider (créatif et original)",
        "suspects": [
            {{
                "nom": "Suspect Principal Évident",
                "description": "Celui que tout accuse au début",
                "mobile": "Mobile apparent et crédible",
                "alibi": "Prétend être rentré directement chez lui à 20h30, mais aucun voisin ne peut le confirmer",
                "role_reel": "Victime indirecte ou témoin innocent"
            }},
            {{
                "nom": "Témoin Respecté",
                "description": "Personne de confiance, crédible",
                "mobile": "Aucun mobile apparent",
                "alibi": "Participait à une réunion du conseil municipal de 19h à 22h, confirmé par 5 témoins",
                "role_reel": "Possible complice ou manipulateur"
            }},
            {{
                "nom": "Outsider Mystérieux",
                "description": "Étranger aux motivations floues",
                "mobile": "Passé trouble, comportement suspect",
                "alibi": "Affirme être resté dans sa chambre d'hôtel toute la soirée, mais réception fermée après 20h",
                "role_reel": "Fausse piste ou coupable surprise"
            }},
            {{
                "nom": "Proche Émotionnel",
                "description": "Lien personnel avec la victime",
                "mobile": "Relation compliquée, tensions connues",
                "alibi": "Dînait au restaurant Le Jardin Secret avec des amis de 19h30 à 22h30",
                "role_reel": "Motivation forte mais pas forcément coupable"
            }},
            {{
                "nom": "Professionnel Discret",
                "description": "Expert/autorité dans son domaine",
                "mobile": "Intérêts professionnels cachés",
                "alibi": "Travaillait tard au bureau, son badge d'accès confirme sa présence jusqu'à 21h45",
                "role_reel": "Mobile technique ou financier secret"
            }},
            {{
                "nom": "Personnage Inattendu",
                "description": "Celui qu'on n'soupçonne jamais",
                "mobile": "Mobile révélé seulement à la fin",
                "alibi": "Au cinéma Rex de 20h à 22h30 pour voir le film Avatar, ticket retrouvé dans sa poche",
                "role_reel": "Vrai coupable ou cerveau de l'affaire"
            }}
        ],
        "indices": [
            {{
                "numero": 1,
                "titre": "Premier indice équilibré",
                "description": "Indice détaillé qui peut faire soupçonner le Suspect Principal ET le Témoin Respecté selon l'angle d'analyse. Les preuves physiques pointent vers l'un, mais les circonstances de découverte impliquent l'autre.",
                "lieu": "Lieu principal",
                "difficulte": "facile",
                "piege": "Semble clairement accuser le Suspect Principal, mais implique aussi le Témoin Respecté"
            }},
            {{
                "numero": 2,
                "titre": "Témoignage contradictoire révélateur",
                "description": "Version qui implique l'Outsider Mystérieux directement, mais révèle aussi que le Proche Émotionnel a menti sur sa présence. Le témoignage semble protéger le Professionnel Discret.",
                "lieu": "Lieu secondaire",
                "difficulte": "facile",
                "piege": "Accuse l'Outsider mais révèle les mensonges du Proche Émotionnel et protège le Professionnel"
            }},
            {{
                "numero": 3,
                "titre": "Objet personnel compromettant",
                "description": "Quelque chose appartenant au Personnage Inattendu est trouvé sur la scène, mais les empreintes du Suspect Principal sont dessus. Le Témoin Respecté affirme avoir vu le Professionnel Discret manipuler cet objet.",
                "lieu": "Scène de crime",
                "difficulte": "moyen",
                "piege": "L'objet appartient à l'un, les empreintes à un autre, et un troisième l'a manipulé"
            }},
            {{
                "numero": 4,
                "titre": "Document falsifié troublant",
                "description": "Papier modifié qui innocente complètement l'Outsider Mystérieux, mais qui a pu être créé par le Professionnel Discret, le Témoin Respecté, OU le Personnage Inattendu selon leurs compétences respectives.",
                "lieu": "Archives/dossiers",
                "difficulte": "moyen",
                "piege": "Innocente l'un mais trois autres auraient pu créer cette fausse preuve"
            }},
            {{
                "numero": 5,
                "titre": "Timing impossible pour plusieurs",
                "description": "Chronologie qui rend l'alibi du Proche Émotionnel impossible, mais révèle aussi que le Suspect Principal et l'Outsider Mystérieux ont menti sur leurs horaires. Le Personnage Inattendu semble le seul avec un timing cohérent.",
                "lieu": "Différents endroits",
                "difficulte": "moyen",
                "piege": "Trois suspects ont des problèmes de timing, un seul semble innocent temporellement"
            }},
            {{
                "numero": 6,
                "titre": "Mobile caché collectif",
                "description": "Événement du passé qui donne un mobile au Proche Émotionnel ET au Professionnel Discret ET au Témoin Respecté. Tous trois ont souffert du même événement impliquant la victime, mais de façons différentes.",
                "lieu": "Archives/mémoires",
                "difficulte": "difficile",
                "piege": "Trois suspects différents ont le même mobile pour des raisons différentes"
            }},
            {{
                "numero": 7,
                "titre": "Réseau de manipulation complexe",
                "description": "Quelqu'un a manipulé le Suspect Principal pour qu'il paraisse coupable. Cette manipulation a pu être orchestrée par le Témoin Respecté, le Professionnel Discret, OU le Personnage Inattendu selon leurs capacités.",
                "lieu": "Lieu de rencontre",
                "difficulte": "difficile",
                "piege": "Un innocent est manipulé, mais trois suspects différents auraient pu être les manipulateurs"
            }},
            {{
                "numero": 8,
                "titre": "Preuve technique à multiple interprétation",
                "description": "Analyse scientifique qui révèle des compétences spécialisées. Le Professionnel Discret a ces compétences ouvertement, mais l'enquête révèle que le Témoin Respecté ET le Personnage Inattendu les possèdent aussi secrètement.",
                "lieu": "Laboratoire/analyse",
                "difficulte": "difficile",
                "piege": "Un suspect a les compétences évidentes, deux autres les cachent"
            }},
            {{
                "numero": 9,
                "titre": "Identités multiples révélées",
                "description": "L'Outsider Mystérieux cache sa vraie identité, mais l'enquête révèle que le Personnage Inattendu ET le Témoin Respecté ont aussi menti sur leurs passés. Seul un de ces mensonges est lié au crime.",
                "lieu": "Dossiers personnels",
                "difficulte": "très difficile",
                "piege": "Trois suspects mentent sur leurs identités, mais un seul mensonge est criminel"
            }},
            {{
                "numero": 10,
                "titre": "Erreur révélatrice finale",
                "description": "Moment où le vrai coupable se trahit, mais cette erreur pourrait techniquement concerner le Témoin Respecté, le Professionnel Discret, OU le Personnage Inattendu selon le contexte. Seule la combinaison avec tous les indices précédents révèle qui c'est vraiment.",
                "lieu": "Confrontation finale",
                "difficulte": "très difficile",
                "piege": "L'erreur finale pourrait concerner trois suspects, seule l'analyse complète révèle le vrai coupable"
            }}
        ],
        "etapes": [
            {{
                "numero": 1,
                "titre": "Découverte trompeuse",
                "description": "Les premiers indices accusent le mauvais suspect",
                "question": "Qui semble le plus coupable ?",
                "choix": ["Le suspect évident", "Chercher plus loin", "Vérifier les alibis"]
            }},
            {{
                "numero": 2,
                "titre": "Fausses pistes",
                "description": "Plusieurs suspects semblent coupables",
                "question": "Quelle piste approfondir ?",
                "choix": ["Mobile évident", "Incohérences temporelles", "Relations cachées"]
            }},
            {{
                "numero": 3,
                "titre": "Révélation du passé",
                "description": "Un événement ancien éclaire tout",
                "question": "Quel secret du passé est crucial ?",
                "choix": ["Relation oubliée", "Crime ancien", "Identité cachée"]
            }},
            {{
                "numero": 4,
                "titre": "Piège tendu",
                "description": "Confrontation pour forcer la vérité",
                "question": "Comment démasquer le vrai coupable ?",
                "choix": ["Révéler la preuve cachée", "Forcer un aveu", "Démontrer l'impossible"]
            }},
            {{
                "numero": 5,
                "titre": "Retournement final",
                "description": "La vérité surprenante éclate",
                "question": "Qui est vraiment le coupable ?",
                "choix": ["Le témoin respecté", "Le professionnel discret", "Le personnage inattendu", "Alliance entre deux suspects"]
            }}
        ],
        "solution": {{
            "coupable": "[Nom du vrai coupable - PAS le suspect évident]",
            "explication": "Mobile inattendu mais logique, comment il a manipulé les preuves et les témoins",
            "indices_cles": ["Les 3-4 indices qui révèlent vraiment la vérité"],
            "surprise": "L'élément qui rend la solution imprévisible mais cohérente",
            "fausses_pistes": "Comment les autres suspects ont été utilisés comme écrans de fumée et pourquoi CHAQUE suspect semblait coupable à un moment donné"
        }}
    }}

    IMPORTANT:
    - Les alibis doivent être CONCRETS : lieu précis, horaires exacts, témoins identifiés
    - Varier les types d'alibis : certains vérifiables, d'autres invérifiables
    - Chaque indice doit impliquer 3-4 suspects différents pour vraiment brouiller les pistes
    - TOUS les 6 suspects doivent être suspectés à différents moments
    - Le coupable doit être surprenant mais sa culpabilité doit être PROUVÉE par les indices
    - Éviter que seuls 2-3 suspects concentrent tous les soupçons
    - Créer une vraie confusion où chaque suspect a des raisons d'être soupçonné
    """









    def _create_smart_fallback(self, film_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Crée un scénario de fallback intelligent avec rotation du coupable
        """
        # Liste de patterns de coupables imprévisibles
        patterns = [
            {
                "coupable": "Expert Respecté",
                "mobile": "Dissimule son incompétence derrière un crime",
                "surprise": "Sa réputation cachait son manque de compétence réel"
            },
            {
                "coupable": "Témoin Principal",
                "mobile": "Était en fait complice depuis le début",
                "surprise": "Celui qui a 'découvert' le crime l'avait planifié"
            },
            {
                "coupable": "Allié Inattendu",
                "mobile": "Vengeance pour un tort ancien ignoré de tous",
                "surprise": "Mobile personnel que personne ne soupçonnait"
            },
            {
                "coupable": "Autorité Morale",
                "mobile": "Protégeait un secret plus grave que le crime",
                "surprise": "Le crime était un sacrifice pour éviter pire"
            },
            {
                "coupable": "Victime Indirecte",
                "mobile": "Mise en scène pour accuser quelqu'un d'autre",
                "surprise": "S'est blessé volontairement pour détourner les soupçons"
            }
        ]

        # Sélection aléatoire du pattern
        pattern = random.choice(patterns)

        return {
            "titre": f"Mystère inspiré de {film_info['titre']}",
            "contexte": f"Dans l'univers de {film_info['titre']}, un crime étrange remet tout en question",
            "crime": "Un délit qui cache en réalité un mobile plus profond",
            "suspects": [
                {"nom": "Suspect Principal", "description": "Celui que tous accusent", "mobile": "Mobile évident", "alibi": "Alibi fragile"},
                {"nom": "Expert Respecté", "description": "Autorité dans son domaine", "mobile": "Aucun mobile apparent", "alibi": "Présent mais discret"},
                {"nom": "Témoin Principal", "description": "Premier sur les lieux", "mobile": "Aucune raison apparente", "alibi": "Sa découverte du crime"},
                {"nom": "Allié Inattendu", "description": "Aide l'enquête activement", "mobile": "Motivations cachées", "alibi": "Collabore pleinement"},
                {"nom": "Autorité Morale", "description": "Personne de confiance absolue", "mobile": "Impossible à imaginer", "alibi": "Réputation irréprochable"},
                {"nom": "Victime Indirecte", "description": "Souffre aussi du crime", "mobile": "Semble être victime", "alibi": "Statut de victime"}
            ],
            "indices": [
                {"numero": 1, "titre": "Évidence Trompeuse", "description": "Preuve qui accuse le mauvais suspect", "lieu": "Scène principale", "difficulte": "facile"},
                {"numero": 2, "titre": "Témoignage Cohérent", "description": "Histoire qui semble parfaite", "lieu": "Interrogatoire", "difficulte": "facile"},
                {"numero": 3, "titre": "Alibi Vérifiable", "description": "Confirmation par plusieurs sources", "lieu": "Vérifications", "difficulte": "moyen"},
                {"numero": 4, "titre": "Incohérence Temporelle", "description": "Quelque chose ne colle pas dans le timing", "lieu": "Reconstitution", "difficulte": "moyen"},
                {"numero": 5, "titre": "Motivation Cachée", "description": "Secret du passé révélé", "lieu": "Archives personnelles", "difficulte": "moyen"},
                {"numero": 6, "titre": "Preuve Technique", "description": "Analyse scientifique révélatrice", "lieu": "Laboratoire", "difficulte": "difficile"},
                {"numero": 7, "titre": "Lien Imprévu", "description": "Connexion secrète entre suspects", "lieu": "Enquête approfondie", "difficulte": "difficile"},
                {"numero": 8, "titre": "Manipulation Révélée", "description": "Quelqu'un tire les ficelles", "lieu": "Analyse des comportements", "difficulte": "difficile"},
                {"numero": 9, "titre": "Faille dans le Plan", "description": "Erreur du vrai coupable", "lieu": "Reconstruction finale", "difficulte": "très difficile"},
                {"numero": 10, "titre": "Aveu Involontaire", "description": "Le coupable se trahit", "lieu": "Confrontation", "difficulte": "très difficile"}
            ],
            "etapes": [
                {"numero": 1, "titre": "Accusation Évidente", "description": "Tout pointe vers le suspect principal", "question": "Faut-il l'arrêter ?", "choix": ["L'arrêter", "Chercher plus", "Vérifier"]},
                {"numero": 2, "titre": "Doutes Grandissants", "description": "Les preuves ne sont pas si claires", "question": "Que faire des incohérences ?", "choix": ["Les ignorer", "Approfondir", "Confronter"]},
                {"numero": 3, "titre": "Nouvelle Piste", "description": "Un élément change la donne", "question": "Quelle direction prendre ?", "choix": ["Piste nouvelle", "Rester sur l'ancienne", "Combiner les deux"]},
                {"numero": 4, "titre": "Révélation Surprenante", "description": "La vérité commence à émerger", "question": "Comment réagir ?", "choix": ["Agir immédiatement", "Rassembler plus de preuves", "Tendre un piège"]},
                {"numero": 5, "titre": "Dénouement Inattendu", "description": "Le vrai coupable se révèle", "question": "Qui est le vrai coupable ?", "choix": [pattern["coupable"], "Suspect Principal", "Complice multiple", "Autre"]}
            ],
            "solution": {
                "coupable": pattern["coupable"],
                "explication": f"Le mobile réel était : {pattern['mobile']}. Les preuves étaient manipulées pour créer une fausse piste.",
                "indices_cles": ["Incohérence Temporelle", "Motivation Cachée", "Faille dans le Plan"],
                "surprise": pattern["surprise"],
                "fausses_pistes": "Le suspect principal était une diversion parfaite"
            }
        }

    def _generate_fallback_scenario(self, film_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Génère un scénario de fallback en cas d'échec de l'IA avec logique imprévisible
        """
        # Essai d'un prompt plus intelligent
        smart_prompt = f"""
Crée une enquête IMPRÉVISIBLE inspirée de {film_info['titre']}.

RÈGLE ABSOLUE: Le coupable ne peut PAS être "Personne Proche" ou le suspect évident.

Choisis parmi ces coupables surprenants:
- Le témoin qui a découvert le crime (il l'avait planifié)
- L'expert respecté (cache son incompétence)
- L'aide précieux (manipule l'enquête)
- La victime secondaire (mise en scène)
- L'autorité morale (protège un secret pire)

Réponds en JSON avec coupable surprenant mais logique.
"""

        try:
            response = self.model.generate_content(smart_prompt)
            scenario_json = self.extract_json_from_reponse(response.text)

            if self.is_valid_scenario(scenario_json):
                return scenario_json
            else:
                # Fallback intelligent
                return self._create_smart_fallback(film_info)

        except Exception as e:
            logger.error(f"Erreur fallback IA: {str(e)}")
            return self._create_smart_fallback(film_info)

    # Garder toutes vos autres méthodes existantes...
    def complete_film_info(self, film_title: str, author_name: str = None) -> Dict[str, Any]:
        """L'IA génère automatiquement la description du film"""
        prompt = f'''Pour le film "{film_title}"{f" de {author_name}" if author_name else ""}, trouve le VRAI réalisateur et réponds en JSON:

        {{"titre": "{film_title}", "auteur": "prénom nom complet du réalisateur", "description": "description détaillée du film", "found": true}}

        ou {{"found": false}} si inexistant.'''

        try:
            response = self.model.generate_content(prompt)
            result = self.extract_json_from_reponse(response.text)
            if result.get('found', False):
                result['titre'] = film_title
            return result
        except Exception as e:
            logger.error(f"Erreur complete_film_info: {e}")
            return {"found": False}

    def is_detective_film(self, film_title: str, film_description: str, author_name: str) -> bool:
        validation_prompt = f"""
Analyse du film "{film_title}" de {author_name}.
Description: {film_description}
Question: est ce que ce film est adapté pour créer une enquete policiere ?
Répondez UNIQUEMENT par "OUI" ou "NON".
"""
        try:
            response = self.model.generate_content(validation_prompt)
            result = response.text.strip().upper()
            suitable = any(word in result for word in ["OUI", "YES", "ADAPTÉ", "SUITABLE"])
            return suitable
        except Exception as e:
            logger.error(f"Erreur de validation du film: {str(e)}")
            return True

    def extract_json_from_reponse(self, response_text: str) -> Dict[str, Any]:
        """Extraction JSON - Nettoie la réponse de l'IA"""
        try:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start == -1 or end == 0:
                raise ValueError("Pas de JSON trouvé dans response")
            json_str = response_text[start:end]
            return json.loads(json_str)
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Erreur parsing JSON: {str(e)}")
            raise

    def is_valid_scenario(self, scenario: Dict[str, Any]) -> bool:
        """Validation du scénario"""
        required_fields = ['titre', 'contexte', 'crime', 'suspects', 'indices', 'etapes', 'solution']

        for field in required_fields:
            if field not in scenario:
                logger.error(f"champs manquant: {field}")
                return False

        if not isinstance(scenario['indices'], list) or len(scenario['indices']) < 10:
            logger.error("Il faut au moins 10 indices")
            return False

        return True

    def generate_investigation_scenario(self, film_title: str, author_name: str = None) -> Dict[str, Any]:
        """Orchestre tout le processus de création d'enquete"""

        # Auto complétion des infos film
        film_info = self.complete_film_info(film_title, author_name)
        if not film_info.get('found'):
            return {"error": True, "message": f"Film '{film_title}' introuvable"}

        # validation du film
        if not self.is_detective_film(film_info['titre'], film_info['description'], film_info['auteur']):
            return {
                "error": True,
                "message": f"Désolé, le film {film_title} ne semble pas adapté pour créer une enquête.",
                "suggestions": [
                    "Films policiers (Seven, Zodiac, L.A. Confidential)",
                    "Thrillers psychologiques (Shutter Island, Gone Girl)",
                    "Films de mystère (Knives Out, Murder on the Orient Express)",
                    "Drames criminels (The Departed, Heat, Goodfellas)"
                ]
            }

        # construction du prompt et generation de l'enquete
        prompt = self.build_prompt(film_info['titre'], film_info['description'], film_info['auteur'])

        try:
            response = self.model.generate_content(prompt)
            scenario_json = self.extract_json_from_reponse(response.text)

            if self.is_valid_scenario(scenario_json):
                logger.info(f"Scénario généré avec succès pour {film_title}")
                return scenario_json
            else:
                logger.warning("Scénario invalide - tentative de fallback")
                return self._generate_fallback_scenario(film_info)

        except Exception as e:
            logger.error(f"Erreur génération IA: {str(e)}")
            return self._generate_fallback_scenario(film_info)
