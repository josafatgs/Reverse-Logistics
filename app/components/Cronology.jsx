// import '../tailwind.css';
import React from 'react';
import {
  Card,
  InlineStack,
  Avatar,
  Box,
  Button,
  Divider,
  Text
} from '@shopify/polaris';

function Cronology({

  handleNewNoteEventChange,
  newEventNote,
  handleAddEvent,
  rowMarkupEvents

}){

  return (
    <>
      <Box paddingInline={'400'} paddingBlockEnd={'200'}>
        <Text as='h2' fontWeight='bold' variant='headingMd'>Cronología</Text>
      </Box>
      <Card padding={'0'}>
        <Box padding={'400'}>
          <InlineStack lockAlign='stretch'>
            <div style={{
                width: '10%',
                display: 'grid',
                placeContent: 'center',
              }}
              >
              <Avatar customer size='xl' />
            </div>
            <div style={{ width: "90%", display: 'grid', placeItems: 'center' }}>
              <textarea
                value={newEventNote}
                onChange={handleNewNoteEventChange}
                placeholder="Dejar un comentario"
                rows={1}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  resize: 'none',
                  outline: 'none',
                  border: 'none',
                  fontFamily: 'Inter'
                }}

              />
            </div>
          </InlineStack>
        </Box>
        <div style={{
            backgroundColor: '#f3f4f6', // bg-gray-100
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            padding: '0.5rem',
          }}
          >
          <Button onClick={handleAddEvent} disabled={newEventNote == ""} size='slim'>Guardar</Button>
        </div>
      </Card>

      <Box paddingBlockStart={'600'}>

        <div style={{
          height: `${rowMarkupEvents.length * 100}px`,
          width: '2px',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.375rem',
          position: 'relative',
          left: '60px'}}></div>

        <div style={{ top: `-${rowMarkupEvents.length * 90}px`, position:'relative', zIndex:10, left: '50px' }}>
          {rowMarkupEvents}
        </div>

      </Box>


    </>


  );
};

export default Cronology;
