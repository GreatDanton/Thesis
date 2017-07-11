
// global storage class

// whenever GlobalStorage is required from somewhere else, we are always
// given the same instance of GlobalStorage -> Singleton pattern
class GlobalStorage {
    constructor() {
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.activeTab = '';
        this.channelTab = {
            "consumptionCurve": [],
            "active": 'Custom',
            "rectangular": {
                "h": 5,
                "B": 10,
                "ng": 0.03,
                "φ": 2,
                "S": '',
                "P": '',
            },
            "trapezoid": {
                "h": 10,
                "b": 70,
                "B": 95,
                "ng": 0.033,
                "φ": 0.14,
                "S": '',
                "P": '',
            },
            "custom": {
                "points": [
                    {x: 0, y: 10},
                    {x: 5, y: 5},
                    {x: 10, y: 5},
                    {x: 15, y: 10},
                ],
                "ngInputs": {0: 0.03, 1: 0.03, 2: 0.03},
                "φ_inputs": {0: 1, 1: 1, 2: 1},
                "S": '',
                "P": '',
            }
        };
        this.HETAb = {
            "Qmin": 40,
            "Qmax": 220,
            "Qteh": 1000,
            "H": 11,
            "η": 90,
        };
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