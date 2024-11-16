const pool = require('../config/databaseController');

module.exports = {
// Consulta para obtener todos los grupos
obtenerTodosLosGrupos: async() => {
  console.log('Hizo la consulta');
    try {
        const result = await pool.query('SELECT a.idgrupo, a.num_grupo,a.anio,a.ciclo,b.materia,c.nombre FROM grupos a,materias b,profesores c WHERE a.idmateria = b.idmateria and a.idprofesor = c.idprofesor;');
        return result;
    } catch (error) {
        console.error('Ocurrio un problema al consultar la lista de grupos: ', error);
    }
},
           

 // Insertar grupo
 insertarGrupo: async(nuevogrupo) => {
  try {
      const result = await pool.query('INSERT INTO grupos SET ?', nuevogrupo);
      return result.insertId;
  } catch (error) {
      console.error('Ocurrio un error al insertar el registro ', error);
  }
},

 // Actualizar grupo
actualizarGrupo: async(idgrupo, datosModificados) => {
  try{
    const result = await pool.query('UPDATE grupos SET ? WHERE idgrupo = ?', [datosModificados,idgrupo]);
    return result.affectedRows > 0;
  }catch(error){
    console.error('Error al actualizar el registro', error);
  }
},



 // Obtener carrera por ID
 obtenerGrupoPorid: async (idgrupo) =>{
  try {
      const[grupo] = await pool.query('SELECT * FROM grupos  WHERE idgrupo = ?',[idgrupo]);
      return grupo;
  } catch (error) {
     console.log('Error para obtener el registro');
  }
 },
 // Eliminar grupo
 eliminarGrupo: async(idgrupo) => {
  try{
    const result = await pool.query('DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]);
    return result.affectedRows > 0;
  }catch(error){
    console.error('Error al eliminar grupo', error);
  }
},

async verificarEstudianteEnGrupo(idGrupo, idEstudiante) {
  try {
    console.log(`Verificando asignación: idGrupo = ${idGrupo}, idEstudiante = ${idEstudiante}`);
    console.log(`Tipo de idGrupo: ${typeof idGrupo}, valor: ${idGrupo}`);
    console.log(`Tipo de idEstudiante: ${typeof idEstudiante}, valor: ${idEstudiante}`);

    // Ejecutar la consulta SQL
    const [rows] = await pool.query(`
      SELECT COUNT(*) as count
      FROM grupo_estudiantes
      WHERE idgrupo = ? AND idestudiante = ?`, [idGrupo, idEstudiante]);

    // Verificar el contenido de rows y su tipo
    if (!rows) {
      console.error("No se obtuvieron resultados válidos de la consulta. 'rows' es undefined o null.");
      return false; // Tratar como no asignado si no se encuentran resultados
    }

    // Comprobar si rows es un arreglo o un objeto y verificar el contenido
    if (Array.isArray(rows)) {
      console.log("Resultado de la consulta (arreglo):", rows);
      if (rows.length > 0 && rows[0].count !== undefined) {
        if (rows[0].count > 0) {
          console.log("Estudiante ya asignado.");
          return true;  // El estudiante ya está asignado al grupo
        } else {
          console.log("Estudiante no asignado.");
          return false;  // El estudiante no está asignado al grupo
        }
      }
    } else if (typeof rows === 'object') {
      console.log("Resultado de la consulta (objeto):", rows);
      if (rows.count !== undefined) {
        if (rows.count > 0) {
          console.log("Estudiante ya asignado.");
          return true;  // El estudiante ya está asignado al grupo
        } else {
          console.log("Estudiante no asignado.");
          return false;  // El estudiante no está asignado al grupo
        }
      }
    }

    // Si no hay un resultado que podamos entender, tratar como no asignado
    console.error("Formato desconocido de los resultados de la consulta.");
    return false;
    
  } catch (error) {
    console.error("Error al verificar estudiante en el grupo: ", error);
    return false;  // Si ocurre un error, retornamos false para evitar la asignación por seguridad
  }
}

,

// Asignar grupo
asignarGrupo: async(asignacion) => {
  try {
  const result = await pool.query("INSERT INTO grupo_estudiantes SET ? ",
  asignacion);
  console.log('Se asigno grupo, resultado: ', result)
  return result;
  } catch (error) {
  console.log('Ocurrio un problema al asignar el grupo', error);
   }
  }
}