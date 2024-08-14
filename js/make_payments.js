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
        await createPayment();
    });

    // Fetch payments on page load
    fetchPaymentInfo();

    async function createPayment() {
        const paymentApiUrl = 'https://localhost:7079/api/Payment/Create'; // Adjust endpoint as necessary
        const formData = new FormData(form);

        const makePaymentData = {
            id: formData.get('MakePaymentId'),
            email: formData.get('email'),
            amountPaid: formData.get('amountPaid')
        };

        try {
            const paymentResponse = await fetch(paymentApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(makePaymentData)
            });

            if (!paymentResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const paymentBody = await paymentResponse.json();
            console.log('Created Payment:', paymentBody);
            outputElement.textContent = `Payment created: ${JSON.stringify(paymentBody)}`;

            // Open the payment authorization URL
            var win = window.open(paymentBody.authorization_url, '_blank');
            win.focus();

            // After payment is created, save the payment information
            await createPaymentInfo(paymentBody);

            form.reset(); // Reset the form after successful submission
            modal.style.display = 'none';

            // Fetch and update payment info after payment is made
            fetchPaymentInfo();
        } catch (error) {
            console.error('Create error:', error);
            outputElement.textContent = `Create error: ${error.message}`;
        }
    }

    async function createPaymentInfo(paymentBody) {
        const paymentInfoApiUrl = 'https://localhost:7079/api/PaymentInfo/Create'; // Adjust endpoint as necessary

        // Extract necessary data for PaymentInfo
        const urlParams = new URLSearchParams(window.location.search);
        const trxref = urlParams.get('trxref') || "default_trxref"; // Default to prevent undefined
        const reference = urlParams.get('reference') || "default_reference"; // Default to prevent undefined

        const paymentInfoData = {
            id: paymentBody.id, // Add the id from paymentBody
            invoiceRefNo: `${trxref} ${reference}`,
            amountPaid: paymentBody.amountPaid,
            paymentMethod: paymentBody.paymentMethod || "Online", // Add a default payment method
            paymentStatus: paymentBody.paymentStatus ? "Successful" : "Failed",
            paymentDate: new Date().toISOString() // Assuming the current date is the payment date
        };

        console.log('Creating Payment Info with data:', paymentInfoData); // Log data being sent to PaymentInfo

        try {
            const paymentInfoResponse = await fetch(paymentInfoApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentInfoData)
            });

            if (!paymentInfoResponse.ok) {
                const errorBody = await paymentInfoResponse.json();
                console.error('Error response body:', errorBody); // Log the error response body
                throw new Error('Network response was not ok');
            }

            const paymentInfoBody = await paymentInfoResponse.json();
            console.log('Created Payment Info:', paymentInfoBody);
            outputElement.textContent += `\nPayment Info created: ${JSON.stringify(paymentInfoBody)}`;
        } catch (error) {
            console.error('Create error:', error);
            outputElement.textContent = `Create error: ${error.message}`;
        }
    }

    async function fetchPaymentInfo() {
        const apiUrl = 'https://localhost:7079/api/PaymentInfo/All';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const payments = await response.json();

            $("#posts").DataTable({
                data: payments,
                columns: [
                    { data: "id" },
                    { data: "invoiceRefNo" },
                    { data: "amountPaid" },
                    { data: "paymentMethod" },
                    { data: "paymentStatus" },
                    { data: "paymentDate" },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return `<button class="btn btn-danger delete-button" data-id="${row.id}">Delete</button>`;
                        }
                    }
                ],
                destroy: true // Allows reinitialization of DataTable
            });
        } catch (error) {
            console.error('Error:', error);
            outputElement.textContent = `Error: ${error.message}`;
        }
    }
});
