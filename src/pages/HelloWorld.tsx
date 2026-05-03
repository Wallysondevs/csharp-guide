import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HelloWorld() {
  return (
    <PageContainer
      title={"Hello World & primeiro projeto"}
      subtitle={"Top-level statements de C# 9+ deixam o \"Hello World\" virar uma linha. Vamos do zero ao programa rodando."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <h2>Criando o projeto</h2>

      <CodeBlock
        language="bash"
        code={`dotnet new console -o ola
cd ola
dotnet run`}
      />

      <h2>Program.cs (top-level)</h2>

      <CodeBlock
        language="csharp"
        title="Program.cs"
        code={`Console.WriteLine("Olá, mundo!");
Console.WriteLine($"Hoje é {DateTime.Now:yyyy-MM-dd}");`}
      />

      <p>Não tem <code>Main</code>, não tem <code>namespace</code>, não tem <code>class</code>. O compilador gera tudo isso pra você. Por baixo do capô existe um método <code>Main</code> implícito.</p>

      <h2>A forma "clássica" (ainda válida)</h2>

      <CodeBlock
        language="csharp"
        code={`namespace Ola;

internal class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Olá, mundo!");
    }
}`}
      />

      <AlertBox type="info" title={"Qual usar?"}>
        <p>Pra apps reais com várias classes, top-level statements ficam só no <code>Program.cs</code> e o resto é organizado normalmente. Os dois estilos coexistem no mesmo projeto.</p>
      </AlertBox>
    </PageContainer>
  );
}
