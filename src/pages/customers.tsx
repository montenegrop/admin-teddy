import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useCompanies } from "@/hooks/useCompanies";
import { AuthStorage } from "@/lib/auth";
import { VITE_FRONT } from "@/constants";
import { ChevronDown, ChevronUp, Search, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

export function CustomersPage() {
  const { companies, isLoading, error, refetchCompanies } = useCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSavePassword = (password: string) => {
    AuthStorage.setPassword(password);
    refetchCompanies();
  };

  const toggleRow = (companyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getSMSBadgeVariant = (smsRemaining: number) => {
    if (smsRemaining > 50) return "default";
    if (smsRemaining > 20) return "secondary";
    return "destructive";
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading customers</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage and view all customer information
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 items-center">
          <PasswordInput onSave={handleSavePassword} className="w-64" />
          <Button variant="outline" onClick={() => refetchCompanies()}>
            Reload
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>SMS Credits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
              <TableHead className="w-20"></TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <Collapsible
                key={company.id}
                open={expandedRows.has(company.id)}
                onOpenChange={() => toggleRow(company.id)}
                asChild
              >
                <>
                  <CollapsibleTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-muted/50 h-20">

                      <TableCell className="font-medium ">
                        {company.name || "N/A"}
                      </TableCell>
                      <TableCell className="">
                        {company.email ? company.email.split('@')[0] : "N/A"}
                      </TableCell>
                      <TableCell className="">
                        {company.last_activity || "N/A"}
                      </TableCell>
                      <TableCell className="">
                        <Badge variant={getSMSBadgeVariant(company.sms_remining || 0)}>
                          {company.sms_remining || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right ">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `${VITE_FRONT}login?email=${company.email}&password=${AuthStorage.getPassword()}`,
                              '_blank'
                            );
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Login
                        </Button>
                      </TableCell>
                      <TableCell className="">
                        {expandedRows.has(company.id) ? (
                          <ChevronUp className="h-4 w-4 mx-auto" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="border-t bg-muted/20 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-lg mb-4">Customer Details</h3>
                              <dl className="space-y-3">
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Name:</dt>
                                  <dd className="text-sm">{company.name || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                                  <dd className="text-sm">{company.email || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Phone:</dt>
                                  <dd className="text-sm">{company.phone || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Twilio Phone:</dt>
                                  <dd className="text-sm">{company.twilio_phone || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Address:</dt>
                                  <dd className="text-sm">{company.address || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Signup Date:</dt>
                                  <dd className="text-sm">{company.created_at || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">SMS Credits Remaining:</dt>
                                  <dd className="text-sm">
                                    <Badge variant={getSMSBadgeVariant(company.sms_remining || 0)}>
                                      {company.sms_remining || 0}
                                    </Badge>
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-4">Actions</h3>
                              <div className="space-y-3">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    window.open(
                                      `${VITE_FRONT}login?email=${company.email}&password=${AuthStorage.getPassword()}`,
                                      '_blank'
                                    );
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Stripe Portal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No customers found matching your search.
        </div>
      )}
    </div>
  );
}