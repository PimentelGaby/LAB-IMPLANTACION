const express = require('express');
const router = express.Router();
const queries = require('../repositories/MateriaRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todas las materias
router.get('/', isLoggedIn, async (request, response) => {
    console.log('Entro aqui');
    const materias = await queries.obtenerTodasLasMaterias();
    console.log('Salio aqui');

    response.render('materias/listado', { materias: materias }); // Mostramos el listado de materias
});

// Endpoint que permite mostrar el formulario para agregar una nueva materia
router.get('/agregar', isLoggedIn, async (request, response) => {
    response.render('materias/agregar');
});

// Endpoint para agregar una materia
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { idmateria, materia } = request.body;
    const nuevaMateria = { idmateria, materia };

    const resultado = await queries.insertarMateria(nuevaMateria);

    if (resultado) {
        request.flash('success', 'Registro insertado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/materias');
});

// Endpoint para mostrar el formulario de modificación
router.get('/modificar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const materia = await queries.obtenerMateriaPorid(idmateria);

    if (materia) {
        response.render('materias/modificar', { idmateria, materia });
    } else {
        response.redirect('/materias');
    }
});

// Endpoint que permite modificar una materia
router.post('/modificar/:id', isLoggedIn, async (request, response) => {
    const { id } = request.params;
    const { idmateria, materia } = request.body;
    const datosModificados = { idmateria, materia };

    const resultado = await queries.actualizarMateria(id, datosModificados);

    if (resultado) {
        request.flash('success', 'Registro actualizado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al actualizar el registro');
    }
    response.redirect('/materias');
});

// Endpoint que permite eliminar una materia
router.get('/eliminar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const resultado = await queries.eliminarMateria(idmateria);

    if (resultado > 0) {
        request.flash('success', 'Registro eliminado con éxito');
    } else {
        request.flash('error', 'Ocurrió un problema al eliminar el registro');
    }
    response.redirect('/materias');
});

module.exports = router;
