// JavaScript Document
document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    fetch('../php/login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
		if (data.success) {
            window.location.href = 'main.html';
        } else {
            if (data.invalidUser) {
				document.getElementById('usuario').classList.add('is-invalid');
            }
			else if(data.invalidPassword){
				document.getElementById('password').classList.add('is-invalid');
			}
            if (data.error) {
                console.log("Error: " + data.error);
            }
        }
    }).catch(error => {
		console.error('Error en el envío del formulario');
	});
});

document.getElementById('usuario').addEventListener('input', function(){
	this.classList.remove('is-invalid');
});

document.getElementById('password').addEventListener('input', function(){
	this.classList.remove('is-invalid');
});