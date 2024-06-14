document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://cab6005e1e50b6ca3fde.free.beeceptor.com/api/users';

    // Function to fetch data from API and display it
    function fetchData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const outputDiv = document.getElementById('output');
                outputDiv.innerHTML = ''; // Clear previous data

                data.forEach(item => {
                    const listItem = document.createElement('div');
                    listItem.textContent = item.data; // Assuming your API returns an array of objects with 'data' field
                    listItem.setAttribute('data-id', item.id); // Assuming 'id' is a field in your API response
                    listItem.classList.add('list-item'); // Add a class for styling
                    listItem.addEventListener('click', handleListItemClick);
                    outputDiv.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Initial fetch when page loads
    fetchData();

    // Handle form submission (POST)
    const form = document.getElementById('dataForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = document.getElementById('inputData').value;
        const postData = {
            data: formData // Adjust based on your API requirements
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(response => {
            if (response.ok) {
                fetchData(); // Refresh data after successful addition
                document.getElementById('inputData').value = ''; // Clear input field
            } else {
                console.error('Failed to add data');
            }
        })
        .catch(error => console.error('Error posting data:', error));
    });

    // Handle updating and deleting data (PUT and DELETE)
    let selectedItemId = null;

    function handleListItemClick(event) {
        const itemId = event.currentTarget.getAttribute('data-id');
        selectedItemId = itemId;

        // Show update/delete form
        document.getElementById('updateDeleteForm').style.display = 'block';

        // Prefill update input with current data
        const currentItemText = event.currentTarget.textContent.trim();
        document.getElementById('updateData').value = currentItemText;

        // Update button click handler (PUT)
        document.getElementById('updateButton').addEventListener('click', function() {
            const updatedData = document.getElementById('updateData').value;
            const putUrl = `${apiUrl}/${selectedItemId}`;
            const putData = {
                data: updatedData // Adjust based on your API requirements
            };

            fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(putData),
            })
            .then(response => {
                if (response.ok) {
                    fetchData(); // Refresh data after successful update
                    document.getElementById('updateDeleteForm').style.display = 'none'; // Hide update/delete form
                } else {
                    console.error('Failed to update data');
                }
            })
            .catch(error => console.error('Error updating data:', error));
        });

        // Delete button click handler (DELETE)
        document.getElementById('deleteButton').addEventListener('click', function() {
            const deleteUrl = `${apiUrl}/${selectedItemId}`;

            fetch(deleteUrl, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    fetchData(); // Refresh data after successful deletion
                    document.getElementById('updateDeleteForm').style.display = 'none'; // Hide update/delete form
                } else {
                    console.error('Failed to delete data');
                }
            })
            .catch(error => console.error('Error deleting data:', error));
        });
    }
});
