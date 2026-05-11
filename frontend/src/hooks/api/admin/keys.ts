export const adminKeys = {
    all: ['admin'] as const,
    users: ( page: number, pageSize: number ) => [...adminKeys.all, 'users', page, pageSize] as const,
    containers: ( all?: boolean ) => [...adminKeys.all, 'containers', all] as const,
    challenges: () => [...adminKeys.all, 'challenges'] as const,
    challenge: ( id: string ) => [...adminKeys.challenges(), id] as const,
    run: ( runId: string ) => [...adminKeys.all, 'runs', runId] as const,
    runTelemetry: ( runId: string ) => [...adminKeys.run( runId ), 'telemetry'] as const,
}