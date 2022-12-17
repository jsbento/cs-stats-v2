import React from "react";
import dynamic from "next/dynamic";
import { trpc } from "../../utils/trpc";
const Plot = dynamic( () => import( "react-plotly.js" ), { ssr: false } );

type CompositeStatPlotProps = {
    statA: string;
    statB: string;
    title: string;
}

const CompositeStatPlot: React.FC<CompositeStatPlotProps> = ({ statA, statB, title }) => {
    const { data, error } = trpc.stats.fetchCompositeStats.useQuery({ statA, statB });

    return (
        data && data.statAData && data.statBData ? (
            <Plot
                data={[
                    {
                        x: data.statAData,
                        y: data.statBData,
                        name: `${statA} vs ${statB}`,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: {
                            color: "blue",
                        },
                    },
                ]}
                layout={{
                    width: 600,
                    height: 600,
                    title,
                    xaxis: {
                        title: statA,
                    },
                    yaxis: {
                        title: statB,
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

export default CompositeStatPlot;