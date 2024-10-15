const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');

// Endpoint para mostrar todos los estudiantes
router.get('/', async (request, response) => {
    const estudiantes = await queries.obtenerTodosLosEstudiantes();
    response.render('estudiantes/listado', { estudiantes }); // Mostramos el listado de estudiantes
});

// Endpoint para mostrar el formulario para agregar un nuevo estudiante
router.get('/agregar', (request, response) => {
    response.render('estudiantes/agregar'); // Renderizamos el formulario de agregar
});

// Endpoint para agregar un estudiante
router.post('/agregar', async (request, response) => {
    const { nombre, apellido, email, usuario, idcarrera } = request.body;
    try {
        const result = await queries.agregarEstudiante({ nombre, apellido, email, usuario, idcarrera });
        if (result) {
            console.log('Estudiante agregado con éxito');
            response.redirect('/estudiantes');
        } else {
            response.render('estudiantes/agregar', { error: 'No se pudo agregar el estudiante' });
        }
    } catch (error) {
        console.error('Error al agregar estudiante:', error);
        response.render('estudiantes/agregar', { error: 'Hubo un error al agregar el estudiante' });
    }
});

// Endpoint para mostrar el formulario de modificar estudiante
router.get('/modificar/:idestudiante', async (request, response) => {
    const { idestudiante } = request.params;
    const estudiante = await queries.obtenerEstudiantePorId(idestudiante);
    response.render('estudiantes/modificar', { estudiante });
});

// Endpoint para actualizar un estudiante
router.post('/modificar/:idestudiante', async (request, response) => {
    const { idestudiante } = request.params;
    const { nombre, apellido, email, usuario, idcarrera } = request.body;
    try {
        const result = await queries.actualizarEstudiante(idestudiante, { nombre, apellido, email, usuario, idcarrera });
        if (result) {
            console.log('Estudiante modificado con éxito');
            response.redirect('/estudiantes');
        } else {
            response.render('estudiantes/modificar', { error: 'No se pudo modificar el estudiante' });
        }
    } catch (error) {
        console.error('Error al modificar estudiante:', error);
        response.render('estudiantes/modificar', { error: 'Hubo un error al modificar el estudiante' });
    }
});

// Endpoint para eliminar un estudiante
router.get('/eliminar/:idestudiante', async (request, response) => {
    const { idestudiante } = request.params;
    const resultado = await queries.eliminarEstudiante(idestudiante);
    if (resultado) {
        console.log('Estudiante eliminado con éxito');
    } else {
        console.error('No se pudo eliminar el estudiante');
    }
    response.redirect('/estudiantes');
});

module.exports = router;
