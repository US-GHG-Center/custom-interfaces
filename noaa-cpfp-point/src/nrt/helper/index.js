// dataPreprocessor.js
/**
 * Parses CSV data and returns an array of objects representing the parsed data.
 * 
 * This function takes CSV .txt data as input and parses it into an array of objects,
 * where each object represents a row of data. The CSV data is expected to have
 * a specific structure, and the function performs parsing based on that structure.
 * 
 * @param {string} csvdata - The CSV data to be parsed.
 * @returns {Array<Object>} An array of objects representing the parsed data.
 * @example
 * // Example input: "# dataset_name: co2_daily_mlo.txt"
 * // Example output: [{ date: "1974-05-19", value: 333.46 }, { date: "1974-05-20", value: 333.64 }]
 */
export function parseData(csvdata) {
    // Parse your CSV data here and return it as ank array of objects
    let dataArr = csvdata.split("\n");
    let dataIndex = getDataIndex(csvdata);
    let data = dataArr.slice(dataIndex);

    // form dataframe
    let lines = data.map((line) => line.replace("\n", "").split(" "));
    let dataframe = lines.map(line => line.filter(data => data != ""));

    // now iterate on each dataline
    let returnValue = dataframe.map((row) => {
        let singleDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
        let year = row[0];
        let month = row[1];
        let day = row[2];
        if (singleDigits.includes(day)) {
            day = `0${day}`;
        }
        if (singleDigits.includes(month)) {
            month = `0${month}`;
        }
        let date = `${year}-${month}-${day}T00:00:00Z`;
        let value = row[4];
        return {
            date: date,
            value: value,
        };
    });
    return returnValue;
    // return [{ date: "2023-01-01", value: 10 }, { date: "2023-01-02", value: 20 }, { date: "2023-01-03", value: 15 }]
}

function getDataIndex(csvdata) {
    // by skipping the header section
    // split the string text based on new line
    let data = csvdata.split("\n");
    // get the header lines. header lines start with #.
    for (let i = 0; i < data.length; i++) {
        if (!data[i].startsWith("#")) {
            return i;
        }
    }
    return data.length;
}