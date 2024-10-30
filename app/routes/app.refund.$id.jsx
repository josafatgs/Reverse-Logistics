import { json } from "@remix-run/node";
import React from "react";
import { useState, useCallback } from 'react';
import { useLoaderData, useActionData, useFetcher } from "@remix-run/react";
import {
  Page,
  Card,
  TextField,
  Form,
  FormLayout,
  Button,
  ButtonGroup,
  Badge,
  Grid,
  Text,
  DataTable,
  Divider,
  Thumbnail,
  Modal,
  Select,
  Layout,
  Box,
  DropZone,
  InlineStack,
  InlineGrid,
  Banner,
  List,
  RadioButton
} from "@shopify/polaris";
import {
  SaveBar,
  useAppBridge
} from '@shopify/app-bridge-react';

import { authenticate } from "../shopify.server";

import {
  getDevolutionById,
  updateRequiresLabel,
  updateShippingPayment,
  updateStatus,
  updateSubsidiary,
  updateComentarios,
  updateCreditNote,
  updateWallet,
  updateValue,
  updateSubsidiaryToGo,
  addEvent
} from '../server/Devolution.server';

import DevolutionSection from "../components/DevolutionSection";
import Order from "../components/Order";
import Products from "../components/Products";
import Cronology from "../components/Cronology";


export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const devolution = await getDevolutionById(params.id, admin.graphql);

  const items = devolution.items;

  const itemDetails = [];
  for (const item of items) {
    if (!item.sku) {
      //console.log(`Item with no SKU found: ${JSON.stringify(item)}`);
      itemDetails.push({ [item.sku]: null });
      continue;
    }

    const query = `#graphql
      query productInfo{
        products(first: 1, query: "sku:${item.sku}") {
          edges {
            node {
              id
              title
              media(first: 1) {
                edges {
                  node {
                    alt
                    ... on MediaImage {
                      image {
                        url
                      }
                    }
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    sku
                    price
                  }
                }
              }
            }
          }
        }
      }`;

    try {
      const response = await admin.graphql(query);
      const data = await response.json();

      if (!data || !data.data || data.data.products.edges.length === 0) {
        //console.log(`Product not found for SKU: ${item.sku}`);
        itemDetails.push({ [item.sku]: null });
        continue;
      }

      itemDetails.push({ [item.sku]: data.data });
    } catch (error) {
      console.error(`Error fetching product for SKU: ${item.sku}`, error);
      itemDetails.push({ [item.sku]: null });
    }
  }

  return json({
    devolution,
    itemDetails,
  });
}




export async function action({ request, params }) {

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  switch (actionType) {
    case "updateDevolution":
      const status = formData.get("statusSelect");
      const subsidiary = formData.get("subsidiarySelect");
      const paymentDone = formData.get("paymentDone");
      const requieredShipping = formData.get("requiredShipping");
      const commentaries = formData.get("comentarios");
      const wallet = formData.get("wallet");
      const creditNote = formData.get("ndc");
      const money = formData.get("value");
      const subsidiaryToGo = formData.get("subsidiaryToGo");

      await updateStatus(params.id, status);
      await updateSubsidiary(params.id, subsidiary);
      await updateRequiresLabel(params.id, requieredShipping);
      await updateShippingPayment(params.id, paymentDone);
      await updateComentarios(params.id, commentaries);
      await updateCreditNote(params.id, creditNote);
      await updateWallet(params.id, wallet);
      await updateValue(params.id, money);
      await updateSubsidiaryToGo(params.id, subsidiaryToGo);


      break;

    case "addEvent":
      const ticketId = formData.get("ticketId");
      const description = formData.get("description");
      const date = formData.get("date");

     await addEvent(ticketId, description, date);

      break;

  }

  return json({ sucess: true});

}

export default function Refund() {

  const shopify = useAppBridge()

  const { devolution, itemDetails } = useLoaderData();

  console.log(devolution);

  const handleDiscard = () => {
    shopify.saveBar.hide('my-save-bar');
  };

  const showSaveBar = () => {
    shopify.saveBar.show('my-save-bar');
  };

  const fetcher = useFetcher();

  const handleSave = () => {
    shopify.saveBar.hide('my-save-bar');

    fetcher.submit(
      {
        actionType: "updateDevolution",
        statusSelect: stateSelected,
        subsidiarySelect: subsidiarySelected,
        paymentDone: paymentShipping,
        requiredShipping: requiresShipping == 'shipping' ? true : false,
        comentarios: commentariesText,
        wallet: walletText,
        ndc: creditNoteText,
        value: moneyText,
        subsidiaryToGo: devolutionSubsidiarySelected,
      },
      { method: "post" }
    );
  };





  // ======================= DEVOLUTION SECTION ===========================
  const [paymentShipping, setPaymentShipping] = useState(devolution.shippingPayment);
  const handlePaymentShipping = useCallback(
    (newChecked) => {setPaymentShipping(newChecked);},
    [],
  );

  const [requiresShipping, setRequireShipping] = React.useState(devolution.requiresLabel ? 'shipping' : 'noShipping');
  const handleRequiresShipping = useCallback(
    (_, newValue) => {setRequireShipping(newValue);},
    []
  );

  const [devolutionSubsidiarySelected, setDevolutionSubsidiarySelected] = useState(devolution.subsidiaryToGo); //Get from db if exists
  const handleDevolutionSubsidiarySelected = useCallback(
    (value) => setDevolutionSubsidiarySelected(value),
    [],
  );

  const [fileShipping, setFile] = useState();
  const handleDropZoneShipping = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile(acceptedFiles[0]),
    [],
  );

  // ================== END DEVOLUTION SECTION ========================


  const handleArticlesList = devolution.items.map((item, index) => {
    try {

      const foundItem = itemDetails.find(detail => detail[item.sku] !== undefined);

      if (!foundItem) {
        console.error(`Item con SKU ${item.sku} no encontrado en itemDetails.`);
        return null;
      }

      const productData = foundItem[item.sku]?.products?.edges?.[0]?.node;

      if (!productData) {
        console.error(`Datos del producto para SKU ${item.sku} no encontrados.`);
        return null;
      }

      const price = productData.variants?.edges?.[0]?.node?.price ?? 'N/A';
      const url = productData.media?.edges?.[0]?.node?.image?.url ?? '';
      const alt = productData.media?.edges?.[0]?.node?.alt ?? 'Sin descripción';
      const title = productData.title ?? 'Producto sin título';

      //console.log(productData);

      return Products(item.quantity, url, alt, price, title, index);

    } catch (error) {

      console.error(`Error procesando el item con SKU ${item.sku}:`, error);
      return null; // En caso de error, retorna null para evitar fallos en el renderizado

    }
  });


  const formatDate = (dateString) => {

    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;

  };

  // State of the invoice
  const [stateSelected, setSelected] = useState(devolution.status);
  const handleStateSelected = useCallback(
    (value) => setSelected(value),
    [],
  );
  const stateOptions = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En camino', value: 'En camino' },
    { label: 'En revision', value: 'En revision' },
    { label: 'Aceptado', value: 'Aceptado' },
    { label: 'Rechazado', value: 'Rechazado' },
  ];

  const [subsidiarySelected, setSubsidiarySelected] = useState(devolution.sucursal);
  const subsidiaryOptions = [
    { label: 'En Linea', value: 'En Linea' },
    { label: 'Cedis', value: 'Cedis' },
    { label: 'Puebla', value: 'Puebla' },
    { label: 'Queretaro', value: 'Queretaro' },
    { label: 'Tijuana', value: 'Tijuana' },
    { label: 'Coacalco', value: 'Coacalco' },
    { label: 'Toreo', value: 'Toreo' }
  ];
  const handleSubsidiarySelected = useCallback(
    (value) => setSubsidiarySelected(value),
    [],
  );


  // ================== RESOLUTION SECTION ============================

  const [creditNoteText, setCreditNoteText] = useState(devolution.ndc);
  const handleCreditNoteText = useCallback((value) => {
    setCreditNoteText(value);
    setWalletText("");
  }, []);

  const [walletText, setWalletText] = useState(devolution.monedero);
  const handleWalletText = useCallback((value) => {
    setWalletText(value); setCreditNoteText("");
  }, []);

  const [moneyText, setMoneyText] = useState(devolution.value);
  const handleMoneyText = useCallback((value) => setMoneyText(value), []);

  const [commentariesText, setCommentariesText] = useState(devolution.comentarios)
  const handleCommentariesText = useCallback((value) => setCommentariesText(value), []);

  const [filesResolution, setFiles] = useState([]);
  const [rejectedResolutionFiles, setRejectedResolutionFiles] = useState([]);
  const hasError = rejectedResolutionFiles.length > 0;

  const handleDropZoneDrop = useCallback(
    (_droppedFiles, acceptedFiles, rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedResolutionFiles(rejectedFiles);
    },
    [],
  );

  const errorMessage = hasError && (
    <Banner title="Las siguientes imanges no pudieron subirse:" tone="critical">
      <List type="bullet">
        {rejectedResolutionFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" no es soportada. El archivo debe ser .jpg, .png.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  const fileUploadResolution = !filesResolution.length && <DropZone.FileUpload actionTitle="Cargar Imagenes" actionHint="Accepts .jpg, and .png" />;
  const uploadedFilesResolution = filesResolution.length > 0 && (
    <div style={{ display: 'grid', width: '100%', height: '100%', placeContent: 'center' }}>
      <InlineStack>
        {filesResolution.map((file, index) => (
          <InlineStack key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={window.URL.createObjectURL(file)}
            />
            <div>
              {file.name}{' '}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </InlineStack>
        ))}
      </InlineStack>
    </div>
  );

  // =============== END RESOLUTION SECTION ============================

  // =============== START CRONOLOGY SECTION ===========================

  const [ newEventNote,setNewEventNote ] = useState("");
  const handleNewNoteEventChange = useCallback(
    (event) => {
      setNewEventNote(event.target.value);
    },
    []
  );

  function formatRowMarkup(array) {
    return array.map(( {createdAt, description} ) =>{
      return(
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2rem',
        }}
        >
          <div style={{
              display: 'grid',
              placeContent: 'center',
              width: '1.25rem', // w-5
              height: '1.25rem', // h-5
              borderRadius: '0.375rem', // rounded-md
              backgroundColor: '#e5e7eb', // bg-gray-200
            }}
            >
            <div style={{
              width: '0.5rem', // w-2
              height: '0.5rem', // h-2
              borderRadius: '0.125rem', // rounded-sm
              backgroundColor: '#374151', // bg-gray-700
            }}
            ></div>

          </div>
          <div>
            <Text variant='bodyMd' fontWeight='medium'>{description}</Text>
            <Text variant='bodySm'>{formatDate(createdAt)}</Text>
          </div>
        </div>
      );
    });
  }


  const [ events, setEvents ] = useState(devolution.event);

  const handleAddEvent = useCallback( async () => {
    if (newEventNote) {

      const response = await fetcher.submit(
        {
          actionType: "addEvent",
          description: newEventNote,
          date: new Date().toISOString(),
          ticketId: devolution.id,
        },
        { method: "POST" }
      );


      const newEvent = {
        createdAt: new Date().toISOString(),
        description: newEventNote,
      };

      setEvents((prevEvents) => [newEvent, ...prevEvents]);
      setNewEventNote("");

    }
  }, [newEventNote]);

  let rowMarkupEvents = formatRowMarkup(events);

  // =============== END CRONOLOGY SECTION =============================


  return (
    <Page

      backAction={{ content: 'Volver', url: '/app' }}
      title={`#${devolution.id}`}
      compactTitle
      titleMetadata={
        <InlineStack gap={'100'}>
          {stateSelected == "Pendiente" ? (
            <Badge progress="complete" tone="critical">{stateSelected}</Badge>
          ) : stateSelected == "En revision" ? (
            <Badge progress="complete" tone="attention">{stateSelected}</Badge>
          ) : stateSelected == "En camino" ? (
            <Badge progress="complete" tone="info">{stateSelected}</Badge>
          ) : stateSelected == "Aceptado" ? (
            <Badge progress="complete" tone="success">{stateSelected}</Badge>
          ) : stateSelected == "Rechazado" ? (
            <Badge progress="complete" tone="critical">{stateSelected}</Badge>
          ) : null}
          <Badge>{subsidiarySelected}</Badge>
          <Badge>{devolution.mainReason}</Badge>
        </InlineStack>
      }
      subtitle={formatDate(devolution.createdAt)}
      primaryAction={
        <Button variant="primary" onClick={showSaveBar}>Guardar</Button>
      }
    >

      <SaveBar id="my-save-bar">
        <button variant="primary" onClick={handleSave}></button>
        <button onClick={handleDiscard}></button>
      </SaveBar>

      <Layout>
        <Layout.Section>
          <Card >

            {stateSelected == "Pendiente" ? (
              <Badge progress="complete" tone="critical">{stateSelected}</Badge>
            ) : stateSelected == "En revision" ? (
              <Badge progress="complete" tone="attention">{stateSelected}</Badge>
            ) : stateSelected == "En camino" ? (
              <Badge progress="complete" tone="info">{stateSelected}</Badge>
            ) : stateSelected == "Aceptado" ? (
              <Badge progress="complete" tone="success">{stateSelected}</Badge>
            ) : stateSelected == "Rechazado" ? (
              <Badge progress="complete" tone="critical">{stateSelected}</Badge>
            ) : null}

            <Divider borderColor="transparent" borderWidth={'100'} />

            <Box
              borderColor="border"
              borderWidth="025"
              borderRadius="300"
            >

              <Box padding="200">

                <Box paddingBlock="100">
                  <Text as="p" variant="bodySm" fontWeight='medium'>
                    Fecha en que el cliente recibió el producto
                  </Text>
                  <Text as="p" variant="bodySm">
                    {formatDate(devolution.dateProductArrive)}
                  </Text>
                </Box>

                <Box paddingBlock="100">
                  <Text as="p" variant="bodySm" fontWeight='medium'>
                    Motivos
                  </Text>


                  <Text as="p" variant="bodySm">
                    {devolution.mainReason}: {devolution.explanation}
                  </Text>
                </Box>

              </Box>

              <Divider />

              <Box paddingBlockEnd={'200'}>

                <Box>
                  { handleArticlesList }
                </Box>

              </Box>

            </Box>


          </Card>

          {/*
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />

          <DevolutionSection
            isPaymentDone={paymentShipping}
            onPaymentChange={handlePaymentShipping}
            optionValue={requiresShipping}
            onOptionChange={handleRequiresShipping}
            onFileDrop={handleDropZoneShipping}
            file={fileShipping}
            subsiOptions={subsidiaryOptions}
            subsidiarySelected={devolutionSubsidiarySelected}
            handleSubsidiarySelected={handleDevolutionSubsidiarySelected}
          />
          */}

          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />

          <Card roundedAbove="sm" padding={'0'}>
            <Box padding={'400'}>

              <Box borderStartEndRadius={'200'}>
                <Box>

                  {stateSelected == 'Aceptado' && (
                    <Box padding={'200'}>
                      <InlineGrid columns={2} gap={'1000'}>
                        <Grid.Cell>
                          <TextField
                            label="Nota de Credito"
                            value={creditNoteText}
                            onChange={handleCreditNoteText}
                            autoComplete="off"
                            placeholder="#"
                          />
                        </Grid.Cell>

                        <Grid.Cell>
                          <TextField
                            label="Monedero"
                            value={walletText}
                            onChange={handleWalletText}
                            autoComplete="off"
                            prefix="#"
                          />
                        </Grid.Cell>
                      </InlineGrid>

                      <InlineGrid columns={2} gap={'1000'}>
                        <Grid.Cell>
                          <TextField
                            label="Valor"
                            value={moneyText}
                            onChange={handleMoneyText}
                            autoComplete="off"
                            prefix="$ MXN"
                          />
                        </Grid.Cell>
                      </InlineGrid>


                      <Divider borderColor="transparent" borderWidth={'100'} />
                      <Divider borderColor="transparent" borderWidth={'100'} />
                      <Divider borderColor="transparent" borderWidth={'100'} />
                      <Divider borderColor="transparent" borderWidth={'100'} />
                    </Box>
                  )}

                </Box>
              </Box>

            </Box>

            <Divider />

            <Box padding={'400'}>

              {stateSelected == 'Rechazado' && (
                <>
                  <TextField
                    label="Comentarios"
                    value={commentariesText}
                    multiline={6}
                    onChange={handleCommentariesText}
                    autoComplete="off"
                  />

                  <Box>
                    {errorMessage}
                    <DropZone label="Imagenes" accept="image/*" type="image" onDrop={handleDropZoneDrop}>
                      {uploadedFilesResolution}
                      {fileUploadResolution}
                    </DropZone>
                  </Box>
                </>
              )}

            </Box>
          </Card>

          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />

          <Cronology
            handleAddEvent={handleAddEvent}
            newEventNote={newEventNote}
            handleNewNoteEventChange={handleNewNoteEventChange}
            rowMarkupEvents={rowMarkupEvents}
          />

        </Layout.Section>

        <Layout.Section variant="oneThird">

          <Order
            ticketNumber={devolution.ticketNumber}
            orderNumber={devolution.orderNumber}
            clientNumber={devolution.clientNumber}
            clientPhone={devolution.contacto}
          />

          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />
          <Divider borderColor="transparent" borderWidth={'100'} />

          <Card >
            <FormLayout>
              <Select
                label="Estado"
                options={stateOptions}
                value={stateSelected}
                onChange={handleStateSelected}
              />
              <Select
                label="Sucursal"
                options={subsidiaryOptions}
                value={subsidiarySelected}
                onChange={handleSubsidiarySelected}
              />
            </FormLayout>
          </Card>

        </Layout.Section>
      </Layout>

    </Page>
  );
}
