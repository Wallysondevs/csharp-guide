import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function MutexSemaphore() {
  return (
    <PageContainer
      title={"Mutex e SemaphoreSlim"}
      subtitle={"Sincronização entre processos (Mutex) e limitação de concorrência (Semaphore)."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <h2>Mutex inter-processo</h2>

      <CodeBlock
        language="csharp"
        code={`using var m = new Mutex(false, "Global\\\\MeuAppRunOnce");
if (!m.WaitOne(0)) { Console.WriteLine("já rodando"); return; }
// app rodando — só uma instância na máquina`}
      />

      <h2>SemaphoreSlim — limitar paralelismo</h2>

      <CodeBlock
        language="csharp"
        code={`var sem = new SemaphoreSlim(initialCount: 5, maxCount: 5);

async Task ProcessarAsync(string item)
{
    await sem.WaitAsync();
    try { await DoAsync(item); }
    finally { sem.Release(); }
}

await Task.WhenAll(itens.Select(ProcessarAsync));   // máx 5 simultâneas`}
      />
    </PageContainer>
  );
}
