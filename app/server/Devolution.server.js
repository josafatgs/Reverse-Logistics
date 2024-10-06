import db from "../db.server";

export async function createDevolution(devolutionData) {
  try {

    const res = await db.devolution.create({
        data: {
            sucursal: devolutionData.subsidiary,
            mainReason: devolutionData.main_reason,
            explanation: devolutionData.explanation,
            ticketNumber: devolutionData.ticket_number,
            clientNumber: devolutionData.client_number,
            orderNumber: devolutionData.order_number != "" ? devolutionData.order_number : 0,
            dateProductArrive: new Date(devolutionData.date_product_arrived),
            contacto: devolutionData.phone_number,
        },
    });

    const itemsData = devolutionData.items.map((item) => ({
        sku: item.sku,
        quantity: item.cantidad,
        devolutionId: res.id,
    }));

    await db.devolution_Item.createMany({
        data: itemsData,
    });

    console.log(res);
    return res;

  } catch (error) {
      console.error('Error creating devolution:', error);
      return null;
  }

}

export async function getDevolutions(graphql) {
  const devolutions = await db.devolution.findMany({
      orderBy: { createdAt: "desc" }
  });

  if (devolutions.length === 0) return [];

  return devolutions;
}

export async function getDevolutionById(devolutionId, graphql) {

    try {
      const devolution = await db.devolution.findUnique({
        where: { id: Number(devolutionId) },
        include: {
          items: true,
          event: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      console.log(devolution);

      return devolution;

    } catch (error) {

      return error;
    }
}

export async function updateStatus(devolutionId, status) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { status: status }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateSubsidiary(devolutionId, subsidiary) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { sucursal: subsidiary }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateShippingPayment(devolutionId, shippingPayment) {

    try {

        const value = shippingPayment == 'true' ? true : false;

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { shippingPayment: value }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}


export async function updateRequiresLabel(devolutionId, requiereLabel) {

    try {

        const value = requiereLabel == 'true' ? true : false;

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { requiresLabel: value }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}


export async function updateCreditNote(devolutionId, ndc) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { ndc: ndc }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }

}

export async function updateWallet(devolutionId, wallet){
    try {
        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { monedero: wallet }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateValue(devolutionId, value){
    try {
        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { value: Number(value) }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateComentarios(devolutionId, comentarios){
    try {
        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { comentarios: comentarios }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateSubsidiaryToGo(devolutionId, subsidiaryToGo){
    try {
        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { subsidiaryToGo: subsidiaryToGo }
        });

        // Delete on Production
        console.log(res);
        return res;

    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}


export async function addEvent(ticketId, description, date) {
  try {

    // Verificar si la devolución existe
    const devolution = await db.devolution.findUnique({
      where: { id: Number(ticketId) },
    });

    if (!devolution) {
      throw new Error(`Devolution with id ${devolutionId} does not exist`);
    }

    // Crear el evento relacionado con la devolución
    const newEvent = await db.event.create({
      data: {
        devolutionId: Number(ticketId),
        description: description,
        createdAt: date
      },
    });

    console.log('Event created successfully:', newEvent);
    return newEvent;

  } catch (error) {
    console.log('Event Error', error);
    return error;
  }
}
