# movies/services/ai_service.py
import json
import google.generativeai as genai  # type: ignore
from django.conf import settings
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class InvestigationAIService:
    def __init__(self):
       genai.configure(api_key=settings.GEMINI_API_KEY)
       self.model = genai.GenerativeModel('gemini-1.5-flash')
    def complete_film_info(self, film_title: str, author_name: str = None) -> Dict[str, Any]:
        """
        L'IA génère automatiquement la description du film
        """
        prompt = f'''Pour le film "{film_title}"{f" de {author_name}" if author_name else ""}, trouve le VRAI réalisateur et réponds en JSON:

        {{"titre": "titre exact du film", "auteur": "prénom nom complet du réalisateur", "description": "description du film", "found": true}}

        ou {{"found": false}} si inexistant.

        IMPORTANT: Pour "auteur", donne le NOM COMPLET du réalisateur (ex: "James Cameron", "Christopher Nolan"), jamais "Réalisateur de...".'''

        try:
            response = self.model.generate_content(prompt)
            return self.extract_json_from_reponse(response.text)
        except:
            return {"found": False}



# def complete_film_info(self, film_title: str, author_name: str = None) -> Dict[str, Any]:
#     """
#     L'IA génère automatiquement la description du film
#     """
#     prompt = f'''Pour le film "{film_title}"{f" de {author_name}" if author_name else ""}, trouve le VRAI réalisateur et réponds en JSON:

#     {{"titre": "titre exact du film", "auteur": "prénom nom complet du réalisateur", "description": "description du film", "found": true}}

#     ou {{"found": false}} si inexistant.

#     IMPORTANT: Pour "auteur", donne le NOM COMPLET du réalisateur (ex: "James Cameron", "Christopher Nolan"), jamais "Réalisateur de...".'''

#     try:
#         response = self.model.generate_content(prompt)
#         print(f"🔍 Réponse brute: {response.text}")
#         return self.extract_json_from_reponse(response.text)
#     except Exception as e:
#         print(f"❌ Erreur complete_film_info: {e}")
#         return {"found": False}



    def is_detective_film(self, film_title:str, film_description: str, author_name: str) -> bool:
        validation_prompt = f"""

Analyse du film " {film_title} " de {author_name}.vars

Description: {film_description}

Qeustion: est ce que ce film est adapté pour créer une enquete policiere ?

Un film est ADAPTÉ s'il contient des élements comme:
- Crime, meurtre, vol, disparition, drame
- Mystère, suspense, thriller
- Enquête, détective, police
- Intrigue criminelle ou judiciaire

Un film n'est PAS ADAPTÉ s'il s'agit principalement de :
- Comédie pure, comédie romantique
- Film pour enfants sans mystère
- Documentaire informatif
- Film musical sans intrigue criminelle
- Romance pure sans éléments de suspense
- Science-fiction/fantasy sans crime central

Répondez UNIQUEMENT par "OUI" ou "NON".
       """

        try:
            response = self.model.generate_content(validation_prompt)
            result = response.text.strip().upper()
            suitable = any(word in result for word in ["OUI", "YES", "ADAPTÉ", "SUITABLE"])
            return suitable

        except Exception as e:
            logger.error (f"Erreur de validation du film: {str(e)}")
            return True


    def build_prompt(self, film_title: str, film_description: str, author_name: str) -> str:
        return f"""
    Tu es un créateur d'enquêtes policières interactives. Tu dois créer une NOUVELLE ENQUÊTE qui s'inspire de l'univers du film "{film_title}" de {author_name}, mais SANS reprendre l'intrigue originale.

    RÈGLES STRICTES :
    1. NE PAS adapter l'histoire du film - créer un NOUVEAU crime
    2. Utiliser l'univers, l'époque, le lieu du film mais changer complètement l'intrigue
    3. Mélanger 1-2 personnages du film avec 3-4 nouveaux suspects inventés
    4. Le vrai coupable NE DOIT PAS être évident - créer de fausses pistes
    5. Ajouter des plot twists et retournements de situation


    RÈGLE ANTI-SPOILER:
    - Le "contexte" ne doit JAMAIS révéler l'identité du coupable
    - Le "crime" ne doit PAS nommer le responsable
    - Présente la situation comme un mystère à résoudre
    - Le joueur doit découvrir qui est le coupable via l'enquête


    CONTEXTE DU FILM : {film_description}

    NE JAMAIS SPOILER LE COUPABLE DANS LA DESCIRPTION ETC

    STRUCTURE OBLIGATOIRE :
    {{
        "titre": "Titre accrocheur de l'enquête (pas le titre du film)",
        "contexte": "Situation initiale dans l'univers du film",
        "crime": "Nouveau crime inventé (pas celui du film)",
        "suspects": [
            {{
                "nom": "Nom du suspect",
                "description": "Description physique et psychologique",
                "mobile": "Raison de commettre le crime",
                "alibi": "Défense du suspect",
                "origine": "personnage_film" ou "nouveau_personnage",
                "est_coupable": true/false,
                "indices_contre": ["Liste d'indices qui l'accusent"],
                "indices_pour": ["Liste d'éléments qui l'innocentent"]
            }}
        ],
        "indices": [
            {{
                "numero": 1,
                "titre": "Nom de l'indice",
                "description": "Description détaillée",
                "lieu_decouverte": "Où est trouvé l'indice",
                "interpretation": "Ce que ça suggère",
                "est_trompeur": true/false,
                "suspects_impliques": ["Noms des suspects concernés"]
            }}
        ],
        "etapes": [
            {{
                "numero": 1,
                "titre": "Phase de l'enquête",
                "description": "Ce qui se passe",
                "choix": ["Option A", "Option B", "Option C"],
                "indices_reveles": ["Indices découverts à cette étape"],
                "plot_twist": "Révélation inattendue (optionnel)"
            }}
        ],
        "solution": {{
            "coupable": "Nom du vrai coupable",
            "mobile_reel": "Vraie raison du crime",
            "methode": "Comment le crime a été commis",
            "revelation": "Comment tout s'explique",
            "fausses_pistes_expliquees": "Pourquoi les autres étaient suspects"
        }}
    }}

    EXIGENCES ANTI-MONOTONIE :
    - AU MOINS 5 suspects avec des mobiles crédibles
    - AU MOINS 2 fausses pistes majeures
    - AU MOINS 1 plot twist majeur dans les étapes
    - Des indices contradictoires qui remettent en question les premières impressions
    - Le coupable ne doit PAS être le suspect le plus évident au début

    EXEMPLE D'INSPIRATION (ne pas copier) :
    Si film = "Titanic" → Enquête sur un vol de bijoux pendant la traversée
    Si film = "Le Parrain" → Enquête sur un empoisonnement pendant un mariage mafieux
    Si film = "Inception" → Enquête sur la mort suspecte d'un psychologue spécialisé en rêves

    Génère maintenant une enquête ORIGINALE et IMPRÉVISIBLE !
    """
    def extract_json_from_reponse (self, response_text:str) -> Dict[str, Any]:
        """
        Extraction JSON - Nettoie la réponse de l'IA
        """
        try:
            start = response_text.find ('{') #si pas trouvé -1
            end = response_text.rfind('}') + 1 # si pas trouvé -1 + 1 = 0

            if start == -1 or end == 0 :
                raise ValueError (" Pas de Json trouvé dans response")

            json_str = response_text[start:end] # recupere que {...}
            return json.loads(json_str) # string -> dictionnaire

        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Erreur parsing JSON: {str(e)}")
            raise

    def is_valid_scenario(self, scenario: Dict[str, Any]) -> bool:

        """
        Validation du scnéario - Vérifie la qualité du résultat
        """

        required_fields = ['titre', 'contexte', 'crime', 'suspects', 'indices', 'etapes', 'solution' ]

        for field in required_fields:
            if field not in scenario:
                logger.error (f"champs manquant: {field}")
                return False

        # vérificaion de type scenario qui est une liste de dictionnaires
        if not isinstance(scenario['suspects'], list) or len(scenario['suspects']) < 2:
            logger.error (" Il faut au moins 2 suspects")
            return False

        if not isinstance (scenario['indices'], list) or len(scenario['indices']) < 3:
            logger.error (" Il faut au moins 3 indices")
            return  False

        return True


    # fonction principale
    def generate_investigation_scenario(self, film_title: str, author_name: str = None) -> Dict [str, Any]:
        """
        Orchectre tout le processus de création d'enquete

        PROCESS:
        1. Auto-complète les infos du film si besoin
        2. Vérifie si le film est adapté (is_detective_film)
        3. Si non → retourne erreur avec suggestions
        4. Si oui → génère le scénario complet
        5. Valide le résultat ou utilise le fallback
        """

        # Auto complétion des infos film
        film_info = self.complete_film_info(film_title, author_name)
        if not film_info.get('found'):
            return {"error": True, "message": f"Film '{film_title}' introuvable"}

        # validation du film
        if not self.is_detective_film(film_info['titre'], film_info['description'], film_info['auteur']):
            return {
                "error" : True,
                "message": f"Désolée, le film {film_title} ne semble pas adapté pour créer une enquete, Choisissez un film avec des éléments de mystére,thriller, drame ou crime",
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
            response = self.model.generate_content (prompt)

            #extraction et validation du json
            scenario_json = self.extract_json_from_reponse (response.text)

            # vérification de qualité de al réponse
            if self.is_valid_scenario(scenario_json):
                logger.info (f"Scénario généré avec succés")
                return scenario_json

            else:
                logger.warning("Scénario invalide")
                return {"error": True, "message": "Erreur génération"}

        except Exception as e:
            logger.error (f"Erreur génération IA: {str(e)}")
            return {"error": True, "message": "Erreur technique"}
