import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Cancellationtoken() {
  return (
    <PageContainer
      title={"CancellationToken"}
      subtitle={"Cancelar operações async sem matar thread na marra."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public async Task BaixarAsync(string url, CancellationToken ct)
{
    while (!ct.IsCancellationRequested)
    {
        // operação rápida
        ct.ThrowIfCancellationRequested();
        await DoChunkAsync(ct);    // propaga
    }
}

// Caller
using var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(5));

try
{
    await BaixarAsync(url, cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("cancelado");
}`}
      />

      <AlertBox type="success" title={"Sempre aceite CT"}>
        <p>Em qualquer API async pública, aceite <code>CancellationToken ct = default</code>. Caller decide se quer cancelar.</p>
      </AlertBox>
    </PageContainer>
  );
}
