
        let marcaDefault ;
        let img;
        const url = 'https://aliatuniversidades.com.mx/ONALIAT/API/hubspot/';
        document.getElementById("year").innerText = new Date().getFullYear();
        
            setTimeout(() => {
                document.getElementById("cargando").style.display = "none";
                
            }, 2000);

        




        /*Funciones generales */
            switch (document.domain) 
            {
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
                                                <h5><i class="fas fa-book"></i>  Ebook</h5>
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

            const alerta = document.getElementById("alerta");

            let stringBuscador = this.value;

            let arrayBusquedas = [];  
            
                    document.querySelectorAll('.tarjeta').forEach(function (div) {
                       
                        let busqueda = div.getAttribute("data-plan").toUpperCase().indexOf(stringBuscador.toUpperCase())
                        arrayBusquedas.push(busqueda)

                        if (busqueda < 0) {
                            div.style.display = "none";
                        }
                        else {
                            div.style.display = "";
                        }
                    });

            const found = arrayBusquedas.find((element) => element >= 0);

            if (found == undefined) 
            {
                alerta.style.display = "block";
            }
            else
            {
                alerta.style.display = "none";
            }

            arrayBusquedas = [];    
            
         

        });

        window.addEventListener("scroll", function() {


            if (this.scrollY < 800)
            {
                document.getElementById("btnTop").style.display= "none";
           
            }   
            else
            {
                document.getElementById("btnTop").style.display = "block";
                
            }
            
        });