const form = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const nameInput = document.getElementById('name');
const quantityInput = document.getElementById('quantity');

async function fetchItems() {
    const res = await fetch('/api/items');
    const items = await res.json();
    itemList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
      ${item.name} (Qty: ${item.quantity})
        <button onclick="editItem('${item._id}', '${item.name}', ${item.quantity})">Edit</button>
        <button onclick="deleteItem('${item._id}')">Delete</button>
    `;
        itemList.appendChild(li);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const item = {
        name: nameInput.value,
        quantity: parseInt(quantityInput.value)
    };
    await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    nameInput.value = '';
    quantityInput.value = '';
    fetchItems();
});

async function deleteItem(id) {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    fetchItems();
}

function editItem(id, oldName, oldQty) {
    const newName = prompt("Edit item name:", oldName);
    const newQty = prompt("Edit quantity:", oldQty);
    if (newName !== null && newQty !== null) {
        fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, quantity: parseInt(newQty) })
        }).then(fetchItems);
    }
}

fetchItems();
