import { Link } from "wouter";
import { BookOpen, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    "title": "Introdução",
    "items": [
      {
        "path": "/o-que-e-csharp",
        "title": "O que é C#"
      },
      {
        "path": "/dotnet-hoje",
        "title": ".NET hoje (8/9)"
      },
      {
        "path": "/hello-world",
        "title": "Hello World & primeiro projeto"
      },
      {
        "path": "/dotnet-cli",
        "title": "dotnet CLI essencial"
      }
    ]
  },
  {
    "title": "Fundamentos",
    "items": [
      {
        "path": "/tipos-primitivos",
        "title": "Tipos primitivos"
      },
      {
        "path": "/var-dynamic-object",
        "title": "var, dynamic e object"
      },
      {
        "path": "/operadores",
        "title": "Operadores"
      },
      {
        "path": "/controle-fluxo",
        "title": "Controle de fluxo"
      },
      {
        "path": "/strings",
        "title": "Strings em C#"
      },
      {
        "path": "/datetime",
        "title": "DateTime, DateOnly, TimeOnly"
      },
      {
        "path": "/conversoes-parsing",
        "title": "Conversões e Parsing"
      },
      {
        "path": "/nullable-reference",
        "title": "Nullable Reference Types"
      },
      {
        "path": "/nullable-value",
        "title": "Nullable Value Types"
      },
      {
        "path": "/arrays-multi",
        "title": "Arrays multidimensionais"
      }
    ]
  },
  {
    "title": "Coleções",
    "items": [
      {
        "path": "/list-t",
        "title": "List<T>"
      },
      {
        "path": "/dictionary",
        "title": "Dictionary<TK,TV>"
      },
      {
        "path": "/hashset",
        "title": "HashSet<T>"
      },
      {
        "path": "/queue-stack",
        "title": "Queue, Stack, LinkedList"
      },
      {
        "path": "/immutable-collections",
        "title": "Immutable Collections"
      },
      {
        "path": "/span-memory",
        "title": "Span<T> e Memory<T>"
      },
      {
        "path": "/readonly-collections",
        "title": "IReadOnlyList, IReadOnlyDictionary"
      },
      {
        "path": "/collection-expressions",
        "title": "Collection expressions (C# 12)"
      }
    ]
  },
  {
    "title": "POO",
    "items": [
      {
        "path": "/classes",
        "title": "Classes e objetos"
      },
      {
        "path": "/construtores",
        "title": "Construtores"
      },
      {
        "path": "/properties",
        "title": "Propriedades"
      },
      {
        "path": "/heranca",
        "title": "Herança"
      },
      {
        "path": "/polimorfismo",
        "title": "Polimorfismo"
      },
      {
        "path": "/interfaces",
        "title": "Interfaces"
      },
      {
        "path": "/abstract-sealed",
        "title": "abstract, virtual, sealed"
      },
      {
        "path": "/static-membros",
        "title": "static: membros e classes"
      },
      {
        "path": "/records",
        "title": "Records (C# 9+)"
      },
      {
        "path": "/struct-vs-class",
        "title": "struct vs class"
      },
      {
        "path": "/enums-csharp",
        "title": "Enums"
      },
      {
        "path": "/tuples",
        "title": "Tuples"
      }
    ]
  },
  {
    "title": "Genéricos",
    "items": [
      {
        "path": "/genericos-basico",
        "title": "Genéricos: o básico"
      },
      {
        "path": "/constraints",
        "title": "Constraints (where)"
      },
      {
        "path": "/variance",
        "title": "Covariance e Contravariance"
      },
      {
        "path": "/generic-math",
        "title": "Generic Math (C# 11)"
      },
      {
        "path": "/generic-methods",
        "title": "Métodos genéricos avançados"
      }
    ]
  },
  {
    "title": "LINQ",
    "items": [
      {
        "path": "/linq-intro",
        "title": "LINQ: o que é"
      },
      {
        "path": "/linq-where-select",
        "title": "Where, Select e companhia"
      },
      {
        "path": "/linq-ordenacao",
        "title": "Ordenação e agrupamento"
      },
      {
        "path": "/linq-join",
        "title": "Join, GroupJoin, Zip"
      },
      {
        "path": "/linq-agregacao",
        "title": "Agregação: Sum, Count, Min, Max, Aggregate"
      },
      {
        "path": "/linq-deferred",
        "title": "Execução deferida vs imediata"
      },
      {
        "path": "/linq-iqueryable",
        "title": "IQueryable vs IEnumerable"
      },
      {
        "path": "/linq-set",
        "title": "Distinct, Union, Intersect, Except"
      },
      {
        "path": "/linq-paginar",
        "title": "Paginação e Take/Skip"
      }
    ]
  },
  {
    "title": "Async",
    "items": [
      {
        "path": "/task-vs-thread",
        "title": "Task vs Thread"
      },
      {
        "path": "/async-await",
        "title": "async / await"
      },
      {
        "path": "/configureawait",
        "title": "ConfigureAwait(false)"
      },
      {
        "path": "/cancellationtoken",
        "title": "CancellationToken"
      },
      {
        "path": "/parallel-tasks",
        "title": "Task.WhenAll, WhenAny, Parallel"
      },
      {
        "path": "/iasync-enumerable",
        "title": "IAsyncEnumerable<T>"
      },
      {
        "path": "/valuetask",
        "title": "ValueTask<T>"
      },
      {
        "path": "/async-deadlocks",
        "title": "Async deadlocks: como evitar"
      }
    ]
  },
  {
    "title": "C# moderno",
    "items": [
      {
        "path": "/pattern-matching",
        "title": "Pattern Matching"
      },
      {
        "path": "/records-with",
        "title": "Records, with e desconstrução"
      },
      {
        "path": "/init-required",
        "title": "init e required"
      },
      {
        "path": "/primary-constructors",
        "title": "Primary constructors (C# 12)"
      },
      {
        "path": "/top-level-statements",
        "title": "Top-level statements e file-scoped namespace"
      },
      {
        "path": "/raw-strings",
        "title": "Raw string literals (C# 11)"
      },
      {
        "path": "/global-usings",
        "title": "Global usings e implicit usings"
      },
      {
        "path": "/source-generators-uso",
        "title": "Source Generators (visão de uso)"
      }
    ]
  },
  {
    "title": "Exceções",
    "items": [
      {
        "path": "/try-catch-finally",
        "title": "try / catch / finally"
      },
      {
        "path": "/custom-exceptions",
        "title": "Exceções customizadas"
      },
      {
        "path": "/exception-filters",
        "title": "Exception filters (when)"
      },
      {
        "path": "/aggregate-exception",
        "title": "AggregateException e InnerExceptions"
      },
      {
        "path": "/exception-best-practices",
        "title": "Boas práticas com exceções"
      }
    ]
  },
  {
    "title": "Memória & performance",
    "items": [
      {
        "path": "/stack-vs-heap",
        "title": "Stack vs Heap"
      },
      {
        "path": "/garbage-collector",
        "title": "Garbage Collector"
      },
      {
        "path": "/idisposable-using",
        "title": "IDisposable e using"
      },
      {
        "path": "/span-perf",
        "title": "Span<T> em performance"
      },
      {
        "path": "/arraypool",
        "title": "ArrayPool<T>"
      },
      {
        "path": "/boxing",
        "title": "Boxing e unboxing"
      },
      {
        "path": "/ref-struct",
        "title": "ref struct"
      },
      {
        "path": "/stackalloc",
        "title": "stackalloc"
      }
    ]
  },
  {
    "title": "Reflection & meta",
    "items": [
      {
        "path": "/reflection-basico",
        "title": "Reflection: lendo metadados"
      },
      {
        "path": "/atributos",
        "title": "Atributos customizados"
      },
      {
        "path": "/expression-trees",
        "title": "Expression Trees"
      },
      {
        "path": "/dynamic-dlr",
        "title": "dynamic e DLR"
      }
    ]
  },
  {
    "title": "I/O",
    "items": [
      {
        "path": "/file-directory",
        "title": "File, Directory, Path"
      },
      {
        "path": "/streams",
        "title": "Streams"
      },
      {
        "path": "/json",
        "title": "System.Text.Json"
      },
      {
        "path": "/xml",
        "title": "XML: parsing e serialização"
      },
      {
        "path": "/compressao",
        "title": "Compressão (gzip, brotli, zip)"
      }
    ]
  },
  {
    "title": "Networking",
    "items": [
      {
        "path": "/httpclient",
        "title": "HttpClient"
      },
      {
        "path": "/grpc",
        "title": "gRPC"
      },
      {
        "path": "/websocket",
        "title": "WebSocket"
      },
      {
        "path": "/sockets",
        "title": "Sockets TCP/UDP"
      },
      {
        "path": "/rest-patterns",
        "title": "Padrões REST com HttpClient"
      }
    ]
  },
  {
    "title": "Concorrência",
    "items": [
      {
        "path": "/lock-monitor",
        "title": "lock e Monitor"
      },
      {
        "path": "/mutex-semaphore",
        "title": "Mutex e SemaphoreSlim"
      },
      {
        "path": "/channels",
        "title": "Channels"
      },
      {
        "path": "/interlocked",
        "title": "Interlocked"
      },
      {
        "path": "/parallel-linq",
        "title": "PLINQ (Parallel LINQ)"
      }
    ]
  },
  {
    "title": "Build & ferramentas",
    "items": [
      {
        "path": "/csproj",
        "title": "csproj: o arquivo de projeto"
      },
      {
        "path": "/nuget",
        "title": "NuGet a fundo"
      },
      {
        "path": "/roslyn-analyzers",
        "title": "Roslyn Analyzers"
      },
      {
        "path": "/aot",
        "title": "AOT (Ahead-of-Time)"
      },
      {
        "path": "/trimming",
        "title": "Trimming"
      },
      {
        "path": "/publish-deploy",
        "title": "dotnet publish & deploy"
      }
    ]
  },
  {
    "title": "Testes",
    "items": [
      {
        "path": "/xunit",
        "title": "xUnit: o framework padrão"
      },
      {
        "path": "/moq",
        "title": "Moq: mocks pra dependências"
      },
      {
        "path": "/fluentassertions",
        "title": "FluentAssertions"
      },
      {
        "path": "/benchmarkdotnet",
        "title": "BenchmarkDotNet"
      }
    ]
  },
  {
    "title": "ASP.NET Core",
    "items": [
      {
        "path": "/aspnet-setup",
        "title": "ASP.NET Core: criando o projeto"
      },
      {
        "path": "/middleware",
        "title": "Middleware"
      },
      {
        "path": "/routing-binding",
        "title": "Routing e Model Binding"
      },
      {
        "path": "/controllers-vs-minimal",
        "title": "Controllers vs Minimal API"
      },
      {
        "path": "/di-aspnet",
        "title": "Injeção de dependência"
      },
      {
        "path": "/configuration",
        "title": "Configuration & Options"
      },
      {
        "path": "/jwt-auth",
        "title": "Autenticação JWT"
      },
      {
        "path": "/cors",
        "title": "CORS"
      },
      {
        "path": "/validation",
        "title": "Validação de DTOs"
      },
      {
        "path": "/openapi-swagger",
        "title": "OpenAPI / Swagger"
      }
    ]
  },
  {
    "title": "EF Core",
    "items": [
      {
        "path": "/ef-setup",
        "title": "EF Core: setup"
      },
      {
        "path": "/ef-dbcontext",
        "title": "DbContext, DbSet, mudanças"
      },
      {
        "path": "/ef-migrations",
        "title": "Migrations"
      },
      {
        "path": "/ef-querying",
        "title": "Querying com LINQ"
      },
      {
        "path": "/ef-relacionamentos",
        "title": "Relacionamentos"
      },
      {
        "path": "/ef-performance",
        "title": "EF Performance"
      }
    ]
  },
  {
    "title": "Padrões & arquitetura",
    "items": [
      {
        "path": "/solid",
        "title": "SOLID em C#"
      },
      {
        "path": "/clean-architecture",
        "title": "Clean Architecture"
      },
      {
        "path": "/mediator-cqrs",
        "title": "MediatR e CQRS"
      },
      {
        "path": "/repository-pattern",
        "title": "Repository Pattern"
      },
      {
        "path": "/di-padroes",
        "title": "Padrões de DI avançados"
      }
    ]
  },
  {
    "title": "Segurança",
    "items": [
      {
        "path": "/hash-cripto",
        "title": "Hash, criptografia, password"
      },
      {
        "path": "/jwt-detalhado",
        "title": "JWT a fundo"
      },
      {
        "path": "/owasp",
        "title": "OWASP Top 10 em ASP.NET"
      },
      {
        "path": "/identity",
        "title": "ASP.NET Identity"
      }
    ]
  },
  {
    "title": "Bibliotecas",
    "items": [
      {
        "path": "/serilog",
        "title": "Serilog: logging estruturado"
      },
      {
        "path": "/automapper",
        "title": "AutoMapper"
      },
      {
        "path": "/polly",
        "title": "Polly: resiliência"
      },
      {
        "path": "/hangfire",
        "title": "Hangfire: jobs em background"
      },
      {
        "path": "/blazor",
        "title": "Blazor: SPA em C#"
      },
      {
        "path": "/mediator-source-gen",
        "title": "Mediator (source-gen)"
      }
    ]
  },
  {
    "title": "Projetos",
    "items": [
      {
        "path": "/projeto-cli",
        "title": "Projeto: CLI tool"
      },
      {
        "path": "/projeto-webapi-crud",
        "title": "Projeto: Web API CRUD completo"
      },
      {
        "path": "/projeto-worker",
        "title": "Projeto: Worker Service"
      },
      {
        "path": "/projeto-grpc",
        "title": "Projeto: serviço gRPC"
      },
      {
        "path": "/projeto-blazor-todo",
        "title": "Projeto: Blazor TODO app"
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          C# — Livro Completo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          142 capítulos de C# moderno em pt-BR — do Hello World ao .NET 8/9, async,
          LINQ, EF Core, ASP.NET, padrões, segurança e projetos reais. Sem rodeios.
        </p>
      </header>

      <div className="space-y-12">
        {SECTIONS.map(sec => (
          <section key={sec.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {sec.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sec.items.map(item => (
                <Link key={item.path} href={item.path}>
                  <a className="group block p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.title}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
