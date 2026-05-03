import { Link } from "wouter";
import { BookOpen, Code2, Cpu, Database, Globe, Layers, Rocket, Shield, Sparkles, Terminal, Wrench, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { title: "Fundamentos & Setup", desc: "História, instalação do .NET, primeiro programa", icon: BookOpen, path: "/historia-csharp", color: "text-violet-400", bg: "bg-violet-500/10", count: "12 tópicos" },
  { title: "Sintaxe & Tipos", desc: "Variáveis, operadores, condicionais, loops, arrays", icon: Code2, path: "/variaveis-tipos", color: "text-blue-400", bg: "bg-blue-500/10", count: "12 tópicos" },
  { title: "Programação Orientada a Objetos", desc: "Classes, herança, polimorfismo, interfaces, records", icon: Layers, path: "/classes-objetos", color: "text-pink-400", bg: "bg-pink-500/10", count: "12 tópicos" },
  { title: "Tipos Avançados", desc: "Enums, structs, tuplas, pattern matching, nullable", icon: Sparkles, path: "/enums", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", count: "12 tópicos" },
  { title: "C# Moderno & Generics", desc: "C# 12/13, generics, primary constructors, collection expr", icon: Zap, path: "/csharp-versions-novidades", color: "text-amber-400", bg: "bg-amber-500/10", count: "12 tópicos" },
  { title: "Coleções & LINQ", desc: "List, Dictionary, HashSet, LINQ, Span/Memory", icon: Database, path: "/array-vs-list", color: "text-emerald-400", bg: "bg-emerald-500/10", count: "24 tópicos" },
  { title: "Strings, IO & JSON", desc: "StringBuilder, Regex, arquivos, streams, JSON, XML", icon: Terminal, path: "/stringbuilder", color: "text-cyan-400", bg: "bg-cyan-500/10", count: "9 tópicos" },
  { title: "Async, Concorrência & Exceções", desc: "async/await, Tasks, Channels, exception filters", icon: Cpu, path: "/threads-vs-tasks", color: "text-indigo-400", bg: "bg-indigo-500/10", count: "20 tópicos" },
  { title: "Reflection & Source Generators", desc: "Reflection, attributes, expression trees, Roslyn", icon: Wrench, path: "/reflection-fundamentos", color: "text-teal-400", bg: "bg-teal-500/10", count: "6 tópicos" },
  { title: "Entity Framework Core", desc: "ORM oficial: DbContext, migrations, queries, performance", icon: Database, path: "/efcore-intro", color: "text-rose-400", bg: "bg-rose-500/10", count: "10 tópicos" },
  { title: "ASP.NET Core", desc: "Minimal APIs, MVC, Blazor, middleware, DI, JWT", icon: Globe, path: "/aspnet-intro", color: "text-orange-400", bg: "bg-orange-500/10", count: "12 tópicos" },
  { title: "Patterns, Tools & Projetos", desc: "SOLID, Mediator, gRPC, BenchmarkDotNet, AOT, projeto final", icon: Rocket, path: "/solid", color: "text-purple-400", bg: "bg-purple-500/10", count: "14 tópicos" },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" /> Atualizado para .NET 9 / C# 13
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
          C# do <span className="text-primary">zero absoluto</span>
          <br />ao <span className="text-secondary">profissional</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Um livro online com <strong className="text-foreground">{146}+ capítulos profundos</strong>, escritos em português,
          que te leva da primeira linha de código até tópicos avançados como LINQ, async/await,
          EF Core, ASP.NET Core, performance e padrões de projeto. Sem pular nada, sem suposições.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link href="/historia-csharp" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
            Começar do início →
          </Link>
          <Link href="/hello-explicado" className="px-6 py-3 rounded-lg bg-card border border-border font-semibold hover:bg-muted transition">
            Ver capítulo de exemplo
          </Link>
        </div>
      </motion.section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">Trilha de aprendizado</h2>
        <p className="text-center text-muted-foreground mb-10">12 grandes blocos, cada um com vários capítulos passo a passo.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={cat.path}>
                  <div className="group h-full p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition cursor-pointer">
                    <div className={`w-12 h-12 rounded-lg ${cat.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${cat.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{cat.desc}</p>
                    <span className="text-xs font-semibold text-primary">{cat.count}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border p-10 text-center">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Por que este guia?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A maioria dos tutoriais é rasa demais para quem nunca programou ou superficial em tópicos avançados.
          Aqui cada capítulo combina <strong className="text-foreground">prosa explicativa</strong>,
          <strong className="text-foreground"> analogias do mundo real</strong>,
          <strong className="text-foreground"> código C# real e comentado</strong> e
          <strong className="text-foreground"> alertas para os erros mais comuns</strong>.
          Tudo de graça e atualizado para o C# moderno.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-8">
          <div><div className="text-3xl font-black text-primary mb-1">146+</div><div className="text-xs uppercase tracking-wider text-muted-foreground">Capítulos</div></div>
          <div><div className="text-3xl font-black text-secondary mb-1">~1MB</div><div className="text-xs uppercase tracking-wider text-muted-foreground">de conteúdo</div></div>
          <div><div className="text-3xl font-black text-primary mb-1">PT-BR</div><div className="text-xs uppercase tracking-wider text-muted-foreground">100%</div></div>
        </div>
      </section>
    </div>
  );
}
