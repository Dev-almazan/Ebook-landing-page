

        let marcaDefault;
        let img;
        const urlApi = 'https://aliatuniversidades.com.mx/ONALIAT/API/hubspot/';
        const parametrosGet = window.location.search;
        const getValor = new URLSearchParams(parametrosGet).get('ebook');
        document.getElementById("year").innerText = new Date().getFullYear();


        /*Funciones generales */

        const mostrarSelect = (mostrar,ocultar)=>
        {
            document.getElementById(mostrar).style.display = "block";
            document.getElementById(ocultar).style.display = "none";
        }

        const ocultarSelect = (ocultar1, ocultar2) => {
            document.getElementById(ocultar1).style.display = "none";
            document.getElementById(ocultar2).style.display = "none";
        }

        const asgnacionPlan = (nivel, carrera, campus,modalidad)=>
        {
            document.getElementById("categoria").value = nivel;
            document.getElementById("carrera").value = carrera;
            document.getElementById("campus").value = campus;
            document.getElementById("modalidad").value = modalidad;
        }

        
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

                                document.getElementById("titulo").innerText = datos[0].values.titulo.trim();
                                document.getElementById("lbEbook").innerText = datos[0].values.carrera.trim();
                                document.getElementById("ebookCarrer").value = datos[0].values.carrera;
                                document.getElementById("ebookNivel").value = datos[0].values.nivel_de_interes.name;
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

        const getModalidad =(url, datos)=> {

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(datos),

                headers: {
                    'content-type': 'application/json'
                }
            }).then((respuesta) => {

                // Convertimos data del api de formato json a array 

                if (respuesta.status == 200) {

                    respuesta.json().then((data) => {

                        let selectMod = document.getElementById("modalidades");
                        const niveles = [];
                        selectMod.options.length = 1;

                        const dataGet = Object.values(data);
                        const resultData = dataGet.filter(dataGet => dataGet.nivel == document.getElementById("ebookNivel").value && dataGet.carrera == document.getElementById("ebookCarrer").value);

                        /* 1- guardamos valores de modalidad y campus */

                        for (let i = 0; i < resultData.length; i++) {

                            niveles.push(resultData[i].modalidad == "On Aliat" ? "En Línea" : resultData[i].modalidad + " en " + resultData[i].campus_valor);
                        }

                        /* 2- quitamos duplicados modalidad y campus */

                        function onlyUnique(value, index, self) {
                            return self.indexOf(value) === index;
                        }

                        let nivelesUnicos = niveles.filter(onlyUnique);

                        /*3- Agregamos options de acuerdo a la data */

                        if(nivelesUnicos.length <= 0)
                        {
                            
                                ocultarSelect("secModalidad", "secCarreras");
                                asgnacionPlan(document.getElementById("ebookNivel").value, document.getElementById("ebookCarrer").value, "opcional", "opcional");
                        }
                        else
                        {
                            
                                mostrarSelect("secModalidad", "secCarreras");
                                
                                for (let a = 0; a < nivelesUnicos.length; a++) {

                                    let option = document.createElement("option");
                                    option.value = nivelesUnicos[a];
                                    option.text = nivelesUnicos[a];
                                    selectMod.appendChild(option);

                                }
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

        const getCarrrera = (url, datos) => {

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(datos),

                headers: {
                    'content-type': 'application/json'
                }
            }).then((respuesta) => {

                // Convertimos data del api de formato json a array 

                if (respuesta.status == 200) {

                    respuesta.json().then((data) => {

                        let selectMod = document.getElementById("carreras");
                        const carreras = [];

                        selectMod.options.length = 1;

                        const dataGet = Object.values(data);
                        const resultData = dataGet.filter(dataGet => dataGet.nivel == document.getElementById("ebookNivel").value );

                        /* 1- guardamos valores de carreras por marca */

                        for (let i = 0; i < resultData.length; i++) {

                            carreras.push(resultData[i].carrera);
                        }

                        /* 2- quitamos carreras duplicadas */

                        function onlyUnique(value, index, self) {
                            return self.indexOf(value) === index;
                        }

                        let carrerasUnicas = carreras.filter(onlyUnique);

                        /*3- Agregamos options de acuerdo a la data */
            
                            mostrarSelect("secCarreras","secModalidad");

                            for (let a = 0; a < carrerasUnicas.length; a++) {

                                let option = document.createElement("option");
                                option.value = carrerasUnicas[a];
                                option.text = carrerasUnicas[a];
                                selectMod.appendChild(option);

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

        document.getElementById("mAcademico").addEventListener('change',function(){
            
            switch (this.value) {
                case "opcion1":
                    
                    // Cosumimos data en el option modalidad
                    getModalidad(urlApi, {
                        'key': 'ALIAT-162098695936825',
                        'medio': 'catalogo',
                        'opcion': 'plan-onaliat',
                        'marca': marcaDefault
                    });

                break;
                case "opcion2":
                    //Apenas voy cursando el bachillerato

                    ocultarSelect("secCarreras", "secModalidad");   
                    asgnacionPlan("Bachillerato", "opcional", "opcional","opcional");

                break;
                case "opcion3":
                    //Me interesa otra carrera
                    getCarrrera(urlApi, {
                        'key': 'ALIAT-162098695936825',
                        'medio': 'catalogo',
                        'opcion': 'plan-onaliat',
                        'marca': marcaDefault
                    });

                break;
                case "opcion4":

                    //ya estoy estudiando otra carrera
                    ocultarSelect("secCarreras", "secModalidad");
                    asgnacionPlan("opcional","opcional", "opcional", "opcional");    

                break;
                default:

                    ocultarSelect("secCarreras", "secModalidad");
                    asgnacionPlan("","","", "");    

                break;
                
            }

        })

        document.getElementById("modalidades").addEventListener('change', function () {
            
                if(this.value == "En Línea")
                {
                    asgnacionPlan(document.getElementById("ebookNivel").value, document.getElementById("ebookCarrer").value, "CES " + marcaDefault,"On Aliat" );
                }
                else
                {

                    const SepararPlan = this.value.split(" en ");     
                    asgnacionPlan(document.getElementById("ebookNivel").value, document.getElementById("ebookCarrer").value, SepararPlan[1], SepararPlan[0] );
                }
        });

        document.getElementById("carreras").addEventListener('change', function () {

            asgnacionPlan(document.getElementById("ebookNivel").value, this.value, "opcional", "opcional");  
          
        });