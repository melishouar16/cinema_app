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
        prompt = f'Pour le film "{film_title}"{f" de {author_name}" if author_name else ""}, réponds en JSON: {{"titre": "...", "auteur": "...", "description": "...", "found": true}} ou {{"found": false}} si inexistant.'

        try:
            response = self.model.generate_content(prompt)
            return self.extract_json_from_reponse(response.text)
        except:
            return {"found": False}

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
        """
            Construction du prompt
        """
        # on fait un return pour utiliser build_prompt apres dans generate_investigation_scenario
        return f"""

Tu es un créateur d'enquetes policieres interactives, Tu dois créer une RÉADAPTATION EXACTE du film "{film_title}" de {author_name} sous forme d'enquête policière interactive.

Description du film original: {film_description}, vous pouvez ajouter d'autres infos que vous avez sur ce  film pour compléter


RÈGLES IMPORTANTES:
1. RESPECTE EXACTEMENT l'intrigue du film original
2. GARDE les vrais personnages, lieux, et événements du film
3. TRANSFORME l'histoire en enquete que le joueur doit résoudre
4. Les SUSPECTS doivent être les vrais personnages du film
5. Les INDICES doivent correspondre aux vrais éléments de l'intrigue
6. La SOLUTION doit révéler ce qui se passe vraiment dans le film
7. GARDE l'époque, l'ambiance et l'univers exact du film

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans texte supplémentaire. Structure exacte:

{{
    "titre": "Enquête basée sur {film_title}",
    "contexte": "Situation du film adaptée en enquête (2-3 phrases avec les vrais éléments)",
    "crime": "Le vrai mystère/crime/événement central du film à élucider",
    "suspects": [
        {{
            "nom": "Nom EXACT du personnage du film",
            "description": "Son vrai rôle dans le film",
            "mobile": "Ses vraies motivations dans l'histoire",
            "alibi": "Son comportement réel dans le film"
        }}
    ],
    "indices": [
        {{
            "numero": 1,
            "titre": "Élément réel du film",
            "description": "Vrai détail/objet/événement important de l'intrigue",
            "lieu": "Vrai lieu du film où cela se passe"
        }}
    ],
    "etapes": [
        {{
            "numero": 1,
            "titre": "Étape basée sur une scène du film",
            "description": "Action inspirée d'une vraie séquence du film",
            "question": "Question sur les vrais événements du film",
            "choix": ["Options basées sur les vraies possibilités du film"]
        }}
    ],
    "solution": {{
        "coupable": "Le vrai responsable selon l'intrigue du film",
        "explication": "La vraie résolution de l'intrigue du film",
        "indices_cles": ["Les vrais éléments qui mènent à la résolution dans le film"]
    }}
}}

Crée 3-4 suspects (vrais personnages), 4-5 indices (vrais éléments), et 3-4 étapes (vraies séquences du film).
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
