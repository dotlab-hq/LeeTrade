import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useState } from 'react'

import PostHogProvider from '../integrations/posthog/provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { ToastStack } from '../components/ui/toast'
import { ConfirmDialog, CommandDialog } from '../components/ui/modals'
import { ErrorComponent } from '../components/ui/error-component'
import { NotFoundComponent } from '../components/ui/not-found-component'
import { useUiStore } from '../stores/ui-store'
import { useAuthStore } from '../lib/auth-store'
import { useMe } from '../hooks/api'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()( {
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  head: () => ( {
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'LeetTrade — Algorithmic Trading Arena',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  } ),
  shellComponent: RootDocument,
} )

function KeyboardShortcuts() {
  const { setCommandOpen } = useUiStore()

  useEffect( () => {
    function handleKeyDown( e: KeyboardEvent ) {
      if ( ( e.metaKey || e.ctrlKey ) && e.key === 'k' ) {
        e.preventDefault()
        setCommandOpen( true )
      }
    }
    window.addEventListener( 'keydown', handleKeyDown )
    return () => window.removeEventListener( 'keydown', handleKeyDown )
  }, [setCommandOpen] )

  return null
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const { initAuth } = useAuthStore()
  const { data: sessionData, isLoading, isError } = useMe()

  useEffect(() => {
    if (!isLoading) {
      if (sessionData?.user) {
        initAuth(sessionData)
      } else if (isError) {
        // User is not authenticated
        initAuth(null)
      }
      setIsInitialized(true)
    }
  }, [sessionData, isLoading, isError, initAuth])

  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-blue"></div>
          <p className="mt-4 text-body">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function RootDocument( { children }: { children: React.ReactNode } ) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <PostHogProvider>
          <AuthInitializer>
            <KeyboardShortcuts />
            {children}
            <ToastStack />
            <ConfirmDialog />
            <CommandDialog />
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </AuthInitializer>
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}
