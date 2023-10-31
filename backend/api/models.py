from django.db import models
from django.contrib.auth.models import AbstractUser
from .tools import encrypt_str
from django.db import transaction

# Create your models here.



class Users(AbstractUser):
    pin = models.CharField(max_length=300,default="",unique=True)
    username = models.CharField(max_length=255,default="",unique=True)
    nom =  models.CharField(max_length=255,default="")
    prenom = models.CharField(max_length=255,default="")
    role =models.CharField(max_length=255,default="") # super | admin | vendor
    password = models.CharField(blank=True,max_length=300)


    def set_pin(self,pin):
        p = encrypt_str(pin)
        self.pin = p
        print(p)

    
    def confirm_pin(self,pin):
        if self.pin == encrypt_str(pin):
            return True
        else:
            return False

    def __str__(self):
        return self.username + " " + self.pin


class pov(models.Model):
    nom = models.CharField(default="",max_length=255)
    logo = models.ImageField(upload_to = 'pov')
    address = models.CharField(default="",max_length=255)

    def __str__(self):
        return self.nom


class Personnel(models.Model):
    pov = models.ForeignKey(pov,on_delete=models.CASCADE,null=True,blank=True)
    user = models.ForeignKey(Users,on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return "[{0}] : {1} ".format(self.user.role,self.user.username)


class Clients(models.Model):
    pov = models.ForeignKey(pov,on_delete=models.CASCADE)
    nom = models.CharField(max_length=255,default="")
    prenom = models.CharField(max_length=255,default='')
    solde = models.FloatField(default=0)
    ca = models.FloatField(default=0)

    def __str__(self):
        return "[{0}] {1}".format(str(self.pov.nom),self.nom)

class Fournisseur(models.Model):
    pov = models.ForeignKey(pov,on_delete=models.CASCADE)
    nom = models.CharField(max_length=255,default="")
    prenom = models.CharField(max_length=255,default='')

    def __str__(self):
        return "[{0}] {1}".format(str(self.pov.nom),self.nom)


class Category(models.Model):
    pov = models.ForeignKey(pov,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tva = models.FloatField(default=0)


    def __str__(self):
        return self.name

    @transaction.atomic
    def disable(self):
        if self.active is False:
            return
        self.active = False
        self.save()
        self.products.update(active=False)




class Depot(models.Model):
    nom = models.CharField(max_length=100, default="")
    address = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.nom


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="products")
    quantity = models.IntegerField(default=0)
    prix_unitaire = models.FloatField(default=0)
    prix_achat = models.FloatField(default=0)
    category = models.ForeignKey(
        'api.Category', on_delete=models.CASCADE, related_name='products')
    fournisseur = models.ForeignKey(
        'api.Fournisseur', on_delete=models.CASCADE, related_name='fournisseurs')

    def __str__(self):
        return self.name





class Contenir(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    depot = models.ForeignKey(Depot, on_delete=models.CASCADE)


class MvtStock(models.Model):
    mvt_type = models.CharField(default="", max_length=255)  # in / out
    contenir = models.ForeignKey(Contenir, on_delete=models.CASCADE)
    qt_sortie = models.IntegerField(default=0)
    qt_entree = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.mvt_type


class OperationCaissier(models.Model):
    pov = models.ForeignKey(pov,on_delete=models.CASCADE)
    mvt_type = models.CharField(default="", max_length=100)  # debit (in) / credit (out)
    montant = models.FloatField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "[{0}] : {1}".format(self.mvt_type, str(self.montant))


# order models 

class Order(models.Model):
    client = models.ForeignKey(Clients,on_delete=models.CASCADE)
    user = models.ForeignKey(Users,on_delete=models.CASCADE)
    pov = models.ForeignKey(pov,on_delete=models.CASCADE)
    total = models.FloatField(default=0)
    paid = models.FloatField(default=0)
    reste = models.FloatField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.client.nom

class OrderDetails(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    produit = models.ForeignKey(Product,on_delete=models.CASCADE)
    ordered_qt = models.IntegerField(default=0)
    reduction = models.FloatField(default=0)

    def __str__(self):
        return str(self.order.id)


class CommandMessage(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    msg = models.CharField(max_length=255,default="")


class Achat(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    total = models.FloatField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product.name