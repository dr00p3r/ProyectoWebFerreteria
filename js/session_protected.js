// JavaScript Document
document.addEventListener('DOMContentLoaded', async () => {
	document.body.style.visibility = 'hidden';
    try {
        const response = await fetch('../php/get_session_data.php');
        const data = await response.json();
        
        if (!(data.loggedin)) {
            window.location.href = 'login.html';
        }else{
			document.body.style.visibility = 'visible';
		}
    } catch (error) {
		window.location.href = 'login.html';
        console.error('Error verificando la sesión');
    }
});