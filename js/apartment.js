document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createApartmentForm');
    const outputElement = document.getElementById('outputElement');
    const createApartmentButton = document.getElementById('createApartmentButton');
    const modal = document.getElementById('createApartmentModal');
    const closeModalButton = document.querySelector('.modal .close');

    // Show the modal
    createApartmentButton.addEventListener('click', () => {
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




    // Create a new apartment
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const apiUrl = 'https://localhost:7079/api/Apartment/Create'; // Adjust endpoint as necessary
        const formData = new FormData(form);

        const apartmentData = {
            id: formData.get('apartmentId'),
            name: formData.get('apartmentName')
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apartmentData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newApartment = await response.json();
            console.log('Created apartment:', newApartment); // Log the created apartment
            outputElement.textContent = `Apartment created: ${JSON.stringify(newApartment)}`;
            
            form.reset(); // Reset the form after successful submission
            fetchApartments(); // Refresh the apartment list
            modal.style.display = 'none';
        } catch (error) {
            console.error('Create error:', error);
            outputElement.textContent = `Create error: ${error.message}`;
        }
    });



    // Delete an apartment
    document.querySelector('#posts tbody').addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-button')) {
            const apartmentId = e.target.getAttribute('data-id');
            const apiUrl = `https://localhost:7079/api/Apartment/Delete/${apartmentId}`; // Adjust endpoint as necessary

            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const deletedApartment = await response.json();
                console.log('Deleted apartment:', deletedApartment); // Log the deleted apartment
                outputElement.textContent = `Apartment deleted: ${JSON.stringify(deletedApartment)}`;
                fetchApartments(); // Refresh the apartment list
            } catch (error) {
                console.error('Delete error:', error);
                outputElement.textContent = `Delete error: ${error.message}`;
            }
        }
    });

    fetchApartments();
});


   // Fetch apartments on page load
async function fetchApartments() {
    $("#posts").DataTable().destroy()
    const apiUrl = 'https://localhost:7079/api/ApartmentInfo/All'; // Adjust endpoint as necessary

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const apartments = await response.json();
        console.log('Fetched apartments:', apartments); // Log the fetched apartments
    //    const tbody = document.querySelector('#posts tbody');
    //     tbody.innerHTML = ''; // Clear the existing table rows
    //     apartments.forEach(apartment => {
    //         const row = document.createElement('tr');
    //         row.innerHTML = `
    //             <td>${apartment.id}</td>
    //             <td>${apartment.aName}</td>
    //             <td><button class="btn btn-danger delete-button" data-id="${apartment.id}">Delete</button></td>
    //         `;
    //         tbody.appendChild(row);
    //     });
        $("#posts").dataTable({
            data:apartments,
            
            columns:[
                {data:"id"},
                {data:"aName"},
                {data:null,
                    render: function(x,y,z){
                        return `<button class="btn btn-danger delete-button btnDelete" >Delete</button>`
                    }
                },
            ]
        })
    } catch (error) {
        console.error('Fetch error:', error);
        outputElement.textContent = `Fetch error: ${error.message}`;
    }
}
