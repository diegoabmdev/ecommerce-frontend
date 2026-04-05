// src/app/api/checkout/route.ts
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  const body = await request.json();
  const { items } = body;

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: items.map((item: any) => ({
        id: item.product.id.toString(),
        title: item.product.title,
        quantity: item.quantity,
        unit_price: Math.round(Number(item.product.price * 850)),
        currency_id: 'CLP'
      })),
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/cart`,
        pending: `${baseUrl}/pending`,
      },
      auto_return: 'approved',
    }
  });

  return NextResponse.json({ init_point: result.init_point });
}