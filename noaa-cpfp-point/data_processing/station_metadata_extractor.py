"""Module providing a function to fetch station meta data."""

import os
import sys
import json

def extract_station_meta(base_dir):
    """
    Extracts metadata for stations from all .txt files in the base directory.

    Parameters:
        base_dir (str): The base directory containing the station data .txt files.

    Returns:
        list: A list of dictionaries containing metadata for each station.

    Description:
        This function iterates through files in the specified directory, extracts metadata
        for stations from relevant sections of the files, and returns a list of dictionaries
        containing the extracted metadata.

    Metadata Extraction Process:
        - Read files in the specified directory.
        - Extract relevant metadata from specific lines in the files.
        - Exclude stations with specific criteria, such as exclusion of PFP sites with interpretation complexity
          or short record length.
        - Return a list of dictionaries containing metadata for each station.

    Note:
        - The function expects station data files to be in a .txt format.
        - The function may skip certain stations based on exclusion criteria.
        - This function assumes that station data files contain metadata in specific sections and formats.

    Example:
        stations_metadata = extract_station_meta("/path/to/data_directory")
    """
    files = os.listdir(base_dir)
    stations = []
    initial_line = 30
    final_line = 50
    excluded_sites = ["LAC", "INX", "BWD", "NEB", "NWB", "TMD", "SPF", "KLM", "MKO", "MLO", "HFM"]

    for file in files:
        if not file.endswith(".txt"):
            continue
        with open(f"{base_dir}/{file}", encoding="utf-8") as ch4_file:
            data = ch4_file.readlines()
            header_line = data[0].split(" : ")[-1]
            relevant_data = data[initial_line:final_line]
            years = set()
            for line in data[int(header_line) :]:
                year = line.split(" ")[1]
                years.add(year)
            if len(years) > 1:
                station = {}
                for datum in relevant_data:
                    key, value = datum.strip(" ").strip("#").strip("\n").split(" : ")
                    station[key.strip(" ")] = value
                if (station["dataset_project"] == "surface-pfp" and station["site_code"] in excluded_sites):
                    # Exclude the following PFP sites Due to interpretation complexity or shortness of record.
                    continue
                stations.append(station)
    return stations


if __name__ == "__main__":
    # Check if file base dir argument is provided
    if len(sys.argv) != 2:
        print("Usage: python station_data.py <files_base_dir>")
        sys.exit(1)

    # Get the file base dir from command line argument
    files_base_dir = sys.argv[1]

    # Call the aggregate function with the provided filepath
    result = extract_station_meta(files_base_dir)
    if len(result) > 0:
        with open("tmp.json", "w", encoding="utf-8") as out_file:
            json.dump(result, out_file)
        print(result)