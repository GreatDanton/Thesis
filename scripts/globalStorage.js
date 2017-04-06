
// global storage class

// whenever GlobalStorage is required from somewhere else, we are always
// given the same instance of GlobalStorage -> Singleton pattern
class GlobalStorage {
    constructor() {
        this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.activeTab = '';
        this.channelTab = {
            "consumptionCurve": [],
            "active": 'Rectangular',
            "rectangular": {
                "h": 5,
                "B": 10,
                "ng": 0.03,
                "φ": 2,
                "S": '',
                "P": '',
            },
            "trapezoid": {
                "h": '',
                "b": '',
                "B": '',
                "ng": '',
                "φ": '',
                "S": '',
                "P": '',
            },
            "custom": {
                "points": [],
                "ngInputs": {},
                "S": '',
                "P": '',
            }
        };
        this.HETAb = {
            "Qmin": 40,
            "Qmax": 220,
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