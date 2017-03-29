
// global storage class

// whenever GlobalStorage is required from somewhere else, we are always
// given the same instance of GlobalStorage -> Singleton pattern
class GlobalStorage {
    constructor() {
        this.storage = {'a': "hello"};

        this.activeTab = 'activeTab';
        this.channelTab = {};
        this.HETAb = {};
        this.resultsTab = {
            "rawData": '',
            "parsedData": '',
            "wetYear": -1,
            "dryYear": -1,
            "hydrogram": {
                    x: '',
                    y: '',
                    names: ''
                },
        };
    }
}

export default (new GlobalStorage);