import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StaticMembros() {
  return (
    <PageContainer
      title={"static: membros e classes"}
      subtitle={"Compartilhado entre todas instâncias. Útil pra utilitários, contadores, factories."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Contador
{
    private static int _total = 0;

    public static int Total => _total;
    public static void Incrementar() => _total++;
}

Contador.Incrementar();
Console.WriteLine(Contador.Total);`}
      />

      <h2>Classe estática</h2>

      <CodeBlock
        language="csharp"
        code={`public static class MathUtils
{
    public static int Quadrado(int x) => x * x;
    public static int Cubo(int x) => x * x * x;
}

int q = MathUtils.Quadrado(5);`}
      />

      <h2>using static</h2>

      <CodeBlock
        language="csharp"
        code={`using static System.Math;
using static System.Console;

WriteLine(Sqrt(16));    // sem System.Math.Sqrt`}
      />

      <AlertBox type="warning" title={"Estado global = problema"}>
        <p>Estado mutável estático é compartilhado entre threads e não testável. Pra DI, prefira injetar serviços. Estático bom é o que é puro/imutável.</p>
      </AlertBox>
    </PageContainer>
  );
}
