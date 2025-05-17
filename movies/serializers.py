from rest_framework import serializers
from .models import Auteur, Film

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


