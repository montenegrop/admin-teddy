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
import { AuthStorage } from "@/lib/auth";
import { VITE_FRONT } from "@/constants";
import { useCalls } from "@/hooks/useCalls";

export function TablePage() {

  const { calls, isLoading, error, refetchUsers } = useCalls();


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
            <TableHead>Store</TableHead>
            <TableHead>Twilio</TableHead>
            <TableHead>Caller</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Audio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls?.map((call) => (
            <TableRow key={call.id}>
              <TableCell>{call.name}</TableCell>
              <TableCell>{call.twilio}</TableCell>
              <TableCell>{call.caller}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>{call.summary}</TableCell>
              <TableCell>{call.audio_url}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
