// Define the Cart class
class Cart {
    constructor() {
        this.items = []; // Initialize an empty array to hold Item objects
    }

    // Method to add an item to the cart
    addItem(item) {
        if (item instanceof Item) {
            this.items.push(item);
            console.log(`${item.name} added to the cart.`);
        } else {
            console.log('Invalid item. Please provide an instance of Item.');
        }
    }

    // Method to remove an item from the cart
    removeItem(itemName) {
        const index = this.items.findIndex(item => item.name === itemName);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            console.log(`${removedItem.name} removed from the cart.`);
        } else {
            console.log(`${itemName} not found in the cart.`);
        }
    }

    // Method to display all items in the cart
    displayItems() {
        console.log('Items in the cart:');
        this.items.forEach(item => {
            console.log(`${item.name}: ${item.quantity}`);
        });
    }
}