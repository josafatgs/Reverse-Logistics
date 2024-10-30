document.addEventListener("DOMContentLoaded", (event) => {

  const data = {
    "subsidiary": "",
    "main_reason": "",
    "explanation": "",
    "ticket_number": "",
    "client_number": "",
    "order_number": "",
    "items": [],
    "date_product_arrived": "",
    "phone_number": ""
  };

  function validateField(value, fieldName) {
    if (value === "") {
        alert(`El campo ${fieldName} es obligatorio.`);
        return false;
    }
    return true;
  }

  function clearData() {
    // Limpiar los datos
    data.subsidiary = "";
    data.main_reason = "";
    data.explanation = "";
    data.ticket_number = "";
    data.client_number = "";
    data.order_number = "";
    data.items = [];
    data.date_product_arrived = "";
    data.phone_number = "";

    document.getElementById('ticket-input').value = "";
    document.getElementById('order-input').value = "";
    document.getElementById('client-number').value = "";
    document.getElementById('reason-input').value = "";
    document.getElementById('subsidiary-input').value = "";
    document.getElementById('commentaries').value = "";
    document.getElementById('date-input').value = "";
    document.getElementById('sku-input').value = "";
    document.getElementById('qty-input').value = "";
    document.getElementById('phone-number').value = "";

    const productTableBody = document.querySelector('#product-table tbody');
    productTableBody.innerHTML = "";
  }

  function showNextCard(currentCard, nextCard) {
    // Hide the current card
    document.getElementById(`card-${currentCard}`).classList.remove("show");

    // Show the next card
    if (document.getElementById(`card-${nextCard}`)) {
        document.getElementById(`card-${nextCard}`).classList.add("show");
    }
  }

  function showPreviosCard(currentCard) {
    const previosCard = parseInt(currentCard) - 1;

    // Hide the current card
    document.getElementById(`card-${currentCard}`).classList.remove("show");

    // Show the previous card
    if (document.getElementById(`card-${previosCard}`)) {
        document.getElementById(`card-${previosCard}`).classList.add("show");
    }
  }

  function showFolio(info) {

    console.log(info);
    // Limpiar los datos
    clearData();

    // Mostrar folio
    const folio = document.getElementById('folio-number');
    folio.innerHTML = info.id; // Cambiar el número de folio

    // Cambiar mensaje whatsapp
    const anchor = document.getElementById('whatsapp-anchor');
    const url = `https://api.whatsapp.com/send?phone=522211939333&text=Hola, genere un nuevo ticket, por *${info.mainReason}* y mi compra la realice en *PT${info.sucursal}*. Mi número de folio es *${info.id}*.`; // Cambiar el número de teléfono & el número de folio
    anchor.href = url;

    showNextCard(9, 10);
  }

  function sendData() {

    if (document.querySelector('.sucess-info').classList.contains('show-result-info')) {
      document.querySelector('.sucess-info').classList.remove('show-result-info');
    }
    if (document.querySelector('.error-info').classList.contains('show-result-info')) {
      document.querySelector('.error-info').classList.remove('show-result-info')
    }

    const url = window.location.origin + "/apps/store-return/";

    document.getElementById('loading-spinner').style.display = 'block';

    // Enviar los datos a un servidor
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(res => {
        document.getElementById('loading-spinner').style.display = 'none';
        document.querySelector('.sucess-info').classList.add('show-result-info');
        showFolio(res.devolution);
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('loading-spinner').style.display = 'none';
        document.querySelector('.error-info').classList.add('show-result-info');
        showNextCard(9, 10);
    });
  }

  const cards = document.querySelectorAll(".card");
  const nextButtons = document.querySelectorAll("#next-card");
  const previosButtons = document.querySelectorAll("#previus-card");

  // Show the first card on page load
  cards[0].classList.add("show");

  // Event listener for next buttons
  nextButtons.forEach(button => {
    button.addEventListener("click", function() {
        const currentCard = this.getAttribute("data-card");
        const nextCard = parseInt(currentCard) + 1;

        switch (currentCard) {
            case '1':
                const ticketNumber = document.getElementById('ticket-input').value;
                if (validateField(ticketNumber, "Número de Ticket")) {
                    data.ticket_number = ticketNumber;
                    showNextCard(currentCard, nextCard);
                }
                break;
            case '2':
                data.order_number = document.getElementById('order-input').value;
                showNextCard(currentCard, nextCard);
                break;
            case '3':
                const clientNumber = document.getElementById('client-number').value;
                if (validateField(clientNumber, "Número de Cliente")) {
                    data.client_number = clientNumber;
                    showNextCard(currentCard, nextCard);
                }
                break;
            case '4':
                const mainReason = document.getElementById('reason-input').value;
                if (validateField(mainReason, "Motivo de Devolución")) {
                    data.main_reason = mainReason;
                    showNextCard(currentCard, nextCard);
                }
                break;
            case '5':
                const subsidiary = document.getElementById('subsidiary-input').value;
                if (validateField(subsidiary, "Lugar de Compra")) {
                    data.subsidiary = subsidiary;
                    showNextCard(currentCard, nextCard);
                }
                break;
            case '6':
                data.explanation = document.getElementById('commentaries').value;
                showNextCard(currentCard, nextCard);
                break;
            case '7':
                const dateProductArrived = document.getElementById('date-input').value;
                if (validateField(dateProductArrived, "Fecha de Recepción del Producto")) {
                    data.date_product_arrived = dateProductArrived + " 00:00:00.000";
                    showNextCard(currentCard, nextCard);
                }
                break;
            case '8':
                if (validateItems()) {
                    showNextCard(currentCard, nextCard);
                }
                break;
            case '9':
                const phoneNumber = document.getElementById('phone-number').value;
                if (validateField(phoneNumber, "Número de Teléfono")) {
                    data.phone_number = phoneNumber;
                    sendData();
                }
                break;
        }
    });
  });

  function validateItems() {
    if (data.items.length <= 0){
      alert(`No has agregado ningun item para garantía`);
      return false;
    }

    return true;
  }

  // Event listener for previous buttons
  previosButtons.forEach(button => {
    button.addEventListener("click", function() {
        const currentCard = this.getAttribute("data-card");
        showPreviosCard(currentCard);
    });
  });

  // Capturamos el botón y los inputs
  const addProductButton = document.getElementById('add-product-button');
  const skuInput = document.getElementById('sku-input');
  const qtyInput = document.getElementById('qty-input');
  const productTableBody = document.querySelector('#product-table tbody');

  // Evento para agregar productos
  addProductButton.addEventListener('click', () => {
    const sku = skuInput.value;
    const qty = Number(qtyInput.value);

    if (validateField(sku, "SKU") && validateField(qty, "Cantidad")) {

        console.log(data.items);

        const indexIfExist = data.items.findIndex( item => item.sku == sku);

        if (indexIfExist != -1) {

          data.items[indexIfExist].cantidad += qty;

          const rows = productTableBody.getElementsByTagName('tr');
          for (let row of rows) {
            const skuCell = row.getElementsByTagName('td')[0];
            if (skuCell.textContent == sku) {
              const cantidadCell = row.getElementsByTagName('td')[1];
              cantidadCell.textContent = data.items[indexIfExist].cantidad;
              break;
            }
          }

          console.log(indexIfExist);

        } else {

          console.log(indexIfExist);

          data.items.push({ "sku": sku, "cantidad": qty })

          // Crear una nueva fila en la tabla
          const newRow = document.createElement('tr');


          // Crear celdas para SKU y cantidad
          const skuCell = document.createElement('td');
          skuCell.textContent = sku;

          const cantidadCell = document.createElement('td');
          cantidadCell.textContent = qty;

          // Agregar las celdas a la fila
          newRow.appendChild(skuCell);
          newRow.appendChild(cantidadCell);

          // Agregar la fila a la tabla
          productTableBody.appendChild(newRow);

          // Limpiar los inputs después de agregar el producto
          skuInput.value = '';
          qtyInput.value = '';
        }
    }
  });


  const tooltips = document.querySelectorAll(".tooltip");

  tooltips.forEach(tooltip => {
    tooltip.addEventListener( 'click', () => {
      const tooltipText = tooltip.querySelector('.tooltiptext');
      if (tooltipText.classList.contains('show-tooltip')){
        tooltipText.classList.remove('show-tooltip');
      } else {
        tooltipText.classList.add('show-tooltip');
      }
    });
  });
});
