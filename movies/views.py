from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Auteur, Film, Enquete, EvaluationEnquete, SessionJeu
from .serializers import UserSerializer, RegisterSerializer, AuteurSerializer, FilmSerializer, EnqueteSerializer, EnqueteDetailsSerializer, SessionJeuSerializer, EvaluationEnqueteSerializer, UserSerializer
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated


@method_decorator(cache_page(60 * 15), name='list')
@method_decorator(cache_page(60 * 30), name='retrieve')
class AuteurViewSet(viewsets.ModelViewSet):
    queryset = Auteur.objects.all()
    serializer_class = AuteurSerializer

    def list(self, request):
        print("test de cache")
        return super().list(request)

    def destroy(self, request, *args, **kwargs):
        auteur = self.get_object()
        if auteur.films.count() > 0:
            return Response(
                {"erreur": "Impossible de supprimer cet auteur car il a des films associés"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)



@method_decorator(cache_page(60 * 10), name='list')
@method_decorator(cache_page(60 * 20), name='retrieve')
class FilmViewSet(viewsets.ModelViewSet):
    queryset = Film.objects.all()
    serializer_class = FilmSerializer

    def get_queryset(self):
        queryset = Film.objects.all()
        statut = self.request.query_params.get('statut')
        if statut:
            queryset = queryset.filter(statut=statut)
        return queryset

    @action(detail=True, methods=['patch'])
    def archiver(self, request, pk=None):
        film = self.get_object()
        film.statut = 'archive'
        film.save()
        return Response({'statut': 'Film archivé'})


class EnqueteViewSet (viewsets.ModelViewSet):
    queryset = Enquete.objects.all()
    serializer_class = EnqueteSerializer

class SessionJeuViewSet (viewsets.ModelViewSet):
    queryset = SessionJeu.objects.all()
    serializer_class = SessionJeuSerializer

class EvaluationEnqueteViewSet (viewsets.ModelViewSet):
    queryset = EvaluationEnquete.objects.all()
    serializer_class = EvaluationEnqueteSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """Permissions selon l'action"""
        if self.action == 'create':  # Inscription
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer

    def get_queryset(self):
        # Admins voient tout, autres voient juste leur profil
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile'):
            if self.request.user.profile.is_admin():
                return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Mon profil : GET /api/users/me/"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
