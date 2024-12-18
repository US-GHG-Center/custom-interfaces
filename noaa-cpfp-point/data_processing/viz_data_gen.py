""" Module providing a function to generate a chart-visualization-ready JSON dataset """

import sys
import json
import pandas as pd

def extact_viz_json(filepath):
    """
    Reads data from a .txt file, extracts necessary data for visualization, and returns a list of JSON objects that can be readily visualized in chart.

    Parameters:
        filepath (str): The path to the file containing the data to be converted.

    Returns:
        list: A list of dictionaries representing necessary visualization JSON data, with each dictionary containing
              'date' and 'value' keys.

    Description:
        This function reads data from a .txt file, and returns a list of JSON objects.
        The function performs the following steps:
        - Reads the content of the file.
        - Extracts the header lines from the file to determine the structure of the data.
        - Processes the data into a DataFrame.
        - Converts the aggregated data into a list of JSON objects, where each object contains 'date' and 'value' keys.

    Exceptions:
        - FileNotFoundError: If the specified file is not found.
        - Exception: If any other exception occurs during the processing, the exception message is returned.

    Note:
        - The input file is expected to have a .txt format with header lines indicating the structure of the data.
        - The returned JSON list is suitable for use in frontend applications to visualize the aggregated data.

    Example:
        extrated_json = extact_viz_json("/path/to/data_file.txt")
    """
    try:
        with open(filepath, "r", encoding="utf-8") as file:
            file_content_str = file.read()
            # split the string text based on new line
            file_content_list = file_content_str.split("\n")
            # get the header lines. its mentioned in the file's first line.
            header_lines = file_content_list[0].split(":")[-1]
            header_lines = int(header_lines)
            # Slice the non header part of the data. and the last empty element
            str_datas = file_content_list[header_lines - 1: -1]
            data = [data.replace("\n", "").split(" ") for data in str_datas]
            # seperate table body and head to form dataframe
            table_head = data[0]
            table_body = data[1:]
            dataframe = pd.DataFrame(table_body, columns=table_head)
            dataframe['value'] = dataframe['value'].astype(float)
            # Filter data
            mask = (dataframe["qcflag"] == "...") & (dataframe["value"] != 0) & (dataframe["value"] != -999)
            filtered_df = dataframe[mask].reset_index(drop=True)
            processed_df = filtered_df[['datetime', 'value']]
            # dict formation, needed for frontend [{date: , value: }]
            json_list = []
            for _, row in processed_df.iterrows():
                json_obj = {'date': row['datetime'], 'value': row['value']}
                json_list.append(json_obj)
            return json_list
    except FileNotFoundError:
        return "File not found"
    except Exception as e:
        return f"Exception occured {e}"

if __name__ == "__main__":
    # Check if filepath argument is provided
    if len(sys.argv) != 2:
        print("Usage: python aggregrate.py <filepath>")
        sys.exit(1)

    # Get the filepath from command line argument
    data_filepath = sys.argv[1]

    # Call the aggregate function with the provided filepath
    result = extact_viz_json(data_filepath)
    if result is not None:
        print(result)
        # save the json file for reference
        out_path = f"{data_filepath.split('/')[-1]}.json"
        with open(out_path, "w", encoding="utf-8") as file:
            json.dump(result, file)
