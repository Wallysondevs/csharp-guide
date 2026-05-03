import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Arraypool() {
  return (
    <PageContainer
      title={"ArrayPool<T>"}
      subtitle={"Reusar arrays grandes em vez de alocar e jogar fora."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(8192);   // pode vir maior que 8192
try
{
    int lido = await stream.ReadAsync(buffer);
    Processar(buffer.AsSpan(0, lido));
}
finally
{
    pool.Return(buffer);            // devolve pro pool
}`}
      />

      <AlertBox type="info" title={"MemoryPool tb"}>
        <p><code>MemoryPool&lt;T&gt;</code> retorna IMemoryOwner com Dispose automático em <code>using</code>. Mais ergonômico.</p>
      </AlertBox>
    </PageContainer>
  );
}
