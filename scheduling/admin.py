from django.contrib import admin
from .models import EventType, Availability, AvailabilityRule, Booking

@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "duration_minutes", "active", "created_at")
    search_fields = ("title", "slug")
    list_filter = ("active",)

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ("timezone", "created_at")

@admin.register(AvailabilityRule)
class AvailabilityRuleAdmin(admin.ModelAdmin):
    list_display = ("availability", "weekday", "start_time", "end_time")
    list_filter = ("weekday",)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("event_type", "start_at", "end_at", "status", "booker_email")
    list_filter = ("status", "event_type")
    search_fields = ("booker_email", "booker_name", "event_type__slug")
