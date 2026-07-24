import BottomNav from "./BottomNav";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function OperatorLayout({title, children}: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container py-4">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
      </header>

      <main className="container py-6 pb-24">{children}</main>

      <BottomNav />
    </div>
  );
}
