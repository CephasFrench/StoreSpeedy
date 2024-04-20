const fs = require('fs');
const axios = require('axios');

// Path to the PDF file on your system
let path = "/Users/cameronhardin/WebstormProjects/StoreSpeedy/StoreSpeedy/ValleyMillsStoreMap.pdf";

// Function to convert a PDF file to a base64 string
function pdfToBase64(pdfFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(pdfFile, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data.toString('base64'));
            }
        });
    });
}

// Function to send the base64 string to a server and handle the response
function sendBase64ToServer(base64String, prompt) {
    let data = {
        "contents": {
            "role": "user",
            "parts": [
                {
                    "inlineData": {
                        "mimeType": "application/pdf",
                        "data": base64String
                    }
                },
                {
                    "text": prompt
                }
            ]
        }
    };
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-aiplatform.googleapis.com/v1/projects/storespeedy/locations/us-central1/publishers/google/models/gemini-1.5-pro-preview-0409:generateContent',
        headers: {
            'Authorization': 'Bearer ya29.a0Ad52N3_rhN0NCQLuR0nk3pgOnYWZ6W_eoN7Au68o4pQu-nUJh8u5ABxoiFtnNjfkhUd6QgEvVOjS7F_5TclVC1DzrM4L-AGs7lQph4ykvw1G81IyqIMCIgjOSZL5O7QlA8ziTyUKkwkufhEohazYKZeyhEUITQrQjnJl9qbN5GYDB3s2-danJhYzekYvlkB2t3g3-US9tsos5OH5pxs7dRV2cuJ6boPjJiPTi-3TaQ6CzrspEQAu-xdOxpvjXVVHcT7n-xmo_SIWn12mlFGHJQaq6_nqCMrLHCmtMzXLFWHHbNyxpmBjlmePVa99K4UHllOlJmA9HSN7vZizm9IYlCW6TIQqJYT2cHCiRMDuyQ84Ay3tXsHsyF7XxkktZODPHiNy3qqDCupvNPlFftAcHYgTYHARhc0OaCgYKAWcSARASFQHGX2Mi2btZqr0-oEmTwppqB6ketg0423', // Replace YOUR_ACCESS_TOKEN with actual token
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios.request(config).then(response => {
        return cleanUpResponseData(response.data);
    }).catch(error => {
        console.error('Error sending data to server:', error);
        throw error;
    });
}

// Function to clean up the data received from the server
function cleanUpResponseData(responseData) {
    console.log("Original ResponseData: \n", responseData);
    try {
        let content = responseData.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
        console.log("Cleaned ResponseData: \n", JSON.stringify(content));
        return JSON.parse(content);
    } catch (error) {
        console.error('Failed to clean up data:', error);
        throw error;
    }
}

// Callback function to handle the base64 string
let callback = base64String => {
    //console.log("Base64 String:", base64String);
};

// Function to get the store service
function getStoreService(pdfFile, callback) {
    pdfToBase64(pdfFile).then(base64String => {
        callback(base64String);
        let prompt = "This pdf gives a top-down view of the layout of an HEB store. Convert page 2 into a detailed json array indexed by aisle number?";
        sendBase64ToServer(base64String, prompt).then(cleanedData => {
            let storeName = "Test Store Name";
            const store = new Store(storeName, cleanedData, base64String);
            console.log('Store initialized with aisles and items:', store);
            store.promptAiForNeighbors(); // Now asking for neighbors after initialization
        }).catch(error => console.error('Failed to send base64 to server:', error));
    }).catch(error => console.error('Error converting PDF to base64:', error));
}

class Store {
    constructor(name, data, base64Pdf) {
        this.name = name;
        this.storeMap = new StoreMap();
        Object.entries(data).forEach(([key, values]) => {
            const aisle = new Aisle(`Aisle ${key}`, key, base64Pdf);
            values.forEach(itemName => {
                aisle.addItem(new Item(itemName));
            });
            this.storeMap.addAisle(aisle);
        });
    }

    promptAiForNeighbors() {
        // Construct a prompt to get neighbors for all aisles
        let prompt = "This pdf gives a top-down view of the layout of an HEB store. Convert page 2 into a list of each aisle and the neighboring aisles in json.";
        sendBase64ToServer(this.storeMap.aisles[0].base64Pdf, prompt).then(data => {
            this.storeMap.updateAisleNeighbors(data);
        }).catch(error => {
            console.error('Error fetching neighbors for aisles:', error);
        });
    }
}

class StoreMap {
    constructor() {
        this.aisles = [];
    }

    addAisle(aisle) {
        this.aisles.push(aisle);
    }

    updateAisleNeighbors(data) {
        console.log('Neighbors data received:', data);
        // Implement logic to update aisles with their neighbors
    }
}

class Aisle {
    constructor(name, location, base64Pdf) {
        this.name = name;
        this.location = location;
        this.items = [];
        this.base64Pdf = base64Pdf;
        this.neighbors = []; // Assume neighbors are also aisles
    }

    addItem(item) {
        this.items.push(item);
    }
}

class Item {
    constructor(name) {
        this.name = name;
    }
}

class Customer {
    constructor(name, store) {
        this.name = name;
        this.store = store;
        this.cart = new Cart();
    }

    addItemToCart(itemName) {
        let findResult = this.store.storeMap.findItem(itemName);
        if (findResult) {
            this.cart.addItem(findResult.item);
        } else {
            console.error("Item not found!");
        }
    }
}

class Cart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.price, 0); // Note: Price not defined in Item class
    }
}

// Invoke the function to start the process
getStoreService(path, callback);