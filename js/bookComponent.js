// Asegúrate de haber incluido PDF.js en tu HTML antes que este script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>

class FlippingBook extends HTMLElement {
    constructor() {
        
        super();
        this.pdf = this.getAttribute('pdf') || "";
        this.attachShadow({ mode: 'open' });

        // Datos de las páginas (ejemplos)
        this.pagesData = [
            {
                title: "",
                image:this.pdf, // URL de tu PDF
                content: "",
                pdfPage: 1   // Indica qué página del PDF mostrar
            },
            {
                title: "",
                image: this.pdf, // Misma URL del PDF
                content: "",
                pdfPage: 2   // Indica la página 2 del PDF
            },
            {
                title: "",
                image: this.pdf, // Misma URL del PDF
                content: "",
                pdfPage: 3   // Indica la página 2 del PDF
            },
            {
                title: "",
                image: this.pdf, // Misma URL del PDF
                content: "",
                pdfPage: 23   // Indica la página 2 del PDF
            }
        ];

        this.currentIndex = 0;
        this.isAnimating = false;
    }

    connectedCallback() {
        this.render();
        this.initLogic();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: grid;
                    font-family: Arial, sans-serif;
                }

                .book-wrapper {
                    box-shadow: 0 0rem 0rem rgba(0, 0, 0, .15) !important;
                    width: 20rem; /* Ancho fijo para el libro */
                    height: 29em; /* Altura automática basada en el aspect-ratio */
                    aspect-ratio: 4 / 3; /* Proporción común para libros/presentaciones */
                    margin: 0 auto; /* Centrar y añadir margen */
                    perspective: 2500px; /* Añade perspectiva para el efecto 3D */
                 
                }

                .book {
                   
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }

                .page {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: #fff; /* Fondo por defecto si no hay imagen */
                    background-size: contain; /* 'contain' para PDF, 'cover' para imágenes normales */
                    background-position: center;
                    background-repeat: no-repeat;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    border-radius:15px ;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center; /* Centra el contenido si es poco */
                    left: 0;
                    box-sizing: border-box;
                    backface-visibility: hidden;
                    transition: transform 1s ease, opacity 0.5s ease;
                    transform-origin: center center; /* Origen de la transformación para el flip */
                    color: #333;
                }
                
                .page h2 {
                    margin-top: 0;
                    color: #333; /* Asegurar que el título sea visible */
                    z-index: 1; /* Poner sobre el fondo */
                }

                .page .page-content {
                    text-align: center;
                    z-index: 1; /* Poner sobre el fondo */
                    max-height: 80%; /* Evitar que el contenido desborde */
                    overflow-y: auto; /* Scroll si el contenido es mucho */
                }

                .nav-button {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    z-index: 100; /* Asegurar que estén por encima de las páginas */
                    background: rgba(255,255,255,0.8);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: background 0.3s ease, transform 0.3s ease;
                    top: calc(50% - 20px); /* Centrado verticalmente */
                }
                
                .nav-button:hover {
                    background: rgba(255,255,255,1);
                    transform: scale(1.1);
                }
                
                #next-btn {
                    right: -50px; /* Posición fuera del libro para mejor clic */
                }
                                
                #prev-btn {
                    left: -50px; /* Posición fuera del libro */
                }
                
                .nav-button img {
                    width: 24px;
                    height: 24px;
                }
                /* Para el botón "next", la imagen ya está orientada correctamente */
                /* Si necesitas invertirla (depende del icono): */
                /* #next-btn img { transform: scaleX(-1); } */

                
                .hidden {
                    display: none !important;
                }

                /* Estilo para iframe (si se usara, actualmente no para PDFs) */
                .pdf-viewer-element {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                    z-index: 0; 
                }

                @media screen and (max-width:1250px) {
                .book-wrapper {
                    width: 30vw;
                    height: 50vh;
                }    

                @media screen and (max-width:700px) {
                .book-wrapper {
                    width: 75vw;
                    height: 50vh;
                }
                #next-btn {
                    right: -20px; /* Posición fuera del libro para mejor clic */
                }

                #prev-btn {
                    left: -20px; /* Posición fuera del libro */
                }
                
            }
            </style>
            <div class="book-wrapper">
                <div class="book">
                    <div class="page active" id="current-page" style="display: flex;">
                        <h2></h2>
                        <div class="page-content"></div>
                    </div>
                    <div class="page" id="transition-page" style="display: none;">
                        <h2></h2>
                        <div class="page-content"></div>
                    </div>
                </div>
                <div class="nav-button" id="next-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/271/271220.png" alt="Siguiente">
                </div>
                <div class="nav-button" id="prev-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/271/271220.png" alt="Anterior" style="transform: scaleX(-1);">
                </div>
                
            </div>
        `;
    }

    initLogic() {
        this.currentPageElement = this.shadowRoot.getElementById('current-page');
        this.transitionPageElement = this.shadowRoot.getElementById('transition-page');
        this.nextBtn = this.shadowRoot.getElementById('next-btn');
        this.prevBtn = this.shadowRoot.getElementById('prev-btn');

        // Carga la primera página
        this.updatePageContent(this.currentPageElement, this.currentIndex, true);

        if (this.transitionPageElement) {
            this.transitionPageElement.style.display = 'none';
        }

        this.nextBtn.addEventListener('click', () => this.flipPage('next'));
        this.prevBtn.addEventListener('click', () => this.flipPage('prev'));
    }

    async updatePageContent(pageElement, index, isCurrent = false) {
        if (!pageElement || index < 0 || index >= this.pagesData.length) {
            console.error("Error al actualizar contenido de página: Elemento o índice inválido.", pageElement, index);
            return;
        }
        const pageData = this.pagesData[index];
        pageElement.querySelector('h2').textContent = pageData.title;
        const pageContentDiv = pageElement.querySelector('.page-content');
        pageContentDiv.innerHTML = pageData.content || '';

        pageElement.style.backgroundImage = 'none'; // Reset background

        if (pageData.image && pageData.image.toLowerCase().endsWith('.pdf')) {
            const pdfUrl = pageData.image;
            const pageNum = pageData.pdfPage || 1;
            const scale = 1.5; // Ajusta para calidad vs. rendimiento

            if (typeof pdfjsLib === 'undefined') {
                console.error('PDF.js no está cargado.');
                pageContentDiv.innerHTML = 'Error: PDF.js no está cargado. ' + (pageData.content || '');
                return;
            }

            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

            try {
                pageContentDiv.innerHTML = '....'; // Mensaje temporal
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                await page.render(renderContext).promise;

                pageElement.style.backgroundImage = `url('${canvas.toDataURL('image/png')}')`;
                pageElement.style.backgroundSize = 'contain';
                pageElement.style.backgroundPosition = 'center';
                pageElement.style.backgroundRepeat = 'no-repeat';

                pageContentDiv.innerHTML = pageData.content || ''; // Restaurar contenido original

            } catch (error) {
                console.error(`Error renderizando PDF página ${pageNum}:`, error);
                pageElement.style.backgroundImage = 'none';
                pageContentDiv.innerHTML = `¡Descarga
GRATIS!
¡Regístrate y será tuyo! ${pageData.content || ''}`;
            }

        } else if (pageData.image) {
            pageElement.style.backgroundImage = `url('${pageData.image}')`;
            pageElement.style.backgroundSize = 'cover'; // Para imágenes normales, 'cover' suele ser mejor
            pageElement.style.backgroundPosition = 'center';
            pageElement.style.backgroundRepeat = 'no-repeat';
        } else {
            pageElement.style.backgroundImage = 'none';
            // El color de fondo de .page (CSS) se mostrará
        }

        if (isCurrent) {
            this.prevBtn.classList.toggle('hidden', index === 0);
            this.nextBtn.classList.toggle('hidden', index === this.pagesData.length - 1);
        }
    }

    flipPage(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        let newIndex;
        if (direction === 'next') {
            newIndex = this.currentIndex + 1;
            if (newIndex >= this.pagesData.length) {
                this.isAnimating = false;
                return;
            }
        } else { // 'prev'
            newIndex = this.currentIndex - 1;
            if (newIndex < 0) {
                this.isAnimating = false;
                return;
            }
        }

        // Seleccionar los divs de página actuales en el Shadow DOM
        let currentVisiblePage = this.shadowRoot.getElementById('current-page');
        let currentTransitionPage = this.shadowRoot.getElementById('transition-page');

        // Cargar contenido en la página de transición (que entrará)
        this.updatePageContent(currentTransitionPage, newIndex, false);
        currentTransitionPage.style.display = 'flex'; // Hacerla visible (pero transparente y rotada)
        currentTransitionPage.style.opacity = '0';

        // Aplicar transformaciones para la animación
        if (direction === 'next') {
            currentVisiblePage.style.transformOrigin = 'left center'; // Pivote en el lomo izquierdo para página que sale
            currentTransitionPage.style.transformOrigin = 'right center'; // Pivote en el lomo derecho para página que entra

            currentVisiblePage.style.transform = 'rotateY(-180deg)';
            currentTransitionPage.style.transform = 'rotateY(180deg)'; // Comienza rotada desde el otro lado

            requestAnimationFrame(() => { // Sincronizar con el repintado del navegador
                currentTransitionPage.style.opacity = '1';
                currentTransitionPage.style.transform = 'rotateY(0deg)';
            });

        } else { // 'prev'
            currentVisiblePage.style.transformOrigin = 'right center'; // Pivote en el lomo derecho para página que sale
            currentTransitionPage.style.transformOrigin = 'left center'; // Pivote en el lomo izquierdo para página que entra

            currentVisiblePage.style.transform = 'rotateY(180deg)';
            currentTransitionPage.style.transform = 'rotateY(-180deg)'; // Comienza rotada desde el otro lado

            requestAnimationFrame(() => {
                currentTransitionPage.style.opacity = '1';
                currentTransitionPage.style.transform = 'rotateY(0deg)';
            });
        }


        setTimeout(() => {
            currentVisiblePage.style.display = 'none'; // Ocultar la página que salió
            currentVisiblePage.style.opacity = '1'; // Resetear opacidad
            currentVisiblePage.style.transform = 'rotateY(0deg)'; // Resetear transformación

            // Intercambiar IDs para la próxima transición
            currentVisiblePage.id = 'transition-page';
            currentTransitionPage.id = 'current-page';

            // Actualizar referencias en el componente
            // No es necesario reasignar this.currentPageElement y this.transitionPageElement aquí
            // si siempre los buscamos por ID como arriba. O si lo haces, sé consistente.
            // Para simplificar, siempre los buscamos por ID al inicio de flipPage.

            this.currentIndex = newIndex;
            this.isAnimating = false;

            // Actualizar estado de botones para la nueva página actual
            this.updatePageContent(this.shadowRoot.getElementById('current-page'), this.currentIndex, true);

        }, 1000); // Duración de la animación CSS (transition: transform 1s ease)
    }
}

customElements.define('aliat-ebook', FlippingBook);