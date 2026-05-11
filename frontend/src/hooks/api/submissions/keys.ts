export const submissionKeys = {
    all: ['submissions'] as const,
    lists: () => [...submissionKeys.all, 'list'] as const,
    list: ( filters: Record<string, unknown> ) => [...submissionKeys.lists(), filters] as const,
    details: () => [...submissionKeys.all, 'detail'] as const,
    detail: ( id: string ) => [...submissionKeys.details(), id] as const,
    status: ( id: string ) => [...submissionKeys.detail( id ), 'status'] as const,
    logs: ( id: string ) => [...submissionKeys.detail( id ), 'logs'] as const,
}