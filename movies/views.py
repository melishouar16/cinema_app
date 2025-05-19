from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Auteur, Film
from .serializers import AuteurSerializer, FilmSerializer


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
