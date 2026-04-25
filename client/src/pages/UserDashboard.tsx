import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  id: string;
  pickup: string;
  drop_location: string;
  status: string;
  created_at: string;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;

    const res = await fetch("http://localhost:5000/api/rides/user", {
      credentials: "include",
    });

    const data = await res.json();
    setRides(data);
  };

  useEffect(() => {
    load();
  }, [user]);

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim()) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pickup,
        drop_location: drop,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Ride booked");
      setPickup("");
      setDrop("");
      load();
    } else {
      toast.error("Failed to book");
    }
  };

  const cancel = async (id: string) => {
    const res = await fetch(
      `http://localhost:5000/api/rides/cancel/${id}`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    if (res.ok) {
      toast.success("Ride cancelled");
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
          <h1 className="text-3xl font-bold">Your rides</h1>
          <p className="text-muted-foreground">Book and manage your rides.</p>
        </div>

        <Card className="p-6 shadow-card">
          <h2 className="font-semibold mb-4">Book a ride</h2>
          <form onSubmit={book} className="grid md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup</Label>
              <Input
                id="pickup"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drop">Drop</Label>
              <Input
                id="drop"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Booking..." : "Book ride"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-0 overflow-hidden shadow-card">
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
              {rides.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No rides yet.
                  </TableCell>
                </TableRow>
              )}
              {rides.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.pickup}</TableCell>
                  <TableCell>{r.drop_location}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancel(r.id)}
                      >
                        Cancel
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
