# Generated by Django 4.0.6 on 2022-07-26 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_pov_personnel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='pin',
            field=models.CharField(default='', max_length=300, unique=True),
        ),
    ]
