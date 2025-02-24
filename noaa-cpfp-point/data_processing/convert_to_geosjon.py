import os
import glob
import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# Custom function to convert GeoDataFrame to GeoJSON
def gdf_to_geojson(gdf):
    features = []
    for _, row in gdf.iterrows():
        feature = {
            'type': 'Feature',
            'properties': {
                'datetime': row['datetime'],
                'value': row['value'],
                'latitude': row['latitude'],
                'longitude': row['longitude'],
                'country': row['country']
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [row['longitude'], row['latitude']]
            }
        }
        features.append(feature)
    
    geojson = {
        'type': 'FeatureCollection',
        'name': 'exp',
        'features': features
    }
    return geojson

def process_csv_files():
    # Process all CSV files recursively
    print(len(glob.glob("data/processed/**/*.csv", recursive=True)))
    for file in glob.glob("data/processed/**/*.csv", recursive=True):
        df = pd.read_csv(file)
        
        data = {
            'datetime': df['datetime'].tolist(),
            'value': df['value'].tolist(),
            'latitude': df["latitude"].iloc[0],
            'longitude': df["longitude"].iloc[0],
            'country': df["country"].iloc[0]
        }
        
        # Create a GeoDataFrame with a single row
        gdf = gpd.GeoDataFrame([data], geometry=[Point(data['longitude'], data['latitude'])])
        
        # Convert to GeoJSON
        geojson = gdf_to_geojson(gdf)
        
        # Modify filename
        filename = file.replace("/processed", "/geojson").replace(".csv", ".geojson")
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        # Save to file
        with open(filename, 'w') as f:
            json.dump(geojson, f, indent=2)
        
        print(f"Saved: {filename}")

# Main function
def main():
    process_csv_files()

# Entry point
if __name__ == "__main__":
    main()
