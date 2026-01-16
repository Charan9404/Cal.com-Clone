from datetime import datetime, timedelta, time
from zoneinfo import ZoneInfo
from django.shortcuts import get_object_or_404

from django.utils import timezone as dj_timezone
from django.db import transaction, IntegrityError
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

from .models import EventType, Availability, Booking
from .serializers import (
    EventTypeSerializer,
    AvailabilitySerializer,
    BookingSerializer,
)

class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all().order_by("-created_at")
    serializer_class = EventTypeSerializer

class AvailabilityViewSet(viewsets.ViewSet):
    """
    Single default availability schedule (no login required in assignment).
    """

    def _get_or_create_default(self):
        obj = Availability.objects.first()
        if not obj:
            obj = Availability.objects.create(timezone="Asia/Kolkata")
        return obj

    def list(self, request):
        obj = self._get_or_create_default()
        return Response(AvailabilitySerializer(obj).data)

    def update(self, request, pk=None):
        obj = self._get_or_create_default()
        ser = AvailabilitySerializer(obj, data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

class BookingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Booking.objects.select_related("event_type").order_by("-start_at")
    serializer_class = BookingSerializer

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking.status = Booking.Status.CANCELED
        booking.save(update_fields=["status"])
        return Response({"ok": True})

    def list(self, request, *args, **kwargs):
        # ?type=upcoming|past
        t = request.query_params.get("type", "upcoming")
        now = dj_timezone.now()
        qs = self.get_queryset()
        if t == "past":
            qs = qs.filter(end_at__lt=now)
        else:
            qs = qs.filter(end_at__gte=now)
        ser = self.get_serializer(qs, many=True)
        return Response(ser.data)

# -------- PUBLIC ENDPOINTS --------

@api_view(["GET"])
def public_event_type(request, slug: str):
    try:
        et = EventType.objects.get(slug=slug, active=True)
        return Response(EventTypeSerializer(et).data)
    except EventType.DoesNotExist:
        return Response({"detail": "Event type not found"}, status=404)

@api_view(["GET"])
def public_slots(request):
    """
    GET /api/public/slots?slug=demo-15&date=2026-01-16
    returns: ["2026-01-16T09:00:00+05:30", ...]
    """
    slug = request.query_params.get("slug")
    date_str = request.query_params.get("date")
    if not slug or not date_str:
        return Response({"detail": "slug and date required"}, status=400)

    try:
        et = EventType.objects.get(slug=slug, active=True)
    except EventType.DoesNotExist:
        return Response({"detail": "Event type not found"}, status=404)
    availability = Availability.objects.first()
    if not availability:
        return Response([])

    tz = ZoneInfo(availability.timezone)
    date_obj = datetime.fromisoformat(date_str).date()
    weekday = date_obj.weekday()

    rules = availability.rules.filter(weekday=weekday)
    if not rules.exists():
        return Response([])

    duration = timedelta(minutes=et.duration_minutes)

    # existing confirmed slots for that day (in local tz window)
    day_start_local = datetime.combine(date_obj, time(0, 0), tzinfo=tz)
    day_end_local = day_start_local + timedelta(days=1)

    existing = set(
        Booking.objects.filter(
            event_type=et,
            status=Booking.Status.CONFIRMED,
            start_at__gte=day_start_local.astimezone(dj_timezone.UTC),
            start_at__lt=day_end_local.astimezone(dj_timezone.UTC),
        ).values_list("start_at", flat=True)
    )

    now_utc = dj_timezone.now()

    slots = []
    for r in rules:
        start_local = datetime.combine(date_obj, r.start_time, tzinfo=tz)
        end_local = datetime.combine(date_obj, r.end_time, tzinfo=tz)

        cur = start_local
        while cur + duration <= end_local:
            start_utc = cur.astimezone(dj_timezone.UTC)
            if start_utc >= now_utc and start_utc not in existing:
                slots.append(cur.isoformat())
            cur += duration

    return Response(slots)

@api_view(["POST"])
def public_create_booking(request):
    """
    POST /api/public/bookings/
    { slug, startAt, name, email }
    """
    slug = request.data.get("slug")
    start_at_str = request.data.get("startAt")
    name = request.data.get("name")
    email = request.data.get("email")

    if not all([slug, start_at_str, name, email]):
        return Response({"detail": "slug, startAt, name, email required"}, status=400)

    try:
        et = EventType.objects.get(slug=slug, active=True)
    except EventType.DoesNotExist:
        return Response({"detail": "Event type not found"}, status=404)
    availability = Availability.objects.first()
    if not availability:
        return Response({"detail": "availability not set"}, status=400)

    tz = ZoneInfo(availability.timezone)

    # startAt is expected as ISO string with offset, or local ISO.
    start_local = datetime.fromisoformat(start_at_str)
    if start_local.tzinfo is None:
        start_local = start_local.replace(tzinfo=tz)

    duration = timedelta(minutes=et.duration_minutes)
    end_local = start_local + duration

    start_utc = start_local.astimezone(dj_timezone.UTC)
    end_utc = end_local.astimezone(dj_timezone.UTC)

    try:
        with transaction.atomic():
            booking = Booking.objects.create(
                event_type=et,
                booker_name=name,
                booker_email=email,
                start_at=start_utc,
                end_at=end_utc,
                status=Booking.Status.CONFIRMED,
            )
    except IntegrityError:
        return Response({"detail": "slot already booked"}, status=409)

    return Response(BookingSerializer(booking).data, status=201)


@api_view(["GET"])
def public_booking_detail(request, uid):
    b = get_object_or_404(Booking.objects.select_related("event_type"), booking_uid=uid)
    return Response(BookingSerializer(b).data)