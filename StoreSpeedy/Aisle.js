// Define the Aisle class
class Aisle {
    constructor() {
        this.items = []; // Initialize an empty array to hold Item objects
        this.number = null;
        this.neighbors = [];
    }

    addNeighbor(item) {
        this.neighbors.push(item);
    }

    // Method to add an item to the aisle
    addItem(item) {
        if (item instanceof Item) {
            this.items.push(item);
            console.log(`${item.name} added to the aisle.`);
        } else {
            console.log('Invalid item. Please provide an instance of Item.');
        }
    }

    // Method to remove an item from the aisle
    removeItem(itemName) {
        const index = this.items.findIndex(item => item.name === itemName);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            console.log(`${removedItem.name} removed from the aisle.`);
        } else {
            console.log(`${itemName} not found in the aisle.`);
        }
    }

    removeNeighbor(itemName) {
        const index = this.neighbors.findIndex(item => item.name === itemName);
        if (index !== -1) {
            const removedItem = this.neighbors.splice(index, 1)[0];
            console.log(`${removedItem.name} removed from the aisle.`);
        } else {
            console.log(`${itemName} not found in the aisle.`);
        }
    }

    // Method to display all items in the aisle
    displayItems() {
        console.log('Items in the aisle:');
        this.items.forEach(item => {
            console.log(`${item.name}: ${item.quantity}: ${item.price}`);
        });
    }
}