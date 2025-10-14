# Urban Dashboard - URL Parameters Usage Guide

This document describes all supported URL parameters for the Urban Dashboard application and their accepted values.

## Overview

The Urban Dashboard supports several URL parameters that allow you to:
- Set the area of interest (AOI) for map bounds
- Select specific urban regions
- Choose the dataset to display
- Create bookmarkable and shareable URLs

## Supported URL Parameters

### 1. `aoi` (Area of Interest)

Sets the map bounds to focus on a specific geographic area.

**Accepted Values:**

- `US` - United States (includes Alaska and Hawaii)
- `CONUS` - Continental United States (excludes Alaska and Hawaii)
- `Alabama`
- `Alaska`
- `Arizona`
- `Arkansas`
- `California`
- `Colorado`
- `Connecticut`
- `Delaware`
- `Florida`
- `Georgia`
- `Hawaii`
- `Idaho`
- `Illinois`
- `Indiana`
- `Iowa`
- `Kansas`
- `Kentucky`
- `Louisiana`
- `Maine`
- `Maryland`
- `Massachusetts`
- `Michigan`
- `Minnesota`
- `Mississippi`
- `Missouri`
- `Montana`
- `Nebraska`
- `Nevada`
- `New Hampshire`
- `New Jersey`
- `New Mexico`
- `New York`
- `North Carolina`
- `North Dakota`
- `Ohio`
- `Oklahoma`
- `Oregon`
- `Pennsylvania`
- `Rhode Island`
- `South Carolina`
- `South Dakota`
- `Tennessee`
- `Texas`
- `Utah`
- `Vermont`
- `Virginia`
- `Washington`
- `West Virginia`
- `Wisconsin`
- `Wyoming`

**Example:**
```
http://localhost:3000/?aoi=CONUS
http://localhost:3000/?aoi=California
```

### 2. `region`

Selects and focuses on a specific urban region. The map will automatically zoom to the selected region and display its boundary.

**Accepted Values:**
Any valid urban region name from the dataset. Accepted values are:

- `Austin`
- `Baltimore`
- `Boston`
- `Charlotte`
- `Chicago`
- `Columbus`
- `Dallas`
- `Denver`
- `Detroit`
- `El Paso`
- `Fort Worth`
- `Houston`
- `Indianapolis`
- `Jacksonville`
- `Las Vegas`
- `Los Angeles`
- `Louisville/Jefferson County`
- `Memphis`
- `Nashville-Davidson`
- `New York`
- `Oklahoma City`
- `Philadelphia`
- `Phoenix`
- `Portland`
- `San Antonio`
- `San Diego`
- `San Francisco`
- `San Jose`
- `Seattle`
- `Washington`

**Example:**
```
http://localhost:3000/?region=Los%20Angeles
http://localhost:3000/?region=New%20York
```

### 3. `dataset`

Selects the dataset to display on the map.

**Accepted Values:**
- `vulcan` - VULCAN dataset
- `gra2pes` - GRA2PES dataset (default)

**Example:**
```
http://localhost:3000/?dataset=vulcan
http://localhost:3000/?dataset=gra2pes
```

> Note: Don't use `aoi` and `region` params together. If they are used, `region` takes precedence over `aoi`.