import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-24 px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">Página não encontrada.</p>
      <Link href="/" className="text-primary underline">
        Voltar ao início
      </Link>
    </div>
  );
}
