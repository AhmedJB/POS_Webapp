from time import timezone
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework import status, permissions

# serializers imports
from .serializer import *

# models imports
from .models import *


# simple jwt view import

from rest_framework_simplejwt.views import TokenObtainPairView

# helper script
from .helper import *

from datetime import datetime

from django.utils import timezone

# Create your views here.


class CustomTokenObtain(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


def form_error_resp(message, failed=True):
    return Response({"failed": failed, "message": message})


class Test(APIView):
    def get(self, request, format=None):

        return Response({"res": True})


class Register(APIView):
    def post(self, request, format=None):
        data = request.data
        temp_data = data.copy()

        # del temp_data['pin']
        if "pov" in temp_data.keys():
            del temp_data["pov"]
        u = Users.objects.create(**temp_data)
        u.set_pin(data["pin"])
        try:

            if u.role != "super":
                p_data = {"pov": data["pov"], "user": u.id}
                pr = PersonnelSerializer(data=p_data)
                if pr.is_valid():
                    print("valid")
                    d = pr.save()
                    u.save()
                    return Response(PersonnelSerializer(d).data)
                else:
                    print(pr.error_messages)

            u.save()

            resp = UsersSerializer(u).data
            return Response(resp)
        except:
            u.delete()
            return form_error_resp("failed adding  user")


class UserHandle(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "patch", "delete"]
    serializer_class = UsersSerializer

    def get_queryset(self):
        return Users.objects.all()


class Pov(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        resp = []
        if user.role == "super":
            povs = pov.objects.all()
            resp = PovSerializer(povs, many=True)
        else:
            prs = Personnel.objects.filter(user=user)
            temp = [x.pov for x in prs]
            resp = PovSerializer(temp, many=True)
        return Response(resp.data)

    def post(self, request):
        data = request.data
        user = request.user
        if user.role == "super":
            pv = PovSerializer(data=data)
            if pv.is_valid():
                pv = pv.save()
                return Response(PovSerializer(pv).data)
            else:
                return form_error_resp("check the fields")
        else:
            return form_error_resp("only super user can create povs")


# get users
class getUsers(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, povid, role):
        final = []
        pv = pov.objects.filter(id=povid).first()
        if pv:
            user = request.user
            if user.role == "super":
                if role == "admin":
                    temp = Users.objects.exclude(role="super").filter(role="admin")
                elif role == "user":
                    temp = Users.objects.exclude(role="super").exclude(role="admin")
                else:
                    temp = Users.objects.exclude(role="super")

                for single in temp:
                    per = Personnel.objects.filter(user=single, pov=pv).first()
                    temp2 = UsersSerializer(single).data
                    if per:
                        temp2["linked"] = True
                    else:
                        temp2["linked"] = False
                    final.append(temp2)
            elif user.role == "admin":

                final = getUsersForAdmin(user, pv)
            return Response(final)
        else:
            return form_error_resp("POV not found")


# set user
class LinkToPov(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        uid = data.get("id", False)
        pid = data.get("pid", False)
        action = data.get("action", False)
        if uid and pid:
            target = Users.objects.filter(id=int(uid)).first()
            if target:
                if (target.role == "admin" and user.role == "super") or (
                    target.role not in ["admin", "super"]
                    and user.role in ["admin", "super"]
                ):
                    pv = pov.objects.filter(id=pid).first()
                    if pv:
                        if action:
                            if action == "link":
                                per = Personnel.objects.create(user=target, pov=pv)
                                per.save()
                                data = PersonnelSerializer(per).data
                                return Response(data)
                            elif action == "unlink":
                                per = Personnel.objects.filter(
                                    user=target, pov=pv
                                ).first()
                                if per:
                                    per.delete()
                                    return form_error_resp("link broken", failed=False)
                                else:
                                    return form_error_resp("link not found")

                        else:
                            return form_error_resp("Action not defined")
                    else:
                        return form_error_resp("POV not found")
                else:
                    return form_error_resp("permission issue")
            else:
                return form_error_resp("no user found")
        else:
            return form_error_resp("no user/pov sent")


# client view
""" class ClientView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        params  = request.query_params
        pid = params.get("pid",False)
        if pid:
            pv = pov.objects.filter(id=int(pid)).first()
            if pv:
                clients = Clients.objects.filter(pov=pv)
                resp = ClientSerializer(clients,many=True).data
                return Response(resp)
            else:
                form_error_resp('pov not found')
        else:
            return form_error_resp("no pov sent")
        return Response('check')

    def post(self,request):
        data = request.data 
        s = ClientSerializer(data=data)
        if s.is_valid():
            c = s.save()
            return Response(ClientSerializer(c).data)
        else:
            print(s.error_messages)
            return form_error_resp('failed  saving client') """


class ClientViewSet(ModelViewSet):

    serializer_class = ClientSerializer

    def get_queryset(self):
        print("here")
        pid = self.request.GET.get("pid")
        queryset = Clients.objects.all()
        if pid:
            pv = pov.objects.filter(id=int(pid)).first()
            if pv:
                queryset = queryset.filter(pov=pv)
        return queryset


# fournisseur view
""" class FournisseurView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        params  = request.query_params
        pid = params.get("pid",False)
        if pid:
            pv = pov.objects.filter(id=int(pid)).first()
            if pv:
                fourns = Fournisseur.objects.filter(pov=pv)
                resp = FournisseurSerializer(fourns,many=True).data
                return Response(resp)
            else:
                form_error_resp('pov not found')
        else:
            return form_error_resp("no pov sent")
        return Response('check')

    def post(self,request):
        data = request.data 
        print(data)
        s = FournisseurSerializer(data=data)
        if s.is_valid():
            c = s.save()
            return Response(FournisseurSerializer(c).data)
        else:
            print(s.error_messages)
            return form_error_resp('failed  saving client') """


class testSession(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        return Response(UsersSerializer(user).data)


class CategoryViewset(ModelViewSet):
    # avoir des infos minimes lor de l'appel d'une liste et maximes lor de l'appel des détails
    serializer_class = CategoryListSerializer
    detail_serialzer_class = CategoryDetailSerializer
    http_method_names = ["get", "delete", "post"]

    def get_queryset(self):
        return Category.objects.all()

    def get_serializer_class(self):
        if self.action == "retreive":
            return self.detail_serialzer_class
        return super().get_serializer_class()

    def destroy(self, request, pk=None):
        print("hello world")
        self.get_object().delete()
        return Response({"result": "deleted"})

    @action(detail=True, methods=["post"])
    def disable(self, request, pk):
        self.get_object().disable()
        return Response()


# 1         # class CategoryAPIView(APIView):

#     def get(self, *args, **kwargs):
#         categories = Category.objects.all()
#         serializer = CategorySerializer(categories, many=True)
#         return Response(serializer.data)


class AdminCategoryViewset(ModelViewSet):
    serializer_class = CategoryListSerializer
    detail_serializer_class = CategoryDetailSerializer

    def get_queryset(self):
        print("here")
        pid = self.request.GET.get("pid")
        queryset = Category.objects.all()
        if pid:
            pv = pov.objects.filter(id=int(pid)).first()
            if pv:
                queryset = queryset.filter(pov=pv)
        return queryset


"""   def destroy(self, request, pk=None):
        print('hello world')
        self.get_object().delete()
        return Response({"result":'deleted'}) """


class FournisseurViewset(ModelViewSet):

    serializer_class = FournisseurSerializer

    def get_queryset(self):
        print("here")
        pid = self.request.GET.get("pid")
        queryset = Fournisseur.objects.all()
        if pid:
            pv = pov.objects.filter(id=int(pid)).first()
            if pv:
                queryset = queryset.filter(pov=pv)
        return queryset


class ProductViewset(ModelViewSet):

    serializer_class = ProductSerializer

    def get_queryset(self):
        # Nous récupérons tous les produits dans une variable nommée queryset
        queryset = Product.objects.all()
        # Vérifions la présence du paramètre ‘category_id’ dans l’url et si oui alors appliquons notre filtre
        category_id = self.request.GET.get("category_id")
        fournisseur_id = self.request.GET.get("fournisseur_id")
        depot_id = self.request.GET.get("depot_id")
        if category_id is not None:
            queryset = queryset.filter(category_id=category_id)
            # queryset += queryset.filter(fournisseur_id=fournisseur_id)
        if fournisseur_id is not None:
            queryset = queryset.filter(fournisseur_id=fournisseur_id)
        if depot_id is not None:
            queryset = queryset.filter(depot_id=depot_id)

        return queryset

    def create(self, request):
        data = request.data
        params = request.query_params
        print(data)
        print(params)
        d_id = params.get("depot_id")
        cat = Category.objects.filter(id=data["category"]).first()
        ps = ProductSerializer(data=data)
        if ps.is_valid() and d_id:
            print("valid")
            p = ps.save()
            depot = Depot.objects.filter(id=int(d_id)).first()
            print(depot)
            # creating contenir relation
            con = Contenir.objects.create(product=p, depot=depot)
            con.save()
            mvt = MvtStock.objects.create(
                mvt_type="in", contenir=con, qt_entree=data.get("quantity")
            )
            mvt.save()
            if data.get("record",False):
                achat_data = {
                    "product" : p.id,
                    "quantity" : data.get("quantity"),
                    "total" : int(data.get("quantity")) * float(data.get("prix_achat")),
                }
                caissier_data = {
                    "pov" : p.category.pov.id,
                    "mvt_type" : "credit",
                    "montant" :  int(data.get("quantity")) * float(data.get("prix_achat")),
                }

                s_achat = AchatSerializer(data=achat_data)
                s_caisse = OperationCaissierSerializer(data=caissier_data)
                if s_achat.is_valid() and s_caisse.is_valid():
                    s_achat.save()
                    s_caisse.save()
                else:
                    print(s_achat.errors)
                    print(s_caisse.errors)

                
            return form_error_resp("Created new product", failed=False)
        else:
            print(ps.errors)
            return form_error_resp("Failed Creating product")
        return Response("testing")


class OrderViewset(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = OrderSerializer
    serializer_detail_class = OrderDetailedSerializer

    def get_serializer(self, *args, **kwargs):
        print(self.action)
        if self.action == "list":
            return self.serializer_detail_class(*args,**kwargs)
        return super().get_serializer(*args, **kwargs)


    def get_queryset(self):
        
        queryset = Order.objects.all()
        pov_id = self.request.GET.get("pov",False)
        start = self.request.GET.get("start",False)
        to = self.request.GET.get("to",False)
        if pov_id:
            queryset = queryset.filter(pov = pov_id)
        if start and to:
            start = datetime.fromtimestamp(int(start) // 1000)
            to = datetime.fromtimestamp(int(to) // 1000)
            queryset = queryset.filter(date__range=(start, to))
        return queryset

    def create(self, request):
        data = request.data
        user = request.user
        pv = pov.objects.filter(id=int(data.get("pos"))).first()
        # per = Personnel.objects.filter(user = user, pov = data.get("pos")).first()
        client = Clients.objects.filter(id=data.get("client")).first()
        total = data.get("total") * (1 - data.get("reduction") / 100)
        order_data = {
            "client": data.get("client"),
            "user": user.id,
            "pov": pv.id,
            "total": total,
            "paid": data.get("paid"),
            "reste": total - data.get("paid"),
        }
        os = OrderSerializer(data=order_data)
        if os.is_valid():
            o = os.save()
            # creating order details
            prods = data.get("products")
            for prod in prods:
                od_data = {
                    "order": o.id,
                    "produit": prod.get("id"),
                    "ordered_qt": prod.get("quantity_com"),
                    "reduction": prod.get("reduction"),
                }
                ods = OrderDetailsSerializer(data=od_data)
                if ods.is_valid():
                    p = Product.objects.filter(id=prod.get("id")).first()
                    p.quantity -= int(prod.get("quantity_com"))
                    p.save()
                    od = ods.save()
                    con = Contenir.objects.filter(product=p).first()
                    mvt = MvtStock.objects.create(
                        mvt_type="out", contenir=con, qt_sortie=prod.get("quantity_com")
                    )
                    mvt.save()

                else:
                    print("error in order details")
                    print(ods.errors)
                    return form_error_resp("error in order details")
            oc = OperationCaissier.objects.create(
                mvt_type="debit", montant=float(data.get("paid")),pov=pv
            )
            oc.save()
            client.solde += data.get("paid") - total
            client.ca += total
            client.save()
            return form_error_resp("Created order", failed=False)
        else:
            print(os.errors)
            return form_error_resp("error in creating order")


class DepotViewSet(ModelViewSet):
    serializer_class = DepotSerializer

    def get_queryset(self):
        return Depot.objects.all()


class AchatViewSet(ModelViewSet):
    serializer_class = AchatDetailSerializer

    def get_queryset(self):
        queryset = Achat.objects.all()
        start = self.request.GET.get("start",False)
        to = self.request.GET.get("to",False)
        pov_id = self.request.GET.get("pov",False)
        
        if start and to:
            start = datetime.fromtimestamp(int(start) // 1000)
            to = datetime.fromtimestamp(int(to) // 1000)
            queryset = queryset.filter(date__range=(start, to))
        if pov_id:
            temp = []
            for elem in list(queryset):
                if elem.product.category.pov.id == int(pov_id):
                    temp.append(elem)
            queryset = temp
        return queryset


class MvtStockViewSet(ModelViewSet):

    serializer_class = MvtStockSerializer

    def get_queryset(self):
        queryset = MvtStock.objects.all()
        start = self.request.GET.get("start",False)
        to = self.request.GET.get("to",False)
        pov_id = self.request.GET.get("pov",False)
        if start and to:
            start = datetime.fromtimestamp(int(start) // 1000)
            to = datetime.fromtimestamp(int(to) // 1000)
            queryset = queryset.filter(date__range=(start, to))
        if pov_id:
            temp = []
            for elem in list(queryset):
                if elem.contenir.product.category.pov.id == int(pov_id):
                    temp.append(elem)
            queryset = temp
        return queryset

class OperationCaissierViewSet(ModelViewSet):

    serializer_class = OperationCaissierSerializer

    def get_queryset(self):
        queryset = OperationCaissier.objects.all()
        start = self.request.GET.get("start",False)
        to = self.request.GET.get("to",False)
        pov_id = self.request.GET.get("pov",False)
        if start and to:
            start = datetime.fromtimestamp(int(start) // 1000)
            to = datetime.fromtimestamp(int(to) // 1000)
            queryset = queryset.filter(date__range=(start, to))
        if pov_id:
            queryset = queryset.filter(pov = int(pov_id))
        return queryset


class getStatistics(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def calculate_order_profit(self,order):
        details = OrderDetails.objects.filter(order=order)
        order_cost = 0
        for detail in details:
            order_cost += (detail.produit.prix_achat * detail.ordered_qt)
        return order.total - order_cost


    def post(self,request,format=None):
        data = request.data
        pov_id = data.get("pov",False)
        resp = {}
        if all([pov_id]):
            pv = pov.objects.filter(id=int(pov_id)).first()
            if pv:
                orders = Order.objects.filter(pov=pv,date__gte=timezone.now() - timezone.timedelta(days = 1))
                resp['orders'] = orders.count()
                clients = Clients.objects.filter(pov=pv)
                resp['clients'] = clients.count()
                profit = 0
                for order in orders:
                    profit += self.calculate_order_profit(order)
                resp['profit'] = profit
                return Response(resp)
            else:
                return form_error_resp("No POV")

        else:
            return form_error_resp("failed getting stats")