// Define the Customer class
// Define the Customer class
class Customer {
    constructor(name, pdfFile) {
        this.name = name;
        this.cart = new Cart(); // Initialize a cart for the customer
        this._pdfFile = pdfFile; // Reference to a PDF file
    }

    // Getter for PDF file
    get pdfFile() {
        return this._pdfFile;
    }

    // Setter for PDF file
    set pdfFile(pdfFile) {
        this._pdfFile = pdfFile;
    }

    // Method to add an item to the customer's cart
    addItemToCart(item) {
        this.cart.addItem(item);
    }

    // Method to remove an item from the customer's cart
    removeItemFromCart(itemName) {
        this.cart.removeItem(itemName);
    }

    // Method to display all items in the customer's cart
    displayCart() {
        this.cart.displayItems();
    }
}