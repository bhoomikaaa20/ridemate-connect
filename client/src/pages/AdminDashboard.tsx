import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

interface Profile {
  id: string;
  name: string;
  email: string;
}
interface RoleRow {
  user_id: string;
  role: string;
}
interface Ride {
  id: string;
  pickup: string;
  drop_location: string;
  status: string;
  user_id: string;
  rider_id: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  const load = async () => {
    try {
      const [usersRes, ridesRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/users", {
          credentials: "include"
        }),
        fetch("http://localhost:5000/api/admin/rides", {
          credentials: "include"
        })
      ]);

      const users = await usersRes.json();
      const rides = await ridesRes.json();

      setProfiles(users);
      setRides(rides);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const roleOf = (uid: string) => {
    const user = profiles.find((p) => p.id === uid);
    return (user as any)?.role || "user";
  };
  const nameOf = (user: any) => {
    if (!user) return "—";
    return user.name || user.email;
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      toast.success("User deleted");
      load();
    }
  };

  const deleteRide = async (id: string) => {
    const res = await fetch(`http://localhost:5000/api/admin/rides/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      toast.success("Ride deleted");
      load();
    }
  };

  const usersList = profiles.filter((p) => roleOf(p.id) === "user");
  const ridersList = profiles.filter((p) => roleOf(p.id) === "rider");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="text-muted-foreground">Manage users, riders and rides.</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users ({usersList.length})</TabsTrigger>
            <TabsTrigger value="riders">Riders ({ridersList.length})</TabsTrigger>
            <TabsTrigger value="rides">Rides ({rides.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="shadow-card overflow-hidden">
              <PeopleTable list={usersList} onDelete={deleteUser} />
            </Card>
          </TabsContent>

          <TabsContent value="riders">
            <Card className="shadow-card overflow-hidden">
              <PeopleTable list={ridersList} onDelete={deleteUser} />
            </Card>
          </TabsContent>

          <TabsContent value="rides">
            <Card className="shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Drop</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rides.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No rides.
                      </TableCell>
                    </TableRow>
                  )}
                  {rides.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{nameOf(r.user_id)}</TableCell>
                      <TableCell>{nameOf(r.rider_id)}</TableCell>
                      <TableCell>{r.pickup}</TableCell>
                      <TableCell>{r.drop_location}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteRide(r.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PeopleTable({
  list,
  onDelete,
}: {
  list: Profile[];
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
              None yet.
            </TableCell>
          </TableRow>
        )}
        {list.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.name || "—"}</TableCell>
            <TableCell>{p.email}</TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(p.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
