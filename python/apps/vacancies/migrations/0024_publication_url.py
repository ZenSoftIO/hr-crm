# Generated by Django 2.0.6 on 2018-07-16 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vacancies', '0023_auto_20180716_1406'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='url',
            field=models.URLField(null=True),
        ),
    ]
