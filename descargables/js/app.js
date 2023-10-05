


    document.getElementById("year").innerText = new Date().getFullYear();

    /*Consumo de API */

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");   
fetch("https://aliatuniversidades.com.mx/ONALIAT/API/hubspot/?hdb=ebooks",{
        method: 'GET',
        headers: myHeaders
    })
    .then(response => response.json())
    .then(result => console.log(result.results))
    .catch(error => console.log('error', error));

