document.getElementById('registro-categorias').addEventListener('submit', function(e) {
    e.preventDefault();
	
    let formData = new FormData(this);
    
    fetch('../php/register_types.php', {
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