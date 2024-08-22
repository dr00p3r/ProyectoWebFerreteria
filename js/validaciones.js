// JavaScript Document
function validarSoloTexto(texto) {
    const textPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return textPattern.test(texto);
}

function validarSoloNumeros(texto) {
    const textPattern = /^[0-9]+$/;
    return textPattern.test(texto);
}

function validarFechaNacimiento(fecNac){
    const fechaActual = new Date();
    const fechaRecibida = new Date(fecNac);
    
    return (fechaActual >= fechaRecibida);
}

function validarCedula(cedula){
    if (cedula.length !== 10 || isNaN(cedula)) {
        return false;
    }

    const provincia = parseInt(cedula.substring(0, 2), 10);
    
    if (provincia < 1 || provincia > 30) {
        return false;
    }

    let suma = 0;
    let multiplicador = [2, 1];

    for (let i = 0; i < 9; i++) {
        let digito = parseInt(cedula[i], 10);
        let resultado = digito * multiplicador[i % 2];
        
        if (resultado > 9) {
            resultado -= 9;
        }
        
        suma += resultado;
    }

    const ultimoDigito = parseInt(cedula[9], 10);
    const digitoVerificador = (10 - (suma % 10)) % 10;

    return digitoVerificador === ultimoDigito;
}

function validarFechaNacimiento(fecNac){
    const fechaActual = new Date();
    const fechaRecibida = new Date(fecNac);
    
    return (fechaActual >= fechaRecibida);
}