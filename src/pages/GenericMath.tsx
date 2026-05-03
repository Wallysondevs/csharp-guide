import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericMath() {
  return (
    <PageContainer
      title={"Generic Math (C# 11)"}
      subtitle={"Operadores em interfaces! Agora dá pra escrever Sum<T> que funciona pra int, double, decimal..."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.Numerics;

public static T Soma<T>(IEnumerable<T> xs) where T : INumber<T>
{
    T total = T.Zero;
    foreach (var x in xs) total += x;
    return total;
}

int a = Soma(new[] { 1, 2, 3 });           // 6
double b = Soma(new[] { 1.5, 2.5 });       // 4.0
decimal c = Soma(new[] { 1m, 2m, 3m });    // 6m`}
      />

      <AlertBox type="success" title={"Fim do código duplicado"}>
        <p>Antes precisava escrever <code>SumInt</code>, <code>SumDouble</code>, <code>SumDecimal</code>. Agora um genérico cobre tudo, sem boxing nem performance ruim.</p>
      </AlertBox>
    </PageContainer>
  );
}
