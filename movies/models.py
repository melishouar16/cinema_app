from django.db import models

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
    auteur = models.ForeignKey(Auteur, on_delete=models.CASCADE, related_name='films') #on_delete est obligatoire depuis django 2.0 ?
    statut = models.CharField (
        max_length=10,
        choices=Statut.choices,
        default=Statut.BROUILLON

    )
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre
