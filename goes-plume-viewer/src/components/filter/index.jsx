import { useState, useEffect, useMemo } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

export function FilterByDate({regions, plumes, setFilteredRegions, setFilteredSelectedPlumes, resetFilterDates, setResetFilterDates}) {
    // Calculate the overall temporal extent from regions data
    const { minDate, maxDate } = useMemo(() => {
        if (!regions.length) {
            return {
                minDate: moment("2018-01-01"),
                maxDate: moment()
            };
        }

        let min = moment(regions[0].startDate);
        let max = moment(regions[0].endDate);

        regions.forEach(region => {
            const regionStart = moment(region.startDate);
            const regionEnd = moment(region.endDate);

            if (regionStart.isBefore(min)) min = regionStart;
            if (regionEnd.isAfter(max)) max = regionEnd;
        });

        return { minDate: min, maxDate: max };
    }, [regions]);

    const [startDate, setStartDate] = useState(minDate);
    const [endDate, setEndDate] = useState(maxDate);

    // Update filter dates when the temporal extent changes
    useEffect(() => {
        setStartDate(minDate);
        setEndDate(maxDate);
    }, [minDate, maxDate]);

    // Reset filter dates when home button is clicked
    useEffect(() => {
        if (resetFilterDates) {
            setStartDate(minDate);
            setEndDate(maxDate);
            setResetFilterDates(false);
        }
    }, [resetFilterDates, minDate, maxDate, setResetFilterDates]);

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
                    minDate={minDate}
                    maxDate={maxDate}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "grey !important"
                        },
                        "&:hover fieldset": {
                            borderColor: "grey !important"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "grey !important"
                        }
                        },
                       "& label.Mui-focused": { // Add this to change label color when focused
                            color: "grey !important"
                        }
                    }}
                />
            </div>
            <div style={{ width: "45%", height: "90%" }}>
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "grey !important"
                        },
                        "&:hover fieldset": {
                            borderColor: "grey !important"
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "grey !important"
                        }
                        },
                       "& label.Mui-focused": { // Add this to change label color when focused
                            color: "grey !important"
                        }
                    }}
                />
            </div>
        </>
    );
}
