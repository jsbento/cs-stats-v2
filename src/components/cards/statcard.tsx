import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

type StatCardProps = {
    stat: string;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
    const [ statData, setStatData ] = useState<{ statData: number[], bestFit: number[] } | null>(null);
    const { data, error } = trpc.stats.fetchStat.useQuery({ stat, range: 0 });

    useEffect(() => {
        if( data ) {
            setStatData({
                statData: data.statData.reverse(),
                bestFit: data.bestFit.reverse(),
            });
        }
    }, [ stat ])

    return (
        <div className="items-center text-center">
            { !statData ? 
                <p className="font-semibold animate-">Loading...</p>
                :
                <>
                    <p className="font-semibold">{ stat }</p>
                    <div className="border-md border-2">
                        <table className="overflow-x-scroll">
                            <thead className="sticky top-0 bg-gray-300">
                                <tr className="font-semibold">
                                    <td>Value</td><td>Trend Diff</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    statData && statData.statData.map(( value: number, index: number ) => (
                                        <tr className="text-center">
                                            <td>{ value.toPrecision(6) }</td>
                                            <td>{ (value - statData.bestFit[index]!).toPrecision(6) }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    );
}

export default StatCard;