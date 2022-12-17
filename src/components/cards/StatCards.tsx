import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import ButtonBar from "../common/ButtonBar";
import StatsCard from "./StatsCard";

const StatCards: React.FC = () => {
    const [ currPage, setCurrPage ] = useState<number>( 1 );
    
    const { data, error } = trpc.stats.getAll.useQuery({ page: currPage });

    const onPageChange = ( dir: string ) => {
        if( dir === "prev" ) {
            if( data?.info.prev )
                setCurrPage( currPage - 1 );
        } else if( dir === "next" ) {
            if( data?.info.next )
                setCurrPage( currPage + 1 );
        } else if( dir === "first" ) {
            setCurrPage( 1 );
        } else if( dir === "last" ) {
            setCurrPage( data?.info.pages! );
        }
    }

    if ( error ) {
        return <div>{ error.message }</div>;
    }

    return (
        <>
            <ButtonBar page= {currPage } pages={ data?.info.pages! } onPageChange={ onPageChange } />
                <ul className="grid gap-28 grid-cols-4">
                    { data?.stats.map(( stat, i ) => (
                        <StatsCard key={ i } { ...stat } />
                      ))
                    }
                </ul>
            <ButtonBar page={ currPage } pages={ data?.info.pages! } onPageChange={ onPageChange } />
        </>
    );
}

export default StatCards;