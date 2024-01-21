import Navbar from "~/_components/Navbar";

export default function Loading() {
  return (
    <main className="container min-h-screen bg-background scrollbar-track-background">
      <Navbar />
      <div className="flex items-center justify-center text-foreground">
        Loading
      </div>
    </main>
  );
}
