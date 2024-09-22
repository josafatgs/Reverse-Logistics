const data = {
    "subsidiary": "",
    "main_reason": "",
    "explanation": "",
    "ticket_number": "",
    "client_number": "",
    "order_number": "",
    "items": [],
    "date_product_arrived": ""
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
    document.getElementById('ticket-input').value = "";
    document.getElementById('order-input').value = "";
    document.getElementById('client-number').value = "";
    document.getElementById('reason-input').value = "";
    document.getElementById('subsidiary-input').value = "";
    document.getElementById('commentaries').value = "";
    document.getElementById('date-input').value = "";
    document.getElementById('sku-input').value = "";
    document.getElementById('qty-input').value = "";
    const productTableBody = document.querySelector('#product-table tbody');
    productTableBody.innerHTML = "";

}

const showFolio = (data) => {

    // Limpiar los datos
    clearData();

    // Mostrar folio
    const folio = document.getElementById('folio-number');
    folio.textContent = data.id; // Cambiar el número de folio

    // Cambiar mensaje whatsapp
    const anchor = document.getElementById('whatsapp-anchor');
    const url = `https://api.whatsapp.com/send?phone=573002222222&text=Hola, necesito hacer una devolución. Mi número de folio es ${data.id}.`; // Cambiar el número de teléfono & el número de folio
    anchor.href = url;

}

function sendData() {
    alert("Datos enviados correctamente");
    console.log(data);

    // Enviar los datos a un servidor
    fetch( "http://18.191.127.106:8080/devolution", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showFolio(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getDataFromEndpoint(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON data from the response
        })
        .then(data => {
            console.log(data); // Aquí puedes manejar la respuesta
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function postDataToEndpoint() {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1
    };

    fetch(url, {
        method: 'POST', // Specify the method as POST
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert the data object to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        console.log('Success:', data); // Handle the data
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


const cards = document.querySelectorAll(".card");
const nextButtons = document.querySelectorAll("#next-card");

// Show the first card on page load
cards[0].classList.add("show");

// Event listener for next buttons
nextButtons.forEach(button => {
    button.addEventListener("click", function() {
        const currentCard = this.getAttribute("data-card");
        const nextCard = parseInt(currentCard) + 1;

        switch (currentCard) {
            case '1':
                data.ticket_number = document.getElementById('ticket-input').value;
                break;
            case '2':
                data.order_number = document.getElementById('order-input').value;
                break;
            case '3':
                data.client_number = document.getElementById('client-number').value;
                break;
            case '4':
                data.main_reason = document.getElementById('reason-input').value;
                break;
            case '5':
                data.subsidiary = document.getElementById('subsidiary-input').value;
                break;
            case '6':
                data.explanation = document.getElementById('commentaries').value;
                break;
            case '7':
                data.date_product_arrived = document.getElementById('date-input').value + "00:00:00.000";
                break;
            case '8':
                const sku = document.getElementById('sku-input').value;
                const qty = Number(document.getElementById('qty-input').value);
                data.items.push({ "sku": sku, "cantidad": qty });
                sendData();
                getDataFromEndpoint('https://dogapi.dog/api/v2/breeds');
                postDataToEndpoint();
                break;
        }

        // Hide the current card
        document.getElementById(`card-${currentCard}`).classList.remove("show");

        // Show the next card
        if (document.getElementById(`card-${nextCard}`)) {
            document.getElementById(`card-${nextCard}`).classList.add("show");
        }
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

    data.items.push({ "sku": sku, "cantidad": qty });

    // Validar que los campos no estén vacíos
    if (sku !== "" && qty !== "") {
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
    } else {
        alert("Por favor, llena ambos campos (SKU y Cantidad).");
    }
});



