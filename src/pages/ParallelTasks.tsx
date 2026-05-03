import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ParallelTasks() {
  return (
    <PageContainer
      title={"Task.WhenAll, WhenAny, Parallel"}
      subtitle={"Rodar várias coisas de uma vez de jeito certo."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <h2>WhenAll</h2>

      <CodeBlock
        language="csharp"
        code={`Task<string>[] tasks = urls.Select(u => BaixarAsync(u)).ToArray();
string[] resultados = await Task.WhenAll(tasks);`}
      />

      <h2>WhenAny — corrida</h2>

      <CodeBlock
        language="csharp"
        code={`var t1 = BaixarAsync(servidorA);
var t2 = BaixarAsync(servidorB);
Task<string> primeiro = await Task.WhenAny(t1, t2);
return await primeiro;     // o mais rápido vence`}
      />

      <h2>Parallel.ForEach (CPU-bound)</h2>

      <CodeBlock
        language="csharp"
        code={`Parallel.ForEach(arquivos, arq => Processar(arq));

// Async-friendly
await Parallel.ForEachAsync(urls, async (url, ct) =>
{
    await BaixarAsync(url, ct);
});`}
      />

      <AlertBox type="warning" title={"Não confunda"}>
        <p><code>Parallel</code> é pra trabalho <strong>CPU-bound</strong> (processar imagens, calcular). <code>Task.WhenAll</code> é pra <strong>I/O</strong> (web, banco, arquivo). Misturar dá performance ruim.</p>
      </AlertBox>
    </PageContainer>
  );
}
