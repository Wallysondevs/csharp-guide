import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StackVsHeap() {
  return (
    <PageContainer
      title={"Stack vs Heap"}
      subtitle={"Onde cada coisa vive e por que importa pra performance."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <p>Stack: rápida, automática, escopo de método. Cada thread tem 1MB+. Value types vivem aqui (a menos que sejam boxed ou campo de objeto). Heap: gerenciada pelo GC, lenta de alocar (pelo gc tracking), reference types vivem aqui.</p>

      <CodeBlock
        language="csharp"
        code={`void M()
{
    int n = 5;              // stack
    Pessoa p = new("Ana");   // referência na stack, objeto no heap
    Span<int> buf = stackalloc int[10];  // stack pura, sem GC
}`}
      />

      <AlertBox type="info" title={"Locality matters"}>
        <p>Acesso ao heap é mais lento por causa de cache miss. Pra alta performance, prefira value types pequenos, arrays contíguos, e <code>Span</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
