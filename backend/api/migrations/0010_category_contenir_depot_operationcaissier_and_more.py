# Generated by Django 4.0.6 on 2022-08-09 02:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_fournisseur_clients'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('tva', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Contenir',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Depot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(default='', max_length=100)),
                ('address', models.CharField(default='', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='OperationCaissier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mvt_type', models.CharField(default='', max_length=100)),
                ('montant', models.FloatField(default=0)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='fournisseur',
            name='pov',
        ),
        migrations.AddField(
            model_name='fournisseur',
            name='active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='clients',
            name='ca',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='clients',
            name='solde',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='fournisseur',
            name='nom',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='fournisseur',
            name='prenom',
            field=models.CharField(max_length=255),
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('quantity', models.IntegerField(default=0)),
                ('prix_unitaire', models.FloatField(default=0)),
                ('prix_achat', models.FloatField(default=0)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='api.category')),
                ('fournisseur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fournisseurs', to='api.fournisseur')),
            ],
        ),
        migrations.CreateModel(
            name='MvtStock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mvt_type', models.CharField(default='', max_length=255)),
                ('qt_sortie', models.IntegerField(default=0)),
                ('qt_entree', models.IntegerField(default=0)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('contenir', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.contenir')),
            ],
        ),
        migrations.AddField(
            model_name='contenir',
            name='depot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.depot'),
        ),
        migrations.AddField(
            model_name='contenir',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.product'),
        ),
    ]