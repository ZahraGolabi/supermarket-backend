from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class NestStylePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100
    page_query_param = 'page'

    def get_paginated_response(self, data):
        total_pages = (self.page.paginator.count + self.page_size - 1) // self.page_size
        return Response(
            {
                'data': data,
                'meta': {
                    'itemsPerPage': self.page.paginator.per_page,
                    'totalItems': self.page.paginator.count,
                    'currentPage': self.page.number,
                    'totalPages': max(total_pages, 1),
                },
                'links': {
                    'current': self.request.build_absolute_uri(),
                },
            }
        )
