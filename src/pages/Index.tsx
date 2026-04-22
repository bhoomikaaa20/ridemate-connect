import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Car, MapPin, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, role, loading } = useAuth();

  // Seed default admin (idempotent on backend) once on first visit
  useEffect(() => {
    supabase.functions.invoke("seed-admin").catch(() => {});
  }, []);

  if (!loading && user && role) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "rider") return <Navigate to="/rider" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Simple. Fast. Reliable.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Ride Booking System
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Book a ride in seconds. For users, riders and administrators —
              everything you need in one minimal app.
            </p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button size="lg" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-20 max-w-4xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Book a ride",
                desc: "Enter pickup & drop and you're set.",
              },
              {
                icon: Car,
                title: "Riders accept",
                desc: "Live queue of pending rides for riders.",
              },
              {
                icon: ShieldCheck,
                title: "Admin control",
                desc: "Manage users, riders and rides easily.",
              },
            ].map((f) => (
              <Card key={f.title} className="p-6 shadow-card">
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Default admin: <span className="font-mono">admin@ride.app</span> /{" "}
        <span className="font-mono">Admin123!</span>
      </footer>
    </div>
  );
};

export default Index;
