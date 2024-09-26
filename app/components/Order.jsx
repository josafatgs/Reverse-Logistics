import React from "react";
import { Card, Text, Divider } from "@shopify/polaris";

function Order({ orderNumber, ticketNumber, clientNumber, clientPhone }) {
    return (
        <Card>

            <Text variant="headingSm" as="h2">
                No. Pedido
            </Text>
            <Text variant="bodySm" as="p">
                {orderNumber}
            </Text>


            <Text variant="headingSm" as="h2">
                No. Ticket
            </Text>
            <Text variant="bodySm" as="p">
                {ticketNumber}
            </Text>


            <Text variant="headingSm" as="h2">
                No. Cliente
            </Text>
            <Text variant="bodySm" as="p">
                {clientNumber}
            </Text>

            <Text variant="headingSm" as="h2">
                Contacto
            </Text>
            <Text variant="bodySm" as="p">
                {clientPhone}
            </Text>
        </Card>
    );
}

export default Order;
