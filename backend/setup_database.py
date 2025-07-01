import os
import sys
import django
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cinema.settings')
django.setup()

from django.contrib.auth.models import User
from movies.models import Auteur, Film, Enquete, EvaluationEnquete

def setup_database():
    fixtures_path = 'movies/fixtures/initial_data.json'

    with open(fixtures_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Suppression des données existantes
    EvaluationEnquete.objects.all().delete()
    Enquete.objects.all().delete()
    Film.objects.all().delete()
    Auteur.objects.all().delete()
    User.objects.all().delete()

    # Stockage des objets créés
    users = {}
    auteurs = {}
    films = {}
    enquetes = {}

    # Création des utilisateurs
    for item in data:
        if item['model'] == 'auth.user':
            fields = item['fields']
            user = User.objects.create_user(
                username=fields['username'],
                email=fields['email'],
                password=fields['password'],
                is_staff=fields.get('is_staff', False),
                is_superuser=fields.get('is_superuser', False),
                is_active=fields.get('is_active', True)
            )
            users[item['pk']] = user

    # Création des auteurs
    for item in data:
        if item['model'] == 'movies.auteur':
            fields = item['fields']
            auteur = Auteur.objects.create(
                nom=fields['nom'],
                email=fields['email'],
                date_naissance=fields['date_naissance']
            )
            auteurs[item['pk']] = auteur

    # Création des films
    for item in data:
        if item['model'] == 'movies.film':
            fields = item['fields']
            film = Film.objects.create(
                titre=fields['titre'],
                description=fields['description'],
                date_sortie=fields['date_sortie'],
                evaluation=fields['evaluation'],
                auteur=auteurs[fields['auteur']],
                statut=fields['statut']
            )
            films[item['pk']] = film

    # Création des enquêtes
    for item in data:
        if item['model'] == 'movies.enquete':
            fields = item['fields']
            enquete = Enquete.objects.create(
                titre=fields['titre'],
                description=fields['description'],
                scenario_json=fields['scenario_json'],
                film_source=films[fields['film_source']],
                createur=users[fields['createur']],
                statut=fields['statut']
            )
            enquetes[item['pk']] = enquete

    # Création des évaluations
    for item in data:
        if item['model'] == 'movies.evaluationenquete':
            fields = item['fields']
            EvaluationEnquete.objects.create(
                evaluateur=users[fields['evaluateur']],
                enquete=enquetes[fields['enquete']],
                note=fields['note'],
                commentaire=fields['commentaire']
            )

if __name__ == "__main__":
    setup_database()
