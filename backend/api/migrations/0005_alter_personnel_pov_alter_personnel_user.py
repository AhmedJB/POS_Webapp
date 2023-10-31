# Generated by Django 4.0.6 on 2022-07-26 10:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_personnel_pov_alter_personnel_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personnel',
            name='pov',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.pov'),
        ),
        migrations.AlterField(
            model_name='personnel',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]