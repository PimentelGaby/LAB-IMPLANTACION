const pool = require('../config/databaseController');

module.exports = {

    obtenerTodosLosEstudiantes: async () => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        } catch (error) {
            console.error('Ocurrio un problema al consultar la lista de estudiantes: ', error);
        }
    },

    // Eliminar un estudiante
    eliminarEstudiante: async (idestudiante) => {
        try {
            const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el registro', error);
        }
    },

    // Insertar un estudiante
    insertarEstudiante: async (nuevoEstudiante) => {
        try {
            const result = await pool.query("INSERT INTO estudiantes SET ? ", nuevoEstudiante);
            return result.affectedRows > 0;

        } catch (error) {
            console.error('Error al insertar el registro', error);
        }
    },

    //Actualizar estudiante
    actualizarEstudiante: async(idestudiante, datosModificados) => {
      try{
        const result = await pool.query('UPDATE estudiantes SET ? WHERE idestudiante = ?', [datosModificados,idestudiante]);
        return result.affectedRows > 0;
      }catch(error){
        console.error('Error al actualizar el registro', error);
      }
  },

   // Actualizar un estudiante por ID
   obtenerEstudiantePorid: async (idestudiante) => {
    try {
        const result = await pool.query('SELECT * FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
        if (result.length > 0){
           return result[0];
        }else{
           return null;
        }
        
    } catch (error) {
    console.error('Error al actualizar el registro', error);
    }
}
}
