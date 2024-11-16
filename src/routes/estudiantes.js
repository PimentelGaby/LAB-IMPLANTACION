const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');
const carrerasQuery = require('../repositories/CarreraRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los estudiantes
router.get('/', isLoggedIn, async (request, response) => {
    const estudiantes = await queries.obtenerTodosLosEstudiantes();
    response.render('estudiantes/listado', { estudiantes }); // Mostramos el listado de estudiantes
});

// Endpoint que permite mostrar el formulario para agregar un nuevo estudiante
router.get('/agregar', isLoggedIn, async (request, response) => {
    const lstCarreras = await carrerasQuery.obtenerTodasLasCarreras();
    // Renderizamos el formulario
    response.render('estudiantes/agregar', { lstCarreras });
});

// Endpoint para agregar un estudiante
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { idestudiante, nombre, apellido, email, idcarrera, usuario } = request.body;
    const nuevoEstudiante = { idestudiante, nombre, apellido, email, idcarrera, usuario };
    const resultado = await queries.insertarEstudiante(nuevoEstudiante);

    if (resultado) {
        request.flash('success', 'Registro insertado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/estudiantes');
});

// Endpoint para mostrar el formulario de modificación
router.get('/modificar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const estudiante = await queries.obtenerEstudiantePorid(idestudiante);

    if (estudiante) {
        const lstCarreras = await carrerasQuery.obtenerTodasLasCarreras();
        response.render('estudiantes/modificar', { lstCarreras, idestudiante, estudiante });
    } else {
        response.redirect('/estudiantes');
    }
});

// Endpoint que permite modificar un estudiante
router.post('/modificar/:id', isLoggedIn, async (request, response) => {
    const { id } = request.params;
    const { idestudiante, nombre, apellido, email, idcarrera, usuario } = request.body;
    const datosModificados = { idestudiante, nombre, apellido, email, idcarrera, usuario };

    const resultado = await queries.actualizarEstudiante(id, datosModificados);

    if (resultado) {
        request.flash('success', 'Registro actualizado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al actualizar el registro');
    }

    response.redirect('/estudiantes');
});

// Endpoint que permite eliminar un estudiante
router.get('/eliminar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const resultado = await queries.eliminarEstudiante(idestudiante);
    if (resultado > 0) {
        request.flash('success', 'Registro eliminado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al eliminar el registro');
    }
    response.redirect('/estudiantes');
});

module.exports = router;
