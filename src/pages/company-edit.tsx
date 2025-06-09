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
import type { Company } from "@/services/api";

export function CompanyEditPage() {
    const { companyId } = useParams({ from: '/companies/$companyId/edit' });
    const navigate = useNavigate();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
        // Refetch company data when password is updated
        fetchCompanyData();
    };

    const fetchCompanyData = async () => {
        try {
            setIsLoading(true);
            // TODO: Implement API call to fetch single company by ID
            // const response = await UserService.getCompany(companyId);
            // setCompany(response);
            // setFormData({
            //   name: response.name,
            //   email: response.email,
            //   phone: response.phone,
            //   twilio_phone: response.twilio_phone,
            //   address: response.address,
            //   sms_remining: response.sms_remining,
            // });

            // Mock data for now - replace with actual API call
            const mockCompany: Company = {
                id: companyId,
                name: "Sample Company",
                email: "sample@company.com",
                phone: "+1234567890",
                twilio_phone: "+1987654321",
                address: "123 Main St, City, State",
                sms_remining: 150,
                company_category_id: 1,
                timezone_offset_mins: -300,
                timezone: "America/New_York",
                city: "New York",
                created_at: "2024-01-01",
                last_activity: "2024-01-15",
            };

            setCompany(mockCompany);
            setFormData({
                name: mockCompany.name,
                email: mockCompany.email,
                phone: mockCompany.phone,
                twilio_phone: mockCompany.twilio_phone,
                address: mockCompany.address,
                sms_remining: mockCompany.sms_remining,
            });
        } catch (error) {
            console.error("Error fetching company:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            // TODO: Implement API call to update company
            // await UserService.updateCompany(companyId, formData);
            console.log("Saving company data:", formData);

            // Navigate back to customers page after successful save
            navigate({ to: '/customers' });
        } catch (error) {
            console.error("Error saving company:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getSMSBadgeVariant = (smsRemaining: number) => {
        if (smsRemaining > 50) return "default";
        if (smsRemaining > 20) return "secondary";
        return "destructive";
    };

    useEffect(() => {
        fetchCompanyData();
    }, [companyId]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
    }

    if (!company) {
        return <div className="flex items-center justify-center min-h-[400px]">Company not found</div>;
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
                                <Button onClick={handleSave} disabled={isSaving}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate({ to: '/customers' })}
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