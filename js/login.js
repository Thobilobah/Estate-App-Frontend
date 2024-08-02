document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();
    
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    
    console.log("Phone Number:", phoneNumber); // Debugging line
    console.log("Password:", password); // Debugging line
    
    fetch('https://localhost:7079/api/UserInfo/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password
        })
    })
    .then(response => {
        console.log('Response Status:', response.status); // Debugging line
        return response.json();
    })
    .then(res => {
        console.log('Response Data:', res); // Debugging line
        if (res.responseCode === 200) {
            if(res.data.includes("TEN")){
                window.location.href = '/index2.html';
            }else{
alert("not implemented")
            }
            
        } else {
            alert(res.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});
