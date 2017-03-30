/* example of data we are parsing
day.month.year,flow

sample_csv = `
1.1.2010,50.00
2.1.2010,55.10
3.1.2010,60.10
4.1.2010,75.55
5.1.2010,50.25
1.2.2010,10.25
5.3.2011,10
`
*/

// parse csv input data, returns hash map => ( [year] = [month]: monthly_flow )
function createMonthlyFlow(input_data) {
    // array of lines of data
    let linesOfData = input_data.split('\n');

    let waterFlow = {};

    // loop through data, create hash map of values
    for (let i of linesOfData) {
        if (i.length > 0) {  // filter empty lines
            let data_arr = i.split(',');
            let date = data_arr[0];
            let flow = parseFloat(data_arr[1]);

            // if flow is missing, assign 0
            if (flow === undefined) {
                flow = 0;
            }

            let date_arr = date.split('.');
            let day = parseInt(date_arr[0]);
            let month = parseInt(date_arr[1]);
            let year = parseInt(date_arr[2]);

            // initialize sub objects to get around undefined error
            if (waterFlow[year] === undefined) {
                waterFlow[year] = {};
                waterFlow[year]["yearlyFlow"] = 0;
            }
            if (waterFlow[year][month] === undefined) {
                waterFlow[year][month] = 0;
            }

            // create monthly flow for each year
            waterFlow[year]["yearlyFlow"] = waterFlow[year]["yearlyFlow"] + flow;
            waterFlow[year][month] = waterFlow[year][month] + flow;
        }
    }

    return waterFlow
}


// get dry and wet years from waterFlow object
// input: waterFlow object
// returns object {dryYear: year, wetYear: year}
function getExtremeFlow(waterFlow) {
    let maxFlow = -1;
    let minFlow = -1;
    let wetYear;
    let dryYear;

    for (let key in waterFlow) {
        // check for actual property of object and not something from prototype
        if (waterFlow.hasOwnProperty(key)) {
            // pick first value as min flow
            if (minFlow === -1) {
                minFlow = waterFlow[key]['yearlyFlow'];
                dryYear = key;
            }
            // check if we have new min/max flow
            if (waterFlow[key]['yearlyFlow'] < minFlow) {
                minFlow = waterFlow[key]['yearlyFlow'];
                dryYear = key;
            }
            if (waterFlow[key]['yearlyFlow'] > maxFlow)  {
                maxFlow = waterFlow[key]['yearlyFlow'];
                wetYear = key;
            }
        }
    }

    return {
        'wetYear': wetYear,
        'dryYear': dryYear
    }
}


// creates data suitable for using in graphs
// input: desired year and waterFlow object
// output: array of data [1,2,3,4]
function createGraphData(year, waterFlow) {
    let chosenYear = waterFlow[year];
    let months = [];
    let graphData = [];

    // Robust way to gather data from object
    // get all months from waterFlow object of chosen year
    for (let key in chosenYear) {
        if (key !== 'yearlyFlow') {
            months.push(parseInt(key));
        }
    }
    // sort months array ascending
    months = sortArrayAsc(months);

    // create array of flow numbers for every month in chosen year
    for (let i = 0; i < 12; i++) {
        if (months.indexOf(i+1) < 0) {
            graphData.push(0); // if month data is missing assign 0
        } else {
            graphData.push(chosenYear[i+1].toFixed(1));
        }
    }

    return graphData;
}


// sort given array ascending
function sortArrayAsc(arr) {
    arr.sort(function(a,b) {
        return a - b;
    });
    return arr;
}


// create average flow for each month based on all data
// returns array -> suitable for producing graphs;
function getAverageData(waterFlow) {
    let monthlyData = [];
    let numOfYears = 0;
    for (let year in waterFlow) {
        if (waterFlow.hasOwnProperty(year))  {
            numOfYears++;
            let graphData = createGraphData(year, waterFlow);
            monthlyData.push(graphData);
        }
    }

    let averageData = monthlyData[0].map((_, i) =>
    monthlyData.reduce((p,_,j) => p + monthlyData[j][i]/numOfYears, 0 ));

    let finalData = averageData.map((data) => {
        return (
            data.toFixed(1)
        )
    });

    return finalData;
}


// export functions
export {
    createMonthlyFlow,
    getExtremeFlow,
    createGraphData,
    getAverageData
};