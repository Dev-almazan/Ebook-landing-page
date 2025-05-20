
        let marcaDefault = "ETAC";
        let img = "https://www.aliatuniversidades.com.mx/hubfs/l_etac.svg";
        const url = 'https://comunicacionesaliat.com/api/hubspot/';
        document.getElementById("year").innerText = new Date().getFullYear();   
            setTimeout(() => {
                document.getElementById("cargando").style.display = "none";
            },1000);

            /*Funciones generales */
            document.getElementById("imgNav").src = img;

            const getData =(url, parametros)=> {

                fetch(url + parametros, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': 'Bearer 2ee90da8-c02e-4c3d-9700-d6200016ee75'
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
                                            <div class="iconos">
                                                    <h5><i class="fas fa-book"></i>  Ebook</h5>
                                            </div>
                                            </div>
                                            <h5 class="title">${datos[a].values.titulo}</h5>
                                            <p>Descubre por qué la firma digital y la gestión documental son más importantes que nunca.</p>
                                            <a href="descargables/?ebook=${datos[a].id}" class="btn">DESCARGA GRATIS</a>
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