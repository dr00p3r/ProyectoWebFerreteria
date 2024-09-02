document.addEventListener('DOMContentLoaded', function () {
    // Función para obtener las facturas desde el servidor
    function obtenerFacturas() {
        fetch('../php/ver_facturas.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarFacturas(data.facturas);
                } else {
                    alert('Error al obtener facturas: ' + data.message);
                }
            })
            .catch(error => console.error('Error al obtener facturas:', error));
    }

    // Función para mostrar las facturas en la tabla
    function mostrarFacturas(facturas) {
        const tbody = document.getElementById('facturasBody');
        tbody.innerHTML = ''; // Limpiar el contenido anterior

        facturas.forEach(factura => {
            const row = document.createElement('tr');

            // Convertir totalFactura a número antes de usar toFixed()
            const totalFactura = parseFloat(factura.totalFactura) || 0;

            row.innerHTML = `
                <td>${factura.fechaF}</td>
                <td>${factura.cedula}</td>
                <td>${factura.nombre}</td>
                <td>${factura.apellido}</td>
                <td>${totalFactura.toFixed(2)}</td>
                <td>${factura.vendedor}</td>
                <td>
                    <button class="eliminarBtn" data-id="${factura.idF}">Eliminar</button>
                    <button class="generarBtn" data-id="${factura.idF}">Generar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Añadir eventos a los botones de editar, eliminar e imprimir
        document.querySelectorAll('.editarBtn').forEach(btn => {
            btn.addEventListener('click', editarFactura);
        });

        document.querySelectorAll('.eliminarBtn').forEach(btn => {
            btn.addEventListener('click', eliminarFactura);
        });

        document.querySelectorAll('.generarBtn').forEach(btn => {
            btn.addEventListener('click', generarFactura);
        });
    }

    // Función para editar una factura
    function editarFactura(event) {
        const facturaId = event.target.getAttribute('data-id');
        alert(`Editar factura con ID: ${facturaId}`);
    }

    // Función para eliminar una factura
    function eliminarFactura(event) {
        const facturaId = event.target.getAttribute('data-id');

        if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
            fetch('../php/eliminar_factura.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'id': facturaId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Factura eliminada correctamente.');
                    obtenerFacturas();
                } else {
                    alert('Error al eliminar la factura: ' + data.error);
                }
            })
            .catch(error => console.error('Error al eliminar la factura:', error));
        }
    }

    // Función para generar una factura en XML
    function generarFactura(event) {
        const facturaId = event.target.getAttribute('data-id');
        
		let cliente;
		
		var formData = new FormData();
		formData.append('idF', facturaId);
		
		fetch('../php/get_invoice_customer.php'){
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				cliente = data.cliente;
				console.log(cliente);
			} else {
				alert('Error al obtener datos de la factura: ' + data.error);
			}
		})
		.catch(error => console.error('Error al generar la factura'));
		
		let productos;
		
		fetch('../php/get_invoice_products.php'){
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				productos = data.productos;
				console.log(productos);
			} else {
				alert('Error al obtener datos de la factura: ' + data.error);
			}
		})
		.catch(error => console.error('Error al generar la factura'));
		
		let datosEmpresa;
		
		fetch('../php/get_enterprise_data.php'){
			method: 'GET'
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				datosEmpresa = data.datosEmpresa;
				console.log(datosEmpresa);
			} else {
				alert('Error al obtener datos de la factura: ' + data.error);
			}
		})
		.catch(error => console.error('Error al generar la factura'));
		
		const factura = {
			idF = facturaId,
			fechaEmision = new Date(),
			totalSinImpuestos = 0.0,
			totalDescuento = 0.0,
			IVA_actual = 15,
			propina = 0.0,
			importeTotal = 0.0,
			
			moneda = 'DOLAR',
			pagos = [{
					formaPago = 01,
					total = 0.0
				}]
			,
			productos = productos
		};
		
		escribirXML(datosEmpresa, factura);
        
    }

	function escribirXML(datosEmpresa, factura){
		xml = '<?xml version="1.0" encoding="UTF-8"?>' +
			'<factura id="comprobante" version="1.1.0">' +
			'<infoTributaria>' +
			'<ambiente>' + datosEmpresa.ambiente + '</ambiente>' +
			'<tipoEmision> 1 </tipoEmision>' +
			'<razonSocial>' + datosEmpresa.razonSocial + '</razonSocial>'
			'<nombreComercial>' + datosEmpresa.nombreComercial + '</nombreComercial>' +
			'<ruc>'+ datosEmpresa.ruc + '</ruc>';

		let claveAcceso = factura.fechaEmision.getDate().toString().padStart(2, '0') +  // Día
		(factura.fechaEmision.getMonth() + 1).toString().padStart(2, '0') +  // Mes
		factura.fechaEmision.getFullYear().toString() +  // Año
		'01' +  // Código del documento
		datosEmpresa.ruc + 
		datosEmpresa.ambiente.toString() + 
		datosEmpresa.establecimiento.toString().padStart(3, '0') + 
		datosEmpresa.puntoEmision.toString().padStart(3, '0') + 
		factura.idF.toString().padStart(9, '0') + 
		generarCodigoAleatorio + '1';

		claveAcceso = claveAcceso + calcularDigitoVerificador(claveAcceso);

		xml += '<claveAcceso>' + claveAcceso + '</claveAcceso>' +
			'<codDoc>01</codDoc>'+
			'<estab>' + datosEmpresa.establecimiento + '</estab>' +
			'<ptoEmi>' + datosEmpresa.puntoEmision + '</ptoEmi>' + 
			'<secuencial>' + factura.idF + '</secuencial>' + 
			'<dirMatriz>' + datosEmpresa.dirMatriz + '</dirMatriz>' +
		'</infoTributaria>' +
		'<infoFactura>'
			'<fechaEmision>'+factura.fechaEmision.getDay()+'/'+factura.fechaEmision.getMonth()+'/'+
				factura.fechaEmision.getFullYear()+'</fechaEmision>'+
			'<dirEstablecimiento>' + datosEmpresa.dirEstablecimiento + '</dirEstablecimiento>' +
			'<obligadoContabilidad>'+ datosEmpresa.obligadoContabilidad +'</obligadoContabilidad>' +
			'<tipoIdentificacionComprador>'+ factura.datosCliente.tipoIdentificacion +'</tipoIdentificacionComprador>' +
			'<razonSocialComprador>' + factura.datosCliente.razonSocial + '</razonSocialComprador>' +
			'<identificacionComprador>' + factura.datosCliente.identificacion +'</identificacionComprador>' +
			'<totalSinImpuestos>' + factura.totalSinImpuestos + '</totalSinImpuestos>'
			'<totalDescuento>' + factura.totalDescuento + '</totalDescuento>' +
			'<totalConImpuestos>' +
				'<totalImpuesto>' + 
					//total IVA
					'<codigo>2</codigo>'+
					'<codigoPorcentaje>4</codigoPorcentaje>' + 
					'<baseImponible>' + factura.totalSinImpuestos + '</baseImponible>' +
					'<valor>' + factura.totalSinImpuestos * (IVA_actual/100.0) + '</valor>' +
				'</totalImpuesto>'
			'</totalConImpuestos>'
			'<propina>'+ factura.propina + '</propina>'+
			'<importeTotal>' + factura.totalSinImpuestos * (1 + (IVA_actual/100.0)) + factura.propina + '</importeTotal>' + 
			'<moneda>' + factura.moneda + '</moneda>'
			'<pagos>';
		// Iterar sobre los pagos y generar XML para cada uno
		factura.pagos.forEach(function(pago) {
			xml += '<pago>' +
					'<formaPago>' + pago.formaPago + '</formaPago>' +
					'<total>' + pago.total.toFixed(2) + '</total>' +
				   '</pago>';
		});

		xml += '</pagos>' +
			'</infoFactura>' +
			'<detalles>';

		// Iterar sobre los productos y generar XML para cada uno
		factura.productos.forEach(function(producto) {
			xml += '<detalle>' +
					'<codigoPrincipal>' + producto.idP + '</codigoPrincipal>' +
					'<descripcion>' + producto.descripcionP + '</descripcion>' +
					'<cantidad>' + producto.cantidad.toFixed(2) + '</cantidad>' +
					'<precioUnitario>' + producto.precioUnitario.toFixed(2) + '</precioUnitario>' +
					'<descuento>0.00</descuento>' +
					'<precioTotalSinImpuesto>' + producto.precioTotalSinImpuesto.toFixed(2) + '</precioTotalSinImpuesto>' +
					'<detallesAdicionales>' +
						'<detAdicional nombre="informacionAdicional" valor="."/>' +
					'</detallesAdicionales>' +
					'<impuestos>' +
						'<impuesto>' +
							'<codigo>2</codigo>' +
							'<codigoPorcentaje>4</codigoPorcentaje>' +
							'<tarifa>' + factura.IVA_actual + '</tarifa>' +
							'<baseImponible>' + producto.precioTotalSinImpuesto.toFixed(2) + '</baseImponible>' +
							'<valor>' + (producto.precioTotalSinImpuesto * (factura.IVA_actual / 100.0)).toFixed(2) + '</valor>' +
						'</impuesto>' +
					'</impuestos>' +
				'</detalle>';
		});

		xml += '</detalles>' +
			'<infoAdicional>' +
				'<campoAdicional nombre="Telefono">' + factura.datosCliente.telefono + '</campoAdicional>' +
				'<campoAdicional nombre="Email">' + factura.datosCliente.correo + '</campoAdicional>' +
			'</infoAdicional>' +
		'</factura>';

		return xml;
	}

	function generarCodigoAleatorio() {
		// Genera un número aleatorio de 8 dígitos
		return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
	}

	function calcularDigitoVerificador(claveAcceso) {
		// Convertir la clave de acceso en un array de números.
		let numeros = claveAcceso.split('').map(Number);

		// Secuencia de factores [2, 3, 4, 5, 6, 7]
		let factores = [2, 3, 4, 5, 6, 7];

		// Variable para almacenar la suma total
		let sumaTotal = 0;

		// Recorrer el array de derecha a izquierda aplicando los factores
		for (let i = numeros.length - 1, factorIndex = 0; i >= 0; i--, factorIndex++) {
			let factor = factores[factorIndex % factores.length]; // Ciclar los factores
			sumaTotal += numeros[i] * factor; // Multiplicar y sumar
		}

		// Aplicar módulo 11 al resultado
		let modulo11 = sumaTotal % 11;

		// Calcular el dígito verificador
		let digitoVerificador = 11 - modulo11;

		// Ajustar el dígito verificador según las reglas
		if (digitoVerificador === 11) {
			digitoVerificador = 0;
		} else if (digitoVerificador === 10) {
			digitoVerificador = 1;
		}

		return digitoVerificador;
	}
	
	
    // Obtener facturas al cargar la página
    obtenerFacturas();
});
