import { useState } from "react";
import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import { Search, X, BookOpen } from "lucide-react";

const NAVIGATION = [
  {
    title: "Fundamentos & Setup",
    items: [
      { path: "/hello-explicado", label: "Olá Mundo Explicado (Capítulo de Exemplo)" },
      { path: "/historia-csharp", label: "A História do C# e do .NET" },
      { path: "/dotnet-runtime", label: "O que é o .NET? Runtime, SDK, BCL" },
      { path: "/instalacao-sdk", label: "Instalando o .NET SDK em Windows, Linux e macOS" },
      { path: "/dotnet-cli", label: "O CLI dotnet: comandos essenciais" },
      { path: "/primeiro-programa", label: "Seu primeiro programa em C#" },
      { path: "/top-level-statements", label: "Top-level statements: o C# moderno sem cerimônia" },
      { path: "/csproj-anatomy", label: "Entendendo o arquivo .csproj" },
      { path: "/namespaces-using", label: "Namespaces e diretivas using" },
      { path: "/comentarios-xmldoc", label: "Comentários e documentação XML" },
      { path: "/ide-vscode-rider", label: "Escolhendo seu editor: VS Code, Visual Studio e Rider" },
      { path: "/debug-basico", label: "Depurando seu primeiro programa" },
      { path: "/build-vs-run", label: "Build, Restore, Run: o ciclo completo" }
    ]
  },
  {
    title: "Sintaxe & Tipos",
    items: [
      { path: "/variaveis-tipos", label: "Variáveis e o sistema de tipos do C#" },
      { path: "/tipos-valor", label: "Tipos por valor: int, double, bool, char, decimal" },
      { path: "/tipos-referencia", label: "Tipos por referência: string, object, classes, arrays" },
      { path: "/operadores", label: "Operadores aritméticos, lógicos e de comparação" },
      { path: "/conversoes-cast", label: "Conversões e casting de tipos" },
      { path: "/strings-fundamentos", label: "Strings em C#: o básico que todo iniciante precisa" },
      { path: "/console-io", label: "Lendo e escrevendo no console" },
      { path: "/condicionais-if-switch", label: "Condicionais: if, else, switch e switch expression" },
      { path: "/loops", label: "Loops: for, while, do-while, foreach" },
      { path: "/arrays", label: "Arrays: tamanho fixo, multidimensionais e jagged" },
      { path: "/metodos-funcoes", label: "Métodos: parâmetros, retorno e overloading" },
      { path: "/parametros-out-ref", label: "Parâmetros especiais: ref, out, in e params" }
    ]
  },
  {
    title: "Programação Orientada a Objetos",
    items: [
      { path: "/classes-objetos", label: "Classes e objetos: a base da POO" },
      { path: "/propriedades", label: "Propriedades: getters e setters elegantes" },
      { path: "/construtores", label: "Construtores: dando vida aos objetos" },
      { path: "/this-base", label: "As palavras-chave this e base" },
      { path: "/encapsulamento", label: "Encapsulamento: public, private, protected, internal" },
      { path: "/heranca", label: "Herança: reaproveitando comportamento" },
      { path: "/polimorfismo", label: "Polimorfismo: um nome, vários comportamentos" },
      { path: "/classes-abstract", label: "Classes abstratas: contratos parcialmente implementados" },
      { path: "/interfaces", label: "Interfaces: contratos puros entre classes" },
      { path: "/sealed-virtual", label: "sealed, virtual, override e abstract na prática" },
      { path: "/classes-static-partial", label: "Classes static, partial e nested" },
      { path: "/records-vs-class", label: "Records: classes com igualdade por valor" }
    ]
  },
  {
    title: "Tipos Avançados",
    items: [
      { path: "/enums", label: "Enums: conjuntos nomeados de constantes" },
      { path: "/structs", label: "Structs: tipos por valor sob medida" },
      { path: "/tuplas", label: "Tuplas: agrupando valores sem criar uma classe" },
      { path: "/anonymous-types", label: "Tipos anônimos: objetos sem nome de classe" },
      { path: "/nullable-reference", label: "Nullable reference types: o C# que avisa antes do crash" },
      { path: "/value-vs-reference", label: "Value type vs Reference type: a diferença que importa" },
      { path: "/boxing-unboxing", label: "Boxing e unboxing: o custo escondido" },
      { path: "/immutable", label: "Imutabilidade: por que e como tornar tipos imutáveis" },
      { path: "/init-only-required", label: "Modificadores init e required: imutabilidade moderna" },
      { path: "/deconstruction", label: "Deconstruction: desempacotando objetos" },
      { path: "/indexers", label: "Indexers: acessando objetos como arrays" },
      { path: "/pattern-matching", label: "Pattern matching: switch poderoso e is melhorado" }
    ]
  },
  {
    title: "C# Moderno & Generics",
    items: [
      { path: "/csharp-versions-novidades", label: "C# 7 a C# 13: novidades versão a versão" },
      { path: "/file-scoped-namespaces", label: "File-scoped namespaces: menos indentação" },
      { path: "/global-using", label: "Global using e ImplicitUsings" },
      { path: "/generics-basico", label: "Generics: tipos parametrizados sem boxing" },
      { path: "/generics-restricoes-where", label: "Restrições genéricas com where" },
      { path: "/generics-metodos", label: "Métodos genéricos: poder em métodos individuais" },
      { path: "/generics-covariance", label: "Covariância e contravariância em generics" },
      { path: "/default-keyword", label: "A palavra default em generics" },
      { path: "/generic-math", label: "Generic Math: aritmética genérica com INumber<T>" },
      { path: "/primary-constructors", label: "Primary constructors em classes (C# 12)" },
      { path: "/collection-expressions", label: "Collection expressions: literais para coleções (C# 12)" },
      { path: "/alias-any-type", label: "Using aliases para qualquer tipo (C# 12)" }
    ]
  },
  {
    title: "Coleções & LINQ (básico)",
    items: [
      { path: "/array-vs-list", label: "Array vs List<T>: quando usar cada um" },
      { path: "/list-detalhado", label: "List<T>: o canivete suíço das coleções" },
      { path: "/dictionary-hashtable", label: "Dictionary<K,V>: lookup O(1) por chave" },
      { path: "/hashset", label: "HashSet<T>: conjuntos sem duplicatas" },
      { path: "/queue-stack", label: "Queue<T> e Stack<T>: filas e pilhas" },
      { path: "/linked-list", label: "LinkedList<T>: lista duplamente encadeada" },
      { path: "/immutable-collections", label: "Coleções imutáveis: ImmutableList e amigos" },
      { path: "/concurrent-collections", label: "Coleções concorrentes para multi-thread" },
      { path: "/span-memory", label: "Span<T> e Memory<T>: zero-copy de alta performance" },
      { path: "/linq-intro", label: "LINQ: consultando coleções como SQL" },
      { path: "/linq-where-select", label: "LINQ: Where e Select fundamentais" },
      { path: "/linq-orderby-groupby", label: "LINQ: OrderBy, ThenBy e GroupBy" }
    ]
  },
  {
    title: "LINQ avançado, Strings & I/O",
    items: [
      { path: "/linq-joins", label: "LINQ: Join, GroupJoin e SelectMany" },
      { path: "/linq-aggregates", label: "LINQ: Sum, Average, Count, Aggregate" },
      { path: "/linq-set-operations", label: "LINQ: Distinct, Union, Intersect, Except" },
      { path: "/linq-deferred-execution", label: "Execução adiada (deferred) em LINQ" },
      { path: "/linq-query-syntax", label: "Query syntax vs Method syntax em LINQ" },
      { path: "/ienumerable-vs-iqueryable", label: "IEnumerable vs IQueryable: a diferença crucial" },
      { path: "/stringbuilder", label: "StringBuilder: concatenando strings sem desperdiçar memória" },
      { path: "/string-interpolation-formatacao", label: "Interpolação e formatação avançada de strings" },
      { path: "/regex", label: "Expressões regulares com Regex" },
      { path: "/encoding-unicode", label: "Encoding e Unicode em C#" },
      { path: "/file-io-fundamentos", label: "Lendo e escrevendo arquivos com File" },
      { path: "/streams-readers", label: "Streams, StreamReader e StreamWriter" }
    ]
  },
  {
    title: "JSON, XML & Async",
    items: [
      { path: "/json-systemtextjson", label: "JSON com System.Text.Json" },
      { path: "/xml-linq", label: "XML com XDocument e LINQ to XML" },
      { path: "/path-directory", label: "Path e Directory: manipulando caminhos e pastas" },
      { path: "/threads-vs-tasks", label: "Threads vs Tasks: por que usar Task hoje" },
      { path: "/async-await-fundamentos", label: "async/await: o que realmente acontece" },
      { path: "/task-of-t", label: "Task e Task<T>: tipos de retorno assíncronos" },
      { path: "/configureawait", label: "ConfigureAwait(false): quando e por quê" },
      { path: "/cancellation-token", label: "CancellationToken: cancelando operações async" },
      { path: "/parallel-foreach", label: "Parallel.For e Parallel.ForEach para CPU-bound" },
      { path: "/plinq", label: "PLINQ: paralelizando consultas LINQ" },
      { path: "/channels-pipelines", label: "Channels: produtor-consumidor moderno em C#" },
      { path: "/async-streams-iasyncenumerable", label: "async streams: IAsyncEnumerable<T> e await foreach" }
    ]
  },
  {
    title: "Concorrência, Exceções & Reflection",
    items: [
      { path: "/valuetask", label: "ValueTask<T>: async sem alocar" },
      { path: "/sincronizacao-locks", label: "Sincronização: lock, Monitor e race conditions" },
      { path: "/semaphore", label: "SemaphoreSlim: controlando concorrência async" },
      { path: "/try-catch-finally", label: "Tratamento de exceções: try, catch, finally" },
      { path: "/throw-rethrow", label: "throw e rethrow: preservando o stack trace" },
      { path: "/custom-exceptions", label: "Criando suas próprias exceções" },
      { path: "/exception-filters", label: "Exception filters: catch when (...)" },
      { path: "/aggregate-exception", label: "AggregateException: quando várias falham juntas" },
      { path: "/reflection-fundamentos", label: "Reflection: inspecionando tipos em runtime" },
      { path: "/attributes-customizados", label: "Atributos customizados: metadados em runtime" },
      { path: "/dynamic-keyword", label: "A palavra dynamic e o DLR" },
      { path: "/expression-trees", label: "Expression trees: código como dado" }
    ]
  },
  {
    title: "Source Generators & EF Core",
    items: [
      { path: "/source-generators", label: "Source Generators: gerando código em compile-time" },
      { path: "/roslyn-analyzers", label: "Roslyn analyzers: lint customizado" },
      { path: "/efcore-intro", label: "EF Core: o ORM oficial do .NET" },
      { path: "/efcore-dbcontext", label: "DbContext: a porta de entrada do EF Core" },
      { path: "/efcore-entities", label: "Modelando entidades para EF Core" },
      { path: "/efcore-migrations", label: "Migrations: versionando o schema do banco" },
      { path: "/efcore-queries", label: "Consultando dados com LINQ no EF Core" },
      { path: "/efcore-relacionamentos", label: "Relacionamentos: 1:1, 1:N, N:N" },
      { path: "/efcore-transacoes", label: "Transações no EF Core" },
      { path: "/efcore-performance", label: "Performance no EF Core: armadilhas e soluções" },
      { path: "/efcore-raw-sql", label: "SQL bruto e procedures no EF Core" },
      { path: "/efcore-in-memory", label: "Provider InMemory para testes" }
    ]
  },
  {
    title: "ASP.NET Core",
    items: [
      { path: "/aspnet-intro", label: "ASP.NET Core: visão geral do framework web" },
      { path: "/minimal-api", label: "Minimal APIs: criar API REST em 10 linhas" },
      { path: "/mvc-controllers", label: "MVC Controllers: estrutura clássica para APIs grandes" },
      { path: "/razor-pages", label: "Razor Pages: páginas server-side com code-behind" },
      { path: "/blazor-server", label: "Blazor Server: SPA com C# rodando no servidor" },
      { path: "/blazor-wasm", label: "Blazor WebAssembly: C# rodando no navegador" },
      { path: "/middleware", label: "Middleware: o pipeline de requisições" },
      { path: "/dependency-injection", label: "Dependency Injection nativo do ASP.NET Core" },
      { path: "/configuration-options", label: "Configuration e Options pattern" },
      { path: "/routing", label: "Routing: do URL ao endpoint" },
      { path: "/model-validation", label: "Validação de modelos com Data Annotations e FluentValidation" },
      { path: "/auth-jwt", label: "Autenticação com JWT em ASP.NET Core" }
    ]
  },
  {
    title: "Patterns, Tools & Projetos",
    items: [
      { path: "/identity-aspnet", label: "ASP.NET Identity: usuários, senhas e roles" },
      { path: "/openapi-swagger", label: "OpenAPI/Swagger: documentando sua API" },
      { path: "/signalr", label: "SignalR: comunicação em tempo real" },
      { path: "/solid", label: "Princípios SOLID com exemplos em C#" },
      { path: "/repository-pattern", label: "Repository pattern: abstraindo o acesso a dados" },
      { path: "/mediator-cqrs", label: "Mediator e CQRS com MediatR" },
      { path: "/httpclient-typed", label: "HttpClient: typed clients e IHttpClientFactory" },
      { path: "/grpc-aspnet", label: "gRPC em ASP.NET Core" },
      { path: "/serilog", label: "Logging estruturado com Serilog" },
      { path: "/benchmarkdotnet", label: "BenchmarkDotNet: medindo performance com rigor" },
      { path: "/native-aot-trimming", label: "Native AOT e trimming: binários menores e startup instantâneo" },
      { path: "/publish-deploy", label: "Publish: framework-dependent vs self-contained" },
      { path: "/xunit-moq", label: "Testes unitários com xUnit, Moq e FluentAssertions" },
      { path: "/projeto-final-webapi", label: "Projeto final: API REST completa de Tarefas" }
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useHashLocation();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = NAVIGATION.map(sec => ({
    title: sec.title,
    items: sec.items.filter(it =>
      !q || it.label.toLowerCase().includes(q) || it.path.toLowerCase().includes(q)
    ),
  })).filter(sec => sec.items.length > 0);

  return (
    <>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
      )}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-primary text-primary-foreground font-extrabold text-sm flex items-center justify-center">C#</span>
            <div className="leading-tight">
              <div className="font-bold text-sm">C# Guia Completo</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">do zero ao avançado</div>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-3 py-3 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Pesquisar capítulos..."
              className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <Link href="/">
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition",
              location === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            )}>
              <BookOpen className="w-4 h-4" /> Início
            </div>
          </Link>
          {filtered.map(sec => (
            <div key={sec.title}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-primary/80">{sec.title}</div>
              <div className="space-y-0.5">
                {sec.items.map(it => (
                  <Link key={it.path} href={it.path}>
                    <div className={cn(
                      "px-3 py-1.5 rounded-md text-[13px] transition cursor-pointer",
                      location === it.path
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}>
                      {it.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">Nenhum capítulo encontrado.</div>
          )}
        </nav>
        <div className="px-5 py-3 border-t border-border text-[11px] text-muted-foreground">
          {NAVIGATION.reduce((a,s)=>a+s.items.length,0)} capítulos · .NET 9
        </div>
      </aside>
    </>
  );
}
