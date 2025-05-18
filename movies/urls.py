from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuteurViewSet, FilmViewSet

router = DefaultRouter()
router.register(r'auteurs', AuteurViewSet)
router.register(r'films', FilmViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
