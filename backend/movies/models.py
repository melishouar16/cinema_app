from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Auteur(models.Model):
    nom = models.CharField(max_length=100)
    email= models.EmailField(unique=True)
    date_naissance = models.DateField()
    date_creation = models.DateField(auto_now_add=True) # add = une seule fois à la création
    date_modification = models.DateField(auto_now=True)

    def __str__(self):
        return self.nom

class Film(models.Model):
    class Evaluation(models.IntegerChoices):
        UN = 1, ('1 étoiles')
        DEUX = 2, ('2 étoiles')
        TROIS = 3, ('3 étoiles')
        QUATRE = 4, ('4 étoiles')
        CINQ = 5, ('5 étoiles')

    class Statut(models.TextChoices):
        BROUILLON = 'brouillon', ('Brouillon')
        PUBLIE = 'publie', ('Publié')
        ARCHIVE = 'archive', ('Archivé')

    titre = models.CharField(max_length=200)
    description = models.TextField()
    date_sortie = models.DateField()
    evaluation = models.IntegerField (choices=Evaluation.choices) # .choices appartient à IntegerChoices
    auteur = models.ForeignKey(Auteur, on_delete=models.PROTECT, related_name='films') #on_delete est obligatoire depuis django 2.0 ?
    statut = models.CharField (
        max_length=10,
        choices=Statut.choices,
        default=Statut.BROUILLON

    )
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre


class Enquete (models.Model):

    class Statut(models.TextChoices):
        BROUILLON = 'brouillon', 'Brouillon'
        PUBLIE = 'publie', 'Publié'
        ARCHIVE = 'archive', 'Archivé'

    film_source = models.ForeignKey(Film, on_delete = models.CASCADE, related_name = 'enquetes')
    createur = models.ForeignKey(User, on_delete = models.CASCADE, related_name= 'enquetes_crees')

    titre = models.CharField(max_length=200)
    description = models.TextField()

    scenario_json = models.TextField()

    statut = models.CharField(max_length=10, choices=Statut.choices, default= Statut.BROUILLON)
    evaluation_moyenne = models.FloatField(default=0.0)
    nombre_evaluations = models.IntegerField(default=0)
    nombre_parties = models.IntegerField(default=0)

    date_creation = models.DateTimeField(auto_now_add= True)
    date_modification = models.DateTimeField(auto_now= True)

    def __str__(self):
        return self.titre


class  EvaluationEnquete(models.Model):
    evaluateur = models.ForeignKey(User, on_delete= models.CASCADE, related_name='evaluations')
    enquete = models.ForeignKey (Enquete, on_delete=models.CASCADE, related_name='evaluations')

    note =models.IntegerField(choices=Film.Evaluation.choices)
    commentaire = models.TextField(blank=True)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['evaluateur', 'enquete']

    def __str__(self):
        return f"{self.evaluateur.username} - {self.enquete.titre} - {self.note}"

class UserProfile(models.Model):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Administrateur'
        VISITEUR = 'visiteur', 'Visiteur'        # Non connecté, lecture seule
        UTILISATEUR = 'utilisateur', 'Utilisateur'  # Connecté, peut tout faire

    # créer modéle de profil étendu  de User
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name= 'profile')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VISITEUR)
    date_creation = models.DateTimeField(auto_now_add = True)
    date_modification = models.DateTimeField(auto_now = True)
    is_active = models.BooleanField(default= True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

    def can_create_enquetes(self):
        return self.role in [self.Role.ADMIN, self.Role.UTILISATEUR] # retourne boolean

    def can_play_enquetes(self):
        return self.role in [self.Role.ADMIN, self.Role.UTILISATEUR]

    def can_evaluate(self):
        return self.role in [self.Role.ADMIN, self.Role.UTILISATEUR]

    def is_admin(self):
        return self.role == self.Role.ADMIN

    def is_visiteur(self):
        return self.role == self.Role.VISITEUR

#créer automatiquement un profil à chaque fois qu'un user est créé
@receiver(post_save, sender = User)
def create_user_profile (sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, role=UserProfile.Role.UTILISATEUR)

# sauvegarder le profil automatiquement
@receiver (post_save, sender=User)
def save_user_profile (sender, instance, **kwargs):
    if hasattr (instance, 'profile'):
        instance.profile.save()




@receiver(post_save, sender=EvaluationEnquete)
def update_enquete_evaluation_stats(sender, instance, created, **kwargs):
    """Met à jour les statistiques d'évaluation de l'enquête"""
    enquete = instance.enquete

    # Recalculer les statistiques depuis toutes les évaluations
    evaluations = EvaluationEnquete.objects.filter(enquete=enquete)

    if evaluations.exists():
        # Calculer la moyenne
        total_notes = sum(eval.note for eval in evaluations)
        moyenne = total_notes / evaluations.count()

        # Mettre à jour l'enquête
        enquete.evaluation_moyenne = round(moyenne, 1)
        enquete.nombre_evaluations = evaluations.count()
        enquete.save()
    else:
        # Aucune évaluation
        enquete.evaluation_moyenne = 0.0
        enquete.nombre_evaluations = 0
        enquete.save()

@receiver(post_delete, sender=EvaluationEnquete)
def update_enquete_evaluation_stats_on_delete(sender, instance, **kwargs):
    """Met à jour les statistiques quand une évaluation est supprimée"""
    enquete = instance.enquete

    # Recalculer les statistiques
    evaluations = EvaluationEnquete.objects.filter(enquete=enquete)

    if evaluations.exists():
        total_notes = sum(eval.note for eval in evaluations)
        moyenne = total_notes / evaluations.count()

        enquete.evaluation_moyenne = round(moyenne, 1)
        enquete.nombre_evaluations = evaluations.count()
        enquete.save()
    else:
        enquete.evaluation_moyenne = 0.0
        enquete.nombre_evaluations = 0
        enquete.save()
