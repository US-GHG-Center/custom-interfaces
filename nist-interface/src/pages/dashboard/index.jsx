import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../../components/mapboxViewer';
import { Title } from '../../components/title';
import { ConcentrationChart } from '../../components/chart';
import { SelectGHG } from '../../components/dropdown';

export function Dashboard({ stations, selectedStationId, setSelectedStationId, ghg, agency, region, stationCode, setSelectedGHG }) {
  const [ displayChart, setDisplayChart ] = useState(false);

  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change

  return (
    <Box className="fullSize">
        <Title ghg={ghg} agency={agency} region={region}/>
        { stations && <MapBoxViewer
                        stations={stations}
                        region={region}
                        agency={agency}
                        stationCode={stationCode}
                        setSelection={setSelectedStationId}
                        setDisplayChart={setDisplayChart}
                      />}
        { displayChart && <SelectGHG selectedGHG={ghg} setSelectedGHG={setSelectedGHG} />}
        { displayChart && <ConcentrationChart
                            selectedStationId={selectedStationId}
                            setSelectedStationId={setSelectedStationId}
                            setDisplayChart={setDisplayChart}
                            ghg={ghg}
                          /> }
    </Box>
  );
}