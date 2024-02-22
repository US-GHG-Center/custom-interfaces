import os
import sys

base_dir = sys.argv[1]
files = os.listdir(base_dir)
stations = []
initial_line = 30
final_line = 50
for file in files:
    if not file.endswith(".txt"):
        continue
    with open(f"{base_dir}/{file}") as ch4_file:
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
            stations.append(station)
        else:
            print(file)

print(stations)
