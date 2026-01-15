from django.db import models
from django.db.models import Q
import uuid

class EventType(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField()
    slug = models.SlugField(unique=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.duration_minutes}m)"

class Availability(models.Model):
    timezone = models.CharField(max_length=64, default="Asia/Kolkata")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.timezone

class AvailabilityRule(models.Model):
    availability = models.ForeignKey(Availability, on_delete=models.CASCADE, related_name="rules")
    weekday = models.PositiveSmallIntegerField()  # 0=Mon ... 6=Sun
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        ordering = ["weekday", "start_time"]

    def __str__(self):
        return f"{self.weekday}: {self.start_time}-{self.end_time}"

class Booking(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "CONFIRMED"
        CANCELED = "CANCELED"

    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name="bookings")
    booking_uid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    booker_name = models.CharField(max_length=120)
    booker_email = models.EmailField()

    start_at = models.DateTimeField()
    end_at = models.DateTimeField()

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.CONFIRMED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["event_type", "start_at"],
                condition=Q(status="CONFIRMED"),
                name="uniq_confirmed_slot_per_event",
            )
        ]

    def __str__(self):
        return f"{self.event_type.slug} {self.start_at} ({self.status})"
