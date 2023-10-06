
        let marcaDefault ;
        const url = 'https://aliatuniversidades.com.mx/ONALIAT/API/hubspot/';


        /*Funciones generales */
            switch (document.domain) 
            {
                        case 'www.etac.edu.mx':
                            marcaDefault = "ETAC";
                            
                            break;
                        case 'www.utan.edu.mx':
                            marcaDefault = "UTAN";
                            
                            break;
                        case 'www.unea.edu.mx':
                            marcaDefault = "UNEA";
                        
                            break;
                        case 'www.uvg.edu.mx':
                            marcaDefault = "UVG";
                            
                            break;
                        case 'www.soycest.mx':
                            marcaDefault = "CEST";
                            
                            break;
                        case 'www.universidadlaconcordia.edu.mx':
                            marcaDefault = "LA CONCORDIA"
                            
                        break;
                        default:
                            marcaDefault = "ETAC"
                        break;

            }

            const getData =(url, parametros)=> {

                fetch(url + parametros, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then((respuesta) => {

                        // Convertimos data del api de formato json a array 
                        if (respuesta.status == 200) 
                        {

                            respuesta.json().then((values) => {

                                const datos = values.results;

                                let secEbook = document.getElementById("secEbooks");

                                for (a = 0; a < datos.length ; a++)
                                {
                                    secEbook.innerHTML += 
                                    `   
                                        <div class="tarjeta" data-plan="${datos[a].values.titulo} ${datos[a].values.carrera}" >
                                        <div class="bg" style="background-image: url('${datos[a].values.img.url}');">
                                        </div>
                                        <div class="iconos">
                                                <h5><i class="fas fa-book"></i> Ebook</h5>
                                        </div>
                                        <h5 class="title">${datos[a].values.titulo}</h5>
                                        <p class="text">${datos[a].values.descargas} descargas</p>
                                        <a href="descargables/?ebook=${datos[a].id}" class="btn">Lo quiero</a>
                                
                                    </div>
                                    `
                                }


                            });
                        }
                        else 
                        {
                            console.log(respuesta.json())
                        }

                })
                .catch((error) => {

                         console.log(error);

                });

            }

       

        
        
        /*  Funcion general para traer data parametro marca = a dominio  */

        getData(url, "?hdb=ebooks&marca=" + marcaDefault); 


        /*Eventos del Dom  */

        document.getElementById("buscador").addEventListener("keyup", function () {

            const stringBuscador = this.value;

            document.querySelectorAll('.tarjeta').forEach(function(div){

                if (div.getAttribute("data-plan").toUpperCase().indexOf(stringBuscador.toUpperCase()) < 0)
                {
                    div.style.display= "none";
                }

                else
                {
                    div.style.display = ""; 
                }

            });




        });