const pool = require('../config/databaseController');

module.exports = {
    // Consulta para obtener todos los estudiantes
    obtenerTodosLosEstudiantes: async () => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de estudiantes: ', error);
        }
    },

    // Agregar un estudiante
    agregarEstudiante: async (estudiante) => {
        const { nombre, apellido, email, usuario, idcarrera } = estudiante;
        try {
            const result = await pool.query('INSERT INTO estudiantes (nombre, apellido, email, usuario, idcarrera) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, email, usuario, idcarrera]);
            return result.insertId; // Devuelve el ID del estudiante agregado
        } catch (error) {
            console.error('Error al agregar el estudiante: ', error);
            return null;
        }
    },

    // Actualizar un estudiante
    actualizarEstudiante: async (idestudiante, estudiante) => {
        const { nombre, apellido, email, usuario, idcarrera } = estudiante;
        try {
            const result = await pool.query('UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, usuario = ?, idcarrera = ? WHERE idestudiante = ?', [nombre, apellido, email, usuario, idcarrera, idestudiante]);
            return result.affectedRows > 0; // Devuelve true si se actualizó el estudiante
        } catch (error) {
            console.error('Error al actualizar el estudiante: ', error);
            return false;
        }
    },

    // Eliminar un estudiante
    eliminarEstudiante: async (idestudiante) => {
        try {
            const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.affectedRows > 0; // Verifica si se eliminó correctamente
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    }
};
