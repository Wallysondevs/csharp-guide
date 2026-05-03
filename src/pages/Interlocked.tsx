import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Interlocked() {
  return (
    <PageContainer
      title={"Interlocked"}
      subtitle={"Operações atômicas sem lock. Increment, Add, CompareExchange."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`int contador = 0;
Interlocked.Increment(ref contador);     // atomic ++
Interlocked.Add(ref contador, 5);

// CAS — base de algoritmos lock-free
int original;
do
{
    original = contador;
}
while (Interlocked.CompareExchange(ref contador, original + 1, original) != original);`}
      />

      <AlertBox type="info" title={"Volátil ≠ atômico"}>
        <p><code>volatile</code> garante ordering, não atomicidade. Pra contadores compartilhados, use <code>Interlocked</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
