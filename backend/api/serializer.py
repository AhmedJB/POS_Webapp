from rest_framework.serializers import ModelSerializer
from .models import *


# default classes to override
from rest_framework.serializers import ModelSerializer
from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings

# tools imports
from .tools import encrypt_str

# models 



class MyTokenObtainSerializer(serializers.Serializer):
    username_field = "pin"

    def __init__(self, *args, **kwargs):
        super(MyTokenObtainSerializer, self).__init__(*args, **kwargs)

        self.fields[self.username_field] = serializers.CharField()
        #self.fields['password'] = PasswordField()

    def validate(self, attrs):
        # self.user = authenticate(**{
        #     self.username_field: attrs[self.username_field],
        #     'password': attrs['password'],
        # })

        encrypted_pin = encrypt_str(attrs[self.username_field])
        self.user = Users.objects.filter(pin = encrypted_pin,is_superuser=False).first()
        print(self.user)

        if not self.user:
            raise ValidationError('The user is not valid.')

        """ if self.user:
            if not self.user.check_password(attrs['password']):
                raise ValidationError('Incorrect credentials.') """
        print(self.user)
        # Prior to Django 1.10, inactive users could be authenticated with the
        # default `ModelBackend`.  As of Django 1.10, the `ModelBackend`
        # prevents inactive users from authenticating.  App designers can still
        # allow inactive users to authenticate by opting for the new
        # `AllowAllUsersModelBackend`.  However, we explicitly prevent inactive
        # users from authenticating to enforce a reasonable policy and provide
        # sensible backwards compatibility with older Django versions.
        """ if self.user is None or not self.user.is_active:
            raise ValidationError('No active account found with the given credentials') """

        return {}

    @classmethod
    def get_token(cls, user):
        raise NotImplemented(
            'Must implement `get_token` method for `MyTokenObtainSerializer` subclasses')



# custom serializer
class MyTokenObtainPairSerializer(MyTokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        return RefreshToken.for_user(user)

    def validate(self, attrs):
        data = super(MyTokenObtainPairSerializer, self).validate(attrs)

        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data




class UsersSerializer(ModelSerializer):

    class Meta:
        model = Users
        fields = "__all__"


class PovSerializer(ModelSerializer):
    class Meta:
        model = pov
        fields = '__all__'

class PersonnelSerializer(ModelSerializer):
    class Meta:
        model = Personnel
        fields = "__all__"


class ClientSerializer(ModelSerializer):
    class Meta:
        model = Clients
        fields = "__all__"



class ProductSerializer(ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'


class FournisseurSerializer(ModelSerializer):

    class Meta:
        model = Fournisseur
        fields = "__all__"
# pour affcher les produits dans leurs catégories on ne peut pas appliquer des filtres
        # class CategorySerializer(ModelSerializer):

        #     # Nous redéfinissons l'attribut 'product' qui porte le même nom que dans la liste des champs à afficher
        #     # en lui précisant un serializer paramétré à 'many=True' car les produits sont multiples pour une catégorie
        #     products = ProductSerializer(many=True)

        #     class Meta:
        #         model = Category
        #         fields = ['id', 'date_created', 'date_updated', 'name', 'products']


# on redefinit serializer de la catégorie pour qu'on puisse faire un filtre
class CategoryDetailSerializer(serializers.ModelSerializer):

    # En utilisant un `SerializerMethodField', il est nécessaire d'écrire une méthode
    # nommée 'get_XXX' où XXX est le nom de l'attribut, ici 'products'
    products = serializers.SerializerMethodField()
    Fournisseurs = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = "__all__"
        

    def get_products(self, instance):
        # Le paramètre 'instance' est l'instance de la catégorie consultée.
        # Dans le cas d'une liste, cette méthode est appelée autant de fois qu'il y a
        # d'entités dans la liste

        # On applique le filtre sur notre queryset pour n'avoir que les produits actifs
        queryset = instance.products.filter(active=False)
        # Le serializer est créé avec le queryset défini et toujours défini en tant que many=True
        serializer = ProductSerializer(queryset, many=True)
        # la propriété '.data' est le rendu de notre serializer que nous retournons ici
        return serializer.data

class OrderDetailedSerializer(serializers.ModelSerializer):

    client = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()


    class Meta:
        model = Order
        fields = "__all__"

    def get_client(self,instance):
        s = ClientSerializer(instance.client)
        return s.data

    def get_user(self,instance):
        print("instance here")
        s = UsersSerializer(instance.user)
        return s.data
    



class OrderSerializer(serializers.ModelSerializer):

    details = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_details(self,instance):
        queryset = OrderDetails.objects.filter(order = instance)
        s = OrderDetailsSerializer(queryset,many=True)
        return s.data

class OrderDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetails
        fields = "__all__"


class CategoryListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"

        extra_kwargs = {"products" : {"required" :  False} } 


class DepotSerializer(serializers.ModelSerializer):

    class Meta:
        model = Depot
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = "__all__"

class AchatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Achat
        fields = "__all__"

class AchatDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    fournisseur = serializers.SerializerMethodField()

    class Meta:
        model = Achat
        fields = "__all__"

    def get_product(self,instance):
        p = ProductSerializer(instance.product)
        return p.data
    
    def get_fournisseur(self,instance):
        f = FournisseurSerializer(instance.product.fournisseur)
        return f.data


class OperationCaissierSerializer(serializers.ModelSerializer):

    class Meta:
        model = OperationCaissier
        fields = "__all__"


class MvtStockSerializer(serializers.ModelSerializer):

    product = serializers.SerializerMethodField()
    depot = serializers.SerializerMethodField()

    class Meta:
        model = MvtStock
        fields = "__all__"

    def get_product(self,instance):
        p = ProductSerializer(instance.contenir.product)
        return p.data
    
    def get_depot(self,instance):
        d = DepotSerializer(instance.contenir.depot)
        return d.data