// Fetch payment info on page load
async function fetchPaymentInfo() {
    const apiUrl = 'https://localhost:7079/api/PaymentInfo/GetAll';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const paymentInfo = await response.json();

        $("#posts").DataTable({
            data: paymentInfo,
            columns: [
                { data: "id" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `${row.accesscode} ${row.referenceNo}`;
                    }
                },
                { data: "amountPaid" },
                { data: "paymentMethod" },
                {
                    data: "paymentStatus",
                    render: function (data, type, row) {
                        return row.paymentStatus ? "Successful" : "Failed";
                    }
                },
                { data: "paymentDate" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `<button class="btn btn-danger edit-button" data-id="${row.id}" data-reference="${row.reference}">Edit</button>`;
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

// Function to get query parameters from the URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// Main function to check query parameters and call the API if needed
function checkAndFetchPaymentInfo() {
    const queryParams = getQueryParams();
    if (queryParams.trxref && queryParams.reference) {
        fetchPaymentInfo();
    }
}

// Call the main function on page load
document.addEventListener("DOMContentLoaded", checkAndFetchPaymentInfo);
