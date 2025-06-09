import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthStorage } from "@/lib/auth";
import { VITE_FRONT } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Save, ArrowLeft } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";

export function CompanyEditPage() {
    const { companyId } = useParams({ from: '/companies/$companyId/edit' });
    const navigate = useNavigate();
    const { 
        company, 
        isLoading, 
        error,
        updateCompany, 
        isUpdating, 
        updateError, 
        updateSuccess,
        refetchCompany 
    } = useCompany(companyId);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        twilio_phone: "",
        address: "",
        sms_remining: 0,
    });

    const handleSavePassword = (password: string) => {
        AuthStorage.setPassword(password);
        refetchCompany();
    };

    const handleSave = async () => {
        try {
            updateCompany(formData);
        } catch (error) {
            console.error("Error saving company:", error);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getSMSBadgeVariant = (smsRemaining: number) => {
        if (smsRemaining > 200) return "default";
        if (smsRemaining > 50) return "secondary";
        return "destructive";
    };

    // Update form data when company data is loaded
    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                email: company.email || "",
                phone: company.phone || "",
                twilio_phone: company.twilio_phone || "",
                address: company.address || "",
                sms_remining: company.sms_remining || 0,
            });
        }
    }, [company]);

    // Navigate back to customers page on successful update
    useEffect(() => {
        if (updateSuccess) {
            navigate({ to: '/customers' });
        }
    }, [updateSuccess, navigate]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
    }

    if (error || !company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Company not found</h2>
                    <p className="text-muted-foreground">
                        {error ? "Error loading company data" : "The company you're looking for doesn't exist"}
                    </p>
                </div>
                <Button onClick={() => navigate({ to: '/customers' })}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Customers
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-200 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate({ to: '/customers' })}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Customers
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <PasswordInput onSave={handleSavePassword} className="w-64" />
                </div>
            </div>

            {/* Error Messages */}
            {updateError && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-800 text-sm">
                            Error updating company: {updateError.message}
                        </p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Edit Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter business name"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Twilio Phone Number</label>
                                <Input
                                    value={formData.twilio_phone}
                                    onChange={(e) => handleInputChange('twilio_phone', e.target.value)}
                                    placeholder="Enter Twilio phone number"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Address</label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter address"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">SMS Credits</label>
                                <Input
                                    type="number"
                                    value={formData.sms_remining}
                                    onChange={(e) => handleInputChange('sms_remining', parseInt(e.target.value) || 0)}
                                    placeholder="Enter SMS credits"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button onClick={handleSave} disabled={isUpdating}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate({ to: '/customers' })}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Company Details Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Company ID</dt>
                                <dd className="text-sm font-mono">{company.id}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Signup Date</dt>
                                <dd className="text-sm">{company.created_at}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Last Activity</dt>
                                <dd className="text-sm">{company.last_activity}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Timezone</dt>
                                <dd className="text-sm">{company.timezone}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">City</dt>
                                <dd className="text-sm">{company.city}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">SMS Credits Status</dt>
                                <dd className="text-sm">
                                    <Badge variant={getSMSBadgeVariant(formData.sms_remining)}>
                                        {formData.sms_remining} credits
                                    </Badge>
                                </dd>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
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
                                Login as Customer
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}