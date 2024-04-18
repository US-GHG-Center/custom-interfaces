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
 * // Example input: "# dataset_name: co2_nwf_surface-pfp_1_ccgg_event"
 * // Example output: [{ date: "2023-01-01", value: 10 }, { date: "2023-01-02", value: 20 }]
 */
export function parseData(csvdata) {
    // Parse your CSV data here and return it as ank array of objects
    let data = csvdata.split("\n");
    let datasetNameStr = data[5];
    let header_lines = data[0]
      .split(":")
      .slice(-1)[0]
      .trim()
      .replace("\n#\n#", "");
    header_lines = parseInt(header_lines);
    data = data.slice(header_lines - 1);
    const lines = data
      .slice(1)
      .map((line) => line.replace("\n", "").split(" "));
    let filtered;
    if (datasetNameStr === "# dataset_name: co2_nwf_surface-pfp_1_ccgg_event" |
        datasetNameStr === "# dataset_name: co2_bao_surface-pfp_1_ccgg_event" |
        datasetNameStr === "# dataset_name: co2_mvy_surface-pfp_1_ccgg_event") {
      // data column number is different
      filtered = lines
      .filter((line) => line[20] == "...")
      .filter((line) => line[10] !== "-999.99")
      .filter((line) => line[10] !== "0");
    } else {
      filtered = lines
      .filter((line) => line[21] == "...")
      .filter((line) => line[10] !== "-999.99")
      .filter((line) => line[10] !== "0");

    }
    let return_value = filtered.map((line) => {
      return {
        date: line[7],
        value: line[10],
      };
    });
    return return_value;
    // return [{ date: "2023-01-01", value: 10 }, { date: "2023-01-02", value: 20 }, { date: "2023-01-03", value: 15 }]
}