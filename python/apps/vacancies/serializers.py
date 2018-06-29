from rest_framework import serializers

from apps.departments.serializers import PositionSerializer
from apps.requests.serializers import RequestSerializer
from .models import Vacancy, Publication


class VacancySerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.email')
    request_id = RequestSerializer
    position_id = PositionSerializer
    class Meta:
        model = Vacancy
        exclude = []


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ('vacancy_id', 'created', 'created_by', 'facebook',
                  'instagram', 'headhunter', 'diesel', 'jobkg')
