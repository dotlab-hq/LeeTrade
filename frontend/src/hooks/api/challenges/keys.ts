export const challengeKeys = {
    all: ['challenges'] as const,
    lists: () => [...challengeKeys.all, 'list'] as const,
    list: ( filters: Record<string, unknown> ) => [...challengeKeys.lists(), filters] as const,
    details: () => [...challengeKeys.all, 'detail'] as const,
    detail: ( id: string ) => [...challengeKeys.details(), id] as const,
}