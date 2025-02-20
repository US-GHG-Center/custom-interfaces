import os
import requests
import re
from bs4 import BeautifulSoup

# Define source URLs and target directories
URL_MAPPING = {
    "https://gml.noaa.gov/aftp/data/trace_gases/co2/flask/surface/txt/": "data/raw/co2/flask/surface/",
    "https://gml.noaa.gov/aftp/data/trace_gases/co2/in-situ/surface/txt/": "data/raw/co2/insitu/surface/",
    "https://gml.noaa.gov/aftp/data/trace_gases/co2/in-situ/tower/txt/": "data/raw/co2/insitu/tower/",
    "https://gml.noaa.gov/aftp/data/trace_gases/co2/pfp/surface/txt/": "data/raw/co2/pfp/surface/",
    "https://gml.noaa.gov/aftp/data/trace_gases/ch4/flask/surface/txt/": "data/raw/ch4/flask/surface/",
    "https://gml.noaa.gov/aftp/data/trace_gases/ch4/in-situ/surface/txt/": "data/raw/ch4/insitu/surface/",
    "https://gml.noaa.gov/aftp/data/trace_gases/ch4/in-situ/tower/txt/": "data/raw/ch4/insitu/tower/",
    "https://gml.noaa.gov/aftp/data/trace_gases/ch4/pfp/surface/txt/": "data/raw/ch4/pfp/surface/"
}

def get_txt_files(url):
    """Fetch the list of .txt files from the directory listing."""
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to access {url}")
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    files = []
    for link in soup.find_all('a', href=True):
        href = link['href']
        if re.match(r"^.*\.txt$", href):  # Match .txt files
            files.append(href)
    return files

def download_file(url, save_path):
    """Download a file from a URL and save it to a specified path."""
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    else:
        print(f"Failed to download: {url}")

# Iterate through URLs and download files
for base_url, local_dir in URL_MAPPING.items():
    print(f"Fetching files from: {base_url}")
    txt_files = get_txt_files(base_url)
    for file in txt_files:
        file_url = base_url + file
        save_path = os.path.join(local_dir, file)
        download_file(file_url, save_path)
    print("Downloaded")