import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Source Generators: gerando código em compile-time",subtitle:"Como o compilador do C# pode escrever código por você antes mesmo do programa rodar.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs("p",{children:["Imagine que, em vez de escrever um formulário do governo à mão toda vez, você tivesse um carimbo que preenche os campos repetitivos para você. ",e.jsx("strong",{children:"Source generators"})," são exatamente isso para o C#: pequenos programas que rodam ",e.jsx("em",{children:"durante a compilação"}),' e geram código automaticamente, antes de o seu programa virar um executável. O termo "compile-time" significa "no momento em que o compilador transforma seu .cs em IL" (a Intermediate Language do .NET). Isso é o oposto de "runtime" (quando o programa já está rodando).']}),e.jsxs("p",{children:["A grande vantagem é eliminar ",e.jsx("strong",{children:"reflection"})," em runtime. Reflection é a capacidade de inspecionar tipos e métodos enquanto o programa roda — é poderosa, mas lenta e, pior, incompatível com ambientes que cortam código não usado (como AOT — Ahead-Of-Time compilation, usada em apps mobile e nativos). Source generators substituem essa mágica por código C# de verdade, escrito automaticamente, que o JIT pode otimizar normalmente."]}),e.jsx("h2",{children:"Roslyn: o compilador que conversa com você"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Roslyn"})," é o nome do compilador do C#. Ao contrário de compiladores antigos, Roslyn é uma ",e.jsx("em",{children:"biblioteca"}),': você pode plugar nele "extensões" que recebem a árvore sintática (AST — Abstract Syntax Tree, a representação em árvore do seu código) e produzem novos arquivos. Source generators são uma dessas extensões.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Estrutura mínima de um projeto de source generator
// MeuGen.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <LangVersion>latest</LangVersion>
    <EnforceExtendedAnalyzerRules>true</EnforceExtendedAnalyzerRules>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp"
                      Version="4.11.0"
                      PrivateAssets="all" />
  </ItemGroup>
</Project>`})}),e.jsxs("p",{children:["O alvo é sempre ",e.jsx("code",{children:"netstandard2.0"})," porque o gerador roda dentro do compilador, que ainda usa essa superfície de API por compatibilidade."]}),e.jsx("h2",{children:"ISourceGenerator vs IIncrementalGenerator"}),e.jsxs("p",{children:["A primeira versão da API era ",e.jsx("code",{children:"ISourceGenerator"}),": simples, mas roda do zero a cada keystroke no editor — terrível para performance. A versão moderna é ",e.jsx("code",{children:"IIncrementalGenerator"}),', baseada em pipelines reativos: você declara "quando este arquivo mudar, recalcule só esta parte". É como uma planilha do Excel — só a célula afetada recalcula.']}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;

[Generator]
public class OlaGerador : IIncrementalGenerator
{
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        // Filtra: só nos interessam classes com [GerarOla]
        var classesComAtributo = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                "MinhaApp.GerarOlaAttribute",
                predicate: (n, _) => n is ClassDeclarationSyntax,
                transform: (ctx, _) => (ClassDeclarationSyntax)ctx.TargetNode);

        context.RegisterSourceOutput(classesComAtributo, (spc, classe) =>
        {
            var nome = classe.Identifier.Text;
            var codigo = $$"""
                namespace MinhaApp;
                public partial class {{nome}}
                {
                    public string Ola() => "Olá de {{nome}}!";
                }
                """;
            spc.AddSource($"{nome}.g.cs", codigo);
        });
    }
}`})}),e.jsxs(o,{type:"info",title:"Partial: o segredo",children:["Source generators só conseguem ",e.jsx("em",{children:"adicionar"})," arquivos novos, nunca alterar os existentes. Por isso a classe-alvo é declarada como ",e.jsx("code",{children:"partial"}),' — assim o gerador escreve a "outra metade" da classe em um arquivo separado, e o compilador junta tudo.']}),e.jsx("h2",{children:"Caso real 1: System.Text.Json com JsonSerializerContext"}),e.jsxs("p",{children:["Por padrão, ",e.jsx("code",{children:"System.Text.Json"})," usa reflection para descobrir as propriedades de uma classe e serializá-la. Isso quebra em AOT. A solução: declarar um ",e.jsx("em",{children:"contexto"})," que o source generator do JSON lê, gerando o código de serialização específico para cada tipo."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text.Json.Serialization;

public record Pessoa(string Nome, int Idade);

// O atributo diz ao gerador: "produza serializadores para Pessoa"
[JsonSerializable(typeof(Pessoa))]
public partial class MeuJsonContext : JsonSerializerContext { }

// Uso — sem reflection, AOT-friendly
var p = new Pessoa("Ana", 30);
string json = JsonSerializer.Serialize(p, MeuJsonContext.Default.Pessoa);
Pessoa? volta = JsonSerializer.Deserialize(json, MeuJsonContext.Default.Pessoa);`})}),e.jsx("h2",{children:"Caso real 2: GeneratedRegex"}),e.jsxs("p",{children:["Expressões regulares, por padrão, são compiladas em runtime — caro. O atributo ",e.jsx("code",{children:"[GeneratedRegex]"})," faz o gerador produzir o autômato em compile-time, quase tão rápido quanto código escrito à mão."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Text.RegularExpressions;

public partial class Validador
{
    // O método é declarado, mas a implementação é gerada
    [GeneratedRegex(@"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$",
                    RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();

    public static bool EhEmail(string s) => EmailRegex().IsMatch(s);
}`})}),e.jsx("h2",{children:"Caso real 3: LoggerMessage"}),e.jsxs("p",{children:["Logging com interpolação de string aloca memória até quando o nível está desligado. ",e.jsx("code",{children:"[LoggerMessage]"})," gera um método tipado, sem alocação, e ainda valida em compile-time se você esqueceu um placeholder."]}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.Extensions.Logging;

public partial class PedidoServico
{
    private readonly ILogger<PedidoServico> _log;
    public PedidoServico(ILogger<PedidoServico> log) => _log = log;

    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Warning,
        Message = "Pedido {PedidoId} falhou para cliente {ClienteId}")]
    private partial void LogFalha(long pedidoId, long clienteId);

    public void Processar(long pedidoId, long clienteId)
    {
        // ... lógica ...
        LogFalha(pedidoId, clienteId); // 0 alocações se Warning estiver off
    }
}`})}),e.jsxs(o,{type:"warning",title:"Debug é diferente",children:["Como o código é gerado pelo compilador, ele não está visível no seu projeto. No Visual Studio, expanda ",e.jsx("em",{children:"Dependencies → Analyzers → MeuGen → *.g.cs"})," para inspecionar. No CLI, ative ",e.jsx("code",{children:"<EmitCompilerGeneratedFiles>true</EmitCompilerGeneratedFiles>"})," no ",e.jsx("code",{children:".csproj"})," para gravar em disco."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"partial"}),":"]}),' sem ele, o gerador não pode complementar a classe. O erro aparece como "membro duplicado" ou "método sem corpo".']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"ISourceGenerator"})," em projetos novos:"]})," está obsoleto. Sempre use ",e.jsx("code",{children:"IIncrementalGenerator"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Targetar ",e.jsx("code",{children:"net8.0"})," no projeto do gerador:"]})," tem que ser ",e.jsx("code",{children:"netstandard2.0"}),", ou o compilador rejeita."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acreditar que o IDE atualiza sozinho:"})," às vezes é preciso reiniciar o servidor de linguagem (",e.jsx("em",{children:"Restart OmniSharp / Roslyn"}),") após editar o gerador."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Source generators escrevem C# em compile-time, eliminando reflection."}),e.jsxs("li",{children:[e.jsx("code",{children:"IIncrementalGenerator"})," é a API moderna; usa pipelines reativos."]}),e.jsxs("li",{children:["Classes-alvo precisam ser ",e.jsx("code",{children:"partial"}),"."]}),e.jsxs("li",{children:["Casos prontos: ",e.jsx("code",{children:"JsonSerializerContext"}),", ",e.jsx("code",{children:"[GeneratedRegex]"}),", ",e.jsx("code",{children:"[LoggerMessage]"}),"."]}),e.jsx("li",{children:"Indispensáveis para AOT e performance crítica."})]})]})}export{i as default};
