import { Link } from "wouter";
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl font-black text-primary mb-4">404</div>
      <h1 className="text-3xl font-bold mb-3">Capítulo não encontrado</h1>
      <p className="text-muted-foreground mb-8">A página que você procura não existe ou foi movida.</p>
      <Link href="/" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90">
        Voltar para o início
      </Link>
    </div>
  );
}
