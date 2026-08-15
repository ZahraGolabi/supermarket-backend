from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        if isinstance(exc, NotAuthenticated):
            response.data = {'message': str(exc.detail), 'statusCode': 401}
        elif isinstance(exc, PermissionDenied):
            response.data = {'message': str(exc.detail), 'statusCode': 403}
        elif hasattr(exc, 'detail'):
            detail = exc.detail
            if isinstance(detail, list):
                message = detail[0] if detail else 'Validation error'
            elif isinstance(detail, dict):
                first_key = next(iter(detail))
                val = detail[first_key]
                message = val[0] if isinstance(val, list) else str(val)
            else:
                message = str(detail)
            response.data = {'message': message, 'statusCode': response.status_code}
    return response
