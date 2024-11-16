const pool = require('../config/databaseController');

module.exports = {
    
    //Consulta para obtener todas las materias

    obtenerTodasLasMaterias: async() => {
        console.log('Hizo la consulta');
        try {
            const result = await pool.query('SELECT * FROM materias');
            return result;
            
        } catch (error) {
            console.error('ocurrio un problema al consultar la lista de materias', error)
        }
    },

     // Insertar materia
     insertarMateria: async(nuevaMateria) =>{
        try {
            const result = await pool.query('INSERT INTO materias SET ?', nuevaMateria);
            return result.affectedRows > 0;
            
        } catch (error) {
            console.error('Ocurrio un problema al insertar la materia',error)
        }
    },

     //Actualizar materia
     actualizarMateria: async(idmateria,datosModificados) =>{
        try {
            const result = await pool.query(' UPDATE materias SET ?  WHERE idmateria = ?', [datosModificados,idmateria]);
            return result.affectedRows > 0;
            
        } catch (error) {
            console.log('Error al actualizar los datos',error);
        }
    },
     //Obtener materia por id
     obtenerMateriaPorid: async(idmateria) => {
        try {
            const [materia]= await pool.query('SELECT * FROM materias WHERE idmateria = ?',[idmateria]);
            return materia;
            
        } catch (error) {
            console.log('Error al obtener materia');
        }
    },

    // Eliminar materia
    eliminarMateria: async(idmateria) => {
        try {
            const result = await pool.query('DELETE FROM materias WHERE idmateria = ?', [idmateria])
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminara materia', error);
        }
    }

}