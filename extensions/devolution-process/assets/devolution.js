document.addEventListener("DOMContentLoaded", (event) => {

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

    console.log( "Hola");
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
      console.log('Success:', data.devolution);
      return data.devolution; // Devuelve el objeto de devolución

    } catch (error) {
      console.error('Error:', error);
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
