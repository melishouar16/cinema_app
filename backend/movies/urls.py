from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuteurViewSet, UserViewSet, EnqueteViewSet, EvaluationEnqueteViewSet, FilmViewSet
from .views import test_ai_generation

router = DefaultRouter()
router.register(r'auteurs', AuteurViewSet)
router.register(r'films', FilmViewSet)
router.register(r'enquetes', EnqueteViewSet)
router.register(r'evaluations', EvaluationEnqueteViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test-ai/', test_ai_generation, name='test-ai'),
]
