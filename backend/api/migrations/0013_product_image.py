# Generated by Django 4.0.6 on 2022-08-10 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_order_orderdetails_commandmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(default=None, upload_to='products'),
            preserve_default=False,
        ),
    ]
