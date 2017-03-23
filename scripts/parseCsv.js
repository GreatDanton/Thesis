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

    let water_flow = {};

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
            if (water_flow[year] === undefined) {
                water_flow[year] = {};
            }
            if (water_flow[year][month] === undefined) {
                water_flow[year][month] = 0;
            }

            // create monthly flow for each year
            water_flow[year][month] = water_flow[year][month] + flow;
        }
    }

    return water_flow
}

export {createMonthlyFlow};