import { useQuery } from '@tanstack/react-query'
import { api, getApiErrorMessage } from '@/hooks/api/http'
import { adminKeys } from '@/hooks/api/admin/keys'
import type { RunTelemetryResponse } from '@/hooks/schemas'

export function useRunTelemetry( runId: string ) {
    return useQuery( {
        queryKey: adminKeys.runTelemetry( runId ),
        queryFn: async () => {
            try {
                const response = await api.get<RunTelemetryResponse>( `/api/v1/admin/runs/${runId}/telemetry` )
                return response.data
            } catch ( error ) {
                throw new Error( getApiErrorMessage( error, 'Failed to load run telemetry' ) )
            }
        },
        enabled: !!runId,
        refetchInterval: ( query ) => {
            const status = query.state.data?.events
            if ( !status ) return 5000
            return false
        },
    } )
}