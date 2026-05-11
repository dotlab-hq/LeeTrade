export const leaderboardKeys = {
    all: ['leaderboard'] as const,
    byChallenge: ( challengeId: string ) => [...leaderboardKeys.all, challengeId] as const,
}