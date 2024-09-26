import React from 'react';
import {Box, Card, Text, Divider, RadioButton, BlockStack, Select, DropZone, Thumbnail, InlineStack, Checkbox } from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

/**
 * Enviar datos a la bd cuando se guarda
 * Obtener datos de la bd y mostrar datos si existen
*/

function DevolutionSection({

  isPaymentDone,
  onPaymentChange,
  optionValue,
  onOptionChange,
  onFileDrop,
  file,
  subsiOptions,
  subsidiarySelected,
  handleSubsidiarySelected

}) {


  const fileUploadShipping = !file && <DropZone.FileUpload actionTitle='Subir guía' actionHint='Solo se admiten archivos .pdf'/>;
  const uploadedFileShipping = file && (
      <div style={{display: 'grid', width: '100%', height: '100%', placeContent: 'center'}}>
          <InlineStack>
            <Thumbnail
            size="small"
            alt={file.name}
            source={ NoteIcon }
            />

            <div>
            {file.name}
            <Text variant="bodySm" as="p">
                {file.size} bytes
            </Text>
          </div>

      </InlineStack>
      </div>
  )

  return (
    <Card roundedAbove="sm" padding={'0'}>

      <Box padding={'400'}>
        <Text as="h1" variant={'headingMd'}>
            Opciones de devolucion de envios
        </Text>
        <Checkbox
          label="Guia Pagada"
          checked={isPaymentDone}
          onChange={onPaymentChange}
        />
      </Box>

      <Divider/>

      { isPaymentDone && (

      <Box padding={'400'}>
            <Box>
              <RadioButton
                label="Subir etiqueta de devolucion"
                helpText="Sube la etiqueta de devolucion para que el cliente pueda enviar el producto"
                checked={optionValue === 'shipping'}
                id="shipping"
                name="Shipping Label"
                onChange={onOptionChange}
              />

              { optionValue === 'shipping' && (
                <Box paddingBlockStart={'400'}>
                  <DropZone accept='application/pdf' errorOverlayText="File type must be .pdf" allowMultiple={false} onDrop={onFileDrop}>
                    {uploadedFileShipping}
                    {fileUploadShipping}
                  </DropZone>
                </Box>
              )}

            </Box>
      </Box>
      )}

      <Divider/>

      <Box padding={'400'}>
            <Box>
              <RadioButton
                label="No se requiere envio"
                checked={optionValue === 'noShipping'}
                id="noShipping"
                name="Shipping Label"
                onChange={onOptionChange}
              />

              { optionValue === 'noShipping' && (
                <Box padding={'0'} paddingBlockStart={'100'}>
                  <Select
                    label="La entrega del producto se hára en sucursal"
                    options={subsiOptions}
                    value={subsidiarySelected}
                    onChange={handleSubsidiarySelected}
                  />
                </Box>
              )}
            </Box>
      </Box>


    </Card>
  );
}

export default DevolutionSection;
