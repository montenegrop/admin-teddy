import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout'
import { CallsPage } from '@/pages/calls'
import { CustomersPage } from './pages/customers'
import { DashboardPage } from './pages/dashboard'
import { CompanyEditPage } from './pages/company-edit'

// Create a root route
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Create an index route
const indexRoute = createRoute({
  component: DashboardPage,
  path: '/',
  getParentRoute: () => rootRoute,
})

const DashboardRoute = createRoute({
  component: DashboardPage,
  path: '/dashboard',
  getParentRoute: () => rootRoute,
})

// Create a customers route
const customersRoute = createRoute({
  component: CustomersPage,
  path: '/customers',
  getParentRoute: () => rootRoute,
})

// Create a calls route
const callsRoute = createRoute({
  component: CallsPage,
  path: '/calls',
  getParentRoute: () => rootRoute,
})

// Create a company edit route with dynamic company ID parameter
const companyEditRoute = createRoute({
  component: CompanyEditPage,
  path: '/companies/$companyId/edit',
  getParentRoute: () => rootRoute,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  customersRoute,
  callsRoute,
  DashboardRoute,
  companyEditRoute
])

// Create the router
export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}