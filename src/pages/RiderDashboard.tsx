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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

interface Ride {
  id: string;
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
    const { data: avail } = await supabase
      .from("rides")
      .select("id, pickup, drop_location, status, rider_id, user_id")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    setAvailable(avail ?? []);

    const { data: m } = await supabase
      .from("rides")
      .select("id, pickup, drop_location, status, rider_id, user_id")
      .eq("rider_id", user.id)
      .order("created_at", { ascending: false });
    setMine(m ?? []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const accept = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("rides")
      .update({ status: "accepted", rider_id: user.id })
      .eq("id", id)
      .eq("status", "pending");
    if (error) toast.error(error.message);
    else {
      toast.success("Ride accepted");
      load();
    }
  };

  const complete = async (id: string) => {
    const { error } = await supabase
      .from("rides")
      .update({ status: "completed" })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Ride completed");
      load();
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
                <TableRow key={r.id}>
                  <TableCell>{r.pickup}</TableCell>
                  <TableCell>{r.drop_location}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => accept(r.id)}>
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
                <TableRow key={r.id}>
                  <TableCell>{r.pickup}</TableCell>
                  <TableCell>{r.drop_location}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "accepted" && (
                      <Button size="sm" variant="outline" onClick={() => complete(r.id)}>
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
