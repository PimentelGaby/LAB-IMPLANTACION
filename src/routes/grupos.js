const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoRepository');
const materiasQuery = require('../repositories/MateriaRepository');
const profesoresQuery = require('../repositories/ProfesorRepository');
const estudiantesQuery = require('../repositories/EstudianteRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los grupos 
router.get('/', isLoggedIn, async (request, response) => {
  console.log('Entro aqui');
  const grupos = await queries.obtenerTodosLosGrupos();
  console.log('Salio aqui');

  response.render('grupos/listado', { grupos }); // Mostramos el listado de grupos
});

// Endpoint que permite mostrar el formulario para agregar un nuebo grupo
router.get('/agregar',isLoggedIn,  async (request, response) => {

  const lstMaterias = await materiasQuery.obtenerTodasLasMaterias();
  const lstProfesores = await profesoresQuery.obtenerTodosLosProfesores();

  response.render('grupos/agregar', { lstMaterias, lstProfesores });
});


// Endpoint para agregar un grupo 
router.post('/agregar', isLoggedIn, async (request, response) => {
  // Falta agregar logica
  const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
  const nuevoGrupo = { num_grupo, anio, ciclo, idmateria, idprofesor };

  const resultado = await queries.insertarGrupo(nuevoGrupo);

  if(resultado){
    request.flash('success','Registro insertado con exito')
  }else{
    request.flash('error','Ocurrio un problema')
  }


  response.redirect('/grupos');
});


// Endpoint para mostrar el formulario de edición
router.get('/modificar/:idgrupo',isLoggedIn, async (request, response) => {

  const { idgrupo } = request.params;
  const grupo = await queries.obtenerGrupoPorid(idgrupo);

  if (grupo) {
    const lstMaterias = await materiasQuery.obtenerTodasLasMaterias();
    const lstProfesores = await profesoresQuery.obtenerTodosLosProfesores();
    response.render('grupos/modificar', {lstMaterias, lstProfesores, idgrupo, grupo});
  } else {
    response.redirect('/grupos');
  }


});

// Endpoint que permite editar un grupo
router.post('/modificar/:id', isLoggedIn, async (request, response) => {
  const { id } = request.params;
  const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
  const datosModificados = { num_grupo, anio, ciclo, idmateria, idprofesor };

  const resultado = await queries.actualizarGrupo(id, datosModificados);

  if (resultado) {
    console.log('Modificado con exito');
    request.flash('success', 'Registro actualizado con éxito');
    response.redirect('/grupos');
  } else {
    console.log('Error al modificar ');
    request.flash('error', 'Ocurrió un problema al actualizar el registro');
    response.redirect('/grupos');
  }
});

// Endpoint que permite eliminar un grupo
router.get('/eliminar/:idgrupo', isLoggedIn, async (request, response) => {
  // Desestructuramos el objeto que nos mandan en la peticion y extraemos el idestudiante
  const { idgrupo } = request.params;
  const resultado = await queries.eliminarGrupo(idgrupo);
  if(resultado > 0){
    request.flash('success', 'Eliminacion correcta');
    } else {
    request.flash('error', 'Error al eliminar');
    }
  response.redirect('/grupos');
});

// Enpoint que permite navegar a la pantalla para asignar un grupo
router.get('/asignargrupo/:idgrupo',isLoggedIn, async (request, reponse) => {
  const { idgrupo } = request.params;
  // Consultamos el listado de estudiantes disponible
  const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
  reponse.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
});

// Endpoint que permite asignar un grupo
router.post('/asignargrupo', isLoggedIn, async (request, response) => {
  const data = request.body;
  const result = processDataFromForm(data);
  let resultado = null;

  // Verificar los datos que se están recibiendo del formulario
  console.log("Datos recibidos del formulario:", result);

  for (const tmp of result.grupo_estudiantes) {
    const { idgrupo, idestudiante } = tmp;

    // Verificar si el estudiante ya está asignado al grupo
    console.log(`Verificando asignación para: idGrupo = ${idgrupo}, idEstudiante = ${idestudiante}`);
    const yaAsignado = await queries.verificarEstudianteEnGrupo(idgrupo, idestudiante);
    console.log("Ya está asignado:", yaAsignado);

    if (yaAsignado) {
      // Si el estudiante ya está asignado, notificar y continuar con el siguiente estudiante
      console.log(`El estudiante con ID ${idestudiante} ya está asignado al grupo.`);
      request.flash('error', `El estudiante con ID ${idestudiante} ya está asignado al grupo.`);
      continue;  // Continuar con el siguiente estudiante
    } else {
      // Si no está asignado, proceder con la asignación
      console.log("Asignando al estudiante...");
      resultado = await queries.asignarGrupo({ idgrupo, idestudiante });
        // Si la asignación fue exitosa para todos los estudiantes
      console.log("Asignación de grupo realizada con éxito.");
      request.flash('success', 'Asignación de grupo realizada con éxito.');
    }

    if (!resultado) {
      // Si ocurre un error al asignar el grupo, notificar y salir del ciclo
      console.log("Error al asignar el grupo.");
      request.flash('error', 'Ocurrió un problema al realizar la asignación.');
      return response.redirect('/grupos');
    }
  }
  response.redirect('/grupos');
});



// Función para procesar los datos del formulario
function processDataFromForm(data) {
  const result = {
    grupo_estudiantes: []
  };
  for (const key in data) {
    if (key.startsWith('grupo_estudiantes[')) {
      const match = key.match(/\[(\d+)\]\[(\w+)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const property = match[2];
        if (!result.grupo_estudiantes[index]) {
          result.grupo_estudiantes[index] = {};
        }
        result.grupo_estudiantes[index][property] = data[key];
      }
    } else {
      result[key] = data[key];
    }
  }
  return result;
}



module.exports = router;
