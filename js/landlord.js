document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createLandlordForm');
    const outputElement = document.getElementById('outputElement');
    const createLandlordButton = document.getElementById('createLandlordButton');
    const modal = document.getElementById('createLandlordModal');
    const closeModalButton = document.querySelector('.modal .close');

    // Show the modal
    createLandlordButton.addEventListener('click', () => {
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

    // Create a new landlord
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const apiUrl = 'https://localhost:7079/api/UserInfo/Create'; // Adjust endpoint as necessary
        const formData = new FormData(form);

        const landlordData = {
            id: formData.get('landlordId'),
            roleName: formData.get('roleName'),
            fName: formData.get('fName'),
            lName: formData.get('lName'),
            phoneNo: formData.get('phoneNo'),
            password: formData.get('password')
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(landlordData)
            });
            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(errorResponse || 'Network response was not ok');
            }
            const newLandlord = await response.json();
            console.log('Created landlord:', newLandlord); // Log the created landlord

            // Update the table with the new landlord
            const tbody = document.querySelector('#posts tbody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${newLandlord.id}</td>
                <td>${newLandlord.roleName}</td>
                <td>${newLandlord.fName}</td>
                <td>${newLandlord.lName}</td>
                <td>${newLandlord.phoneNo}</td>
                <td><button class="btn btn-danger delete-button" data-id="${newLandlord.id}">Delete</button></td>
            `;
            tbody.appendChild(row);

            form.reset(); // Reset the form after successful submission
            fetchLandlords();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Create error:', error);
            outputElement.textContent = `Create error: ${error.message}`;
        }
    });


     // Delete a landlord
    document.querySelector('#posts tbody').addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-button')) {
            const landlordId = e.target.getAttribute('data-id');
            const apiUrl = `https://localhost:7079/api/Landlord/Delete/${landlordId}`; // Adjust endpoint as necessary

            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const deletedLandlord = await response.json();
                console.log('Deleted landlord:', deletedLandlord); // Log the deleted landlord
                outputElement.textContent = `Landlord deleted: ${JSON.stringify(deletedLandlord)}`;
                fetchLandlords(); // Refresh the landlord list
            } catch (error) {
                console.error('Delete error:', error);
                outputElement.textContent = `Delete error: ${error.message}`;
            }
        }
    });

     // Fetch landlords when the page loads
    fetchLandlords();

});

// Fetch landlords on page load
async function fetchLandlords() {
    const apiUrl = 'https://localhost:7079/api/UserInfo/All'; // Adjust endpoint as necessary

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let landlords = await response.json();
        console.log('Fetched landlords:', landlords); // Log the fetched landlords

        // Filter out admin details and roles starting with 'TEN'
        landlords = landlords.filter(landlord =>
            !(landlord.id === 4 && landlord.fName === 'Oluwatobiloba' && landlord.lName === 'Taiwo' && landlord.phoneNo === '09061810859') &&
            !landlord.roleName.startsWith('TEN')
        );

        // const tbody = document.querySelector('#posts tbody');
        // tbody.innerHTML = ''; // Clear the existing table rows
        // landlords.forEach(landlord => {
        //     const row = document.createElement('tr');
        //     row.innerHTML = `
        //         <td>${landlord.id}</td>
        //         <td>${landlord.roleName}</td>
        //         <td>${landlord.fName}</td>
        //         <td>${landlord.lName}</td>
        //         <td>${landlord.phoneNo}</td>
        //         <td><button class="btn btn-danger delete-button" data-id="${landlord.id}">Delete</button></td>
        //     `;
        //     tbody.appendChild(row);
        // });

        $("#posts").dataTable({
            data:landlords,
            
            columns:[
                {data:"id"},
                {data:"roleName"},
                {data:"fName"},
                {data:"lName"},
                {data:"phoneNo"},
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
