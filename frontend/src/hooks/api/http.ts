import axios from 'axios'

type ApiErrorPayload = {
    message?: string
    error?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create( {
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
} )

export function getApiErrorMessage( error: unknown, fallbackMessage = 'Request failed' ) {
    if ( axios.isAxiosError<ApiErrorPayload>( error ) ) {
        const responseData = error.response?.data
        return responseData?.message || responseData?.error || error.message || fallbackMessage
    }

    if ( error instanceof Error ) {
        return error.message
    }

    return fallbackMessage
}