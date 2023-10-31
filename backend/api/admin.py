from django.contrib import admin

from .models import *

# Register your models here.


admin.site.register(Users)
admin.site.register(pov)
admin.site.register(Personnel)
class CategoryAdmin(admin.ModelAdmin):

    list_display = ('name',)


class ProductAdmin(admin.ModelAdmin):

    list_display = ('name', 'category',)





admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Fournisseur)
admin.site.register(Depot)
admin.site.register(MvtStock)
admin.site.register(OperationCaissier)
admin.site.register(Achat)
admin.site.register(Contenir)
admin.site.register(Order)
admin.site.register(OrderDetails)
admin.site.register(Clients)