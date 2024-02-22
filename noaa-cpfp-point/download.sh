#If something fails with exit!=0 the script stops
set -e

# Download files
wget https://gml.noaa.gov/aftp/data/trace_gases/co2/flask/surface/co2_surface-flask_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/ch4/flask/surface/ch4_surface-flask_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/ch4/pfp/surface/ch4_surface-pfp_ccgg_text.zip
wget https://gml.noaa.gov/aftp/data/trace_gases/co2/pfp/surface/co2_surface-pfp_ccgg_text.zip

# unzip to respective folders
unzip -j -o co2_surface-flask_ccgg_text.zip co2_surface-flask_ccgg_text/*_event.txt -d noaa-cpfp-point/flask/co2
unzip -j -o ch4_surface-flask_ccgg_text.zip ch4_surface-flask_ccgg_text/*_event.txt -d noaa-cpfp-point/flask/ch4
unzip -j -o co2_surface-pfp_ccgg_text.zip co2_surface-pfp_ccgg_text/*_event.txt -d noaa-cpfp-point/surface-pfp/co2
unzip -j -o ch4_surface-pfp_ccgg_text.zip ch4_surface-pfp_ccgg_text/*_event.txt -d noaa-cpfp-point/surface-pfp/ch4
