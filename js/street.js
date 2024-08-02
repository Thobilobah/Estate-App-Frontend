document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createStreetForm');
    const outputElement = document.getElementById('outputElement');
    const createStreetButton = document.getElementById('createStreetButton');
    const modal = document.getElementById('createStreetModal');
    const closeModalButton = document.querySelector('.modal .close');
    const submitButton = document.getElementById('mySubmit');
    const updateButton = document.getElementById('myUpdate');
    const deleteButton = document.createElement('button');

    // Add delete button to the modal
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.style.display = 'none';
    deleteButton.id = 'deleteButton';
    form.appendChild(deleteButton);

    // Show the modal for creating a new street
    createStreetButton.addEventListener('click', () => {
        form.reset(); // Clear the form fields
        document.getElementById('editStreetId').value = ''; // Clear the editStreetId hidden field
        modal.style.display = 'block';
        deleteButton.style.display = 'none'; // Hide the delete button
        submitButton.classList.remove("hideButton");
        updateButton.classList.add("hideButton");
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

    // Create a Street
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const streetId = document.getElementById('streetId').value;
        const streetName = document.getElementById('streetName').value;
        const apiUrl = 'https://localhost:7079/api/StreetInfo/Create';

        const data = {
            streetId: streetId,
            streetName: streetName
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            outputElement.textContent = JSON.stringify(responseData, null, 2);

            form.reset();
            fetchStreets();
            modal.style.display = 'none';

        } catch (error) {
            console.error('Error:', error);
            outputElement.textContent = `Error: ${error.message}`;
        }
    });

    // Update a Street (PUT request)
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        let streetId = document.getElementById('streetId').value;
        const streetName = document.getElementById('streetName').value;
        const apiUrl = 'https://localhost:7079/api/StreetInfo/Update';
        streetId =parseInt(streetId)
        
        const data = {
            id: streetId,
            streetName: streetName
        };

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            outputElement.textContent = JSON.stringify(responseData, null, 2);

            form.reset();
            fetchStreets();
            modal.style.display = 'none';

        } catch (error) {
            console.error('Error:', error);
            outputElement.textContent = `Error: ${error.message}`;
        }
    });

    // Function to delete a street
    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const streetId = document.getElementById('streetId').value;
        const apiUrl = `https://localhost:7079/api/StreetInfo/Delete/${streetId}`;

        try {
            const response = await fetch(apiUrl, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchStreets();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            outputElement.textContent = `Error: ${error.message}`;
        }
    });

    fetchStreets();

    // Fetch streets on page load
    async function fetchStreets() {
        const apiUrl = 'https://localhost:7079/api/StreetInfo/All';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const streets = await response.json();

            $("#posts").DataTable({
                data: streets,
                columns: [
                    { data: "id" },
                    { data: "streetName" },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return `<button class="btn btn-danger edit-button" data-id="${row.id}" data-name="${row.streetName}">Edit</button>`;
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

    // Event delegation to handle Edit button clicks
    $(document).on('click', '.edit-button', function () {
        const streetId = $(this).data('id');
        const streetName = $(this).data('name');

        $('#editStreetId').val(streetId);
        $('#streetId').val(streetId);
        $('#streetName').val(streetName);

        modal.style.display = 'block';
        deleteButton.style.display = 'inline-block'; // Show the delete button

        // Hide submit, show update
        submitButton.classList.add("hideButton");
        updateButton.classList.remove("hideButton");

        console.log('submitButton classes:', submitButton.classList);
        console.log('updateButton classes:', updateButton.classList);
    });
});
