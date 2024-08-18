// JavaScript Document
completarSideBarSesion();

document.getElementById('sidebarToggle').addEventListener('click', function () {
	document.querySelector('.sidebar').classList.toggle('show');
});

document.getElementById('sidebarInsideToggle').addEventListener('click', function () {
	document.querySelector('.sidebar').classList.toggle('show');
});

document.getElementById('cerrarSesion').addEventListener('click', function () {
	fetch('../php/close_session.php', { method: 'HEAD' });
	window.location.href = "login.html";
});

function completarSideBarSesion(){
	fetch('../php/get_session_data.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
		let pfpUrl = "../img/pfp_usuarios/"+data.id+"_pfp.jpg";
		if(verificarImagen(pfpUrl)){
		   document.getElementById('pfp').src = pfpUrl;
		}
		document.getElementById('usuario').innerHTML = "" + data.usuario;
		document.getElementById('msgBienvenida').innerHTML = "Hola, " + data.nombre;
    }).catch(error => {
		console.error('Error en el envío del formulario');
	});
}

async function verificarImagen(url) {
    try {
        let response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error("Error al verificar la imagen");
        return false;
    }
}

//Asegurar solo un submenu a la vez
document.addEventListener('DOMContentLoaded', function () {
    const collapses = document.querySelectorAll('.collapse');

    collapses.forEach(function (collapse) {
        collapse.addEventListener('show.bs.collapse', function () {
            collapses.forEach(function (otherCollapse) {
                if (otherCollapse !== collapse) {
                    new bootstrap.Collapse(otherCollapse, {
                        toggle: false
                    }).hide();
                }
            });
        });
    });
});