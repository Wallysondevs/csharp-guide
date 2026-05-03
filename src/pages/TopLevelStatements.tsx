import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function TopLevelStatements() {
  return (
    <PageContainer
      title={"Top-level statements e file-scoped namespace"}
      subtitle={"Menos boilerplate, mais código que importa."}
      difficulty={"iniciante"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// Program.cs (C# 9+)
using System;

Console.WriteLine("início");
var nome = Console.ReadLine();
Console.WriteLine($"oi {nome}");

// File-scoped namespace (C# 10)
namespace MeuApp.Servicos;

public class Calculadora
{
    public int Somar(int a, int b) => a + b;
}`}
      />

      <p>Em vez de <code>namespace X &#123; class Y &#123; ... &#125; &#125;</code> com indentação, todo o arquivo passa a estar dentro do namespace declarado.</p>
    </PageContainer>
  );
}
