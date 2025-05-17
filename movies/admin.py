from django.contrib import admin
from .models import Auteur, Film
from django.db.models import Count

class FilmInline(admin.TabularInline): #présentation en tableau
    model = Film
    extra = 0

class AuteurAvecFilmsFilter (admin.SimpleListFilter) : #filtre personnalisé
    title = 'auteurs avec films'
    parameter_name = 'avec_films'


    def lookups(self, request, model_admin):
        return (
            ('oui', 'Avec au moins un film'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'oui':
            return queryset.annotate(num_films=Count('films')).filter(num_films__gt=0)
        return queryset

@admin.register(Auteur)
class AuteurAdmin(admin.ModelAdmin):
    list_display = ('nom', 'email', 'date_naissance', 'nombre_films')
    search_fields = ('nom', 'email')
    list_filter = (AuteurAvecFilmsFilter,)
    inlines = [FilmInline]

    def nombre_films(self, obj):
        return obj.films.count()
    nombre_films.short_description = 'Nombre de films'

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ('titre', 'auteur', 'date_sortie', 'evaluation', 'statut')
    list_filter = ('date_creation', 'evaluation', 'statut')
    search_fields = ('titre', 'description', 'auteur__nom')
    date_hierarchy = 'date_creation'
    autocomplete_fields = ['auteur']
