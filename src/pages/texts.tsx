import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTexts } from "@/hooks/useTexts";
import { AuthStorage } from "@/lib/auth";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";

export function TextsPage() {
    const { texts, isLoading, error, refetchtexts } = useTexts();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const handleSavePassword = (password: string) => {
        AuthStorage.setPassword(password);
        refetchtexts();
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
                    <Button variant="outline" onClick={() => refetchtexts()}>
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
                            <TableHead>Direction</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="w-20"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {texts?.map((text) => (
                            <Collapsible
                                key={text.id}
                                open={expandedRows.has(text.id)}
                                onOpenChange={() => toggleRow(text.id)}
                                asChild
                            >
                                <>
                                    <CollapsibleTrigger asChild>
                                        <TableRow className="cursor-pointer hover:bg-muted/50 h-16">

                                            <TableCell className="font-medium py-4">
                                                {text.name && text.name.length > 25 ? (
                                                    <span title={text.name}>{text.name.slice(0, 25)}...</span>
                                                ) : (
                                                    text.name || "N/A"
                                                )}
                                            </TableCell>

                                            <TableCell className="py-4">
                                                {"-"}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {text.from || "N/A"}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {text.to || "N/A"}
                                            </TableCell>

                                            <TableCell className="py-4">
                                                {text.created_at ? (
                                                    <time
                                                        dateTime={new Date(text.created_at).toISOString()}
                                                        title={`${new Date(text.created_at).toUTCString()}`}
                                                    >
                                                        {new Intl.DateTimeFormat("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            timeZoneName: "short",
                                                        }).format(new Date(text.created_at))}
                                                    </time>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {expandedRows.has(text.id) ? (
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
                                                            <h3 className="font-semibold text-lg mb-4">Message Content</h3>
                                                            <dl className="space-y-3">
                                                                <div>
                                                                    <dt className="text-sm font-medium text-muted-foreground">Store Name:</dt>
                                                                    <dd className="text-sm">{text.content || "N/A"}</dd>
                                                                </div>


                                                            </dl>
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

            {texts?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No calls found matching your search.
                </div>
            )}
        </div>
    );
}