const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const queries = require('../repositories/UsuarioRepository'); // Repositorio de lógica para la DB
const { isLoggedIn } = require('../lib/auth');

// Listar todos los usuarios
router.get('/', isLoggedIn, async (req, res) => {
    const usuarios = await queries.obtenerTodosLosUsuarios();
    res.render('usuarios/listado', { usuarios });
});

// Mostrar formulario para agregar un usuario
router.get('/agregar', isLoggedIn, (req, res) => {
    res.render('usuarios/agregar');
});

// Agregar un nuevo usuario
router.post('/agregar', isLoggedIn, async (req, res) => {
    const { user_name, user_email, user_password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);

        const nuevoUsuario = {
            user_name,
            user_email,
            user_password: hashedPassword,
        };

        const resultado = await queries.agregarUsuario(nuevoUsuario);

        if (resultado) {
            req.flash('success', 'Usuario agregado con éxito.');
        } else {
            req.flash('error', 'Ocurrió un problema al agregar el usuario.');
        }
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        req.flash('error', 'Error inesperado al agregar el usuario.');
    }
    res.redirect('/usuarios');
});

// Mostrar formulario para modificar un usuario
router.get('/modificar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const usuario = await queries.obtenerUsuarioPorId(id);

    if (usuario) {
        res.render('usuarios/modificar', { usuario });
    } else {
        req.flash('error', 'Usuario no encontrado.');
        res.redirect('/usuarios');
    }
});

// Modificar un usuario
router.post('/modificar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { user_name, user_email, user_password } = req.body;

    try {
        let hashedPassword = null;
        if (user_password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(user_password, salt);
        }

        const datosModificados = {
            user_name,
            user_email,
        };

        if (hashedPassword) {
            datosModificados.user_password = hashedPassword;
        }

        const resultado = await queries.modificarUsuario(id, datosModificados);

        if (resultado) {
            req.flash('success', 'Usuario modificado con éxito.');
        } else {
            req.flash('error', 'Ocurrió un problema al modificar el usuario.');
        }
    } catch (error) {
        console.error('Error al modificar usuario:', error);
        req.flash('error', 'Error inesperado al modificar el usuario.');
    }
    res.redirect('/usuarios');
});

// Eliminar un usuario
router.get('/eliminar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await queries.eliminarUsuario(id);

        if (resultado) {
            req.flash('success', 'Usuario eliminado con éxito.');
        } else {
            req.flash('error', 'No se pudo eliminar el usuario.');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        req.flash('error', 'Error inesperado al eliminar el usuario.');
    }
    res.redirect('/usuarios');
});

module.exports = router;
