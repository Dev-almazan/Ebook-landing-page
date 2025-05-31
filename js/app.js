
            const url = 'https://comunicacionesaliat.com/api/hubspot/';
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
                                        <div class="tarjeta" plan="E-book Consejos ${datos[a].values.carrera} ${datos[a].values.titulo}"  >
                                            <div class="bg" style="background-image: url('${datos[a].values.img.url}');">
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

       
        function searchItem(value, tipo) {
                const alerta = document.getElementById("alerta");
                let stringBuscador = value;
                let arrayBusquedas = [];
                document.querySelectorAll('.tarjeta').forEach(function (div) {
                    let busqueda = div.getAttribute(tipo).toUpperCase().indexOf(stringBuscador.toUpperCase())
                    arrayBusquedas.push(busqueda)
                    if (busqueda < 0) {
                        div.style.display = "none";
                    }
                    else {
                        div.style.display = "";
                    }
                });
                const found = arrayBusquedas.find((element) => element >= 0);
                if (found == undefined) {
                    alerta.style.display = "block";
                }
                else {
                    alerta.style.display = "none";
                }
                arrayBusquedas = [];
            }
        
        
        /*  Funcion general para traer data parametro marca = a dominio  */

        getData(url,"?hdb=ebooks&marca=ETAC"); 


        /*Eventos del Dom  */

        document.getElementById("buscador").addEventListener("keyup",function(){
            // 1. Llama a filterItem con el ID del input y el valor actual
            filterItem("buscador", this.value);
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

        function filterItem(elementId, valueToSet){
            // 1. Actualiza el valor del input oculto de forma más genérica
            // Usamos 'elementId' para el ID del input que se va a actualizar
            document.getElementById(elementId).value = valueToSet;

            // 2. Simplifica la obtención de valores y manejo de "todos"
            // Usamos el operador ternario para asignar un string vacío si el valor es "todos"
            const contentType = document.getElementById("content-type").value === "todos" ? "" : document.getElementById("content-type").value;
            const theme = document.getElementById("theme").value === "todos" ? "" : document.getElementById("theme").value;
            const career = document.getElementById("career").value === "todos" ? "" : document.getElementById("career").value;
            const buscador = document.getElementById("buscador").value === "todos" ? "" : document.getElementById("buscador").value;

            // 3. Construye el término de búsqueda de forma dinámica
            // Filtramos los valores vacíos y luego los unimos con un espacio
            const searchTerms = [contentType, theme, career,buscador].filter(term => term !== "").join(" ");
            // 4. Llama a searchItem con el término de búsqueda
            searchItem(searchTerms,'plan');
           
        }


        function activeList(element) { // El segundo parámetro 'li' no es necesario aquí
            const listItems = document.querySelectorAll(element);

            listItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Remueve la clase 'active' de todos los elementos 'li'
                    listItems.forEach(li => {
                        li.classList.remove('active');
                        const svgInLi = li.querySelector('svg'); // Encuentra el SVG dentro de este li
                        if (svgInLi) {
                            svgInLi.classList.remove('active__svg'); // Remueve la clase 'active' del SVG también
                        }
                    });

                    // Agrega la clase 'active' al elemento 'li' en el que se hizo clic
                    item.classList.add('active');

                    // Agrega la clase 'active' al SVG dentro del li en el que se hizo clic
                    const svgInsideClickedLi = item.querySelector('svg');
                    if (svgInsideClickedLi) {
                        svgInsideClickedLi.classList.add('active__svg');
                    }
                });
            });
        }

        activeList(".content-type li","li");
        activeList(".theme li", "li");     
        activeList(".career li", "li");




// Función para manejar el estado 'open'
function handleDetailsState() {
    // Define el ancho máximo para considerar "móvil" (puedes ajustar este valor)
    const mobileBreakpoint = 900;
    // Obtiene todos los 'details' que podrían estar abiertos
    const detailsElements = document.querySelectorAll('details.filter-section');
    // Comprueba el ancho actual de la ventana
    if (window.innerWidth < mobileBreakpoint) {
        // Si es móvil, recorre los elementos y quita 'open' si lo tienen
        detailsElements.forEach(detail => {
            if (detail.hasAttribute('open')) {
                detail.removeAttribute('open');
            }
        });
    }  
}

// Ejecuta la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', handleDetailsState);
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleDetailsState, 150);
});
 


class formulario {
    constructor(formId) {
        this.form = document.getElementById(formId);
    }

    validateForm() {
        const inputs = this.form.querySelectorAll("input");
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add("error");
                isValid = false;
            } else {
                input.classList.remove("error");
            }
        });

        if (isValid) {
            this.submitForm();
        }
    }

    submitForm() {
        // Aquí puedes agregar la lógica para enviar el formulario
        console.log("Formulario enviado correctamente.");
    }
}
    


const form =  new formulario("Ebs");

document.getElementById("btnEs").addEventListener("click", function(e) {
    e.preventDefault();
       console.log("Botón de envío presionado");
})