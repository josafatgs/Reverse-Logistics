document.addEventListener("DOMContentLoaded", (event) => {

  const data = {
    "client_number": 25242,
    "createdAt": "Sun, 22 Sep 2024 01:48:43 GMT",
    "date_product_arrvie": "Fri, 22 May 2020 09:06:28 GMT",
    "explanation": "El producto llego dañado por la paqueteria, ya que venia aplastada",
    "id": 2,
    "items": [
        {
            "cantidad": 1,
            "sku": "9309"
        },
        {
            "cantidad": 2,
            "sku": "23424"
        }
    ],
    "main_reason": "Paquete dañado",
    "order_number": 243432,
    "requires_label": 0,
    "returnment_label": "",
    "shipping_payment": 0,
    "status": "En camino",
    "subsidiary": "CEDIS",
    "ticket_number": 2342909
  }


  function setProgressBar(){

    const progressBar = document.getElementById("progress-bar");
    const pending__svg = document.querySelector(".pending__svg");
    const carrier__svg = document.querySelector(".carrier__svg");
    const review__svg = document.querySelector(".review__svg");
    const result__svg = document.querySelector(".result__svg");

    console.log(data.status);

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

    } else if(data.status == "Aceptado") {
      //return "bg-primary";
      progressBar.style.width = "100%";
      pending__svg.classList.add("done");
      carrier__svg.classList.add("done");
      review__svg.classList.add("done");
      result__svg.classList.add("done");
    }

    console.log( "Hola");
  }

  function getDevolutionInfo() {

    //
    const devoluciónValue = document.getElementById("search-input").value;

    // Make Fetch request to get the data
    console.log(typeof devoluciónValue);
    console.log(data);

    // If data is not empty
    if (devoluciónValue == 1) {
      // Show the info

      showInfoData();
      setProgressBar();

      handleResultsBox("result");
    } else {
      // Show error
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
      //statusInfoCommentaries.innerHTML = data.comentaries;
    } else if(data.status == "Aceptado") {
      // Show Result
      statusLabelInfo.innerHTML = "Aceptado";
      statusInfoPopulated.innerHTML = "Tu devolución ha sido aceptada";
      //statusInfoCommentaries.innerHTML = data.comentaries;
    }

  }

  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", getDevolutionInfo);

});
