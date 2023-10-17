

        let marcaDefault;
        let img;
        const urlApi = 'https://aliatuniversidades.com.mx/ONALIAT/API/hubspot/';
        const parametrosGet = window.location.search;
        const getValor = new URLSearchParams(parametrosGet).get('ebook');
        if (getValor == undefined) { window.location.href = '../'; }
        document.getElementById("year").innerText = new Date().getFullYear();
        let secCarreras = document.getElementById("secCarreras")
        let secModalidad = document.getElementById("secModalidad")


        /*Funciones generales */

        const alertas = (valor, posicion) => {
            /* Mostramos span con la alerta de la validacion de acuerdo al input */

            const error = document.getElementsByClassName('error');

            for (b = 0; b < error.length; b++) {

                if (error[b] == error[posicion]) {
                    error[posicion].innerHTML = valor;
                }
                else {
                    error[b].innerHTML = "";
                }

            }

        }


        function resaltar(valor) {
            var element = document.getElementById(valor);
            element.classList.add("resaltes");
            element.classList.add("efectos");

        }

        function removerResaltes() {

            document.querySelectorAll('.input-gp').forEach(function (div) {

                let element = document.getElementById(div.id);
                if (element.classList.contains("resaltes")) 
                {
                    element.classList.remove("resaltes")
                }
            });

        }

        const submitForm = (url,datos) => {

                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(datos),
                        headers: {
                            'content-type': 'application/json'
                        }
                    }).then((respuesta) => {

                        if (respuesta.status == 200) {

                            window.location.href = document.getElementById("url").value;
                        }
                        else {
                            console.log(respuesta.ok);
                            console.log(respuesta.status);
                            respuesta.json().then((data) => {

                                alert(data);
                            });
                        }

                    })
                        .catch((error) => {

                            console.log(error);

                        });


        }

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
            
        }, 1500);

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
                                document.getElementById("url").value = datos[0].values.pdf;
                               

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

            let selectMod = document.getElementById("modalidades");
            selectMod.options.length = 1;

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

                        
                        const niveles = [];
                        

                        const dataGet = Object.values(data);

                        let carreDEf = document.getElementById("carreras").value == "" ? document.getElementById("ebookCarrer").value : document.getElementById("carreras").value;

                        const resultData = dataGet.filter(dataGet => dataGet.nivel == document.getElementById("ebookNivel").value && dataGet.carrera == carreDEf);

                        console.log(resultData)
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

                        document.getElementById("carreras").value = "";

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

                    asgnacionPlan("opcional", "opcional", "", "");

                    document.getElementById("carreras").value = document.getElementById("ebookCarrer").value;
                    mostrarSelect("secModalidad","secCarreras")
                   
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

                    asgnacionPlan("opcional", "", "", "");

                    mostrarSelect("secCarreras", "secModalidad")
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

             if (this.value == "En Línea")
                {
                    
                 asgnacionPlan(document.getElementById("ebookNivel").value, document.getElementById("carreras").value == "" ? document.getElementById("ebookCarrer").value : document.getElementById("carreras").value, "CES " + marcaDefault,"On Aliat" );
                   
                }
                else
                {

                    const SepararPlan = this.value.split(" en ");     
                    asgnacionPlan(document.getElementById("ebookNivel").value, document.getElementById("carreras").value == "" ? document.getElementById("ebookCarrer").value : document.getElementById("carreras").value, SepararPlan[1], SepararPlan[0] );
                }

        });

        document.getElementById("carreras").addEventListener('change', function () {

            document.getElementById("carrera").value = document.getElementById("carreras").value

            document.getElementById("modalidad").value="";

            secModalidad.style.display = "block"

            getModalidad(urlApi, {
                'key': 'ALIAT-162098695936825',
                'medio': 'catalogo',
                'opcion': 'plan-onaliat',
                'marca': marcaDefault
            },document.getElementById('pdf'));

            
          
        });

        document.getElementById("FormSubmit").addEventListener('submit', function (e) {


                e.preventDefault();
                removerResaltes();


                    let nombre = document.getElementById('nombre').value;
                    let correo = document.getElementById('correo').value;
                    let telefono = document.getElementById('telefono').value;
                    let momentoAc = document.getElementById('mAcademico').value;
                    let carreras = document.getElementById('carrera').value;
                    let modalidades = document.getElementById('modalidad').value;


                    let excorreo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,6})+$/;
                    let numeros = /^([0-9 ])+$/;
                    let letras = /^([á-ú-Á-Ú-a-z-A-Z-ñ ._])+$/;


                    if (nombre.length > 55 || letras.test(nombre) === false || nombre.length == 0) {
                        
                        resaltar("nombre")
                        alertas("Por favor ingresa tú nombre completo", 0);
                    }
                    else if (correo.length > 55 || excorreo.test(correo) === false || correo.length == 0) {

                        resaltar("correo")
                        alertas("Por favor ingresa tú correo electrónico", 1);
                    }
                    else if (telefono.length != 10 || numeros.test(telefono) === false || telefono.length == 0) {

                        resaltar("telefono")
                        alertas("Por favor ingresa número de teléfono - 10 digítos.", 2);
                       
                    }
                    else if (momentoAc.length == 0 || letras.test(momentoAc.value) === false) {
                        alertas("", 0);
                        resaltar("mAcademico");
                    }
                    else if (carreras.length == 0 || letras.test(carreras.value) === false) {

                        resaltar("carreras");
                    }
                    else if (modalidades.length == 0 || letras.test(modalidades.value) === false) {
                        
                        resaltar("modalidades");
                    }
                    else 
                    {
                        alertas("", 0);
                        submitForm(urlApi, {
                            key: 'ALIAT-162098695936825',
                            marca: marcaDefault,
                            medio: 'organico-ebook',
                            nombre: nombre,
                            correo: correo,
                            telefono: telefono,
                            momento: momentoAc,
                            categoria: document.getElementById('categoria').value,
                            carrera: document.getElementById('carrera').value,
                            campus: document.getElementById('campus').value,
                            modalidad: document.getElementById('modalidad').value
                        });
                    }


        });