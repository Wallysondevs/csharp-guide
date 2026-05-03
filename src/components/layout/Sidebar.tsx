import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, Archive, ArrowDownAZ, ArrowRightLeft, AtomIcon, BarChart, BookCheck, BookOpen, BookText, Box, BoxSelect, Boxes, Braces, Bug, Calculator, CheckCircle2, CircleAlert, CircleHelp, CircleSlash, Clock, Combine, Compass, Component, Cpu, Database, Diamond, Eye, FileBox, FileCode, FileInput, FileText, Filter, FolderTree, FunctionSquare, Funnel, Gauge, GitBranch, GitFork, GitMerge, Globe, Group, Hammer, Hash, Hourglass, KeyRound, Layers, Layers3, Layout, LayoutDashboard, Library, ListOrdered, Lock, Map, MemoryStick, Network, Package, PackageOpen, Pin, Plug, Quote, Radio, Recycle, RefreshCw, Repeat, Rocket, Scissors, Search, Server, Settings, Settings2, Shapes, Shield, ShieldAlert, ShieldCheck, Sigma, Snowflake, Sparkles, Tag, Tags, Terminal, TestTube, Trash2, Trees, Type, UserCheck, Variable, Wand, Wand2, Workflow, X, XCircle, Zap
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Início",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
    ]
  },
  {
    title: "Introdução",
    items: [
      { path: "/o-que-e-csharp", label: "O que é C#", icon: BookOpen },
      { path: "/dotnet-hoje", label: ".NET hoje (8/9)", icon: Sparkles },
      { path: "/hello-world", label: "Hello World & primeiro projeto", icon: Terminal },
      { path: "/dotnet-cli", label: "dotnet CLI essencial", icon: Rocket },
    ]
  },
  {
    title: "Fundamentos",
    items: [
      { path: "/tipos-primitivos", label: "Tipos primitivos", icon: Hash },
      { path: "/var-dynamic-object", label: "var, dynamic e object", icon: Variable },
      { path: "/operadores", label: "Operadores", icon: Calculator },
      { path: "/controle-fluxo", label: "Controle de fluxo", icon: GitBranch },
      { path: "/strings", label: "Strings em C#", icon: Type },
      { path: "/datetime", label: "DateTime, DateOnly, TimeOnly", icon: Clock },
      { path: "/conversoes-parsing", label: "Conversões e Parsing", icon: RefreshCw },
      { path: "/nullable-reference", label: "Nullable Reference Types", icon: CheckCircle2 },
      { path: "/nullable-value", label: "Nullable Value Types", icon: CircleHelp },
      { path: "/arrays-multi", label: "Arrays multidimensionais", icon: Boxes },
    ]
  },
  {
    title: "Coleções",
    items: [
      { path: "/list-t", label: "List<T>", icon: ListOrdered },
      { path: "/dictionary", label: "Dictionary<TK,TV>", icon: Library },
      { path: "/hashset", label: "HashSet<T>", icon: Database },
      { path: "/queue-stack", label: "Queue, Stack, LinkedList", icon: Boxes },
      { path: "/immutable-collections", label: "Immutable Collections", icon: Layers3 },
      { path: "/span-memory", label: "Span<T> e Memory<T>", icon: Snowflake },
      { path: "/readonly-collections", label: "IReadOnlyList, IReadOnlyDictionary", icon: Cpu },
      { path: "/collection-expressions", label: "Collection expressions (C# 12)", icon: Lock },
    ]
  },
  {
    title: "POO",
    items: [
      { path: "/classes", label: "Classes e objetos", icon: Component },
      { path: "/construtores", label: "Construtores", icon: Wand2 },
      { path: "/properties", label: "Propriedades", icon: Shapes },
      { path: "/heranca", label: "Herança", icon: GitMerge },
      { path: "/polimorfismo", label: "Polimorfismo", icon: Repeat },
      { path: "/interfaces", label: "Interfaces", icon: Plug },
      { path: "/abstract-sealed", label: "abstract, virtual, sealed", icon: ShieldCheck },
      { path: "/static-membros", label: "static: membros e classes", icon: Pin },
      { path: "/records", label: "Records (C# 9+)", icon: FileBox },
      { path: "/struct-vs-class", label: "struct vs class", icon: Box },
      { path: "/enums-csharp", label: "Enums", icon: Tags },
      { path: "/tuples", label: "Tuples", icon: Group },
    ]
  },
  {
    title: "Genéricos",
    items: [
      { path: "/genericos-basico", label: "Genéricos: o básico", icon: Sigma },
      { path: "/constraints", label: "Constraints (where)", icon: Filter },
      { path: "/variance", label: "Covariance e Contravariance", icon: GitFork },
      { path: "/generic-math", label: "Generic Math (C# 11)", icon: FunctionSquare },
      { path: "/generic-methods", label: "Métodos genéricos avançados", icon: Layers },
    ]
  },
  {
    title: "LINQ",
    items: [
      { path: "/linq-intro", label: "LINQ: o que é", icon: Search },
      { path: "/linq-where-select", label: "Where, Select e companhia", icon: Funnel },
      { path: "/linq-ordenacao", label: "Ordenação e agrupamento", icon: ArrowDownAZ },
      { path: "/linq-join", label: "Join, GroupJoin, Zip", icon: GitBranch },
      { path: "/linq-agregacao", label: "Agregação: Sum, Count, Min, Max, Aggregate", icon: BarChart },
      { path: "/linq-deferred", label: "Execução deferida vs imediata", icon: Hourglass },
      { path: "/linq-iqueryable", label: "IQueryable vs IEnumerable", icon: Database },
      { path: "/linq-set", label: "Distinct, Union, Intersect, Except", icon: CircleSlash },
      { path: "/linq-paginar", label: "Paginação e Take/Skip", icon: ArrowRightLeft },
    ]
  },
  {
    title: "Async",
    items: [
      { path: "/task-vs-thread", label: "Task vs Thread", icon: Workflow },
      { path: "/async-await", label: "async / await", icon: Hourglass },
      { path: "/configureawait", label: "ConfigureAwait(false)", icon: Settings2 },
      { path: "/cancellationtoken", label: "CancellationToken", icon: XCircle },
      { path: "/parallel-tasks", label: "Task.WhenAll, WhenAny, Parallel", icon: Cpu },
      { path: "/iasync-enumerable", label: "IAsyncEnumerable<T>", icon: Repeat },
      { path: "/valuetask", label: "ValueTask<T>", icon: Zap },
      { path: "/async-deadlocks", label: "Async deadlocks: como evitar", icon: AlertTriangle },
    ]
  },
  {
    title: "C# moderno",
    items: [
      { path: "/pattern-matching", label: "Pattern Matching", icon: Sparkles },
      { path: "/records-with", label: "Records, with e desconstrução", icon: GitMerge },
      { path: "/init-required", label: "init e required", icon: Diamond },
      { path: "/primary-constructors", label: "Primary constructors (C# 12)", icon: Wand2 },
      { path: "/top-level-statements", label: "Top-level statements e file-scoped namespace", icon: Quote },
      { path: "/raw-strings", label: "Raw string literals (C# 11)", icon: FileText },
      { path: "/global-usings", label: "Global usings e implicit usings", icon: Globe },
      { path: "/source-generators-uso", label: "Source Generators (visão de uso)", icon: Wand },
    ]
  },
  {
    title: "Exceções",
    items: [
      { path: "/try-catch-finally", label: "try / catch / finally", icon: ShieldAlert },
      { path: "/custom-exceptions", label: "Exceções customizadas", icon: CircleAlert },
      { path: "/exception-filters", label: "Exception filters (when)", icon: Filter },
      { path: "/aggregate-exception", label: "AggregateException e InnerExceptions", icon: Combine },
      { path: "/exception-best-practices", label: "Boas práticas com exceções", icon: BookCheck },
    ]
  },
  {
    title: "Memória & performance",
    items: [
      { path: "/stack-vs-heap", label: "Stack vs Heap", icon: MemoryStick },
      { path: "/garbage-collector", label: "Garbage Collector", icon: Trash2 },
      { path: "/idisposable-using", label: "IDisposable e using", icon: Recycle },
      { path: "/span-perf", label: "Span<T> em performance", icon: Gauge },
      { path: "/arraypool", label: "ArrayPool<T>", icon: PackageOpen },
      { path: "/boxing", label: "Boxing e unboxing", icon: Box },
      { path: "/ref-struct", label: "ref struct", icon: BoxSelect },
      { path: "/stackalloc", label: "stackalloc", icon: Layers },
    ]
  },
  {
    title: "Reflection & meta",
    items: [
      { path: "/reflection-basico", label: "Reflection: lendo metadados", icon: Eye },
      { path: "/atributos", label: "Atributos customizados", icon: Tag },
      { path: "/expression-trees", label: "Expression Trees", icon: Trees },
      { path: "/dynamic-dlr", label: "dynamic e DLR", icon: Wand2 },
    ]
  },
  {
    title: "I/O",
    items: [
      { path: "/file-directory", label: "File, Directory, Path", icon: FolderTree },
      { path: "/streams", label: "Streams", icon: FileInput },
      { path: "/json", label: "System.Text.Json", icon: Braces },
      { path: "/xml", label: "XML: parsing e serialização", icon: FileCode },
      { path: "/compressao", label: "Compressão (gzip, brotli, zip)", icon: Archive },
    ]
  },
  {
    title: "Networking",
    items: [
      { path: "/httpclient", label: "HttpClient", icon: Globe },
      { path: "/grpc", label: "gRPC", icon: Plug },
      { path: "/websocket", label: "WebSocket", icon: Radio },
      { path: "/sockets", label: "Sockets TCP/UDP", icon: Network },
      { path: "/rest-patterns", label: "Padrões REST com HttpClient", icon: ArrowRightLeft },
    ]
  },
  {
    title: "Concorrência",
    items: [
      { path: "/lock-monitor", label: "lock e Monitor", icon: Lock },
      { path: "/mutex-semaphore", label: "Mutex e SemaphoreSlim", icon: KeyRound },
      { path: "/channels", label: "Channels", icon: Workflow },
      { path: "/interlocked", label: "Interlocked", icon: AtomIcon },
      { path: "/parallel-linq", label: "PLINQ (Parallel LINQ)", icon: Zap },
    ]
  },
  {
    title: "Build & ferramentas",
    items: [
      { path: "/csproj", label: "csproj: o arquivo de projeto", icon: Hammer },
      { path: "/nuget", label: "NuGet a fundo", icon: Package },
      { path: "/roslyn-analyzers", label: "Roslyn Analyzers", icon: Bug },
      { path: "/aot", label: "AOT (Ahead-of-Time)", icon: Cpu },
      { path: "/trimming", label: "Trimming", icon: Scissors },
      { path: "/publish-deploy", label: "dotnet publish & deploy", icon: Rocket },
    ]
  },
  {
    title: "Testes",
    items: [
      { path: "/xunit", label: "xUnit: o framework padrão", icon: TestTube },
      { path: "/moq", label: "Moq: mocks pra dependências", icon: CheckCircle2 },
      { path: "/fluentassertions", label: "FluentAssertions", icon: Quote },
      { path: "/benchmarkdotnet", label: "BenchmarkDotNet", icon: Gauge },
    ]
  },
  {
    title: "ASP.NET Core",
    items: [
      { path: "/aspnet-setup", label: "ASP.NET Core: criando o projeto", icon: Server },
      { path: "/middleware", label: "Middleware", icon: Layers },
      { path: "/routing-binding", label: "Routing e Model Binding", icon: Map },
      { path: "/controllers-vs-minimal", label: "Controllers vs Minimal API", icon: Component },
      { path: "/di-aspnet", label: "Injeção de dependência", icon: Zap },
      { path: "/configuration", label: "Configuration & Options", icon: Plug },
      { path: "/jwt-auth", label: "Autenticação JWT", icon: Settings },
      { path: "/cors", label: "CORS", icon: KeyRound },
      { path: "/validation", label: "Validação de DTOs", icon: Globe },
      { path: "/openapi-swagger", label: "OpenAPI / Swagger", icon: CheckCircle2 },
    ]
  },
  {
    title: "EF Core",
    items: [
      { path: "/ef-setup", label: "EF Core: setup", icon: Database },
      { path: "/ef-dbcontext", label: "DbContext, DbSet, mudanças", icon: FileBox },
      { path: "/ef-migrations", label: "Migrations", icon: GitBranch },
      { path: "/ef-querying", label: "Querying com LINQ", icon: Search },
      { path: "/ef-relacionamentos", label: "Relacionamentos", icon: Network },
      { path: "/ef-performance", label: "EF Performance", icon: Gauge },
    ]
  },
  {
    title: "Padrões & arquitetura",
    items: [
      { path: "/solid", label: "SOLID em C#", icon: Compass },
      { path: "/clean-architecture", label: "Clean Architecture", icon: LayoutDashboard },
      { path: "/mediator-cqrs", label: "MediatR e CQRS", icon: Workflow },
      { path: "/repository-pattern", label: "Repository Pattern", icon: Boxes },
      { path: "/di-padroes", label: "Padrões de DI avançados", icon: Component },
    ]
  },
  {
    title: "Segurança",
    items: [
      { path: "/hash-cripto", label: "Hash, criptografia, password", icon: Shield },
      { path: "/jwt-detalhado", label: "JWT a fundo", icon: KeyRound },
      { path: "/owasp", label: "OWASP Top 10 em ASP.NET", icon: AlertTriangle },
      { path: "/identity", label: "ASP.NET Identity", icon: UserCheck },
    ]
  },
  {
    title: "Bibliotecas",
    items: [
      { path: "/serilog", label: "Serilog: logging estruturado", icon: BookText },
      { path: "/automapper", label: "AutoMapper", icon: Map },
      { path: "/polly", label: "Polly: resiliência", icon: ShieldCheck },
      { path: "/hangfire", label: "Hangfire: jobs em background", icon: Clock },
      { path: "/blazor", label: "Blazor: SPA em C#", icon: Layout },
      { path: "/mediator-source-gen", label: "Mediator (source-gen)", icon: Workflow },
    ]
  },
  {
    title: "Projetos",
    items: [
      { path: "/projeto-cli", label: "Projeto: CLI tool", icon: Terminal },
      { path: "/projeto-webapi-crud", label: "Projeto: Web API CRUD completo", icon: Server },
      { path: "/projeto-worker", label: "Projeto: Worker Service", icon: Cpu },
      { path: "/projeto-grpc", label: "Projeto: serviço gRPC", icon: Network },
      { path: "/projeto-blazor-todo", label: "Projeto: Blazor TODO app", icon: Layout },
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-sm">C# Guide</h1>
                <p className="text-xs text-muted-foreground">Livro Completo</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-6">
            {NAVIGATION.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </h2>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
