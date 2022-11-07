import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Stats } from "../../../../types/stats";
import { calculateBestFit } from "../../../../utils/stats";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const statsRouter = router({
    fetchStats: protectedProcedure
        .query(async ({ ctx, input }) => {
            try {
                const raw_stats = await fetch(process.env.TRN_API_URL! + 'ctx.session.user.profile.steamUsername', {
                    method: "GET",
                    headers: {
                        "TRN-Api-Key": process.env.TRN_API_KEY!,
                    },
                })
                .then(res => res.json())
                .then(data => data.data.segments[0].stats);

                const stats: Stats = {};
                for( const stat in raw_stats ) {
                    stats[stat] = {
                        value: raw_stats[stat].value,
                        percentile: raw_stats[stat].percentile,
                    };
                }

                const result = await ctx.db.collection("stats").insertOne({ username: 'ctx.session.user.profile.steamUsername', stats, timestamp: Date.now() });
                console.log(result)
                return stats;
            } catch( err: any ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message,
                });
            }
        }),
    fetchStat: protectedProcedure
        .input(z.object({
            stat: z.string(),
            range: z.number(),
        }).required())
        .query(async ({ ctx, input }) => {
            const filter: { [ key: string ]: string | Object } = {
                username: 'ctx.session.user.profile.steamUsername',
            }
            if( input.range !== 0 ) {
                const start = Date.now();
                filter['timestamp'] = {
                    '$gte': start - (input.range * DAY_IN_MS),
                    '$lte': start,
                }
            }
            try {
                const stats = await ctx.db.collection("stats").find(filter, {
                    projection: {
                        data: {
                            [ input.stat ]: { value: 1 }
                        }, 
                        timestamp: 1,
                    }
                }).toArray();
                if( !stats ) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "No stats found" });
                } else {
                    const statData: number[] = stats.map( stat => {
                        if ( input.stat === 'timePlayed' ) return stat.data[input.stat].value / 3600;
                        return stat.data[input.stat].value;
                    })
                    const timestamps: number[] = stats.map( stat => ( stat.timestamp - stats[0]!.timestamp ) / DAY_IN_MS );
                    const bestFit = calculateBestFit(timestamps, statData);
                    return {
                        statData,
                        timestamps,
                        bestFit,
                    };
                }
            } catch ( error: any ) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
            }
        }),
})