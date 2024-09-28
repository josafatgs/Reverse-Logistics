import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Text,
  InlineGrid
} from '@shopify/polaris';


export default function Products(qty, url, alt, price, title) {


  return (
    <Card>
      <InlineGrid columns={['auto', 'fr']} gap="050">

          {/* <Box>
            <Image alt={product.media.edges[0]?.node?.alt || 'Product image'} source={imageUrl} />
          </Box>

          <Box>
            <Text variant="headingLg">{data.products.edges.node.title}</Text>
            <Text>${data.products.edges.node.variants.edges.node.price}</Text>
            <Text>X {qty}</Text>
          </Box> */}

      </InlineGrid>
    </Card>
  );
}
