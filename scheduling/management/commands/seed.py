from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, time, datetime
from zoneinfo import ZoneInfo

from scheduling.models import EventType, Availability, AvailabilityRule, Booking

class Command(BaseCommand):
    help = "Seed database with sample event types, availability and bookings."

    def handle(self, *args, **options):
        # Event Types
        et1, _ = EventType.objects.get_or_create(
            slug="quick-chat-15",
            defaults={
                "title": "Quick Chat",
                "description": "A quick 15-minute intro call.",
                "duration_minutes": 15,
                "active": True,
            },
        )
        et2, _ = EventType.objects.get_or_create(
            slug="deep-dive-30",
            defaults={
                "title": "Deep Dive",
                "description": "A focused 30-minute session.",
                "duration_minutes": 30,
                "active": True,
            },
        )

        # Availability (single default)
        availability = Availability.objects.first()
        if not availability:
            availability = Availability.objects.create(timezone="Asia/Kolkata")
        else:
            availability.timezone = "Asia/Kolkata"
            availability.save()

        # Weekly rules: Mon-Fri 09:00-17:00
        availability.rules.all().delete()
        rules = []
        for weekday in range(0, 5):  # Mon-Fri
            rules.append(AvailabilityRule(
                availability=availability,
                weekday=weekday,
                start_time=time(9, 0),
                end_time=time(17, 0),
            ))
        AvailabilityRule.objects.bulk_create(rules)

        # Sample booking tomorrow at 10:00 local time for et1
        tz = ZoneInfo(availability.timezone)
        now_local = timezone.now().astimezone(tz)
        tomorrow = (now_local + timedelta(days=1)).date()
        start_local = datetime.combine(tomorrow, time(10, 0), tzinfo=tz)
        start_utc = start_local.astimezone(timezone.UTC)
        end_utc = (start_local + timedelta(minutes=et1.duration_minutes)).astimezone(timezone.UTC)

        Booking.objects.get_or_create(
            event_type=et1,
            start_at=start_utc,
            defaults={
                "end_at": end_utc,
                "booker_name": "Sample User",
                "booker_email": "sample@example.com",
                "status": Booking.Status.CONFIRMED,
            }
        )

        self.stdout.write(self.style.SUCCESS("✅ Seed completed: 2 event types, availability, 1 booking"))
