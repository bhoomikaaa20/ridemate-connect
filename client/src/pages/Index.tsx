import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Car, CheckCircle2, ClipboardList, MapPin, ShieldCheck, UserCog, Users, WalletCards } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/seed-admin")
      .catch(() => { });
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
        <section className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Simple. Fast. Reliable.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Ride Booking System
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Book a ride in seconds.
            </p>

            <div className="flex items-center justify-center gap-3 pt-4">
              <Button size="lg" asChild>
                <Link to="/login">Login <ArrowRight /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-20 max-w-4xl mx-auto">
            {[{
              icon: MapPin,
              title: "Book a ride",
              desc: "Enter pickup & drop and you're set.",
            },
            {
              icon: Car,
              title: "Riders accept",
              desc: "Live queue of pending rides.",
            },
            {
              icon: ShieldCheck,
              title: "Admin control",
              desc: "Manage everything easily.",
            }].map((f) => (
              <Card key={f.title} className="p-6 shadow-card">
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/40 py-16">
          <div className="container">
            <div className="max-w-2xl mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A complete ride flow in three steps</h2>
              <p className="text-muted-foreground mt-3">
                The app keeps the booking process clear for passengers, riders, and admins without extra complexity.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: ClipboardList, title: "Request", desc: "A user submits pickup and drop locations from the dashboard." },
                { icon: Car, title: "Accept", desc: "A rider sees pending rides and accepts the next available request." },
                { icon: CheckCircle2, title: "Complete", desc: "Accepted rides can be completed, cancelled, or reviewed by admin." },
              ].map((step, index) => (
                <div key={step.title} className="rounded-lg border bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <step.icon className="h-7 w-7 text-primary" />
                    <span className="text-sm font-semibold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for every role</h2>
              <p className="text-muted-foreground mt-3">
                Each dashboard only shows the actions that matter for that account type.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Users, title: "Users", desc: "Book rides, view history, and cancel pending rides." },
                { icon: Car, title: "Riders", desc: "Accept pending rides and mark active rides complete." },
                { icon: UserCog, title: "Admins", desc: "Manage users, riders, and all ride records." },
              ].map((roleCard) => (
                <Card key={roleCard.title} className="p-5 shadow-card">
                  <roleCard.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{roleCard.title}</h3>
                  <p className="text-sm text-muted-foreground">{roleCard.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-14">
          <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm opacity-90 mb-3">
                <WalletCards className="h-4 w-4" />
                No maps, payments, tracking, or notifications required.
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start testing the booking flow now</h2>
            </div>
            <div className="flex gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create account</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/login">Admin login</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;