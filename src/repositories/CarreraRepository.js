const pool = require('../config/databaseController');

module.exports = {
    // Obtener todas las carreras
    obtenerTodasLasCarreras: async () => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de carreras: ', error);
        }
    },

    // Agregar una nueva carrera
    agregarCarrera: async (carrera) => {
        const { nombre, descripcion } = carrera;
        try {
            const result = await pool.query('INSERT INTO carreras (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
            return result.insertId; // Devuelve el ID de la carrera agregada
        } catch (error) {
            console.error('Error al agregar la carrera: ', error);
            return null;
        }
    },

    // Actualizar una carrera
    actualizarCarrera: async (idcarrera, carrera) => {
        const { nombre, descripcion } = carrera;
        try {
            const result = await pool.query('UPDATE carreras SET nombre = ?, descripcion = ? WHERE idcarrera = ?', [nombre, descripcion, idcarrera]);
            return result.affectedRows > 0; // Devuelve true si se actualizó la carrera
        } catch (error) {
            console.error('Error al actualizar la carrera: ', error);
            return false;
        }
    },

    // Eliminar una carrera
    eliminarCarrera: async (idcarrera) => {
        try {
            const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
            return result.affectedRows > 0; // Verifica si se eliminó correctamente
        } catch (error) {
            console.error('Error al eliminar la carrera', error);
        }
    }
};
