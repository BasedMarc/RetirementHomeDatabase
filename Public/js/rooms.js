document.addEventListener('DOMContentLoaded', function() {
    // Add an event listener to the form submission
    const addRoomForm = document.querySelector('form[action="/rooms/add"]');
    addRoomForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addRoom();
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            deleteRoom(this.getAttribute('data-room-id'));
        });
    });
});

function addRoom() {
    const number = document.getElementById('roomNumber').value;
    const capacity = document.getElementById('roomCapacity').value;
    const floorId = document.getElementById('roomFloor').value;

    fetch('/api/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: number, capacity: capacity, floor: floorId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Room added:', data);
        // Update the UI with the new room (append it to the list)
        const roomsList = document.getElementById('roomsList');
        roomsList.innerHTML += `<li id="room-${data.id}">Room ${data.number}: Capacity ${data.capacity} - Floor ${data.floor}</li>`;
        // Clear input fields
        document.getElementById('roomNumber').value = '';
        document.getElementById('roomCapacity').value = '';
        document.getElementById('roomFloor').value = ''; // You may need to adjust this based on your form
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function deleteRoom(roomId) {
    fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            const roomElement = document.getElementById(`room-${roomId}`);
            if (roomElement) {
                roomElement.parentNode.removeChild(roomElement);
            }
        } else {
            console.error('Failed to delete the room.');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Add event listener to delete buttons
document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function() {
        const roomId = this.getAttribute('data-room-id');
        deleteRoom(roomId);
    });
});