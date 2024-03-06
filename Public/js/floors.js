document.addEventListener('DOMContentLoaded', function() {
    const addFloorForm = document.getElementById('addFloorForm');
    addFloorForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addFloor();
    });

    // Attach a single click event listener to the parent UL element for event delegation
    document.getElementById('floorsList').addEventListener('click', function(event) {
        // Check if the clicked element has the class 'delete-button'
        if (event.target && event.target.classList.contains('delete-button')) {
            const floorId = event.target.getAttribute('data-floor-id');
            deleteFloor(floorId);
        }
    });
});

function addFloor() {
    const level = document.getElementById('floorLevel').value;
    const name = document.getElementById('floorName').value;

    fetch('/api/floors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level: level, name: name }),
    })
    .then(response => response.json())
    .then(data => {
        const floorsList = document.getElementById('floorsList');
        floorsList.innerHTML += `<li id="floor-${data.id}">${data.level} - ${data.name} <button class="delete-button" data-floor-id="${data.id}">Delete</button></li>`;
        document.getElementById('floorLevel').value = '';
        document.getElementById('floorName').value = '';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteFloor(floorId) {
    const id = parseInt(floorId, 10) || floorId;

    fetch(`/api/floors/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            const floorElement = document.getElementById(`floor-${id}`);
            if (floorElement) {
                floorElement.parentNode.removeChild(floorElement);
            }
        } else {
            console.error('Failed to delete the floor.');
        }
    })
    .catch(error => console.error('Error:', error));
}
