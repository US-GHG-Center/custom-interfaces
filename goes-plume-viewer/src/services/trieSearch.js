import { TrieTree } from "../utils/trieTree";

export class TrieSearch {
    constructor() {
        this.trieTree = new TrieTree();
    }

    addItems(items) {
        // add items to the tire tree
        items.forEach(item => {
            item.split("_").forEach(word => {
                this.trieTree.insert(word);
            });
        });
    }

    getRecommendations(prefix) {
        if (!prefix) {
            return [];
        }
        // return all recommendations
        return this.trieTree.search(prefix);
    }
}