import React from "react";
import { Stats } from "../../types/stats";

type StatsCardProps = {
    stats: Stats;
    timestamp: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, timestamp }) => {
    const formatDateTime = ( time: number ) => {
        const date = new Date( time );
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${ month }/${ day }/${ year } ${ hour < 10 ? `0${ hour }` : hour }:${ minute < 10 ? `0${ minute }` : minute }:${ second < 10 ? `0${ second }` : second }`;
    }

    return (
        <div className="w-1/4">
            <table className="border">
            <caption className="caption-bottom">Data from { formatDateTime( timestamp ) }</caption>
                <thead>
                    <tr>
                        <th className="w-1/3 px-1 text-center">Stat</th>
                        <th className="w-1/3 px-1 text-center">Value</th>
                        <th className="w-1/3 px-1 text-center">Percentile</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys( stats ).map( stat => (
                            <tr>
                                <td>{ stat }</td>
                                <td>{ stats[stat]!.value.toFixed( 2 ) }</td>
                                <td>{ stats[stat]!.percentile }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default StatsCard;