from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.urls import reverse

from apps.candidates.models import Candidate
from apps.departments.models import Department
from apps.notifications.notifications import interview_created

User = get_user_model()

INTERVIEW_STATUS = (
    ('TO_BE_CONDUCTED', 'Предстоит'),
    ('CONDUCTED', 'Прошло'),
    ('CANCELLED', 'Отменено'),
)


class Interview(models.Model):
    event = models.CharField(max_length=100, null=True)
    status = models.CharField(choices=INTERVIEW_STATUS, max_length=100, default="TO_BE_CONDUCTED")
    candidate = models.ForeignKey(Candidate, on_delete=models.PROTECT, related_name='interviews')
    begin_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True)
    description = models.CharField(max_length=1000, blank=True)
    location = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return '{name} {begin_time}-{end_time}'.format(begin_time=self.begin_time,
                                                       end_time=self.end_time,
                                                       name=self.candidate.first_name)

    def get_absolute_url(self):
        return reverse('v1:interview-detail', kwargs={'pk': self.id})


post_save.connect(sender=Interview, receiver=interview_created)


class Interviewer(models.Model):
    comment = models.TextField(null=True, blank=True)
    interview = models.ForeignKey(Interview, related_name='interviewers', on_delete=models.PROTECT)
    user = models.ForeignKey(User, related_name='interviews', on_delete=models.PROTECT)

    def __str__(self):
        return '{interview}'.format(interview=self.interview)


class Evaluation(models.Model):
    interviewer = models.ForeignKey(Interviewer, on_delete=models.PROTECT)
    rate = models.IntegerField()
    criteria = models.ForeignKey('Criteria', on_delete=models.PROTECT)

    class Meta:
        default_related_name = 'evaluations'


class Criteria(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)

    def __str__(self):
        return self.name
