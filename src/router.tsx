import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout'
import { HomePage } from '@/pages/home'
import { CallsPage } from '@/pages/calls'
import { CustomersPage } from './pages/customers'

// Create a root route
const rootRoute = createRootRoute({
  component: RootLayout,
})



// Create an index route
const indexRoute = createRoute({
  component: HomePage,
  path: '/',
  getParentRoute: () => rootRoute,
})

// Create a table route
const customersRoute = createRoute({
  component: CustomersPage,
  path: '/customers',
  getParentRoute: () => rootRoute,
})

const tableCalls = createRoute({
  component: CallsPage,
  path: '/calls',
  getParentRoute: () => rootRoute,
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, customersRoute, tableCalls])

// Create the router
export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}