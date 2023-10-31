# Generated by Django 4.0.6 on 2022-08-10 22:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_category_pov'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='pov',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to='api.pov'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]