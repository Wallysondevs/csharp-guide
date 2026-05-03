import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqPaginar() {
  return (
    <PageContainer
      title={"Paginação e Take/Skip"}
      subtitle={"Take, Skip, TakeLast, Chunk — paginar e fatiar coleções."}
      difficulty={"iniciante"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var primeiros = lista.Take(10);
var pulo = lista.Skip(20).Take(10);   // página 3 de 10 em 10
var ultimos = lista.TakeLast(5);

// .NET 6+: TakeRange
var meio = lista.Take(10..20);

// Chunk: divide em pedaços
foreach (var bloco in lista.Chunk(100))
{
    // bloco é T[] de até 100 itens
    ProcessarLote(bloco);
}`}
      />

      <AlertBox type="success" title={"Chunk pra batch"}>
        <p><code>Chunk(N)</code> é ideal pra processar em lotes (insert no banco, chamada de API, etc).</p>
      </AlertBox>
    </PageContainer>
  );
}
