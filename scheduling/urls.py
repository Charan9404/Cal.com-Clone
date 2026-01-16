from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"event-types", views.EventTypeViewSet, basename="event-types")
router.register(r"bookings", views.BookingViewSet, basename="bookings")

urlpatterns = [
    # Admin APIs
    path("", include(router.urls)),
    path("availability/", views.AvailabilityViewSet.as_view({'get': 'list', 'put': 'update'}), name="availability"),

    # Public APIs
    path("public/event-types/<slug:slug>/", views.public_event_type, name="public-event-type"),
    path("public/slots/", views.public_slots, name="public-slots"),
    path("public/bookings/", views.public_create_booking, name="public-create-booking"),
    path("public/bookings/<uuid:uid>/", views.public_booking_detail, name="public-booking-detail"),
]