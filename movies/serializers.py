from rest_framework import serializers
from .models import Auteur, Film, Enquete, EvaluationEnquete, SessionJeu, UserProfile
from rest_framework.reverse import reverse
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class FilmSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Film
        fields = ['id', 'titre', 'description', 'date_sortie', 'evaluation', 'auteur', 'statut', 'date_creation', '_links']

    def get__links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        links = {
            'self': reverse('film-detail', kwargs={'pk': obj.pk}, request=request),
            'auteur': reverse('auteur-detail', kwargs={'pk': obj.auteur.pk}, request=request),
        }

        if obj.statut == 'publie':
            links['archiver'] = f"{reverse('film-detail', kwargs={'pk': obj.pk}, request=request)}archiver/"

        return links

class AuteurSerializer(serializers.ModelSerializer):
    films = FilmSerializer(many=True, read_only=True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Auteur
        fields = ['id', 'nom', 'email', 'date_naissance', 'films', '_links']

    def validate_email(self, value):
        if Auteur.objects.filter(email=value).exists():
            raise serializers.ValidationError("kl'email existe")
        return value

    def get__links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        return {
            'self': reverse('auteur-detail', kwargs={'pk': obj.pk}, request=request),
            'films': f"{reverse('film-list', request=request)}?auteur={obj.pk}",
        }

class EnqueteSerializer(serializers.ModelSerializer):
    film_source_titre = serializers.CharField(source='film_source.titre', read_only=True)
    createur_nom = serializers.CharField(source='createur.username', read_only=True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Enquete
        fields = [
            'id', 'titre', 'description', 'scenario_json',
            'film_source', 'film_source_titre',
            'createur', 'createur_nom',
            'statut', 'evaluation_moyenne', 'nombre_evaluations', 'nombre_parties',
            'date_creation', 'date_modification', '_links'
        ]
        read_only_fields = ['evaluation_moyenne', 'nombre_evaluations', 'nombre_parties'] # Sans protection, un utilisateur pourrait s'attribuer 500 parties, evalutation 5 etc

    def get__links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        links = {
            'self': reverse('enquete-detail', kwargs={'pk': obj.pk}, request=request),
            'film_source': reverse('film-detail', kwargs={'pk': obj.film_source.pk}, request=request),
        }

        if obj.statut == 'brouillon':
            links['publier'] = f"{reverse('enquete-detail', kwargs={'pk': obj.pk}, request=request)}publier/"

        return links

class SessionJeuSerializer(serializers.ModelSerializer):
    enquete_titre = serializers.CharField(source='enquete.titre', read_only=True)
    joueur_nom = serializers.CharField(source='joueur.username', read_only=True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = SessionJeu
        fields = [
            'id', 'joueur', 'joueur_nom',
            'enquete', 'enquete_titre',
            'etape_actuelle', 'statut', 'date_creation', '_links'
        ]

    def get__links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        return {
            'self': reverse('sessionjeu-detail', kwargs={'pk': obj.pk}, request=request),
            'enquete': reverse('enquete-detail', kwargs={'pk': obj.enquete.pk}, request=request),
        }

class EvaluationEnqueteSerializer(serializers.ModelSerializer):
    enquete_titre = serializers.CharField(source='enquete.titre', read_only=True)
    evaluateur_nom = serializers.CharField(source='evaluateur.username', read_only=True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationEnquete
        fields = [
            'id', 'evaluateur', 'evaluateur_nom',
            'enquete', 'enquete_titre',
            'note', 'commentaire', 'date_creation', 'date_modification', '_links'
        ]

    def get__links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        return {
            'self': reverse('evaluationenquete-detail', kwargs={'pk': obj.pk}, request=request),
            'enquete': reverse('enquete-detail', kwargs={'pk': obj.enquete.pk}, request=request),
        }

# ajout d'un serializer pour afficher les details d'une enquete ( pour film source par exemple afficher description en plus de nom)
class EnqueteDetailsSerializer(serializers.ModelSerializer):
    film_source = FilmSerializer(read_only=True) # récupére tout
    session = SessionJeuSerializer(many=True, read_only=True)
    evaluations = EvaluationEnqueteSerializer(many=True, read_only=True)
    createur_nom = serializers.CharField(source='createur.username', read_only=True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Enquete
        fields = [
            'id', 'titre', 'description', 'scenario_json',
            'film_source', 'createur', 'createur_nom',
            'statut', 'evaluation_moyenne', 'nombre_evaluations', 'nombre_parties',
            'date_creation', 'date_modification',
            'session', 'evaluations', '_links'
        ]

    def get__links(self, obj):
        request = self.context.get('request')
        if not request:
            return {}

        links = {
            'self': reverse('enquete-detail', kwargs={'pk': obj.pk}, request=request),
            'film_source': reverse('film-detail', kwargs={'pk': obj.film_source.pk}, request=request),
            'sessions': f"{reverse('sessionjeu-list', request=request)}?enquete={obj.pk}",
            'evaluations': f"{reverse('evaluationenquete-list', request=request)}?enquete={obj.pk}",
        }

        if obj.statut == 'brouillon':
            links['publier'] = f"{reverse('enquete-detail', kwargs={'pk': obj.pk}, request=request)}publier/"

        return links


# add  user profile serializers

#infos profil
class UserProfileSerializer (serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'date_creation', 'date_modification', 'is_active']
        read_only_fields =  ['date_creation', 'date_modification']

#affiche infos user + infos profil (du serializer precedent)
class UserSerializer (serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only = True)
    _links = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile', '_links']
        read_only_fields = ['id', 'date_joined']

    def get_links(self, obj):
        request = self.context.get ('request')
        if not request:
            return {}

        return {
            'self': f"/api/users/{obj.pk}/",
            'enquetes_creees': f"/api/enquetes/?createur={obj.pk}",
            'sessions': f"/api/sessions/?joueur={obj.pk}",
            'evaluations': f"/api/evaluations/?evaluateur={obj.pk}",
        }


# pour l'inscription
class RegisterSerializer (serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, validators = [validate_password]) # est accessible uniquement en ecriture mais ne s'affiche jamais
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate (self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe sont différents")
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email = value).exists ():
            raise serializers.ValidationError (" Cet email existe déja")
        return value

    def create(self, validated_data):
        #supprimer password_confirm car plus besoin apres validation
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        return user


