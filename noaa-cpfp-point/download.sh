#If something fails with exit!=0 the script stops
set -e

if [ ! -d "temp" ]; then
    # If not, create it
    mkdir -p "temp"
fi
cd temp

# Download files
wget https://gml.noaa.gov/aftp/data/trace_gases/co2/flask/surface/co2_surface-flask_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/ch4/flask/surface/ch4_surface-flask_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/ch4/pfp/surface/ch4_surface-pfp_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/co2/pfp/surface/co2_surface-pfp_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/co2/in-situ/surface/co2_surface-insitu_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/co2/in-situ/tower/co2_tower-insitu_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/ch4/in-situ/surface/ch4_surface-insitu_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/ch4/in-situ/tower/ch4_tower-insitu_ccgg_text.zip

# unzip to respective folders
unzip -j -o co2_surface-flask_ccgg_text.zip co2_surface-flask_ccgg_text/*_event.txt -d ../data/raw/co2/flask/surface
unzip -j -o ch4_surface-flask_ccgg_text.zip ch4_surface-flask_ccgg_text/*_event.txt -d ../data/raw/ch4/flask/surface
unzip -j -o co2_surface-pfp_ccgg_text.zip co2_surface-pfp_ccgg_text/*_event.txt -d ../data/raw/co2/pfp/surface
unzip -j -o ch4_surface-pfp_ccgg_text.zip ch4_surface-pfp_ccgg_text/*_event.txt -d ../data/raw/ch4/pfp/surface
unzip -j -o co2_surface-insitu_ccgg_text.zip co2_surface-insitu_ccgg_text/*.txt -d ../data/raw/co2/insitu/surface
unzip -j -o co2_tower-insitu_ccgg_text.zip co2_tower-insitu_ccgg_text/*.txt -d ../data/raw/co2/insitu/tower
unzip -j -o ch4_surface-insitu_ccgg_text.zip ch4_surface-insitu_ccgg_text/*.txt -d ../data/raw/ch4/insitu/surface
unzip -j -o ch4_tower-insitu_ccgg_text.zip ch4_tower-insitu_ccgg_text/*.txt -d ../data/raw/ch4/insitu/tower
