const helpers = require('handlebars');

// Este helper nos permite comparar 2 valores en la plantilla handlebars
helpers.registerHelper('eq', function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this); // Utilizamos un if ternario
});

// Helper para formato de la fecha


helpers.registerHelper('formatDate', function (date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
});

// Helper para formatear la fecha en formato 'YYYY-MM-DD'
helpers.registerHelper('formatDateEdit', function (date) {
    if (!date) return ''; // Si no hay fecha, devolver vacío
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mes en dos dígitos
    const day = String(d.getDate()).padStart(2, '0'); // Día en dos dígitos
    return `${year}-${month}-${day}`; // Formato compatible con el input de tipo date
  });

module.exports = helpers;
