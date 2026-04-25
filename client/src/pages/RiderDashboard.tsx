import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

interface Ride {
  _id: string;
  pickup: string;
  drop_location: string;
  status: string;
  rider_id: string | null;
  user_id: string;
}

export default function RiderDashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState<Ride[]>([]);
  const [mine, setMine] = useState<Ride[]>([]);

  const load = async () => {
    if (!user) return;

    const availRes = await fetch("http://localhost:5000/api/rides/available", {
      credentials: "include",
    });
    const avail = await availRes.json();
    setAvailable(avail);

    const myRes = await fetch("http://localhost:5000/api/rides/my", {
      credentials: "include",
    });
    const my = await myRes.json();
    setMine(my);
  };
  useEffect(() => {
    load();
  }, [user]);

  const accept = async (id: string) => {
    const res = await fetch(`http://localhost:5000/api/rides/accept/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Ride accepted");
      load();
    } else {
      toast.error("Failed");
    }
  };

  const complete = async (id: string) => {
    const res = await fetch(`http://localhost:5000/api/rides/complete/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Ride completed");
      load();
    } else {
      toast.error("Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Rider dashboard</h1>
          <p className="text-muted-foreground">Accept rides and mark them as done.</p>
        </div>

        <Card className="shadow-card">
          <div className="px-6 pt-6">
            <h2 className="font-semibold">Available rides</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pickup</TableHead>
                <TableHead>Drop</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {available.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No pending rides.
                  </TableCell>
                </TableRow>
              )}
              {available.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.pickup}</TableCell>
                  <TableCell>{r.drop_location}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => accept(r._id)}>
                      Accept
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="shadow-card">
          <div className="px-6 pt-6">
            <h2 className="font-semibold">Your accepted rides</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pickup</TableHead>
                <TableHead>Drop</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No accepted rides yet.
                  </TableCell>
                </TableRow>
              )}
              {mine.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.pickup}</TableCell>
                  <TableCell>{r.drop_location}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "accepted" && (
                      <Button size="sm" variant="outline" onClick={() => complete(r._id)}>
                        Mark completed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
