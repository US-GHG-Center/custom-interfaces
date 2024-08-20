
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from "../dashboard";

export function DashboardContainer() {
    const [searchParams] = useSearchParams();
    const [dataset] = useState(searchParams.get("dataset") || "gra2pes"); //vulcan, gra2pes (default)

    return (
        <Dashboard dataset={dataset} />
    )
}
