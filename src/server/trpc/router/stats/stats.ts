import { router, publicProcedure, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ServerStats, StatInfo, Stats } from "../../../../types/stats";
import { calculateBestFit } from "../../../../utils/stats";
import { env } from "../../../../env/server.mjs";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const RESULTS_PER_PAGE = 4;

export const statsRouter = router({
    fetchStats: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const raw_stats = await fetch(env.TRN_API_URL + ctx.session.user.userProfile!.steamUsername, {
                    method: "GET",
                    headers: {
                        "TRN-Api-Key": env.TRN_API_KEY,
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

                await ctx.db.collection<ServerStats>("stats").insertOne({
                    username: ctx.session.user.userProfile!.steamUsername,
                    stats,
                    timestamp: Date.now()
                });

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
                username: ctx.session.user.userProfile!.steamUsername,
            }
            if( input.range !== 0 ) {
                const start = Date.now();
                filter['timestamp'] = {
                    '$gte': start - (input.range * DAY_IN_MS),
                    '$lte': start,
                }
            }
            try {
                const stats = await ctx.db.collection<ServerStats>("stats").find(filter, {
                    projection: {
                        data: {
                            [ input.stat ]: { value: 1 }
                        }, 
                        timestamp: 1,
                    }
                }).toArray();
                if( !stats ) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No stats found"
                    });
                } else {
                    const statData: number[] = stats.map( stat => {
                        if ( input.stat === 'timePlayed' ) return stat.stats[input.stat]!.value / 3600;
                        return stat.stats[input.stat]!.value;
                    })
                    const timestamps: number[] = stats.map( stat => ( stat.timestamp - stats[0]!.timestamp ) / DAY_IN_MS );
                    const bestFit = calculateBestFit(timestamps, statData);
                    return {
                        statData,
                        timestamps,
                        bestFit,
                    };
                }
            } catch ( err: any ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message
                });
            }
        }),
    getAll: protectedProcedure
        .input(z.object({
            page: z.number().nullable(),
        }).required())
        .query(async ({ ctx, input }) => {
            try {
                const stats = (await ctx.db.collection<ServerStats>("stats").find({
                    username: ctx.session.user.userProfile!.steamUsername,
                }).toArray()).reverse();

                if( !stats ) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No stats found"
                    });
                }
    
                const page: number = input.page || 1;
                const pages: number = Math.ceil(stats.length / RESULTS_PER_PAGE);
                const statInfo: StatInfo = {
                    count: stats.length,
                    pages,
                    next: page !== pages ? page + 1 : null,
                    prev: page !== 1 ? page - 1 : null,
                }
                const startIdx = (page - 1) * RESULTS_PER_PAGE;
                const endIdx = page * RESULTS_PER_PAGE;

                return {
                    info: statInfo,
                    stats: stats.slice(startIdx, endIdx),
                }
            } catch( err: any ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message
                });
            }
        }),
    fetchCompositeStats: protectedProcedure
        .input(z.object({
            statA: z.string(),
            statB: z.string(),
        }).required())
        .query(async ({ ctx, input }) => {
            try {
                const stats = await ctx.db.collection<ServerStats>("stats").find({
                    username: ctx.session.user.userProfile!.steamUsername,
                }, {
                    projection: {
                        data: {
                            [ input.statA ]: { value: 1 },
                            [ input.statB ]: { value: 1 },
                        },
                    },
                }).toArray();
                if( !stats ) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "No stats found"
                    });
                } else {
                    const statAData: number[] = stats.map( stat => {
                        return input.statA === 'timePlayed' ? stat.stats[input.statA]!.value / 3600 : stat.stats[input.statA]!.value;
                    });
                    const statBData: number[] = stats.map( stat => {
                        return input.statB === 'timePlayed' ? stat.stats[input.statB]!.value / 3600 : stat.stats[input.statB]!.value;
                    });

                    return {
                        statAData,
                        statBData,
                    }
                }
            } catch( err: any ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message
                });
            }
        }),
})