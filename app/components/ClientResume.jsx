import React from 'react'
import {
  Card,
  Text
} from '@shopify/polaris'

function ClientResume({purchase_number, ticket_number}) {
  <Card>

    <Text variant='headingMd' as='h1'>
      Resumen de cliente
    </Text>

    <Text variant="headingSm" as="h2">
        Compras realizadas
    </Text>
    <Text variant="bodySm" as="p">
        <p style={{color: "#4469ff"}}>{purchase_number}</p>
    </Text>

    <Text variant="headingSm" as="h2">
        Devoluciones realizadas
    </Text>
    <Text variant="bodySm" as="p">
      <p style={{color: "#4469ff"}}>{ticket_number}</p>
    </Text>

  </Card>
}

export default ClientResume;
