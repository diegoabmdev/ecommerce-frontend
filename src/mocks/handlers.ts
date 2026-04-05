// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/products', () => {
    return HttpResponse.json([
      { id: 1, title: 'Producto Cacheado' }
    ]);
  }),
  http.get('*/products/category/:slug', ({ params }) => {
    return HttpResponse.json([
      { id: 2, title: `Producto de ${params.slug}` }
    ]);
  })
];