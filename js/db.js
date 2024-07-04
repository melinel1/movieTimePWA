'use strict';

const db = new PouchDB('PelisFavs');

// Recibe un objeto peli y la guarda
const guardarPeli = async (peli) => {
    try {
        const res = await db.put(peli);
        console.log('Peli guardada:', res);
    } catch (error) {
        console.error('Error al guardar la peli:', error);
    }
}

// Leer Pelis favoritas
const leerPelisFavs = async () => {
    const docs = await db.allDocs( {include_docs: true, descending: true} )
    const rows = docs.rows.map( item => item.doc );
    return rows
}

// Recibe el ID y elimina la peli de favoritos
const eliminarPeliFav = async (id) =>{
    // const doc = await db.get( "peli_"+id );
    // console.log(doc);
    // await db.remove(doc);
    try {
        const doc = await db.get(id);
        console.log(doc);
        await db.remove(doc);
    } catch (error) {
        console.error('Error al eliminar la peli:', error);
    }
}

// Verificar si la película existe en favoritos del IndexedDB
const existePeliculaEnDB = async (id) => {
    try {
        const doc = await db.get(id.toString());
        return true;
    } catch (error) {
        if (error.status === 404) {
            return false;
        } else {
            console.error('Error al verificar si la peli existe en la DB:', error);
            return false;
        }
    }
}

let peliculasFavoritasArray = [];

// Función de leer pelis de IndexedDB
async function getPeliculasFavoritas(){
    peliculasFavoritasArray = await leerPelisFavs();
    console.log(peliculasFavoritasArray);
    return peliculasFavoritasArray;
}

//*Instanciamos el sw
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js');
} else{
    renderError('Tu navegador no soporta esta Aplicación Web');
}