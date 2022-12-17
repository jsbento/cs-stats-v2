import React from "react";
import dynamic from "next/dynamic";
import { trpc } from "../../utils/trpc";
const Plot = dynamic( () => import( "react-plotly.js" ), { ssr: false } );

type StatPlotProps = {
    stat: string;
    title: string;
    filters: {
        start: number;
        end: number;
    }
}

const StatPlot: React.FC<StatPlotProps> = ({ stat, title, filters }) => {
    const { data, error } = trpc.stats.fetchStat.useQuery({ stat, range: filters.end });

    return (
        data && data.statData && data.timestamps && data.bestFit ? (
            <Plot
                data={[
                    {
                        x: data.timestamps,
                        y: data.statData,
                        type: "scatter",
                        name: "Data",
                        mode: "lines+markers",
                        marker: {
                            color: "blue",
                        },
                    }
                ]}
                layout={{
                    width: 600,
                    height: 600,
                    title,
                    xaxis: {
                        title: "Timestamp",
                    },
                    yaxis: {
                        title: stat,
                    },
                }}
            />
        ) : (
            <div>
                <p>Loading...</p>
            </div>
        )
    );
}

export default StatPlot;