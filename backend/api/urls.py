from email.mime import base
from django.contrib import admin
from django.urls import path, include

# jwt imports
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import routers

# views import
from .views import *


# Ici nous créons notre routeur
router = routers.SimpleRouter()
# Puis lui déclarons une url basée sur le mot clé ‘category’ et notre view
# afin que l’url générée soit celle que nous souhaitons ‘/api/category/’
# router.register('category', CategoryViewset, basename='category')
router.register("product", ProductViewset, basename="product")
router.register("category", AdminCategoryViewset, basename="admin-category")
router.register("fournisseur", FournisseurViewset, basename="admin-fournisseur")
# client view set
router.register("clients", ClientViewSet, basename="client")
router.register("admin/depot", DepotViewSet, basename="depot")
# order viewset
router.register("order", OrderViewset, basename="order")

# modify user viewset
router.register("user", UserHandle, basename="users")
# achat view set
router.register("achat",AchatViewSet,basename="achat")
# mvt stock view
router.register("mvtstock",MvtStockViewSet,basename="mvtstock")
# operation caissier
router.register("operation",OperationCaissierViewSet,basename="operation")

urlpatterns = [
    path("", include(router.urls)),
    path("register", Register.as_view()),
    # jwt routes
    path("token", CustomTokenObtain.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    # session test route
    path("session", testSession.as_view()),
    path("createpov", Pov.as_view()),
    # get users
    path("getusers/<int:povid>/<str:role>", getUsers.as_view()),
    path("link", LinkToPov.as_view()),
    path("stats",getStatistics.as_view()),
    # client view
    # path("clients",ClientView.as_view()),
    # fournisseur view
    # path("fournisseur",FournisseurView.as_view()),
]
