/**
 * Class that preprocesses text data (in CSV type format) and generates visualization-ready JSON array data.
 *
 * @class DataPreprocessor
 * @description Preprocesses text data and generates visualization-ready JSON array data.
 *
 * @constructor {Object} csvdata - The original CSV text data to be preprocessed.
 *
 * @property {Array} data - The original CSV text data to be preprocessed.
 * @property {number} year - Column index for the year attribute (default: null).
 * @property {number} month - Column index for the month attribute (default: null).
 * @property {number} day - Column index for the day attribute (default: null).
 * @property {number} value - Column index for the value attribute (default: null).
 *
 * @method setDataColumnIndex() - Sets the column indices for the year, month, day, and value
attributes. Needs to be overridden by subclasses.
 *
 * @method getVizJSON() - Generates visualization-ready JSON array data from the preprocessed dataframe.
 *
 * @method createDataframe(csvdata) - Creates a 2D array representing a dataframe from the original
CSV data.
 *
 * @method preprocessData(data) - Performs some data cleaning on the input data.
 *
 * Helpers:
 * @method removeHeader(csvdata) - Removes the header section from the original CSV data.
 * @method getDataIndex(dataArr) - Gets the index of the first non-header line in the CSV data.
 * @method formDate(dfRow) - Formats a date string based on the year, month, and day attributes.
 */
export class DataPreprocessor {
    // it will be used to preprocess the txt data and then generate the viz ready json data
    // csv styled txt file is first parsed and then filtered into 2d array representing dataframe
    // necessary columns of the dataframe is then selected for the viz ready json generation.
    constructor(csvdata) {
        this.data = csvdata;
        // column index for data attributes
        this.year = null;
        this.month = null;
        this.day = null;
        this.value = null;
    }

    setDataColumnIndex() {
        // default column index for year, month, day and value attributes
        this.year = null;
        this.month = null;
        this.day = null;
        this.value = null;
    }
    
    getVizJSON() {
        this.setDataColumnIndex();
        let dataFrame = this.createDataframe(this.data);
        let vizJSON = dataFrame.map((row) => {
            let date = this.formDate(row);
            let value = row[this.value];
            return {
                date: date,
                value: value,
            };    
        });
        return vizJSON;
    }
    
    createDataframe(csvdata) {
        // form a 2d array representing a dataframe
        let data = this.removeHeader(csvdata);
        let dataframe = this.preprocessData(data);
        return dataframe;
    }

    preprocessData(data) {
        // some data preprocessing logic
        let lines = data.map((line) => line.replace("\n", "").split(" "));
        let filteredData = lines.map(line => line.filter(data => data != ""));
        return filteredData;
    }

    // helper functions

    removeHeader(csvdata) {
        let dataArr = csvdata.split("\n");
        let dataIndex = this.getDataIndex(dataArr);
        let data = dataArr.slice(dataIndex);
        return data;
    }

    getDataIndex(dataArr) {
        // by skipping the header section
        // split the string text based on new line
        // get the header lines. header lines start with #.
        for (let i = 0; i < dataArr.length; i++) {
            if (!dataArr[i].startsWith("#")) {
                return i;
            }
        }
        return dataArr.length;
    }

    formDate(dfRow) {
        let singleDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
        let year = "1999";
        let month = "01";
        let day = "01";

        // yearly
        if ((this.year !== null) && (this.month === null) && (this.day === null)) {
            year = dfRow[this.year];
            return `${year}-${month}-${day}T00:00:00Z`;
        }

        // monthly
        if ((this.year !== null) && (this.month !== null) && (this.day === null)) {
            year = dfRow[this.year];
            month = dfRow[this.month];
            if (singleDigits.includes(month)) {
                month = `0${month}`;
            }
            return `${year}-${month}-${day}T00:00:00Z`;
        }

        // daily
        year = dfRow[this.year];
        month = dfRow[this.month];
        day = dfRow[this.day];

        if (singleDigits.includes(day)) {
            day = `0${day}`;
        }
        if (singleDigits.includes(month)) {
            month = `0${month}`;
        }
        return `${year}-${month}-${day}T00:00:00Z`;
    }
}