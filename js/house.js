document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createHouseForm');
    const outputElement = document.getElementById('outputElement');
    const createHouseButton = document.getElementById('createHouseButton');
    const modal = document.getElementById('createHouseModal');
    const closeModalButton = document.querySelector('.modal .close');

    // Show the modal
    createHouseButton.addEventListener('click', () => {
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

// Create a new house
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const apiUrl = 'https://localhost:7079/api/HouseInfo/Create';
    const formData = new FormData(form);

    const houseData = {
        houseId: formData.get('houseId'),
        houseNo: formData.get('houseNo'),
        streetName: formData.get('streetName'),
        isRented: formData.get('isRented') === 'true',
        noOfApartment: parseInt(formData.get('noOfApartment'), 10),
        houseType: formData.get('houseType'),
        rentPrice: parseFloat(formData.get('rentPrice'))
    };

    console.log('Submitting house data:', houseData);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(houseData)
        });
        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`Create house - Network response was not ok: ${response.statusText}, Response: ${errorResponse}`);
        }
        const newHouse = await response.json();
        console.log('Created house:', newHouse);

        // Remove the line that appends the JSON response to the outputElement
        // outputElement.textContent = `House created: ${JSON.stringify(newHouse)}`;

        // Update the table with the new house
        const tbody = document.querySelector('#posts tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newHouse.id}</td>
            <td>${newHouse.houseNo}</td>
            <td>${newHouse.streetName}</td>
            <td>${newHouse.isRented}</td>
            <td>${newHouse.noOfApartment}</td>
            <td>${newHouse.houseType}</td>
            <td>${newHouse.rentPrice}</td>
            <td><button class="btn btn-danger delete-button" data-id="${newHouse.id}">Delete</button></td>
        `;
        tbody.appendChild(row);

        form.reset();
        fetchHouses();
        modal.style.display = 'none';
        
    } catch (error) {
        console.error('Create error:', error);
        outputElement.textContent = `Create error: ${error.message}`;
    }
});

// Delete an apartment
document.querySelector('#posts tbody').addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-button')) {
        const houseId = e.target.getAttribute('data-id');
        const apiUrl = `https://localhost:7079/api/HouseInfo/Delete/${houseId}`;

        console.log('Deleting house with ID:', houseId);

        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Delete house - Network response was not ok: ${response.statusText}, Response: ${errorResponse}`);
            }
            const deletedHouse = await response.json();
            console.log('Deleted house:', deletedHouse);

            // Remove the line that appends the JSON response to the outputElement
            // outputElement.textContent = `House deleted: ${JSON.stringify(deletedHouse)}`;

            // Remove the row from the table
            e.target.closest('tr').remove();
        } catch (error) {
            console.error('Delete error:', error);
            outputElement.textContent = `Delete error: ${error.message}`;
        }
    }
});

fetchHouses();
});


// Fetch houses on page load
async function fetchHouses() {
    $("#posts").DataTable().destroy()
    const apiUrl = 'https://localhost:7079/api/HouseInfo/All';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Fetch houses - Network response was not ok: ${response.statusText}`);
        }
        const houses = await response.json();
        console.log('Fetched houses:', houses);

        // const tbody = document.querySelector('#posts tbody');
        // tbody.innerHTML = '';
        // houses.forEach(house => {
        //     const row = document.createElement('tr');
        //     row.innerHTML = `
        //         <td>${house.id}</td>
        //         <td>${house.houseNo}</td>
        //         <td>${house.streetName}</td>
        //         <td>${house.isRented}</td>
        //         <td>${house.noOfApartment}</td>
        //         <td>${house.houseType}</td>
        //         <td>${house.rentPrice}</td>
        //         <td><button class="btn btn-danger delete-button" data-id="${house.id}">Delete</button></td>
        //     `;
        //     tbody.appendChild(row);
        // });
        $("#posts").dataTable({
            data:houses,
            
            columns:[
                {data:"id"},
                {data:"houseNo"},
                {data:"streetName"},
                {data:"isRented"},
                {data:"noOfApartment"},
                {data:"houseType"},
                {data:"rentPrice"},
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
