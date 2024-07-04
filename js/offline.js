// historia.js
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    renderPeliculasFavoritas();
});

async function renderPeliculasFavoritas() {
    const seccionFavoritas = document.getElementById('peliculasFavoritas');
    seccionFavoritas.innerHTML = '';

    const peliculasFavoritas = await getPeliculasFavoritas();

    if (peliculasFavoritas.length === 0) {
        seccionFavoritas.innerHTML = //html
        `
        <div class="pb-3 d-flex flex-column justify-content-center align-items-center">
            <h2 class="text-center">¡Aún no has agregado películas a tus Favoritos!</h2>
            <p class="text-center">Ahora no tienes conexión a internet, pero cuando la tengas anímate a buscar películas y guardalas en favoritos...</p>
            <button class="btn btn-secondary mt-3" disabled>Buscar Películas</button>
        </div>
        `;
    } else {
        let htmlResultado = //html
        `
        <div class="pb-3 d-flex flex-column justify-content-center align-items-center">
            <h2 class="text-center">Películas Favoritas</h2>
            <p class="text-center">No tienes conexión a internet. Sin embargo, aquí tienes tus películas favoritas al alcance...</p>
        </div>
        <div class="row">
        `;

        for (let pelicula of peliculasFavoritas) {
            htmlResultado += //html
            `
            <div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                <article class="card">
                    <div class="card-img px-3 pt-3">
                        <div class="position-relative div-img-botones">
                            <img src="${pelicula.poster}" alt="${pelicula.title}" class="img-fluid img-card-top">
                            <button class="btn btn-primary rounded-circle position-absolute top-100 start-100 translate-middle z-3 quitar-peli" onclick="quitarPelicula('${pelicula._id}')" id="quitar_${pelicula._id}"><i class="fa-solid fa-heart" title="Corazón relleno"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${pelicula.title} <span class="text-muted fst-italic fs-6">${pelicula.release_date}</span></h3>
                    </div>
                </article>
            </div>
            `;
        }

        htmlResultado += `</div>`;
        seccionFavoritas.innerHTML = htmlResultado;
    }
}

async function quitarPelicula(id) {
    console.log("Se quita: ", id);
    const btnQuitar = document.getElementById(`quitar_${id}`);
    btnQuitar.style.display = 'none';

    await eliminarPeliFav( id.toString() );

    peliculasFavoritasArray = await leerPelisFavs();
    await renderPeliculasFavoritas();
}

//active
const liActive = document.querySelector(".active").parentElement;
liActive.classList.add('activePadre');