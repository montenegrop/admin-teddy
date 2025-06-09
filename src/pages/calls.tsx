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
import { AuthStorage } from "@/lib/auth";
import { useCalls } from "@/hooks/useCalls";
import { ChevronDown, ChevronUp, Search, ExternalLink, Play } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function CallsPage() {
  const { calls, isLoading, error, refetchCalls } = useCalls();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSavePassword = (password: string) => {
    AuthStorage.setPassword(password);
    refetchCalls();
  };

  const toggleRow = (callId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(callId)) {
      newExpanded.delete(callId);
    } else {
      newExpanded.add(callId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredCalls = calls?.filter((call) =>
    call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.caller.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.twilio.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading calls</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-200 py-2">
        <h1 className="text-3xl font-bold tracking-tight">Call Logs</h1>

      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 items-center">
          <PasswordInput onSave={handleSavePassword} className="w-64" />
          <Button variant="outline" onClick={() => refetchCalls()}>
            Reload
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Call time</TableHead>
              <TableHead>Caller #</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.map((call) => (
              <Collapsible
                key={call.id}
                open={expandedRows.has(call.id)}
                onOpenChange={() => toggleRow(call.id)}
                asChild
              >
                <>
                  <CollapsibleTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-muted/50 h-16">

                      <TableCell className="font-medium py-4">
                        {call.name && call.name.length > 25 ? (
                          <span title={call.name}>{call.name.slice(0, 25)}...</span>
                        ) : (
                          call.name || "N/A"
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {call.twilio || "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        {call.caller || "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        {call.duration || "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        {expandedRows.has(call.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="border-t bg-muted/20 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-lg mb-4">Call Details</h3>
                              <dl className="space-y-3">
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Store Name:</dt>
                                  <dd className="text-sm">{call.name || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Twilio Number:</dt>
                                  <dd className="text-sm">{call.twilio || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Caller Number:</dt>
                                  <dd className="text-sm">{call.caller || "N/A"}</dd>
                                </div>
                                <div>
                                  <dt className="text-sm font-medium text-muted-foreground">Call Duration:</dt>
                                  <dd className="text-sm">{call.duration || "N/A"}</dd>
                                </div>

                              </dl>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-4">Call Analysis</h3>
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">Summary:</h4>
                                  <div className="min-h-[3rem] max-h-[7.5rem] overflow-y-auto border rounded-md p-3 bg-muted/30 text-sm leading-relaxed">
                                    {(() => {
                                      try {
                                        return call.summary
                                          ? JSON.parse(call.summary).call_summary || "No summary available"
                                          : "No summary available";
                                      } catch (error) {
                                        return call.summary || "No summary available";
                                      }
                                    })()}
                                  </div>
                                </div>

                                {call.audio_url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      window.open(call.audio_url, '_blank');
                                    }}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Play Audio Recording
                                  </Button>
                                )}
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

      {filteredCalls.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No calls found matching your search.
        </div>
      )}
    </div>
  );
}