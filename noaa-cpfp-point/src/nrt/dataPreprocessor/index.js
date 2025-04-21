import { DataPreprocessor } from "./root";

/**
 * Class that extends the DataPreprocessor to preprocess daily NRT data in txt format and generates
visualization-ready JSON data.
 *
 * @method setDataColumnIndex()  - Sets the column indices for the year, month, day, and value
attributes. Specifically sets:
 *      - this.year to 0 (default: null)
 *      - this.month to 1 (default: null)
 *      - this.day to 2 (default: null)
 *      - this.value to 4 (default: null)
 * 
 * Note: all the other methods are inherited from the DataPreprocessor class.
 */
export class DailyDataPreprocessor extends DataPreprocessor {
    setDataColumnIndex() {
        this.year = 0;
        this.month = 1;
        this.day = 2;
        this.value = 4;
    }
}

/**
 * Class that extends the DataPreprocessor to preprocess monthly NRT data in txt format and generates
visualization-ready JSON data.
 *
 * @method setDataColumnIndex()  - Sets the column indices for the year, month, day, and value
attributes. Specifically sets:
 *      - this.year to 0 (default: null)
 *      - this.month to 1 (default: null)
 *      - this.value to 5 (default: null)
 * 
 * Note: all the other methods are inherited from the DataPreprocessor class.
 */
export class MonthlyDataPreprocessor extends DataPreprocessor {
    setDataColumnIndex() {
        this.year = 0;
        this.month = 1;
        this.value = 5;
    }
}

/**
 * Class that extends the DataPreprocessor to preprocess yearly NRT data in txt format and generates
visualization-ready JSON data.
 *
 * @method setDataColumnIndex()  - Sets the column indices for the year, month, day, and value
attributes. Specifically sets:
 *      - this.year to 0 (default: null)
 *      - this.value to 2 (default: null)
 * 
 * Note: all the other methods are inherited from the DataPreprocessor class.
 */
export class YearlyDataPreprocessor extends DataPreprocessor {
    setDataColumnIndex() {
        this.year = 0;
        this.value = 1;
    }
}


/**
 * Class that extends the DataPreprocessor to preprocess daily surface insitu of MKO data in txt format and generates
visualization-ready JSON data.
 *
 * @method setDataColumnIndex()  - Sets the column indices for the year, month, day, and value
attributes. Specifically sets:
 *      - this.year to 0 (default: null)
 *      - this.month to 1 (default: null)
 *      - this.day to 2 (default: null)
 *      - this.value to 4 (default: null)
 *
 * Note: all the other methods are inherited from the DataPreprocessor class.
 */
export class CustomMKODataPreprocessor extends DataPreprocessor {
    // overrides

    setDataColumnIndex() {
        this.year = 1;
        this.month = 2;
        this.day = 3;
        this.value = 10;
        this.qc = 18;
    }

    preprocessData(data) {
        // some data preprocessing logic
        let lines = data.map((line) => line.replace("\n", "").split(" "));
        let filteredData = lines
        .filter((line) => line[this.qc] == "...")
        .filter((line) => line[this.value] !== "-999.99")
        .filter((line) => line[this.value] !== "0")
        // mko only existed between November 29, 2022 through July 4, 2023
        let clippedData = this.dataClip(filteredData)
        return clippedData;
    }

    dataClip(data) {
        // considering the data is sorted by date.
        // mko only existed between 11/29/2022 through 7/4/2023
        // remove all except them
        let left = -1;
        let right = -1;
        for (let i=0; i < data.length; i++) {
            let idxData = data[i]
            if (Number(idxData[1]) === 2022 && Number(idxData[2]) === 11 && Number(idxData[3]) === 29) {
                left = i;
            }
            if (Number(idxData[1]) === 2023 && Number(idxData[2]) === 7 && Number(idxData[3]) === 4) {
                right = i;
            }
        }
        if (left == -1) {
            left = 0;
        }
        if (right == -1) {
            right = data.length - 1;
        }
        return data.slice(left, right+1)
    }

    getDataIndex(dataArr) {
        // by skipping the header section
        // split the string text based on new line
        // the number of row to skip is mentioned in the header
        const parts = dataArr[0].split(':'); // Split the string by colon
        const number = parseInt(parts[1].trim()); // Trim any whitespace and convert to number
        return number + 1;
    }
}


/**
 * Class that extends the DataPreprocessor to preprocess NRT data in txt format and generates
visualization-ready JSON data for MLO station. There are custom criterias for this data.
 * custom criterias: Only show non QCed data after the point where there is no QCed data.
 *
 * @method setDataColumnIndex()  - Sets the column indices for the year, month, day, and value
attributes. Specifically sets:
 *      - this.year to 0 (default: null)
 *      - this.month to 1 (default: null)
 *      - this.day to 2 (default: null)
 *      - this.value to 4 (default: null)
 *
 * Note: all the other methods are inherited from the DataPreprocessor class.
 */
export class CustomNRTMLODataPreprocessor extends DataPreprocessor {
    setDataColumnIndex() {
        this.year = 0;
        this.month = 1;
        this.day = 2;
        this.value = 4;
    }

    // overriding the method
    getVizJSON() {
        this.setDataColumnIndex();
        // filter the data from the point when there is no QCed data
        const cutOffDate = new Date("2023-04-30T00:00:00Z");
        let dataFrame = this.createDataframe(this.data);
        let vizJSONFilter = dataFrame.map((row) => {
            let date = this.formDate(row);
            let value = row[this.value];
            let jsDate = new Date(date);
            if (jsDate < cutOffDate) {
                return null;
            }
            return {
                date: date,
                value: value,
            };
        });
        let vizJSON = vizJSONFilter.filter((data) => data !== null);
        return vizJSON;
    }
}
