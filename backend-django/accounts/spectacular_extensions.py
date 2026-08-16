from drf_spectacular.extensions import OpenApiAuthenticationExtension


class CookieJWTAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = 'accounts.authentication.CookieJWTAuthentication'
    name = 'cookieAuth'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'cookie',
            'name': 'X-JWT-ACCESS',
            'description': 'JWT access token stored in httpOnly cookie after verify-by-phone',
        }
