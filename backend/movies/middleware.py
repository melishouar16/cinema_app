import logging
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin  # fournit methodes par défaut __init__ __call__  poru aps ecrire manuellement
from rest_framework import status

logger = logging.getLogger(__name__)

class CinemaAPIMiddleware(MiddlewareMixin):

    def process_exception(self, request, exception):
        logger.error (f"Erreur Cinema API - {request.path} - {str(exception)}")

        if request.path.startswith('/api/'):
            return JsonResponse({
                'error' : 'une erreur est apparue',
                'message': str(exception),
                'status_code': 500
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return None
