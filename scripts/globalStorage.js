
// global storage class

// whenever GlobalStorage is required from somewhere else, we are always
// given the same instance of GlobalStorage -> Singleton pattern
class GlobalStorage {
    constructor() {
        this.activeTab = '';
        this.channelTab = {
            "active": '',
            "rectangular": {
                "h": '',
                "B": '',
                "ng": '',
                "φ": '',
                "S": '',
                "P": ''
            },
            "trapezoid": {
                "h": '',
                "b": '',
                "B": '',
                "ng": '',
                "φ": '',
                "S": '',
                "P": ''
            },
            "custom": {
                "points": [],
                "ngInputs": {},
                "S": '',
                "P": ''
            }
        };
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