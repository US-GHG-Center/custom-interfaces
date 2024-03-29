import pandas as pd
import json
import sys

def aggregate(filepath):
    """
    Reads data from a file specified by the filepath, aggregates (sum) hourly dataset into daily data, and saves the aggregated data as a JSON file.

    Args:
        filepath (str): The path to the input file containing data.

    Returns:
        str or None: If successful, Returns an output path if success.
                     If there's an error, returns a string message.

    Raises:
        FileNotFoundError: If the specified file is not found.
        Exception: If any other unexpected error occurs during processing.

    Example:
        aggregate("data.txt")
    """
    try:
        with open(filepath, "r") as file:
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
            # Filter data
            mask = (dataframe["qcflag"] != "...") & (dataframe["value"] != "0") & (dataframe["value"] != "-999")
            filtered_df = dataframe[mask].reset_index(drop=True)
            # Aggregate data (hourly into daily)
            filtered_df['value'] = filtered_df['value'].astype(float)
            aggregated_df = filtered_df.groupby(['year', 'month', 'day'])['value'].agg(lambda x: x.mode().iloc[0]).reset_index()
            # necessary columns, processed df
            aggregated_df['datetime'] = pd.to_datetime(aggregated_df[['year', 'month', 'day']])
            aggregated_df['datetime'] = aggregated_df['datetime'].dt.strftime('%Y-%m-%dT%H:%M:%SZ')
            processed_df = aggregated_df[['datetime', 'value']]
            # dict formation, needed for frontend [{date: , value: }]
            json_list = []
            for _, row in processed_df.iterrows():
                json_obj = {'date': row['datetime'], 'value': row['value']}
                json_list.append(json_obj)
            # save the json file for reference
            out_path = f"{filepath.split("/")[-1]}.json"
            with open(out_path, "w") as file:
                json.dump(json_list, file)
            return out_path
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
    filepath = sys.argv[1]

    # Call the aggregate function with the provided filepath
    result = aggregate(filepath)
    if result is not None:
        print(result)
