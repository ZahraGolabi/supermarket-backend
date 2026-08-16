from django.core.management.base import BaseCommand

from accounts.models import User, UserRole
from django.conf import settings


class Command(BaseCommand):
    help = 'Seed owner user for admin panel and API'

    def handle(self, *args, **options):
        phone = settings.OWNER_PHONE
        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                'role': UserRole.OWNER,
                'first_name': 'Owner',
                'last_name': 'SnapShop',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if not created:
            user.role = UserRole.OWNER
            user.is_staff = True
            user.is_superuser = True
            user.save()

        user.set_password('admin1234')
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Owner seeded: {phone} / admin1234'))
