import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ParallelLinq() {
  return (
    <PageContainer
      title={"PLINQ (Parallel LINQ)"}
      subtitle={"AsParallel() liga paralelismo automático."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var resultado = numeros.AsParallel()
    .Where(n => EhPrimo(n))
    .Select(n => Pesado(n))
    .ToList();

// controle
var r = numeros.AsParallel()
    .WithDegreeOfParallelism(4)
    .WithCancellation(ct)
    .Where(...)
    .ToArray();`}
      />

      <AlertBox type="warning" title={"Não paraleliza tudo"}>
        <p>PLINQ vale pra trabalho CPU-bound em coleções grandes. Pra coleções pequenas ou trabalho rápido, overhead é maior que ganho.</p>
      </AlertBox>
    </PageContainer>
  );
}
