from rest_framework import serializers
from .models import Auteur, Film, Enquete, EvaluationEnquete, SessionJeu

class FilmSerializer (serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = ['id', 'titre', 'description', 'date_sortie', 'evaluation', 'auteur', 'statut', 'date_creation']


class AuteurSerializer (serializers.ModelSerializer):
    films = FilmSerializer(many=True, read_only=True)

    class Meta:
        model = Auteur
        fields = ['id', 'nom', 'email', 'date_naissance', 'films']

    def validate_email(self, value):
        if Auteur.objects.filter(email=value).exists():
            raise serializers.ValidationError("kl'email existe")
        return value

class EnqueteSerializer (serializers.ModelSerializer):
    film_source_titre = serializers.CharField(source = 'film_source.titre', read_only=True)
    createur_nom = serializers.CharField(source ='createur.username', read_only=True)

    class Meta:
        model = Enquete
        fields = [
            'id', 'titre', 'description', 'scenario_json',
            'film_source', 'film_source_titre',
            'createur', 'createur_nom',
            'statut', 'evaluation_moyenne', 'nombre_evaluations', 'nombre_parties',
            'date_creation', 'date_modification'
        ]
        read_only_fields = ['evaluation_moyenne', 'nombre_evaluations', 'nombre_parties'] # Sans protection, un utilisateur pourrait s'attribuer 500 parties, evalutation 5 etc

class SessionJeuSerializer (serializers.ModelSerializer):
    enquete_titre = serializers.CharField(source = 'enquete.titre', read_only = True)
    joueur_nom = serializers.CharField(source = 'joueur.username', read_only = True)

    class Meta:
        model = SessionJeu
        fields = [
            'id', 'joueur', 'joueur_nom',
            'enquete', 'enquete_titre',
            'etape_actuelle', 'statut', 'date_creation'
        ]

class EvaluationEnqueteSerializer (serializers.ModelSerializer):

    enquete_titre = serializers.CharField(source = 'enquete.titre', read_only = True)
    evaluateur_nom = serializers.CharField(source = 'evaluateur.username', read_only = True)

    class Meta:
        model = EvaluationEnquete
        fields = [
            'id', 'evaluateur', 'evaluateur_nom',
            'enquete', 'enquete_titre',
            'note', 'commentaire', 'date_creation', 'date_modification'
        ]


# ajout d'un serializer pour afficher les details d'une enquete  ( pour film source par exemple afficher description en plus de nom)
class EnqueteDetailsSerializer (serializers.ModelSerializer):
    film_source = FilmSerializer(read_only = True) # récupére tout
    session = SessionJeuSerializer(read_only = True)
    evaluations = EvaluationEnqueteSerializer(read_only = True)
    createur_nom = serializers.CharField(source = 'createur.username', read_only = True)

    class Meta:
        model = Enquete
        fields = [
            'id', 'titre', 'description', 'scenario_json',
            'film_source', 'createur', 'createur_nom',
            'statut', 'evaluation_moyenne', 'nombre_evaluations', 'nombre_parties',
            'date_creation', 'date_modification',
            'session', 'evaluations'
        ]
