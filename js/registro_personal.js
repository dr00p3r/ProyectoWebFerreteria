// JavaScript Document
// Generación de contraseña: 8 caracteres aleatorios
let contrasenaAleatoria = Math.random().toString(36).slice(-8);
document.getElementById('password').value = contrasenaAleatoria;

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

document.getElementById('registro-personal').addEventListener('submit', function(e) {
	e.preventDefault();
	
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