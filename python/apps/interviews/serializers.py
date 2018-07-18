from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.candidates.models import Candidate
from apps.users.serializers import AuxUserSerializer
from apps.departments.serializers import DepartmentSerializer
from .models import Interview, Criteria, Interviewer, Evaluation

User = get_user_model()


class AuxCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = ('id', 'name')


class CriteriaListSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()

    class Meta:
        model = Criteria
        fields = ('id', 'name', 'department')


class CriteriaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = ('id', 'name', 'department')


class AuxCandidateSerializer(serializers.ModelSerializer):
    """Candidate Serializer for Candidates List and Candidate Detail endpoint"""

    class Meta:
        model = Candidate
        depth = 3
        fields = ('id', 'first_name', 'last_name', 'position', 'status', 'created', 'email')


class EvaluationSerializer(serializers.ModelSerializer):
    criteria = AuxCriteriaSerializer()

    class Meta:
        model = Evaluation
        fields = ('id', 'rate', 'criteria')


class InterviewerSerializer(serializers.ModelSerializer):
    user = AuxUserSerializer()

    class Meta:
        model = Interviewer
        fields = ('id', 'user')


class InterviewerEmailSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.email')

    class Meta:
        model = Interviewer
        fields = ('user',)


class InterviewerDetailSerializer(serializers.ModelSerializer):
    user = AuxUserSerializer()
    evaluations = EvaluationSerializer(many=True)

    class Meta:
        model = Interviewer
        fields = ['id', 'user', 'comment', 'evaluations']


class InterviewListSerializer(serializers.ModelSerializer):
    """Serializer for Interviews List Endpoint"""
    interviewers = InterviewerSerializer(many=True)
    candidate = AuxCandidateSerializer()
    filter_fields = ('status',)

    class Meta:
        model = Interview
        depth = 3
        fields = ('id', 'begin_time', 'end_time', 'status', 'candidate', 'interviewers')


class InterviewCreateSerializer(serializers.ModelSerializer):
    interviewers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

    class Meta:
        model = Interview
        exclude = []

    def create(self, validated_data):
        users = validated_data.pop('interviewers')
        instance = Interview.objects.create(**validated_data)
        for user in users:
            user = User.objects.get(email=user)
            Interviewer.objects.create(interview=instance, user=user)
        return instance

    def update(self, instance, validated_data):
        new_users = validated_data.pop('interviewers')
        old_users = [interviewer.user for interviewer in instance.interviewers.all()]

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        users_to_delete = set(old_users).difference(set(new_users))
        users_to_create = set(new_users).difference(set(old_users))

        Interviewer.objects.filter(interview=instance, user__in=users_to_delete).delete()
        interviewers_to_create = [Interviewer(interview=instance, user=user) for user in users_to_create]
        Interviewer.objects.bulk_create(interviewers_to_create)

        return instance


class InterviewDetailSerializer(serializers.ModelSerializer):
    candidate = AuxCandidateSerializer()
    interviewers = InterviewerDetailSerializer(many=True)

    class Meta:
        model = Interview
        fields = ['id', 'candidate', 'status', 'begin_time', 'end_time', 'description', 'location', 'interviewers']


class AuxInterviewSerializer(serializers.ModelSerializer):
    """Serializer for Detailed Candidate Endpoint"""
    interviewers = InterviewerSerializer(many=True)

    class Meta:
        depth = 3
        model = Interview
        fields = ('id', 'status', 'begin_time', 'end_time', 'interviewers')


class JavaScriptInterviewSerializer(serializers.ModelSerializer):
    interviewers = InterviewerEmailSerializer(many=True)
    candidate_email = serializers.CharField(source='candidate.email')
    phone = serializers.CharField(source='candidate.phone')

    class Meta:
        model = Interview
        fields = ('begin_time', 'end_time', 'interviewers', 'candidate_email', 'phone')


class EvaluationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        exclude = []