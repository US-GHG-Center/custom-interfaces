"""Module containing utility functions for data processing and file manipulation."""
import os
import pandas as pd

def get_insitu_filename_wo_daily_data(base_dir):
    """
    Retrieves hourly_data filenames from the specified base directory that do not have data with respective daily frequency counterpart.

    Args:
        base_dir (str): The base directory containing the filenames.

    Returns:
        list: A list of hourly_data filenames from the base directory that do not have data with daily frequency counterpart.

    Example:
        filenames = get_insitu_filename_wo_daily_data("/path/to/base_directory")
    """
    files = os.listdir(base_dir)
    splitted_filenames = [file_name.split("_") for file_name in files]
    labelled_filename_hash = get_labelled_filename_hash(splitted_filenames)

    df_filename = pd.DataFrame(labelled_filename_hash)
    grouped_df = df_filename.groupby(by="station")
    filtered_grouped_df = grouped_df.filter(lambda x: "DailyData.txt" not in x["frequency"].values)
    df_filename_wo_daily_data = filtered_grouped_df[['ghg', 'station', 'medium-type']].drop_duplicates() # ghg > station > medium > type, that doesnot have daily data.
    # check if the df_name not having daily data, has hourly data. and then convert.
    df_filename_wo_daily_data['file_wo_daily_data'] = df_filename_wo_daily_data.apply(combine_to_name, axis=1)
    hourly_file_wo_daily_data = df_filename_wo_daily_data['file_wo_daily_data'].tolist()
    return hourly_file_wo_daily_data

def get_insitu_filename_wo_monthly_data(base_dir):
    """
    Retrieves hourly_data filenames from the specified base directory that do not have data with respective monthly frequency counterpart.

    Args:
        base_dir (str): The base directory containing the filenames.

    Returns:
        list: A list of hourly_data filenames from the base directory that do not have data with monthly frequency counterpart.

    Example:
        filenames = get_insitu_filename_wo_monthly_data("/path/to/base_directory")
    """
    files = os.listdir(base_dir)
    splitted_filenames = [file_name.split("_") for file_name in files]
    labelled_filename_hash = get_labelled_filename_hash(splitted_filenames)

    df_filename = pd.DataFrame(labelled_filename_hash)
    grouped_df = df_filename.groupby(by="station")
    filtered_grouped_df = grouped_df.filter(lambda x: "MonthlyData.txt" not in x["frequency"].values)
    df_filename_wo_monthly_data = filtered_grouped_df[['ghg', 'station', 'medium-type']].drop_duplicates() # ghg > station > medium > type, that doesnot have daily data.
    # check if the df_name not having daily data, has hourly data. and then convert.
    df_filename_wo_monthly_data['file_wo_daily_data'] = df_filename_wo_monthly_data.apply(combine_to_name, axis=1)
    hourly_file_wo_monthly_data = df_filename_wo_monthly_data['file_wo_daily_data'].tolist()
    return hourly_file_wo_monthly_data

# helpers

def get_labelled_filename_hash(split_filenames):
    """
    Generates a hash of labelled filenames from the split filenames.

    Args:
        split_filenames (list): A list of filenames split into elements.

    Returns:
        list: A list of dictionaries containing labelled parts from dismanteled filename.

    Example:
        labelled_filenames = get_labelled_filename_hash(["filename1.txt", "filename2.txt"])
    """
    labels = ["ghg", "station", "medium-type", "_", "_", "frequency"]
    result = []
    for filename in split_filenames:
        temp = {}
        for idx, elem in enumerate(filename):
            if (labels[idx] != "_"):
                temp[f"{labels[idx]}"] = elem
        result.append(temp)
    return result

def combine_to_name(row):
    """
    Combines elements of a DataFrame row into a filename string.

    Args:
        row (pd.Series): A pandas Series representing a row of data.

    Returns:
        str: The combined filename string.

    Example:
        filename = combine_to_name({"ghg": "co2", "station": "crv", "medium-type": "tower"})
    """
    # ref: co2_crv_tower-insitu_1_ccgg_HourlyData.txt
    return f"{row['ghg']}_{row['station']}_{row['medium-type']}_1_ccgg_HourlyData.txt"

def get_file_names(base_dir):
    """
    Retrieves filenames from the specified base directory.

    Args:
        base_dir (str): The base directory containing the filenames.

    Returns:
        list: A list of filenames from the base directory.

    Example:
        filenames = get_file_names("/path/to/base_directory")
    """
    files = os.listdir(base_dir)
    return files