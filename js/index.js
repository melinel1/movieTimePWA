'use strict';

const inputBusqueda = document.getElementById('busqueda');
const btnSubmit = document.getElementById('submitBuscar');
const seccionResultado = document.getElementById('peliculaEncontrada');
const seccionPopular = document.getElementById('peliculasPopulares');
const form = document.getElementById('BusquedaForm');

const API_KEY = 'api_key=22645a72c50e8c80af92c5c26d6aeace&language=es';
const BASE_URL = 'https://api.themoviedb.org/3/';

const getPeliculasPopulares = async () =>{
    const endPoint= `${BASE_URL}discover/movie?sort_by=popularity.desc&${API_KEY}`;

    const resp = await fetch(endPoint);
    const data = await resp.json();
    console.log(data);
    renderPelisPopulares(data.results);
}

const userEffect = () => {
    getPeliculasPopulares();
}

userEffect();

const spinner = document.createElement('div');
spinner.id = 'spinner';
spinner.classList.add('text-center', 'z-3', 'my-3', 'd-flex', 'justify-content-center');
spinner.setAttribute('role', 'status');
spinner.innerHTML = //html
`
<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
</div>
`;

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const busqueda = inputBusqueda.value.trim();

    if(busqueda && busqueda !== ''){
        try {
            seccionResultado.innerHTML = '';
            seccionResultado.appendChild(spinner);

            const endPoint = BASE_URL + 'search/movie?' + API_KEY +'&query='+ busqueda;
            const resp = await fetch(endPoint);
            const data = await resp.json();

            if (data.results.length === 0) {
                throw new Error('No se encontraron resultados.');
            } else {
                seccionResultado.removeChild(spinner);
                await renderResultados(data.results);
                seccionPopular.style.display = 'none';
                seccionPopular.style.setProperty('display', 'none', 'important');
            }
        } catch (error) {
            seccionResultado.removeChild(spinner);
            seccionResultado.classList.remove('p-3', 'mb-3', 'sombraResultados', 'bg-primary');

            Swal.fire({
                title: "Ups...",
                text: `¡Ocurrió un error en el servidor! Intenta de nuevo con otra película o sé más específico, sino por favor intenta más tarde. Detalles del error: ${error.message}`,
                icon: "error"
            });
        }
    } else{
        Swal.fire({
            title: "Campo vacío",
            text: "Por favor, ingresa el nombre de una película para buscar.",
            icon: "warning"
        });
        return;
    }
});

async function renderPelisPopulares(arrayPeliculas) {
    seccionPopular.innerHTML = '';

    let htmlPopulares = //html
    `
        <div class="pb-3 d-flex flex-column justify-content-center align-items-center">
            <h2 class="text-center text-white">Películas Populares</h2>
        </div>
        <div class="row">
    `;

    const urlBasePoster = 'https://image.tmdb.org/t/p/w500';

    for (let pelicula of arrayPeliculas) {
        const existePelicula = await existePeliculaEnDB(pelicula.id);

        let titulo, poster, descripcion, fecha, id;

        id = pelicula.id;
        titulo = pelicula.title;
        poster = pelicula.poster_path !== null ? urlBasePoster + pelicula.poster_path : 'img/poster-not-found.jpg';
        fecha = pelicula.release_date;

        if(pelicula.overview !== null && pelicula.overview !== '') {
            descripcion = pelicula.overview; descripcion= descripcion.substring(0, 45) + '...';
        } else{
            descripcion = 'No tiene descripción disponible';
        } 

        htmlPopulares += //html
        `
            <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-2">
                <article class="card text-white">
                    <div class="card-img px-3 pt-3">
                        <div class="position-relative div-img-botones">
                            <img src="${poster}" alt="${titulo}" class="img-fluid img-card-top rounded">
                            <button class="btn btn-primary rounded-circle position-absolute top-100 start-100 translate-middle z-3 agregar-peli" id="agregar_${id}" ${existePelicula ? 'style="display: none;"' : ''}><i class="fa-regular fa-heart" title="Corazón no relleno"></i></button>
                            <button class="btn btn-primary rounded-circle position-absolute top-100 start-100 translate-middle z-3 quitar-peli" id="quitar_${id}" ${existePelicula ? '' : 'style="display: none;"'}><i class="fa-solid fa-heart" title="Corazón relleno"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-white h5">${titulo} <span class=" text-white fst-italic fs-6">${fecha}</span></h3>
                        <p class=" text-white">${descripcion}</p>
                        <a href="detalle.html?id=${id}" class="btn btn-primary">Ver más</a>
                    </div>
                </article>
            </div>
        `;
    }

    htmlPopulares += `</div>`;
    seccionPopular.innerHTML = htmlPopulares;

    for (let pelicula of arrayPeliculas) {
        const id = pelicula.id;
        const poster = pelicula.poster_path !== false ? urlBasePoster + pelicula.poster_path : 'img/poster-not-found.jpg';
        const title = pelicula.title;
        const overview = pelicula.overview;
        const release_date = pelicula.release_date;

        const btnAgregar = document.getElementById(`agregar_${id}`);
        const btnQuitar = document.getElementById(`quitar_${id}`);

        btnAgregar.addEventListener('click', () => agregarPelicula(id, title, release_date, poster, overview));
        btnQuitar.addEventListener('click', () => quitarPelicula(id));

    }
}

async function renderResultados(arrayPeliculas) {
    seccionResultado.innerHTML = '';

    let htmlResultado = //html
    `
        <div class="pb-3 d-flex flex-column justify-content-center align-items-center">
            <h2 class="text-center">Resultados</h2>
        </div>
        <div class="row">
    `;

    const urlBasePoster = 'https://image.tmdb.org/t/p/w500';

    for (let pelicula of arrayPeliculas) {
        try {
            seccionResultado.appendChild(spinner);

            seccionResultado.removeChild(spinner);

            if (arrayPeliculas.length < 1) {
                throw new Error(arrayPeliculas.Error);
            } else if (arrayPeliculas.length >= 1) {
                const existePelicula = await existePeliculaEnDB(pelicula.id);

                let titulo, poster, descripcion, fecha, id;

                id = pelicula.id;
                titulo = pelicula.title;
                poster = pelicula.poster_path !== null ? urlBasePoster + pelicula.poster_path : 'img/poster-not-found.jpg'
                fecha = pelicula.release_date;

                if(pelicula.overview !== null && pelicula.overview !== '') {
                    descripcion = pelicula.overview; descripcion= descripcion.substring(0, 45) + '...';
                } else{
                    descripcion = 'No tiene descripción disponible';
                } 

                seccionResultado.classList.add('p-3', 'mb-3', 'sombraResultados', 'bg-primary');

                htmlResultado += //html
                `
                    <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                        <article class="card text-white">
                            <div class="card-img px-3 pt-3">
                                <div class="position-relative div-img-botones">
                                    <img src="${poster}" alt="${titulo}" class="img-fluid img-card-top rounded">
                                    <button class="btn btn-primary rounded-circle position-absolute top-100 start-100 translate-middle z-3 agregar-peli" id="agregar_${id}" ${existePelicula ? 'style="display: none;"' : ''}><i class="fa-regular fa-heart" title="Corazón no relleno"></i></button>
                                    <button class="btn btn-primary rounded-circle position-absolute top-100 start-100 translate-middle z-3 quitar-peli" id="quitar_${id}" ${existePelicula ? '' : 'style="display: none;"'}><i class="fa-solid fa-heart" title="Corazón relleno"></i></button>
                                </div>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title text-white h5">${titulo} <span class=" text-white fst-italic fs-6">${fecha}</span></h3>
                                <p class=" text-white">${descripcion}</p>
                                <a href="detalle.html?id=${id}" class="btn btn-primary">Ver más</a>
                            </div>
                        </article>
                    </div>
                `;
            }
        } catch (error) {
            seccionResultado.classList.remove('p-3', 'mb-3', 'sombraResultados', 'bg-primary');
            seccionResultado.removeChild(spinner);

            Swal.fire({
                title: "Ups...",
                text: `¡Ocurrió un error en el servidor! Intenta de nuevo con otra película o sé más específico, sino por favor intenta más tarde. Detalles del error: ${error.message}`,
                icon: "error"
            });
        }
    }

    htmlResultado += `</div>`;
    seccionResultado.innerHTML = htmlResultado;

    for (let pelicula of arrayPeliculas) {
        const id = pelicula.id;
        const poster = pelicula.poster_path !== false ? urlBasePoster + pelicula.poster_path : 'img/poster-not-found.jpg';
        const title = pelicula.title;
        const overview = pelicula.overview;
        const release_date = pelicula.release_date;

        const btnAgregar = document.getElementById(`agregar_${id}`);
        const btnQuitar = document.getElementById(`quitar_${id}`);

        btnAgregar.addEventListener('click', () => agregarPelicula(id, title, release_date, poster, overview));
        btnQuitar.addEventListener('click', () => quitarPelicula(id));

    }
}

async function agregarPelicula(id, title, release_date, poster, overview) {
    const fecha = new Date().toLocaleDateString();

    const pelicula = {
        _id: id.toString(),
        title,
        release_date,
        fecha, 
        poster, 
        overview
    };

    const btnAgregar = document.getElementById(`agregar_${id}`);
    btnAgregar.style.display = 'none';
    const btnQuitar = document.getElementById(`quitar_${id}`);
    btnQuitar.style.display = 'block';

    await guardarPeli(pelicula);
    console.log(pelicula);
    await getPeliculasFavoritas();
}

async function quitarPelicula(id) {
    console.log("Se quita: ", id);

    const btnAgregar = document.getElementById(`agregar_${id}`);
    const btnQuitar = document.getElementById(`quitar_${id}`);
    btnQuitar.style.display = 'none';
    btnAgregar.style.display = 'block';

    await eliminarPeliFav( id.toString() );

    peliculasFavoritasArray = await leerPelisFavs();

    await getPeliculasFavoritas();
}


//* Toast para Descargar App
let aviso;
let toastInstalar = document.getElementById('toast-install');
let toastBienvenida = document.getElementById('toast-welcome');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    aviso = e;

    mostrarMensajeInstalar();
});


function mostrarMensajeInstalar(){
    let toast = new bootstrap.Toast(toastInstalar);
    toast.show();
}

function mostrarMensajeBienvenida(){
    let toast = new bootstrap.Toast(toastBienvenida);
    toast.show();
}

document.getElementById('btn-install').addEventListener('click', () => {
    let toast = new bootstrap.Toast(toastInstalar);
    toast.hide();

    aviso.prompt();
    aviso.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Usuario aceptó la instalación');
            mostrarMensajeBienvenida();
        } else {
            console.log('Usuario rechazó la instalación');
        }
    });
});


//active
const liActive = document.querySelector(".active").parentElement;
liActive.classList.add('activePadre');