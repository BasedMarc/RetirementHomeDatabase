// Function to handle adding a new resident
function addResident() {
    const firstname = document.getElementById('residentFirstName').value;
    const lastname = document.getElementById('residentLastName').value;
    const age = document.getElementById('residentAge').value;
    const roomId = document.getElementById('residentRoom').value;

    fetch('/api/residents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname: firstname, lastname: lastname, age: age, room: roomId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resident added:', data);
        // Update the UI with the new resident (you can implement this part)
        // For example, append the new resident to the residents list
        const residentsList = document.getElementById('residentsList');
        const newResidentItem = document.createElement('li');
        newResidentItem.textContent = `${data.firstname} ${data.lastname}, Age: ${data.age}`;
        residentsList.appendChild(newResidentItem);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to handle deleting a resident
function deleteResident(residentId) {
    fetch(`/api/residents/${residentId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resident deleted:', data);
        // Remove the deleted resident from the UI
        const residentElement = document.querySelector(`[data-resident-id="${residentId}"]`);
        if (residentElement) {
            residentElement.remove();
        }

        // Remove the deleted resident from the data structure (assuming residentsData is an array)
        residentsData = residentsData.filter(resident => resident.id !== residentId);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



// Event delegation to handle delete button clicks
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-button')) {
        const residentId = event.target.dataset.residentId;
        if (residentId) {
            deleteResident(residentId);
        }
    }
});


// Add event listener to the form
const addResidentForm = document.getElementById('addResidentForm');
addResidentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addResident();
});