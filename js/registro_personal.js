// JavaScript Document
// Generación de contraseña: 8 caracteres aleatorios
let contrasenaAleatoria = Math.random().toString(36).slice(-8);
document.getElementById('password').value = contrasenaAleatoria;

//Poner maximo a la fecha sin php
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const maxDate = `${yyyy}-${mm}-${dd}`;

document.getElementById('fecha-nacimiento').setAttribute('max', maxDate);

document.getElementById('registro-personal').addEventListener('input', async function() {
    const nombre = document.getElementById('nombre').value.toLowerCase().slice(0, 2);
    const apellido = document.getElementById('apellido').value.toLowerCase();
    let nombreUsuario = nombre + apellido;

    if (nombre && apellido) {
        let coincidencias = 0;
        let unico = false;
		
        while (!unico) {
            if(await verificarUnicidad(nombreUsuario)){
				unico = true;
			}
			else{
				nombreUsuario = nombre + apellido + (++coincidencias);
			}
        }

        document.getElementById('nombre-usuario').value = nombreUsuario;
    }
});

document.getElementById('registro-personal').addEventListener('input', function() {
	 document.getElementById('error-msg').classList.add('d-none');
});

document.getElementById('registro-personal').addEventListener('submit', function(e) {
	e.preventDefault();
	
	const inputs = document.querySelectorAll('#registro-personal .form-control');
    
    inputs.forEach(input => {
        if (input.classList.contains('is-invalid')) {
            let msgerror = document.getElementById('error-msg');
			msgerror.classList.remove('d-none');
			msgerror.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
        }
    });
	
	var formData = new FormData(this);
	
    fetch('../php/register_users.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            if (data.invalidCedula) {
				
            }
            if (data.error) {
                console.log("Error: " + data.error);
            }
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la operación fetch');
    });
});

async function verificarUnicidad(nombreUsuario){
	const formData = new FormData();
    formData.append('nombreUsuario', nombreUsuario);

	try {
		const response = await fetch('../php/check_username.php', {
			method: 'POST',
        	body: formData
		});

		const data = await response.json();
		
		if (data.invalidUsuario) {
			return false;
		} 
		else if (data.success) {
			return true;
		} 
		else if (data.error) {
			console.log("Error: " + data.error);
			return true;
		}
	} catch (error) {
		console.error('Hubo un problema con la operación fetch');
		return true;
	}
}

document.getElementById('nombre').addEventListener('input', function() {
	this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('nombre').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarSoloTexto(this.value)) {
        this.classList.add('is-invalid');
    }else{
		this.classList.add('is-valid');
	}
});

document.getElementById('apellido').addEventListener('input', function() {
	this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('apellido').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarSoloTexto(this.value)) {
        this.classList.add('is-invalid');
    }else{
		this.classList.add('is-valid');
	}
});

document.getElementById('cedula').addEventListener('input', function() {
    this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('cedula').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarCedula(this.value)) {
        this.classList.add('is-invalid');
    }
	else{
		this.classList.add('is-valid');
	}
});

document.getElementById('telefono').addEventListener('input', function() {
    this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('telefono').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarSoloNumeros(this.value) && (this.value.length != 10)) {
        this.classList.add('is-invalid');
    }
	else{
		this.classList.add('is-valid');
	}
});

document.getElementById('fecha-nacimiento').addEventListener('input', function() {
    this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('fecha-nacimiento').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarFechaNacimiento(this.value)) {
        this.classList.add('is-invalid');
    }
	else{
		this.classList.add('is-valid');
	}
});
