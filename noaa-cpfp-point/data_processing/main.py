""" Module providing a function to processes data from various source directories and convert them to visualization ready JSON format. """
import os
import json
from viz_data_gen import extact_viz_json
from aggregate import daily_aggregate, monthly_aggregate
from utils import get_insitu_filename_wo_daily_data, get_insitu_filename_wo_monthly_data, get_file_names

def main():
    """
    Processes data from various source directories and converts them to visualization ready JSON format.
    Raw insitu data is converted to processed data with specific directories for GHG (Green House Gases).

    This function performs the following tasks:
    1. Creates destination directories for processed data if they do not exist.
    2. Converts CSV files in source directories to JSON format and stores them in the corresponding destination directories.
    3. Fills up missing datasets by aggregating granular data (e.g., hourly data to daily or monthly data).

    Returns:
        None

    Raises:
        Any errors encountered during the data processing.

    Example:
        main()
    """
    insitu_src_dirs = ["../data/raw/co2/insitu/surface/", "../data/raw/co2/insitu/tower/",
                "../data/raw/ch4/insitu/surface/", "../data/raw/ch4/insitu/tower/"]
    insitu_dest_dirs = ["../data/processed/co2/insitu/surface/", "../data/processed/co2/insitu/tower/",
                "../data/processed/ch4/insitu/surface/", "../data/processed/ch4/insitu/tower/"]

    # dirs that only need general .txt to .json conversion.
    data_src_dirs = ["../data/raw/co2/pfp/surface/", "../data/raw/co2/flask/surface/", "../data/raw/ch4/pfp/surface/", "../data/raw/ch4/flask/surface/"]
    data_dest_dirs = ["../data/processed/co2/pfp/surface/", "../data/processed/co2/flask/surface/", "../data/processed/ch4/pfp/surface/", "../data/processed/ch4/flask/surface/"]

    # absolute paths conversion
    dirname = os.path.dirname(__file__) # absolute path of this file (which will be executed)
    insitu_src_dirs = [os.path.join(dirname, relative_dir) for relative_dir in insitu_src_dirs]
    insitu_dest_dirs = [os.path.join(dirname, relative_dir) for relative_dir in insitu_dest_dirs]
    data_src_dirs = [os.path.join(dirname, relative_dir) for relative_dir in data_src_dirs]
    data_dest_dirs = [os.path.join(dirname, relative_dir) for relative_dir in data_dest_dirs]

    for dest_dir in insitu_dest_dirs+data_dest_dirs:
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

    # Convert the files in the src_dir and store them in the dest dir.
    txt_src_dirs = data_src_dirs+insitu_src_dirs
    json_dest_dirs = data_dest_dirs+insitu_dest_dirs
    for idx, src_dir in enumerate(txt_src_dirs):
        files = get_file_names(src_dir)
        for filename in files:
            src_filepath = src_dir + filename
            dest_filepath = json_dest_dirs[idx] + json_filename(filename)
            csv_to_json(src_filepath, dest_filepath)

    print("Converted the .txt data to visualization ready JSON.")

    # Fill-up missing datasets #
    # From the src_dir, get the list of files with missing frequency data. Convert them and store them in the dest dir  
    for idx, src_dir in enumerate(insitu_src_dirs):
        insitu_files_wo_daily_data = get_insitu_filename_wo_daily_data(src_dir)
        insitu_files_wo_monthly_data = get_insitu_filename_wo_monthly_data(src_dir)

        # generate for missing daily data
        # For each filenames, use their hourly counterpart and then convert it to daily
        for missed_file in insitu_files_wo_daily_data:
            src_filepath = src_dir + missed_file
            dest_filepath = insitu_dest_dirs[idx] + insitu_daily_filename(missed_file) 
            hourly_to_daily_converter(src_filepath, dest_filepath)

        # generate for missing monthly data
        # For each filenames, use their hourly counterpart and then convert it to monthly
        for missed_file in insitu_files_wo_monthly_data:
            src_filepath = src_dir + missed_file
            dest_filepath = insitu_dest_dirs[idx] + insitu_monthly_filename(missed_file) 
            hourly_to_monthly_converter(src_filepath, dest_filepath)

    print("Missing values filled using aggregation of granular data. Converted to visualization ready JSON.")

# helper
    
def csv_to_json(src_filepath, dest_filepath):
    """
    Converts data from a .txt file to visualization ready JSON format.

    Args:
        src_filepath (str): The file path to the source CSV styled .txt file.
        dest_filepath (str): The file path to save the resulting JSON file.

    Returns:
        None

    Raises:
        Any errors encountered during the conversion process.

    Example:
        csv_to_json("input.txt", "output.json")
    """
    print(f"Processing... {src_filepath}")
    json_list = extact_viz_json(src_filepath)
    with open(dest_filepath, "w", encoding="utf-8") as file:
        json.dump(json_list, file)
        print(f"Completed writing {dest_filepath}")

def hourly_to_daily_converter(src_filepath, dest_filepath):
    """
    Converts data from hourly granularity to daily granularity and saves it as a visualization ready JSON file.

    Args:
        src_filepath (str): The file path to the source data with hourly granularity.
        dest_filepath (str): The file path to save the resulting data with daily granularity.

    Returns:
        None

    Raises:
        Any errors encountered during the conversion process.

    Example:
        hourly_to_daily_converter("hourly_data.csv", "daily_data.json")
    """
    print(f"Processing... {src_filepath}")
    json_list = daily_aggregate(src_filepath)
    with open(dest_filepath, "w", encoding="utf-8") as file:
        json.dump(json_list, file)
        print(f"Completed writing {dest_filepath}")

def hourly_to_monthly_converter(src_filepath, dest_filepath):
    """
    Converts data from hourly granularity to monthly granularity and saves it as a visualization ready JSON file.

    Args:
        src_filepath (str): The file path to the source data with hourly granularity.
        dest_filepath (str): The file path to save the resulting data with monthly granularity.

    Returns:
        None

    Raises:
        Any errors encountered during the conversion process.

    Example:
        hourly_to_monthly_converter("hourly_data.csv", "monthly_data.json")
    """
    print(f"Processing... {src_filepath}")
    json_list = monthly_aggregate(src_filepath)
    with open(dest_filepath, "w", encoding="utf-8") as file:
        json.dump(json_list, file)
        print(f"Completed writing {dest_filepath}")

def insitu_daily_filename(missed_file):
    """
    Generates a new filename for daily granularity data based on the given hourly filename.

    Args:
        missed_file (str): The original hourly filename from which to generate the daily filename.

    Returns:
        str: The new filename with daily granularity.

    Example:
        new_filename = insitu_daily_filename("example_hourly_data.txt")
    """
    splitted_file_name = missed_file.split("_")
    splitted_file_name[5] = "DailyData.json"
    return "_".join(splitted_file_name)

def insitu_monthly_filename(missed_file):
    """
    Generates a new filename for monthly granularity data based on the given hourly filename.

    Args:
        missed_file (str): The original hourly filename from which to generate the monthly filename.

    Returns:
        str: The new filename with monthly granularity.

    Example:
        new_filename = insitu_monthly_filename("example_hourly_data.txt")
    """
    splitted_file_name = missed_file.split("_")
    splitted_file_name[5] = "MonthlyData.json"
    return "_".join(splitted_file_name)

def json_filename(filename):
    """
    Generates a new filename with the ".json" extension based on the given .txt filename.

    Args:
        filename (str): The original filename to be converted.

    Returns:
        str: The new filename with the ".json" extension.

    Example:
        new_filename = json_filename("example.txt") # new_filename is "example.json".
    """
    splitted_filename = filename.split(".")
    splitted_filename[1] = "json"
    return ".".join(splitted_filename)

if __name__ == "__main__":
    main()