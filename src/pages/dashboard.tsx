import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from '@/hooks/useDashboard'
import { AlertTriangle, MessageSquare, Phone, Users } from "lucide-react"
import * as React from 'react'




// Component for metric cards using shadcn/ui Card
const formatMetricValue = (value: number | undefined, fallbackText: string = "N/A") => {
  if (value === undefined) return "Loading...";
  if (value === -1) return fallbackText;
  return value.toString();
};

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  changeType = "positive"
}: {
  title: string
  value: string | number
  change?: string
  icon: React.ElementType
  changeType?: "positive" | "negative"
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <CardDescription className={`text-xs ${changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}>
            {change}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { dashboardData } = useDashboard()



  return (
    <div className="space-y-8">
      <div className="bg-gray-200 py-2">

        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Customers"
            value={formatMetricValue(dashboardData?.companies_count, "Error")}
            icon={Users}
          />
          <MetricCard
            title="Daily Active Users"
            value="coming soon"
            // change="+8% from yesterday"
            icon={Users}
          />
          <MetricCard
            title="Weekly Active Users"
            value="coming soon"
            // change="+15% from last week"
            icon={Users}
          />
        </div>
      </div>

      {/* Call & Text Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Call & Text Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Calls Today"
            value={formatMetricValue(dashboardData?.calls_today, "Error")}
            change="+5% from yesterday"
            icon={Phone}
          />
          <MetricCard
            title="Texts Sent Today"
            value={formatMetricValue(dashboardData?.sms_today, "Error")}
            change="+12% from yesterday"
            icon={MessageSquare}
          />
        </div>
      </div>

      {/* Attention Required Section */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-lg text-yellow-800">Attention Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm font-medium text-yellow-800">
            Companies with low SMS credits (less than 200):
          </CardDescription>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>SMS Credits</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.low_sms_companies.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={company.sms_remining < 10 ? "destructive" : "secondary"}
                      >
                        {company.sms_remining}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-1" to={`/companies/${company.id}/edit`} />
                        Fill
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </CardContent>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm font-medium text-yellow-800">
            Companies with 0 calls today:
          </CardDescription>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  {/* <TableHead>SMS Credits</TableHead> */}
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.no_calls_companies.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    {/* <TableCell>
                      <Badge
                        variant={company.sms_remining < 10 ? "destructive" : "secondary"}
                      >
                        {company.sms_remining}
                      </Badge>
                    </TableCell> */}
                    <TableCell className="text-right">
                      {/* <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-1" to={`/companies/${company.id}/edit`} />
                        Fill
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}