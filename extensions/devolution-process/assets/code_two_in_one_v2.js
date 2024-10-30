document.addEventListener("DOMContentLoaded", (event) => {

  const ticket_create = document.querySelector(".devolution-process-section");
  const ticket_check = document.querySelector(".main-section-container");
  const check = document.getElementById("check_button_opt");

  check.addEventListener( "click", () => {
    ticket_create.style.display = "none";
    ticket_check.style.display = "flex";
  });

  /*
  *   Code to Check Ticket Process
  */

  const acceptedSvg = '<svg viewBox="0 -1.5 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>done_mini [#1484]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-304.000000, -366.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="done_mini-[#1484]" points="259 207.6 252.2317 214 252.2306 213.999 252.2306 214 248 210 249.6918 208.4 252.2306 210.8 257.3082 206"> </polygon> </g> </g> </g> </g></svg>';

  const rejectedSvg = '<svg viewBox="0 -0.5 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close_mini [#1522]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-385.000000, -206.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close_mini-[#1522]" points="334.6 49.5 337 51.6 335.4 53 333 50.9 330.6 53 329 51.6 331.4 49.5 329 47.4 330.6 46 333 48.1 335.4 46 337 47.4"> </polygon> </g> </g> </g> </g></svg>';

  let data = {};

  function clear(){
    const progressBar = document.getElementById("progress-bar");
    const pending__svg = document.querySelector(".pending__svg");
    const carrier__svg = document.querySelector(".carrier__svg");
    const review__svg = document.querySelector(".review__svg");
    const result__svg = document.querySelector(".result__svg");

    progressBar.style.width = "0%";
    if (pending__svg.classList.contains("done")) {
      pending__svg.classList.remove("done");
    }
    if (carrier__svg.classList.contains("done")) {
      carrier__svg.classList.remove("done");
    }
    if (review__svg.classList.contains("done")) {
      review__svg.classList.remove("done");
    }
    if (result__svg.classList.contains("done")) {
      result__svg.classList.remove("done");
      result__svg.innerHTML = "";
    }
  }

  function setProgressBar(){

    const progressBar = document.getElementById("progress-bar");
    const pending__svg = document.querySelector(".pending__svg");
    const carrier__svg = document.querySelector(".carrier__svg");
    const review__svg = document.querySelector(".review__svg");
    const result__svg = document.querySelector(".result__svg");



    if ( data.status == "Pendiente") {
      //return "bg-warning";
      progressBar.style.width = "0%";
      pending__svg.classList.add("done");

    } else if(data.status == "En camino") {
      //return "bg-info";
      progressBar.style.width = "33%";
      pending__svg.classList.add("done");
      carrier__svg.classList.add("done");

    } else if(data.status == "En revision") {
      //return "bg-success";
      progressBar.style.width = "68%";
      pending__svg.classList.add("done");
      carrier__svg.classList.add("done");
      review__svg.classList.add("done");

    } else if(data.status == "Rechazado") {
      //return "bg-danger";
      progressBar.style.width = "100%";
      pending__svg.classList.add("done");
      carrier__svg.classList.add("done");
      review__svg.classList.add("done");
      result__svg.classList.add("done");
      result__svg.innerHTML = rejectedSvg;

    } else if(data.status == "Aceptado") {
      //return "bg-primary";
      progressBar.style.width = "100%";
      pending__svg.classList.add("done");
      carrier__svg.classList.add("done");
      review__svg.classList.add("done");
      result__svg.classList.add("done");
      result__svg.innerHTML = acceptedSvg;
    }


  }

  async function getData(folio) {

    clear();

    try {

      const url = window.location.origin + "/apps/store-return/?id=" + folio;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Manejo de errores HTTP
      }

      const data = await response.json();

      return data.devolution; // Devuelve el objeto de devolución

    } catch (error) {
      return null; // Retorna null en caso de error
    }
  }


  async function getDevolutionInfo() {

    const devoluciónValue = document.getElementById("search-input").value;

    const result = await getData(devoluciónValue);


    if (devoluciónValue != "" && result != null) {

      data = result;

      showInfoData();
      setProgressBar();
      handleResultsBox("result");

    } else {
      handleResultsBox("no-result");
    }
  }

  function handleResultsBox(box) {

    const no_result_found = document.querySelector(".no-result-found");
    const result_box = document.querySelector(".result-container");

    if (box == "result") {
      if (!result_box.classList.contains("show")) {
        result_box.classList.add("show");
      }

      if (no_result_found.classList.contains("show")) {
        no_result_found.classList.remove("show");
      }

    } else if (box == "no-result") {

      if (!no_result_found.classList.contains("show")) {
        no_result_found.classList.add("show");
      }

      if (result_box.classList.contains("show")) {
        result_box.classList.remove("show");
      }
    }
  }

  function showInfoData() {

    const statusLabelInfo = document.getElementById("status-info-label");
    const statusInfoPopulated = document.getElementById("status-info-populated");
    const statusInfoCommentaries = document.getElementById("status-info-commentaries");

    if (data.status == "Pendiente") {
      // Show Pending
      statusLabelInfo.innerHTML = "Pendiente";
      statusInfoPopulated.innerHTML = "Tu devolución ha sido registrada y se encuentra en proceso de verficación";
    } else if(data.status == "En camino") {
      // Show Carrier
      statusLabelInfo.innerHTML = "En camino";
      statusInfoPopulated.innerHTML = "Tu devolución ha pasado el primer filtro y se encuentra en camino a nuestras instalaciones";
    } else if(data.status == "En revision") {
      // Show Review
      statusLabelInfo.innerHTML = "En revision";
      statusInfoPopulated.innerHTML = "Tu devolución ha llegado a nuestras instalaciones y se encuentra en proceso de revisión";
    } else if(data.status == "Rechazado") {
      // Show Result
      statusLabelInfo.innerHTML = "Rechazado";
      statusInfoPopulated.innerHTML = "Tu devolución ha sido rechazada";
      statusInfoCommentaries.innerHTML = data.comentarios;
    } else if(data.status == "Aceptado") {
      // Show Result
      statusLabelInfo.innerHTML = "Aceptado";
      statusInfoPopulated.innerHTML = "Tu devolución ha sido aceptada";

      if (data.ndc != "" & data.monedero == ""){
        statusInfoCommentaries.innerHTML = "Tienes una nota de credito " + `<strong class="important-text">#${data.ndc}</strong>` + " con valor de " + `<strong class="important-text">$ ${data.value}</strong>`
      } else if (data.monedero != "" & data.ndc == "") {
        statusInfoCommentaries.innerHTML = "Tienes un monedero " + `<strong class="important-text">#${data.ndc}</strong>` + " con valor de " + `<strong class="important-text">$ ${data.value}</strong>`
      }
    }

  }

  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", getDevolutionInfo);


  /*
  *   Code to Create Ticket Process
  */

  const data_to_save = {
    "subsidiary": "",
    "main_reason": "",
    "explanation": "",
    "ticket_number": "",
    "client_number": "",
    "order_number": "",
    "items": [],
    "date_product_arrived": "",
    "phone_number": "",
    "files": []
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
    data_to_save.subsidiary = "";
    data_to_save.main_reason = "";
    data_to_save.explanation = "";
    data_to_save.ticket_number = "";
    data_to_save.client_number = "";
    data_to_save.order_number = "";
    data_to_save.items = [];
    data_to_save.date_product_arrived = "";
    data_to_save.phone_number = "";
    data_to_save.files = [];

    document.getElementById('order-input').value = "";
    document.getElementById('client-number').value = "";
    document.getElementById('reason-input').value = "";
    document.getElementById('sku-input').value = "";
    document.getElementById('qty-input').value = "";
    document.getElementById('phone-number').value = "";

    const productTableBody = document.querySelector('#product-table tbody');
    productTableBody.innerHTML = "";
  }

  function showNextCard(currentCard, nextCard) {

    if (nextCard == 2) {
      const subsidiary = document.getElementById('subsidiary-input').value;
      const forSubsidiary = document.querySelector('.forSubsidiary');

      if (subsidiary != "En Linea") {
        forSubsidiary.style.display = "none";
      } else {
        forSubsidiary.style.display = "block";
      }
    }

    // Hide the current card
    document.getElementById(`card-${currentCard}`).classList.remove("show-card");

    // Show the next card
    if (document.getElementById(`card-${nextCard}`)) {
        document.getElementById(`card-${nextCard}`).classList.add("show-card");
    }

  }

  function showPreviosCard(currentCard) {
    const previosCard = parseInt(currentCard) - 1;

    if (currentCard == 3) {
      const subsidiary = document.getElementById('subsidiary-input').value;

      if (subsidiary != "En Linea") {
        forSubsidiary.style.display = "none";
      } else {
        forSubsidiary.style.display = "block";
      }
    }

    // Hide the current card
    document.getElementById(`card-${currentCard}`).classList.remove("show-card");

    // Show the previous card
    if (document.getElementById(`card-${previosCard}`)) {
        document.getElementById(`card-${previosCard}`).classList.add("show-card");
    }
  }

  function showFolio(info) {
    // Limpiar los datos
    clearData();

    // Mostrar folio
    const folio = document.getElementById('folio-number');
    folio.innerHTML = info.id; // Cambiar el número de folio

    // Cambiar mensaje whatsapp
    //const anchor = document.getElementById('whatsapp-anchor');
    // const url = `https://api.whatsapp.com/send?phone=522211939333&text=Genere un nuevo ticket, por *${info.mainReason}* y mi compra la realice en *PT${info.sucursal}*. Mi número de folio es *${info.id}*.`; // Cambiar el número de teléfono & el número de folio
    // anchor.href = url;

    showNextCard(3, 4);
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

    console.log(data_to_save);

    // Enviar los datos a un servidor
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_to_save)
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
        showNextCard(3, 4);
    });
  }

  const cards = document.querySelectorAll(".card");
  const nextButtons = document.querySelectorAll("#next-card");
  const previosButtons = document.querySelectorAll("#previus-card");

  // Show the first card on page load
  cards[0].classList.add("show-card");

  // Get elements
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById("upload-button");
const fileList = document.getElementById('file-list');
let files = [];


// Utility functions
const createFileItem = (fileName) => {
    const fileItem = document.createElement("p");
    fileItem.classList.add("file-item");
    fileItem.textContent = fileName;
    return fileItem;
};

const displayFiles = () => {
    fileList.innerHTML = ""; // Clear previous list
    files.forEach(file => fileList.appendChild(createFileItem(file.name)));
};

const updateFiles = async () => {
  files = await Promise.all(Array.from(fileInput.files).map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // Use a FileReader to convert the blob to base64
    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the "data:*/*;base64," prefix
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    return {
        arrayBuffer: base64,
        name: file.name,
    };
  }));

  displayFiles();
};

const saveFormData = (fields) => {
    fields.forEach(({ elementId, key, label }) => {
        const value = document.getElementById(elementId).value;
        if (validateField(value, label)) {
            data_to_save [key] = value;
        } else {
            throw new Error(`Validation failed for field: ${label}`);
        }
    });
};

// Event listeners
uploadButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", updateFiles);

nextButtons.forEach(button => {
    button.addEventListener("click", function() {
        const currentCard = parseInt(this.getAttribute("data-card"));
        const nextCard = currentCard + 1;

        try {
            switch (currentCard) {
                case 1:
                    saveFormData([
                        { elementId: 'ticket-input', key: 'ticket_number', label: 'Número de Ticket' },
                        { elementId: 'phone-number', key: 'phone_number', label: 'Número de Teléfono' },
                        { elementId: 'subsidiary-input', key: 'subsidiary', label: 'Sucursal' }
                    ]);
                    showNextCard(currentCard, nextCard);
                    break;

                case 2:
                    saveFormData([
                        { elementId: 'reason-input', key: 'main_reason', label: 'Motivo de Devolución' },
                        { elementId: 'client-number', key: 'client_number', label: 'Número de Cliente' },
                        { elementId: 'commentaries', key: 'explanation', label: 'Explicación' },
                        { elementId: 'date-input', key: 'date_product_arrived', label: 'Fecha de llegada' }
                    ]);
                    data_to_save.order_number = document.getElementById('order-input').value;
                    data_to_save.files = files;
                    showNextCard(currentCard, nextCard);
                    break;

                case 3:
                    if (validateItems()) {
                        sendData();
                    }
                    break;
            }
        } catch (error) {
            console.error(error.message);
        }
    });
});

  function validateItems() {
    if (data_to_save.items.length <= 0){
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



        const indexIfExist = data_to_save.items.findIndex( item => item.sku == sku);

        if (indexIfExist != -1) {

          data_to_save.items[indexIfExist].cantidad += qty;

          const rows = productTableBody.getElementsByTagName('tr');
          for (let row of rows) {
            const skuCell = row.getElementsByTagName('td')[0];
            if (skuCell.textContent == sku) {
              const cantidadCell = row.getElementsByTagName('td')[1];
              cantidadCell.textContent = data_to_save.items[indexIfExist].cantidad;
              break;
            }
          }



          skuInput.value = '';
          qtyInput.value = '';

        } else {



          data_to_save.items.push({ "sku": sku, "cantidad": qty })

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

  console.log("All in One");

});
