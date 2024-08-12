document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createMakePaymentForm');
    const outputElement = document.getElementById('outputElement');
    const createMakePaymentButton = document.getElementById('createMakePaymentButton');
    const modal = document.getElementById('createMakePaymentModal');
    const closeModalButton = document.querySelector('.modal .close');

    // Show the modal
    createMakePaymentButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    // Hide the modal
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Hide the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Make a new payment
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const apiUrl = 'https://localhost:7079/api/Payment/Create'; // Adjust endpoint as necessary
        const formData = new FormData(form);

        const MakePaymentData = {
            id: formData.get('MakePaymentId'),
            email: formData.get('email'),
            amountPaid: formData.get('amountPaid')
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(MakePaymentData)
            });

            var body = await response.json();
            console.log('Body below:')
            console.log(body);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Created Payment:', body); // Log the created apartment
            outputElement.textContent = `Payment created: ${JSON.stringify(body)}`;

            var win = window.open(body.authorization_url, '_blank');
            win.focus();
            
            form.reset(); // Reset the form after successful submission
            //fetchApartments(); // Refresh the apartment list
            modal.style.display = 'none';
        } catch (error) {
            console.error('Create error:', error);
            outputElement.textContent = `Create error: ${error.message}`;
        }
    });
});
