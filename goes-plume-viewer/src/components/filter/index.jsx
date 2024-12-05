import { useState, useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

export function FilterByDate({regions, plumes, setFilteredRegions, setFilteredSelectedPlumes}) {
    const [startDate, setStartDate] = useState(moment("2018-01-01"));
    const [endDate, setEndDate] = useState(() => moment());

    useEffect(() => {
        if (!regions.length) return;

        const filteredRegions = []
        // only filter ones where: startDate <= plume.date <= endDate
        for (let i=0; i < regions.length; i++) {
            const region = regions[i];
            const regionStartDatetime = moment(region.startDate);
            const regionEndDatetime = moment(region.endDate);
            if (regionStartDatetime.isSameOrAfter(startDate) && regionEndDatetime.isSameOrBefore(endDate)) {
                filteredRegions.push(region);
            }
        }
        setFilteredRegions(filteredRegions);

        if (!plumes || !plumes.length) return;

        const filteredPlumes = []
        // only filter ones where: startDate <= plume.date <= endDate
        for (let i=0; i < plumes.length; i++) {
            const plume = plumes[i];
            const plumeStartDatetime = moment(plume.startDate);
            const plumeEndDatetime = moment(plume.endDate);
            if (plumeStartDatetime.isSameOrAfter(startDate) && plumeEndDatetime.isSameOrBefore(endDate)) {
                filteredPlumes.push(plume);
            }
        }
        setFilteredSelectedPlumes(filteredPlumes);

    }, [regions, startDate, endDate, setFilteredRegions, plumes, setFilteredSelectedPlumes]);

    return (
        <>
            <div style={{ width: "45%", height: "90%" }}>
                <DatePicker 
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                />
            </div>
            <div style={{ width: "45%", height: "90%" }}>
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                />
            </div>
        </>
    );
}
