const pool = require('../config/databaseController');

module.exports = {
    // Obtener todos los usuarios
    obtenerTodosLosUsuarios: async () => {
        try {
            const result = await pool.query('SELECT * FROM user_login');
            return result;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    },

    // Obtener un usuario por ID
    obtenerUsuarioPorId: async (id) => {
        try {
            const [usuario] = await pool.query('SELECT * FROM user_login WHERE id = ?', [id]);
            return usuario;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    },

    // Agregar un nuevo usuario
    agregarUsuario: async (nuevoUsuario) => {
        try {
            const result = await pool.query('INSERT INTO user_login SET ?', nuevoUsuario);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al agregar el usuario:', error);
        }
    },

    // Modificar un usuario
    modificarUsuario: async (id, datosModificados) => {
        try {
            const result = await pool.query('UPDATE user_login SET ? WHERE id = ?', [datosModificados, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al modificar el usuario:', error);
        }
    },

    // Eliminar un usuario
    eliminarUsuario: async (id) => {
        try {
            const result = await pool.query('DELETE FROM user_login WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    },
};
