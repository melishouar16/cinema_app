from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Auteur, Film
from .serializers import AuteurSerializer, FilmSerializer
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


@method_decorator(cache_page(60 * 15), name='list')      # 15 min
@method_decorator(cache_page(60 * 30), name='retrieve')
class AuteurViewSet(viewsets.ModelViewSet):
    queryset = Auteur.objects.all()
    serializer_class = AuteurSerializer

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


@method_decorator(cache_page(60 * 15), name='list')
class AuteurViewSet(viewsets.ModelViewSet):
    queryset = Auteur.objects.all()
    serializer_class = AuteurSerializer

    def list(self, request):
        print("test de cache")
        return super().list(request)
