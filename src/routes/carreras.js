const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarreraRepository');

// Endpoint para mostrar todas las carreras
router.get('/', async (request, response) => {
    const carreras = await queries.obtenerTodasLasCarreras();
    response.render('carreras/listado', { carreras });
});

// Endpoint para mostrar el formulario de agregar una nueva carrera
router.get('/agregar', (request, response) => {
    response.render('carreras/agregar');
});

// Endpoint para agregar una nueva carrera
router.post('/agregar', async (request, response) => {
    const { nombre, descripcion } = request.body;
    try {
        const result = await queries.agregarCarrera({ nombre, descripcion });
        if (result) {
            console.log('Carrera agregada con éxito');
            response.redirect('/carreras');
        } else {
            response.render('carreras/agregar', { error: 'No se pudo agregar la carrera' });
        }
    } catch (error) {
        console.error('Error al agregar carrera:', error);
        response.render('carreras/agregar', { error: 'Hubo un error al agregar la carrera' });
    }
});

// Endpoint para mostrar el formulario de modificar una carrera
router.get('/modificar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;
    const carrera = await queries.obtenerCarreraPorId(idcarrera);
    response.render('carreras/modificar', { carrera });
});

// Endpoint para modificar una carrera
router.post('/modificar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;
    const { nombre, descripcion } = request.body;
    try {
        const result = await queries.actualizarCarrera(idcarrera, { nombre, descripcion });
        if (result) {
            console.log('Carrera modificada con éxito');
            response.redirect('/carreras');
        } else {
            response.render('carreras/modificar', { error: 'No se pudo modificar la carrera' });
        }
    } catch (error) {
        console.error('Error al modificar carrera:', error);
        response.render('carreras/modificar', { error: 'Hubo un error al modificar la carrera' });
    }
});

// Endpoint para eliminar una carrera
router.get('/eliminar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;
    const resultado = await queries.eliminarCarrera(idcarrera);
    if (resultado) {
        console.log('Carrera eliminada con éxito');
    } else {
        console.error('No se pudo eliminar la carrera');
    }
    response.redirect('/carreras');
});

module.exports = router;
