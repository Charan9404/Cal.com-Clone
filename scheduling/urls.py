from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventTypeViewSet,
    AvailabilityViewSet,
    BookingViewSet,
    public_booking_detail,
    public_event_type,
    public_slots,
    public_create_booking,
)

router = DefaultRouter()
router.register(r"event-types", EventTypeViewSet, basename="event-types")
router.register(r"availability", AvailabilityViewSet, basename="availability")
router.register(r"bookings", BookingViewSet, basename="bookings")

urlpatterns = [
    path("api/", include(router.urls)),

    # public
    path("api/public/event-types/<slug:slug>/", public_event_type),
    path("api/public/slots/", public_slots),
    path("api/public/bookings/", public_create_booking),
    path("api/public/bookings/<uuid:uid>/", public_booking_detail),

]
