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
  ChoiceList,
  TextField,
  RangeSlider
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

  const [itemStrings, setItemStrings] = useState([
    'Todos',
    'Pendientes',
    'En Camino',
    'En Revision',
    'Aceptados',
    'Rechazados',
  ]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},  // Put here function to filter data
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const [selected, setSelected] = useState(0);


  const {mode, setMode} = useSetIndexFiltersMode();

  const [queryValue, setQueryValue] = useState('');


  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );

  const onHandleCancel = () => {};




  const { devolutions } = useLoaderData();
  const navigate = useNavigate();

  const resourceName = {
      singular: 'Devolución',
      plural: 'Devoluciones',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(devolutions);

  const rowMarkup = devolutions.map(
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
  });

  return (

      <Page title="Devoluciones" fullWidth >
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

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'accountStatus':
        return (value).map((val) => `Customer ${val}`).join(', ');
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }

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
}
