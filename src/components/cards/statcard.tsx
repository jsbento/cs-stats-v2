import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

type StatCardProps = {
    stat: string;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
    const [ range, setRange ] = useState<number>(0);

    const { data, error } = trpc.stats.fetchStat.useQuery({ stat, range });

    // useEffect(() => {

    // }, [ stat ])

    return (
        <div>

        </div>
    );
}