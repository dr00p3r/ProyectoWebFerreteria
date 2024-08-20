// JavaScript Document
document.addEventListener('DOMContentLoaded', async () => {
	const tableBody = document.getElementById('usuarios-table-body');
	tableBody.innerHTML = '';
	let usuarios = await obtenerUsuarios();
	usuarios.forEach(usuario => {
		const row = document.createElement('tr');
		
		if(usuario.estadoU === 'activo'){
			row.innerHTML = `
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
			<td>
				<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">Editar</button>
			</td>
		`;
			
		row.addEventListener('click', () => {
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
		
		tableBody.appendChild(row);
	});
});

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