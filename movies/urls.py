from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuteurViewSet, EnqueteViewSet, EvaluationEnqueteViewSet, FilmViewSet, SessionJeuViewSet

router = DefaultRouter()
router.register(r'auteurs', AuteurViewSet)
router.register(r'films', FilmViewSet)
router.register(r'enquetes', EnqueteViewSet)
router.register(r'sessions', SessionJeuViewSet)
router.register(r'evaluations', EvaluationEnqueteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
