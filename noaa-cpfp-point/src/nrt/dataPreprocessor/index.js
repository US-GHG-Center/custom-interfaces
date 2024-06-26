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