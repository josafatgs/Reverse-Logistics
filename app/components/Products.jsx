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
    <div key={index} style={{ width: '100%', display: 'flex', justifyContent: 'start', gap: '20px', alignItems: 'center', borderBottom: '1px solid #f4f4f4', paddingTop: '5px', paddingBottom: '5px', paddingInline: '20px' }}>
        <Thumbnail size='medium' source={url} alt={alt} />
        <Text as="strong" variant="bodySm">{title}</Text>
        <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
          <Text as="p" variant="bodySm">$ {price} X {qty}</Text>
        </div>
    </div>
  );
}
