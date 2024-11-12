import { TrieTree } from "../utils/trieTree";

export class TrieSearch {
    constructor() {
        this.trieTree = new TrieTree();
    }

    addItems(items) {
        if (!items || !items.length){
            return
        }
        // add items to the tire tree
        items.forEach(item => {
            const capitalizedItem = item.toUpperCase();
            capitalizedItem.split("_").forEach(word => {
                this.trieTree.insert(word, item);
            });
        });
    }

    getRecommendations(prefix) {
        if (!prefix) {
            return [];
        }
        prefix = prefix.toUpperCase();
        // return all recommendations
        const results = this.trieTree.search(prefix);
        return [...new Set(results)];
    }
}
