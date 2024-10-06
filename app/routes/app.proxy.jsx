import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import {
  getDevolutionById,
  createDevolution,
 } from "../server/Devolution.server";


export const loader = async ({ request, params }) => {
  const { session, storefront } = await authenticate.public.appProxy(request);

  if (!session || !storefront) {
    return new Response("Unauthorized", { status: 401 });
  }


  if ( request.method == "GET") {
    console.log("GET request");

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Bad Request: Missing ID", { status: 400 });
    }

    const devolution = await getDevolutionById(String(id), storefront.graphql);

    return json({ devolution });

  }

};

export const action = async ({ request }) => {

  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }


  if (request.method == "POST"){

    try {
      const data = await request.json();
      const newDevolution = await createDevolution(data);

      if (!newDevolution) {
        return new Response(`Error al crear la devolución: ${error}`, { status: 500 });
      }

      return json({ devolution: newDevolution });

    } catch (error) {
      return new Response(`Error interno del servidor: ${error}`, { status: 500 });
    }

  }

};
