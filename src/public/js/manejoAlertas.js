// Desaparecer la alerta de éxito después de 3 segundos
setTimeout(function () {
    const successAlert = document.querySelector('.alert-success');
    if (successAlert) {
        successAlert.style.display = 'none';
    }
}, 3000);

// Desaparecer la alerta de error después de 3 segundos
setTimeout(function () {
    const dangerAlert = document.querySelector('.alert-danger');
    if (dangerAlert) {
        dangerAlert.style.display = 'none';
    }
}, 3000);
