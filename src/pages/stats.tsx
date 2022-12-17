import type { NextPage } from "next";
import StatCards from "../components/cards/StatCards";
import { trpc } from "../utils/trpc";
import Router from "next/router";

const Stats: NextPage = () => {
    const query = trpc.stats.fetchStats.useQuery();
    const onUpdateStats = () => {
        query.refetch();
        Router.reload();
    }

    return (
        <div className="flex flex-col items-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={ onUpdateStats }
            >
                Update
            </button>
            <StatCards />
        </div>
    );
}

export default Stats;