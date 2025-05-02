import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useCompanies } from "@/hooks/useCompanies";
import { AuthStorage } from "@/lib/auth";
import { VITE_FRONT } from "@/constants";

export function TablePage() {
  const { companies, isLoading, error, refetchUsers } = useCompanies();

  const handleSavePassword = (password: string) => {
    AuthStorage.setPassword(password);
    refetchUsers();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-4 items-center">
          <PasswordInput onSave={handleSavePassword} className="w-64" />
          <Button variant="outline" onClick={() => refetchUsers()}>
            Reload
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Twilio</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last activity</TableHead>
            <TableHead>Sms</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.phone}</TableCell>
              <TableCell>{company.twilio_phone}</TableCell>
              <TableCell>{company.city}</TableCell>
              <TableCell className="hover:underline hover:text-blue-600">
                <a
                  href={`${VITE_FRONT}login?email=${
                    company.email
                  }&password=${AuthStorage.getPassword()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.email}
                </a>
              </TableCell>
              <TableCell>{company.last_activity}</TableCell>
              <TableCell>{company.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
