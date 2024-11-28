# Generated by Django 5.1.2 on 2024-11-27 23:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('submission', '0004_plagarismanalysis'),
    ]

    operations = [
        migrations.AddField(
            model_name='plagarismanalysis',
            name='question_id',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='plagarismanalysis',
            name='submission',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Plagarism_Analysis', to='submission.examsubmission'),
        ),
    ]
