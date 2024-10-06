import {
  Page,
  IndexTable,
  Card,
  Badge,
  useIndexResourceState,
  Text,
  useBreakpoints,
  IndexFilters,
  useSetIndexFiltersMode,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { getDevolutions } from '../server/Devolution.server'
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { useState, useCallback } from "react";




export async function loader({ request }) {
    const { admin, session } = await authenticate.admin(request);
    const devolutions = await getDevolutions(admin.graphql);

    return json({
        devolutions,
    });
}

export default function ProductRefunds() {

  //======================== LOADER DATA ========================

  const { devolutions } = useLoaderData();
  const navigate = useNavigate();

  const resourceName = {
      singular: 'Ticket',
      plural: 'Tickets',
  };



  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(devolutions);

  // ================== ROW MARKUP ==================

  const devolutionMarkUp = formatRowMarkup(devolutions);

  const [rowMarkup, setRowMarkup] = useState(devolutionMarkUp);
  const handleRowMarkup = useCallback((array) => setRowMarkup(array), []);

  //================= HANDLER FILTERS ==================

  function filterRowMarkup(item) {

    if (item == 'Todos') {

      handleRowMarkup(formatRowMarkup(devolutions));

      return;
    }

    const filteredDevolutions = devolutions.filter( ({ status }) => status === item);

    const newDevolutions = formatRowMarkup(filteredDevolutions);

    handleRowMarkup(newDevolutions);
  }

  function search(query) {

      const filteredDevolutions = devolutions.filter(
        ({ id, status, mainReason, sucursal, explanation, ticketNumber, clientNumber, orderNumber, createdAt }) => {

          const search = query.toLowerCase();
          const idString = id.toString().toLowerCase();
          const statusString = status.toLowerCase();
          const mainReasonString = mainReason.toLowerCase();
          const sucursalString = sucursal.toLowerCase();
          const explanationString = explanation.toLowerCase();
          const ticketNumberString = ticketNumber.toString().toLowerCase();
          const clientNumberString = clientNumber.toString().toLowerCase();
          const orderNumberString = orderNumber.toString().toLowerCase();
          const createdAtString = formatDate(createdAt).toLowerCase();

          return (
            idString.includes(search) ||
            statusString.includes(search) ||
            mainReasonString.includes(search) ||
            sucursalString.includes(search) ||
            explanationString.includes(search) ||
            ticketNumberString.includes(search) ||
            clientNumberString.includes(search) ||
            orderNumberString.includes(search) ||
            createdAtString.includes(search)
          );
        }
      );

      const newDevolutions = formatRowMarkup(filteredDevolutions);

      handleRowMarkup(newDevolutions);
  }

  // ================== FILTERS ==================

  const [itemStrings, setItemStrings] = useState([
    'Todos',
    'Pendiente',
    'En camino',
    'En revision',
    'Aceptado',
    'Rechazado',
  ]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { filterRowMarkup(item); },  // Put here function to filter data
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const [selected, setSelected] = useState(0);


  const {mode, setMode} = useSetIndexFiltersMode();

  const [queryValue, setQueryValue] = useState('');


  const handleFiltersQueryChange = useCallback(
    (value) => { setQueryValue(value); search(value); },
    [],
  );

  const onHandleCancel = () => {};


  return (

      <Page title="Tickets" fullWidth>
          <Card padding={'0'}>
            <IndexFilters


              queryValue={queryValue}
              queryPlaceholder="Buscando..."
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={() => setQueryValue('')}
              cancelAction={{
                onAction: onHandleCancel,
                disabled: false,
                loading: false,
              }}
              tabs={tabs}
              selected={selected}
              onSelect={setSelected}
              filters={[]}
              appliedFilters={[]}
              onClearAll={() => {}}
              mode={mode}
              setMode={setMode}
              hideFilters
              filteringAccessibilityTooltip="Search (F)"
            />
              <IndexTable
              condensed={useBreakpoints().mdOnly}
              resourceName={resourceName}
              itemCount={devolutions.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                  {title:'Folio'},
                  {title:'Fecha'},
                  {title:'Estatus'},
                  {title:'Motivo'},
                  {title:'Pedido'},
                  {title:'Ticket'},
                  {title:'Cliente'},
                  {title:'Sucursal'}
              ]}
              // pagination={{
              //   hasNext: true,
              //   onNext: () => { },
              // }}
              >
                  {rowMarkup}
              </IndexTable>
          </Card>
      </Page>
  );

  function formatDate(dateString) {

    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;

  }

  function formatRowMarkup(array) {
    return array.map(
      (
        {id,status,mainReason, sucursal, explanation, ticketNumber, clientNumber, orderNumber, createdAt}
        , index
      ) => {
        return (
          <IndexTable.Row
            id={id}
            key={index}
            selected={selectedResources.includes(id)}
            position={index}
            onClick={() => { navigate(`/app/refund/${id}`) }}
          >
            <IndexTable.Cell>
              <Text variant="bodyMd" fontWeight="bold" as="span">
                #{id}
              </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{formatDate(createdAt)}</IndexTable.Cell>
            <IndexTable.Cell>
              {
                status == "Pendiente" ? <Badge progress={"complete"} tone={"critical"}>{status}</Badge> :
                status == "En revision" ? <Badge progress={"complete"} tone={"attention"}>{status}</Badge> :
                status == "En camino" ? <Badge progress={"complete"} tone={"info"}>{status}</Badge> :
                status == "Aceptado" ? <Badge progress={"complete"} tone={"success"}>{status}</Badge> :
                status == "Rechazado" ? <Badge progress={"complete"}>{status}</Badge>: ""
              }
            </IndexTable.Cell>
            <IndexTable.Cell>{mainReason}</IndexTable.Cell>
            <IndexTable.Cell>{orderNumber}</IndexTable.Cell>
            <IndexTable.Cell>{ticketNumber}</IndexTable.Cell>
            <IndexTable.Cell>{clientNumber}</IndexTable.Cell>
            <IndexTable.Cell>{sucursal}</IndexTable.Cell>
          </IndexTable.Row>
        );
      }
    );
  }
}
