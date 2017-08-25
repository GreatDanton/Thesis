
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
                "φ": 1,
                "S": '',
                "P": '',
            },
            "trapezoid": {
                "h": 5,
                "b": 5,
                "B": 15,
                "ng": 0.03,
                "φ": 1,
                "S": '',
                "P": '',
            },
            "custom": {
                "points": [
                    { x: 0, y: 5 },
                    { x: 5, y: 0 },
                    { x: 10, y: 0 },
                    { x: 15, y: 5 },
                ],
                "S": '',
                "P": '',
                "ng": 0.03,
                "φ": 1
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