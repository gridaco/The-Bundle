import { packdata } from "@/data";
import { stripe } from "@/s/stripe";
import getHost from "@/s/utils/get-host";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      matpack: string;
      objpack: string;
    };
  }
) {
  const host = getHost(request);

  const { label, images, matpack, objpack, page } = packdata(params);
  const _product_name = label;
  const _product_images = [images.thumbnail.srcabs];
  const _product_price = 2000;

  const session = await checkout_signle_pack({
    product_name: _product_name,
    product_images: _product_images,
    product_price: _product_price,
    success_url: `${host}/library/${matpack.id}/${objpack.id}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${host}${page}`,
  });

  return NextResponse.redirect(session.url!);
}

async function checkout_signle_pack({
  product_name,
  product_images,
  product_price,
  success_url,
  cancel_url,
}: {
  product_name: string;
  product_images: string[];
  product_price: number;
  success_url: string;
  cancel_url: string;
}) {
  console.log({
    success_url,
    cancel_url,
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product_name,
            images: product_images,
          },
          unit_amount: product_price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: success_url,
    cancel_url: cancel_url,
  });

  return session;
}
