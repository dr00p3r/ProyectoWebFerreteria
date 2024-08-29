// JavaScript 
let verRoles = 'todo';

document.addEventListener('DOMContentLoaded', () => llenarTabla(verRoles));

async function llenarTabla(estado) {
    const tableBody = document.getElementById('roles-table-body');
    tableBody.innerHTML = '';
    let roles = await obtenerRoles();
    roles.forEach(rol => {
        const row = document.createElement('tr');
        if (estado === 'todo' || rol.estadoR === estado) {
            let rowHtml = `
                <td>${rol.idR}</td>
                <td>${rol.nombreR}</td>
                <td>${rol.descripcionR}</td>
                <td>${rol.accesosR}</td>
                <td>${rol.estadoR}</td>
                <td class="acciones">
                    <button class="btn btn-primary btn-sm edit-btn mb-2" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
				`;
			if(rol.estadoR === 'activo'){
				rowHtml+= '<button class="btn btn-danger btn-sm delete-btn">Eliminar</button></td>';
			}
			else if(rol.estadoR === 'inactivo'){
				rowHtml+= '<button class="btn btn-danger btn-sm activate-btn">Activar</button></td>';
			}
			
			row.innerHTML = rowHtml;
            
            llenarModalEdicion(row, rol);
			añadirEventoEliminarActivar(row, rol);
            llenarModalDetalles(row, rol);

            tableBody.appendChild(row);
        }
    });
}

document.getElementById('submitActualizar').addEventListener('click', function(event){
    event.preventDefault();
    
    const inputs = document.querySelectorAll('#editRolForm .form-control');
    
    let form = document.getElementById('editRolForm');
    let formData = new FormData(form);
	formData.append('strAccesos', accesos.join(','));
    
    if(confirm("¿Está seguro que desea actualizar este rol? " + document.getElementById('nombre').value)){
        fetch('../php/update_rol_data.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                llenarTabla(verRoles);
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

function añadirEventoEliminarActivar(row, rol){
	if(rol.estadoR === 'activo'){
		row.querySelector('.delete-btn').addEventListener('click', () => {
			if(confirm("¿Está seguro que desea desactivar este rol? " + rol.nombreR)){
				actualizarEstado(rol.idR, 'inactivo');
			}
		});
	}
	else if(rol.estadoR === 'inactivo'){
		row.querySelector('.activate-btn').addEventListener('click', () => {
			if(confirm("¿Está seguro que desea reactivar este rol? " + rol.nombreR)){
				actualizarEstado(rol.idR, 'activo');
			}
		});
	}
}

function actualizarEstado(idRol, nuevoEstado){
	let formData = new FormData();
	
	formData.append('id', idRol);
	formData.append('nuevoEstado', nuevoEstado);
	
	fetch('../php/update_rol_state.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
			llenarTabla(verRoles);
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

function llenarModalEdicion(row, rol){
	row.querySelector('.edit-btn').addEventListener('click', () => {
		document.getElementById('idR').value = rol.idR;
		document.getElementById('nombre').value = rol.nombreR;
		document.getElementById('descripcion').value = rol.descripcionR;
	});
}

function llenarModalDetalles(row, rol){
	row.addEventListener('click', (event) => {
		if (event.target.closest('.acciones')) {
			return;
		}
		
		document.getElementById('modal-id').innerText = `Id de Rol: ${rol.idR}`;
		document.getElementById('modal-nombre').innerText = `Nombre de Rol: ${rol.nombreR}`;
		document.getElementById('modal-descripcion').innerText = `Descripción: ${rol.descripcionR}`;
		document.getElementById('modal-accesos').innerText = `Accesos: ${rol.accesosR}`;
		document.getElementById('modal-estado').innerText = `Estado: ${rol.estadoR}`;

		const myModal = new bootstrap.Modal(document.getElementById('rolModal'));
		myModal.show();
	});
}

async function obtenerRoles() {
	let roles = [];
	try {
		const response = await fetch('../php/get_all_roles.php');
		const data = await response.json();

		if (data.success) {
			roles = data.roles;
		} else {
			console.log("Error: " + data.error);
		}
	} catch (error) {
		console.error('Hubo un problema con la operación fetch');
	}
	
	return roles;
}

//Eventos de validacion
let accesos = [];

document.getElementsByName('accesos').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            if (accesos.indexOf(this.value) === -1) {
                accesos.push(this.value);
            }
        } else {
            const index = accesos.indexOf(this.value);
            if (index !== -1) {
                accesos.splice(index, 1);
            }
        }
    });
});
