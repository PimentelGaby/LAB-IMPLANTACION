// Lista para almacenar temporalmente los estudiantes
let estudiantes = [];

// Función que permite agregar un estudiante a la tabla temporal
function agregarEstudiante() {
  const idEstudiante = $("#estudiante").val();
  const nombreCompleto = $("#estudiante option:selected").text().trim();
  const idGrupo = $("#idgrupo").val();

  // Validar si se seleccionó un estudiante
  if (!idEstudiante) {
    alert("Debe seleccionar un estudiante");
    return;
  }

  // Validar si el estudiante ya existe en la lista
  if (validarEstudianteExiste(idEstudiante)) {
    alert("El estudiante ya ha sido agregado.");
    return;
  }

  // Agregar el estudiante a la lista temporal
  estudiantes.push({ idestudiante: idEstudiante, nombrecompleto: nombreCompleto, idgrupo: idGrupo });

  // Actualizar la tabla y los datos ocultos
  mostrarEstudiantes();
}

// Función para mostrar los estudiantes en la tabla
function mostrarEstudiantes() {
  const contenido = $("#contenido_tabla");
  const data = $("#data");

  // Limpiar contenido previo
  contenido.empty();
  data.empty();

  if (estudiantes.length > 0) {
    // Iterar sobre los estudiantes y mostrarlos en la tabla
    estudiantes.forEach((estudiante, index) => {
      contenido.append(`
        <tr>
          <td>${estudiante.idestudiante}</td>
          <td>${estudiante.nombrecompleto}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(event, ${index})">Eliminar</button>
          </td>
        </tr>
      `);

      // Agregar los datos ocultos para el formulario
      data.append(`<input type="hidden" name="grupo_estudiantes[${index}][idestudiante]" value="${estudiante.idestudiante}" />`);
      data.append(`<input type="hidden" name="grupo_estudiantes[${index}][idgrupo]" value="${estudiante.idgrupo}" />`);
    });
  } else {
    // Si no hay estudiantes, mostrar mensaje de información vacía
    contenido.append(`
      <tr>
        <td colspan="3" style="text-align: center;">No hay estudiantes asignados.</td>
      </tr>
    `);
  }

  // Agregar siempre el ID del grupo solo una vez
  data.append(`<input type="hidden" name="idgrupo" value="${$("#idgrupo").val()}" />`);
}

// Función que permite validar si un estudiante ya existe en la lista
function validarEstudianteExiste(idEstudiante) {
  return estudiantes.some(estudiante => estudiante.idestudiante === idEstudiante);
}

// Función que permite eliminar un estudiante de la tabla temporal
function eliminarEstudiante(event, index) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del enlace

  // Confirmación de eliminación
  if (!confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
    return;
  }

  // Eliminar el estudiante de la lista temporal
  estudiantes.splice(index, 1);

  // Actualizar la tabla y los datos ocultos
  mostrarEstudiantes();
}
