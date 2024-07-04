'use strict';

const seccionDetalle = document.getElementById('seccionDetalle');
const API_KEY = 'api_key=22645a72c50e8c80af92c5c26d6aeace&language=es';
const BASE_URL = 'https://api.themoviedb.org/3/';
const MOVIE_URL = 'movie/';

const urlParams = new URLSearchParams(window.location.search);
const peliculaId = urlParams.get('id');

const getPeliculaDetalles = async (id) =>{
    const endPoint = BASE_URL+MOVIE_URL+id+'?'+API_KEY;
    const resp = await fetch(endPoint);
    const data = await resp.json();
    console.log(data);
    renderDetalles(data);
}

if (peliculaId) {
    getPeliculaDetalles(peliculaId);
} else {
    console.error('No se encontró ningún ID de película en la URL.');
}

async function renderDetalles(pelicula){

    seccionDetalle.innerHTML = '';

    let html = //html
    `
        <div class="pb-3">
            <h2 class="text-white">Detalles</h2>
        </div>

    `;

    const urlBasePoster = 'https://image.tmdb.org/t/p/w500';

    let descripcion;
    if(pelicula.overview !== null) {
        descripcion = pelicula.overview;
    } else{
        descripcion = 'No tiene descripción disponible';
    } 

    let generosHtml = '';
    if (pelicula.genres && pelicula.genres.length > 0) {
        pelicula.genres.forEach(genero => {
            generosHtml += //html
            `<span class="badge">${genero.name}</span>`;
        });
    }

    const existePelicula = await existePeliculaEnDB(pelicula.id);

    html += //html
    `<article class="card text-white container-xl p-0">
        <div class="row px-3 pt-3">
            <div class="col-md-6 col-lg-4 position-relative div-img-botones p-0">
                <img src="${pelicula.poster_path !== null ? urlBasePoster + pelicula.poster_path : 'img/poster-not-found.jpg'}" alt="${pelicula.title}" class="img-fluid img-card-top rounded">
            </div>
            <div class="col-md-6 col-lg-8 card-body">
                <h3 class="card-title text-white h2">${pelicula.title}</h3>
                <p class="text-white fst-italic fs-6">${pelicula.release_date}</p>
                <div class="d-flex gap-2 flex-wrap generos mb-3">
                    ${generosHtml}
                </div>
                <p class="text-white">${descripcion}</p>


                <button class="btn btn-primary agregar-peli" id="agregar_${pelicula.id}" ${existePelicula ? 'style="display: none;"' : ''}><i class="fa-solid fa-heart me-2" title="Corazón relleno"></i>Agregar a favoritos</button>
                <button class="btn btn-primary quitar-peli" id="quitar_${pelicula.id}" ${existePelicula ? '' : 'style="display: none;"'}><i class="fa-solid fa-heart-broken me-2" title="Corazón relleno"></i>Quitar película de favoritos</button>
            </div>
        </div>

    </article>`;

    seccionDetalle.innerHTML = html;


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