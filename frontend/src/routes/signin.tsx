import { createFileRoute } from '@tanstack/react-router'
import { SigninPage } from '#/components/auth/signin-page'

export const Route = createFileRoute('/signin')({
  component: SigninPage,
})
