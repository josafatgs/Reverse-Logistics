import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Text,
  InlineGrid,
  Thumbnail,
  Layout
} from '@shopify/polaris';


export default function Products(qty, url, alt, price, title, index) {


  return (
    <Card key={index}>
      <InlineGrid columns={3} gap="050">
        <Box>
          {url && <Thumbnail alt={alt} source={url} />}
        </Box>
        <Box>
          <Text variant="p" fontWeight='bold'>{title}</Text>
        </Box>
        <Box>
          <Text>${price} MXN  x  {qty}</Text>
        </Box>
      </InlineGrid>
    </Card>
  );
}
