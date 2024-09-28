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
  updateSubsidiaryToGo
} from '../server/Devolution.server';

import DevolutionSection from "../components/DevolutionSection";
import Order from "../components/Order";
import Products from "../components/Products";


export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const devolution = await getDevolutionById(params.id, admin.graphql);

  const items = devolution.items;

  const itemDetails = [];
  for (const item of items) {
    if (!item.sku) {
      throw new Error(`Item with no SKU found: ${JSON.stringify(item)}`);
    }

    const response = await admin.graphql(
      `#graphql
      query productInfo($sku: String) {
        products(first: 1, query: $sku) {
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
      }`,
      { sku: "sku: sku-hosted-1" }
    );

    const data = await response.json();
    itemDetails.push({ [item.sku] : data.data});
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

  }

  return json({ success: true });

}

export default function Refund() {

  const { devolution, itemDetails } = useLoaderData();
  console.log(itemDetails);
  const action = useActionData();
  const fetcher = useFetcher();

  const handleSave = () => {
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

  // Show Modal to Save Info
  const [saveModal, setSaveModal] = useState(false);
  const handlerSaveModal = useCallback(() => setSaveModal((saveModal) => !saveModal), []);



  // Articles Map List
  const handleArticles = devolution.items.map((item) => {
    return (
      <>
        <Grid.Cell >
          <Text as="p" variant="bodySm">
            {item.sku}
          </Text>
        </Grid.Cell>
        <Grid.Cell>
          <Text as="p" variant="bodySm">
            {item.quantity}
          </Text>
        </Grid.Cell>
        <Divider borderColor="transparent" borderWidth={'025'} />
        <Divider borderColor="transparent" borderWidth={'025'} />
      </>
    )
  });

  const handleArticlesList = devolution.items.map((item) => {
    const foundItem = items.find(item => item[skuToFind] !== undefined);
    console.log(foundItem);
    const price = foundItem.products.edges[0].node.variants.edges[0].node.price
    const url = foundItem.products.edges[0].node.title.media.edges[0].node.image.url
    const alt = foundItem.products.edges[0].node.title.media.edges[0].node.alt
    const title = foundItem.products.edges[0].node.title


    return (
      Products(item.qty)
    )
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
    { label: 'Cedis', value: 'Cedis' },
    { label: 'Puebla', value: 'Puebla' },
    { label: 'Queretaro', value: 'Queretaro' },
    { label: 'Tijuana', value: 'Tijuana' },
  ];
  const handleSubsidiarySelected = useCallback(
    (value) => setSubsidiarySelected(value),
    [],
  );


  // ================== RESOLUTION SECTION ============================

  const [creditNoteText, setCreditNoteText] = useState(devolution.ndc);
  const handleCreditNoteText = useCallback((value) => setCreditNoteText(value), []);

  const [walletText, setwalletText] = useState(devolution.monedero);
  const handleWalletText = useCallback((value) => setwalletText(value), []);

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
        <Button variant="primary" onClick={handleSave}>Guardar</Button>
      }
    >
      <Layout>
        <Layout.Section>
          <Card>

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

              <Box padding="200">

                {/* <Box paddingBlock="200">
                  <InlineGrid columns={['oneHalf', 'oneHalf']}>
                    <Grid.Cell >
                      <Text as="p" variant="bodySm">
                        SKU
                      </Text>
                    </Grid.Cell>
                    <Grid.Cell>
                      <Text as="p" variant="bodySm">
                        Pza
                      </Text>
                    </Grid.Cell>
                    <Divider borderColor="transparent" borderWidth={'100'} />
                    <Divider borderColor="transparent" borderWidth={'100'} />
                    <Divider borderColor="transparent" borderWidth={'100'} />
                    <Divider borderColor="transparent" borderWidth={'100'} />
                    {handleArticles}
                  </InlineGrid>
                </Box> */}

                <Box paddingBlock="200">
                  { handleArticlesList }
                </Box>

              </Box>

              <Divider />

            </Box>


          </Card>

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
                            placeholder="# Nota de Credito"
                          />
                        </Grid.Cell>

                        <Grid.Cell>
                          <TextField
                            label="Monedero"
                            value={walletText}
                            onChange={handleWalletText}
                            autoComplete="off"
                            placeholder="# Monedero"
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
                            placeholder="$ MXN"
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
