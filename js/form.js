


class formulario {

    url = "https://comunicacionesaliat.com/api/hubspot/"; 
    tsc = window.atob('QmVhcmVyIDJlZTkwZGE4LWMwMmUtNGMzZC05NzAwLWQ2MjAwMDE2ZWU3NQ==');
    ebook = document.getElementById("ebook_e") ? document.getElementById("ebook_e").value : "";

    constructor(formId) {
        this.form = document.getElementById(formId);
    }
    /*Funciones generales */

    alertas(valor, posicion){
        /* Mostramos span con la alerta de la validacion de acuerdo al input */
        const error = document.getElementsByClassName('error');
        for (let b = 0; b < error.length; b++) {
            if (error[b] == error[posicion]) {
                error[posicion].innerHTML = valor;
            }
            else {
                error[b].innerHTML = "";
            }
        }
    }

    resaltar(valor) {
        var element = document.getElementById(valor);
        element.classList.add("resaltes");
    }

    removerResaltes(id) {
        document.querySelectorAll(id).forEach(function (div) {
            let element = document.getElementById(div.id);
            //console.log(element);
            if (element.classList.contains("resaltes")) {
                element.classList.remove("resaltes")
            }
        });
    }

    validateForm() {

        this.removerResaltes(".form-i");
        let nombre = document.getElementById('nombre_e').value;
        let correo = document.getElementById('correo_e').value;
        let telefono = document.getElementById('telefono_e').value;
        let momentoAc = document.getElementById('academico').value;
        const myCheckbox = document.getElementById('aviso_e');

        let excorreo = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,6})+$/;
        let numeros = /^([0-9 ])+$/;
        let letras = /^([á-ú-Á-Ú-a-z-A-Z-ñ ._])+$/;


        if (nombre.length > 55 || letras.test(nombre) === false || nombre.length == 0) {

            this.resaltar("nombre_e")
            this.alertas("Por favor ingresa tú nombre completo", 0);
        }
        else if (correo.length > 55 || excorreo.test(correo) === false || correo.length == 0) {

            this.resaltar("correo_e")
            this.alertas("Por favor ingresa tú correo electrónico", 1);
        }
        else if (telefono.length != 10 || numeros.test(telefono) === false || telefono.length == 0) {

            this.resaltar("telefono_e")
            this.alertas("Por favor ingresa número de teléfono - 10 digítos.", 2);

        }
        else if (momentoAc.length == 0 || letras.test(momentoAc.value) === false) {
            this.resaltar("academico");
            this.alertas("", 3);
        }
        else if (!myCheckbox.checked) {
            this.resaltar("aviso");
            this.alertas("", 4);
        }
        else {
            this.removerResaltes(".form-i");
            this.alertas("", 0);
            this.submitForm({
                medio: 'ebook-v2',
                nombre: nombre,
                correo: correo,
                telefono: telefono,
                momento: momentoAc
            });
        }
    }

    submitForm = async (requestData) => {
        try {
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(requestData),
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `${this.tsc}`
                }
            };

            const response = await fetch(this.url, requestOptions);
            const data = await response.json();

            if (response.status > 401) {
                console.log(data)
                return
            }
            else if (response.status == 400) {
                Swal.fire({
                    title: "",
                    text: data,
                    icon: "error"
                });
                return
            }
            else {
                Swal.fire({
                    title: "¡Aquí tienes tu ebook!", // Puedes cambiar el título
                    text: " Descárgalo ahora y empieza a disfrutar de su contenido.",
                    icon: "success", // Cambia el icono a "success"
                    showConfirmButton: true, // Muestra el botón de confirmación
                    confirmButtonText: `<a href="${this.ebook}" download style="color: white; text-decoration: none;">¡Descargar!</a>`, // Texto del botón con un enlace de descarga
                    confirmButtonAriaLabel: "Descargar archivo", // Etiqueta para accesibilidad
                    allowOutsideClick: false // Evita que se cierre haciendo clic fuera
                });
                this.form.reset()
            }

        } catch (error) {
            console.error('Error al conectarse a la API:', error);
        }
    }
}
    

//inicializamos el formulario
const form = new formulario("formLead");
document.getElementById("formLead_btn").addEventListener("click", function(e) {
    e.preventDefault();
    form.validateForm();
})