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
import { supabase } from "@/integrations/supabase/client";
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
    const { data, error } = await supabase
      .from("rides")
      .select("id, pickup, drop_location, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRides(data ?? []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!pickup.trim() || !drop.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("rides").insert({
      user_id: user.id,
      pickup: pickup.trim(),
      drop_location: drop.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ride booked");
    setPickup("");
    setDrop("");
    load();
  };

  const cancel = async (id: string) => {
    const { error } = await supabase
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Ride cancelled");
      load();
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
