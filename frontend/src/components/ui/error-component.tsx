import React from 'react'

export function ErrorComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <h2 className="text-2xl font-bold text-accent-red mb-4">Something went wrong</h2>
            <p className="text-body mb-6">An unexpected error occurred. Please try again later.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark hover:bg-surface transition-colors"
            >
                Retry
            </button>
        </div>
    )
}
