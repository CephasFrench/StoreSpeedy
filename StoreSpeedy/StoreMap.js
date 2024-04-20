import {ItemNode} from './ItemNode';

export class StoreMap {
    constructor(jsonData) {
        console.log('inside constuctor');
        this.itemNodes = this.parseJSON(jsonData);
    }

    parseJSON(jsonData) {
        console.log('parseJSON');
        const parsedData = [];
        for (const {id, neighbors} of jsonData) {
            const itemNode = new ItemNode('3', '3');
            parsedData.push(itemNode);
        }
        console.log('finished parsing');
        return parsedData;
    }



    getItemNodes()
    {
        return this.itemNodes;
    }
}