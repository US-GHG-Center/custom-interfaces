import { useState, useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

export function FilterByDate({plumes, setFilteredPlumes}) {
    const [startDate, setStartDate] = useState(moment("2018-01-01"));
    const [endDate, setEndDate] = useState(() => moment());

    useEffect(() => {
        if (!plumes.length) return;

        const filteredPlumes = []
        // only filter ones where: startDate <= plume.date <= endDate
        for (let i=0; i < plumes.length; i++) {
            const plume = plumes[i];
            const plumeDatetime = moment(plume.datetime);
            if (plumeDatetime.isSameOrAfter(startDate) && plumeDatetime.isSameOrBefore(endDate)) {
                filteredPlumes.push(plume);
            }
        }
        setFilteredPlumes(filteredPlumes);
    }, [plumes, startDate, endDate, setFilteredPlumes]);

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
