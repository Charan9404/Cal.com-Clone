from rest_framework import serializers
from .models import EventType, Availability, AvailabilityRule, Booking

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ["id", "title", "description", "duration_minutes", "slug", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

class AvailabilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityRule
        fields = ["id", "weekday", "start_time", "end_time"]
        read_only_fields = ["id"]

class AvailabilitySerializer(serializers.ModelSerializer):
    rules = AvailabilityRuleSerializer(many=True)

    class Meta:
        model = Availability
        fields = ["id", "timezone", "rules", "created_at"]
        read_only_fields = ["id", "created_at"]

    def update(self, instance, validated_data):
        rules_data = validated_data.pop("rules", [])
        instance.timezone = validated_data.get("timezone", instance.timezone)
        instance.save()

        # replace rules (simple MVP)
        instance.rules.all().delete()
        AvailabilityRule.objects.bulk_create([
            AvailabilityRule(
                availability=instance,
                weekday=r["weekday"],
                start_time=r["start_time"],
                end_time=r["end_time"],
            )
            for r in rules_data
        ])
        return instance

class BookingSerializer(serializers.ModelSerializer):
    event_type_slug = serializers.CharField(source="event_type.slug", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "booking_uid", "event_type", "event_type_slug",
            "booker_name", "booker_email",
            "start_at", "end_at", "status", "created_at"
        ]
        read_only_fields = ["id", "booking_uid", "created_at"]
