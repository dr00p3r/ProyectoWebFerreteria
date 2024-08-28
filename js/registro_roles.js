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

document.getElementById('registro-roles').addEventListener('submit', function(e) {
    e.preventDefault();
	
    let formData = new FormData(this);
    formData.append('strAccesos', accesos.join(','));
    
    fetch('../php/register_roles.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
		if (data.success){
			this.reset();
		}
        else {
            if (data.error) {
                console.log("Error: " + data.error);
            }
        } 
    })
    .catch(error => {
        console.error('Hubo un problema con la operación fetch', error);
    });
});