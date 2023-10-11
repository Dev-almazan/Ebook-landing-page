

        let marcaDefault;
        let img;
        const urlApi = 'https://aliatuniversidades.com.mx/ONALIAT/API/hubspot/';
        const parametrosGet = window.location.search;
        const getValor = new URLSearchParams(parametrosGet).get('ebook');
        document.getElementById("year").innerText = new Date().getFullYear();


        /*Funciones generales */

        setTimeout(() => {
            document.getElementById("cargando").style.display = "none";
        }, 1000);

        switch (document.domain) {
            case 'www.etac.edu.mx':
                marcaDefault = "ETAC";
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_etac.svg";
                break;
            case 'www.utan.edu.mx':
                marcaDefault = "UTAN";
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_utan.svg";
                break;
            case 'www.unea.edu.mx':
                marcaDefault = "UNEA";
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_unea.svg";
                break;
            case 'www.uvg.edu.mx':
                marcaDefault = "UVG";
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_uvg.svg";
                break;
            case 'www.soycest.mx':
                marcaDefault = "CEST";
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_cest.svg";
                break;
            case 'www.universidadlaconcordia.edu.mx':
                marcaDefault = "LA CONCORDIA"
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_ulc.svg";
                break;
            default:
                marcaDefault = "ETAC";
                img = "https://www.aliatuniversidades.com.mx/hubfs/l_etac.svg";
                break;

        }

        document.getElementById("imgNav").src = img;

        const getData = (url, parametros) => {

                fetch(url + parametros, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then((respuesta) => {

                    // Convertimos data del api de formato json a array 
                    if (respuesta.status == 200) {

                        respuesta.json().then((values) => {

                        const datos = values.results;

                            if (datos.length == 1)
                            {

                                let listEbook = document.getElementById("listEbook");
                                let imgc = document.getElementById("imgEbook");
                                let subtemas = datos[0].values.subtemas;

                                document.getElementById("titulo").innerText = datos[0].values.titulo;
                                document.getElementById("descripcion").innerText = datos[0].values.descripcion;

                                imgc.src = datos[0].values.img.url;
                                imgc.alt = datos[0].values.carrera;
                                imgc.title = datos[0].values.carrera;

                                if (subtemas.length >= 0)
                                {
                                    for (a = 0; a < subtemas.length ; a++) 
                                    {
                                            listEbook.innerHTML +=`<li><span>${a + 1}</span> ${subtemas[a].name}</li>`
                                    }
                                }
                                else
                                {
                                    document.getElementById("h2Ebook").style.display = "none";
                                }

                            }
                            else
                            {
                                console.log("no existe información del item.")
                                window.location.href = '../'; 
                            }
                                   
                                

                        });
                    }
                    else {
                        console.log(respuesta.json())
                    }

                })
                    .catch((error) => {

                        console.log(error);

                    });

        }


        /*  Manejo del Dom eventos y llamado de funciones */


        getData(urlApi,"?hdb=ebooks&item=" + getValor); 
