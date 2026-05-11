import React from 'react'
import { useNavigate } from '@tanstack/react-router'

export function NotFoundComponent() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">Page Not Found</h2>
            <p className="text-body mb-6">The page you are looking for doesn't exist or has been moved.</p>
            <button
                onClick={() => navigate( { to: '/app' } )}
                className="px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark hover:bg-surface transition-colors"
            >
                Go Back Home
            </button>
        </div>
    )
}
