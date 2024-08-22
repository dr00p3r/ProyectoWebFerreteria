// JavaScript Document
let verUsuarios = 'todo';

document.addEventListener('DOMContentLoaded', () => llenarTabla(verUsuarios));

async function llenarTabla(estado) {
    const tableBody = document.getElementById('usuarios-table-body');
    tableBody.innerHTML = '';
    let usuarios = await obtenerUsuarios();
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        if (estado === 'todo' || usuario.estadoU === estado) {
            let rowHtml = `
                <td>${usuario.idU}</td>
                <td>${usuario.nombreU}</td>
                <td>${usuario.apellidoU}</td>
                <td>${usuario.cedulaU}</td>
                <td>${usuario.telefonoU}</td>
                <td>${usuario.emailU}</td>
                <td>${usuario.rolU}</td>
                <td>${usuario.estadoCivilU}</td>
                <td>${usuario.nombreUsuario}</td>
				<td>${usuario.fechaCreacionU}</td>
                <td>${usuario.estadoU}</td>
                <td class="acciones">
                    <button class="btn btn-primary btn-sm edit-btn mb-2" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
				`;
			if(usuario.estadoU === 'activo'){
				rowHtml+= '<button class="btn btn-danger btn-sm delete-btn">Eliminar</button></td>';
			}
			else if(usuario.estadoU === 'inactivo'){
				rowHtml+= '<button class="btn btn-danger btn-sm activate-btn">Activar</button></td>';
			}
			
			row.innerHTML = rowHtml;
            
            llenarModalEdicion(row, usuario);
			añadirEventoEliminarActivar(row, usuario);
            llenarModalDetalles(row, usuario);

            tableBody.appendChild(row);
        }
    });
}

document.getElementById('submitActualizar').addEventListener('click', function(event){
    event.preventDefault();
    
    const inputs = document.querySelectorAll('#editUsuarioForm .form-control');
    let valido = true;
    let firstInvalidInput = null;

    inputs.forEach(input => {
        if(input.classList.contains('is-invalid')){
            valido = false;
            if (!firstInvalidInput) {
                firstInvalidInput = input;
            }
        }
    });
    
    if(!valido) {
        if (firstInvalidInput) {
            desplegarAcordeonConError(firstInvalidInput);
            firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    let form = document.getElementById('editUsuarioForm');
    let formData = new FormData(form);
    
    if(confirm("¿Está seguro que desea actualizar este usuario? " + document.getElementById('editNombreUsuario').value)){
        fetch('../php/update_user_data.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                llenarTabla(verUsuarios);
            }
            else{
                if (data.error) {
                    console.log("Error: " + data.error);
                }
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch');
        });
    }
});

function desplegarAcordeonConError(input) {
    const accordionItems = document.querySelectorAll('.accordion-collapse');
    
    accordionItems.forEach(collapseElement => {
        if (collapseElement.classList.contains('show')) {
            collapseElement.classList.remove('show');
            const accordionButton = collapseElement.previousElementSibling.querySelector('.accordion-button');
            if (accordionButton) {
                accordionButton.classList.add('collapsed');
            }
        }
    });
	
    const accordionItem = input.closest('.accordion-item');
    if (accordionItem) {
        const collapseElement = accordionItem.querySelector('.accordion-collapse');
        if (collapseElement && !collapseElement.classList.contains('show')) {
            const accordionButton = accordionItem.querySelector('.accordion-button');
            accordionButton.classList.remove('collapsed');
            collapseElement.classList.add('show');
        }
    }
}

function añadirEventoEliminarActivar(row, usuario){
	if(usuario.estadoU === 'activo'){
		row.querySelector('.delete-btn').addEventListener('click', () => {
			if(confirm("¿Está seguro que desea desactivar este usuario? " + usuario.nombreUsuario)){
				actualizarEstado(usuario.idU, 'inactivo');
			}
		});
	}
	else if(usuario.estadoU === 'inactivo'){
		row.querySelector('.activate-btn').addEventListener('click', () => {
			if(confirm("¿Está seguro que desea reactivar este usuario? " + usuario.nombreUsuario)){
				actualizarEstado(usuario.idU, 'activo');
			}
		});
	}
}

function actualizarEstado(idUsuario, nuevoEstado){
	let formData = new FormData();
	
	formData.append('id', idUsuario);
	formData.append('nuevoEstado', nuevoEstado);
	
	fetch('../php/update_user_state.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
			llenarTabla(verUsuarios);
        }
		else{
			if (data.error) {
                console.log("Error: " + data.error);
            }
		}
    })
    .catch(error => {
        console.error('Hubo un problema con la operación fetch');
    });
}


function llenarModalEdicion(row, usuario){
	row.querySelector('.edit-btn').addEventListener('click', () => {
		document.getElementById('editId').value = usuario.idU;
		document.getElementById('editNombre').value = usuario.nombreU;
		document.getElementById('editApellido').value = usuario.apellidoU;
		document.getElementById('editCedula').value = usuario.cedulaU;
		document.getElementById('editTelefono').value = usuario.telefonoU;
		document.getElementById('editEmail').value = usuario.emailU;
		document.getElementById('editRol').value = usuario.rolU;
		document.getElementById('editEstadoCivil').value = usuario.estadoCivilU;
		document.getElementById('editNombreUsuario').value = usuario.nombreUsuario;
		document.getElementById('editFechaNacimiento').value = usuario.fechaNacimientoU;
		document.getElementById('editEstadoCivil').value = usuario.estadoCivilU;
	});
}

function llenarModalDetalles(row, usuario){
	row.addEventListener('click', (event) => {
		if (event.target.closest('.acciones')) {
			return;
		}
		
		document.getElementById('modal-nombre-usuario').innerText = `Nombre de Usuario: ${usuario.nombreUsuario}`;
		document.getElementById('modal-cedula').innerText = `Cédula: ${usuario.cedulaU}`;
		document.getElementById('modal-telefono').innerText = `Teléfono: ${usuario.telefonoU}`;
		document.getElementById('modal-email').innerText = `Email: ${usuario.emailU}`;
		document.getElementById('modal-nombre').innerText = `Nombre: ${usuario.nombreU}`;
		document.getElementById('modal-apellido').innerText = `Apellido: ${usuario.apellidoU}`;
		document.getElementById('modal-rol').innerText = `Rol: ${usuario.rolU}`;
		document.getElementById('modal-estado-civil').innerText = `Estado civil: ${usuario.estadoCivilU}`;
		document.getElementById('modal-fecha-creacion').innerText = `Fecha de Creación: ${usuario.fechaCreacionU}`;
		document.getElementById('modal-estado').innerText = `Estado: ${usuario.estadoU}`;

		const myModal = new bootstrap.Modal(document.getElementById('usuarioModal'));
		myModal.show();
	});
}

async function obtenerUsuarios() {
	let usuarios = [];
	try {
		const response = await fetch('../php/get_all_users.php');
		const data = await response.json();

		if (data.success) {
			usuarios = data.usuarios;
		} else {
			console.log("Error: " + data.error);
		}
	} catch (error) {
		console.error('Hubo un problema con la operación fetch');
	}
	
	return usuarios;
}

//Eventos de validacion
document.getElementById('editNombre').addEventListener('input', function() {
	this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('editNombre').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarSoloTexto(this.value)) {
        this.classList.add('is-invalid');
    }else{
		this.classList.add('is-valid');
	}
});

document.getElementById('editApellido').addEventListener('input', function() {
	this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('editApellido').addEventListener('blur', function() {
    if (this.value.trim() === "") {
        return;
    }

    if (!validarSoloTexto(this.value)) {
        this.classList.add('is-invalid');
    }else{
		this.classList.add('is-valid');
	}
});


document.getElementById('editTelefono').addEventListener('input', function() {
    this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('editTelefono').addEventListener('blur', function() {
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

document.getElementById('editFechaNacimiento').addEventListener('input', function() {
    this.classList.remove('is-invalid');
	this.classList.remove('is-valid');
});

document.getElementById('editFechaNacimiento').addEventListener('blur', function() {
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
