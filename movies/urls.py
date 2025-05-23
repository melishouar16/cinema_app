from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuteurViewSet, UserViewSet, EnqueteViewSet, EvaluationEnqueteViewSet, FilmViewSet, SessionJeuViewSet

router = DefaultRouter()
router.register(r'auteurs', AuteurViewSet)
router.register(r'films', FilmViewSet)
router.register(r'enquetes', EnqueteViewSet)
router.register(r'sessions', SessionJeuViewSet)
router.register(r'evaluations', EvaluationEnqueteViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
