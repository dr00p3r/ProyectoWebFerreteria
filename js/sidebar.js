document.addEventListener('DOMContentLoaded', () => {
    completarSideBarSesion();
    
    document.getElementById('btnInicio').addEventListener('click', function () {
        window.location.href = 'main.html';
    });

    document.getElementById('sidebarFacturar').addEventListener('click', function () {
        window.location.href = 'facturar.html';
    });

    document.getElementById('sidebarClientes').addEventListener('click', function () {
        window.location.href = 'clientes.html';
    });

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
});

async function completarSideBarSesion() {
    try {
        const response = await fetch('../php/get_session_data.php', { method: 'POST' });
        const data = await response.json();
        
        const pfpUrl = `../img/pfp_usuarios/${data.id}_pfp.jpg`;
        const imgExist = await verificarImagen(pfpUrl);
        
        if (imgExist) {
            document.getElementById('pfp').src = pfpUrl;
        }
        
        document.getElementById('usuario').innerHTML = data.usuario;
        document.getElementById('msgBienvenida').innerHTML = `Hola, ${data.nombre}`;
        
        const accesos = data.accesos;
        if (accesos.includes('facturas')) {
            document.getElementById('sidebarFacturar').classList.remove('d-none');
        }
        if (accesos.includes('reportes')) {
            document.getElementById('sidebarReportes').classList.remove('d-none');
        }
        if (accesos.includes('roles')) {
            document.getElementById('sidebarRoles').classList.remove('d-none');
        }
        if (accesos.includes('personal')) {
            document.getElementById('sidebarPersonal').classList.remove('d-none');
        }
        if (accesos.includes('productos')) {
            document.getElementById('sidebarProductos').classList.remove('d-none');
        }
        if (accesos.includes('categorias')) {
            document.getElementById('sidebarCategorias').classList.remove('d-none');
        }
        if (accesos.includes('proveedores')) {
            document.getElementById('sidebarProveedores').classList.remove('d-none');
        }
        if (accesos.includes('clientes')) {
            document.getElementById('sidebarClientes').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error en el envío del formulario', error);
    }
}

async function verificarImagen(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error("Error al verificar la imagen", error);
        return false;
    }
}

// Manejo de colapsos
document.addEventListener('DOMContentLoaded', () => {
    const collapses = document.querySelectorAll('.collapse');

    collapses.forEach(function (collapse) {
        collapse.addEventListener('show.bs.collapse', function () {
            collapses.forEach(function (otherCollapse) {
                if (otherCollapse !== collapse) {
                    new bootstrap.Collapse(otherCollapse, { toggle: false }).hide();
                }
            });
        });
    });
});
