import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TaskVsThread() {
  return (
    <PageContainer
      title={"Task vs Thread"}
      subtitle={"Por que ninguém mais usa Thread direto. Task abstrai pool, agendamento e continuação."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <h2>Thread (legado)</h2>

      <CodeBlock
        language="csharp"
        code={`var t = new Thread(() => Console.WriteLine("oi"));
t.Start();
t.Join();`}
      />

      <p>Cria thread do SO. Caro (~1MB de stack). Sem retorno fácil. Sem cancelamento elegante.</p>

      <h2>Task (moderno)</h2>

      <CodeBlock
        language="csharp"
        code={`Task t = Task.Run(() => Console.WriteLine("oi"));
await t;

Task<int> calc = Task.Run(() => Pesado());
int r = await calc;`}
      />

      <p>Task vai pro <strong>ThreadPool</strong> — pool reutilizável de threads. Tem retorno tipado, continuação (<code>ContinueWith</code>, <code>await</code>), cancelamento, agregação.</p>

      <AlertBox type="info" title={"await ≠ thread nova"}>
        <p><code>await</code> SÓ libera a thread atual durante I/O. Não cria thread. Thread só aparece quando há computação CPU-bound (e aí use <code>Task.Run</code>).</p>
      </AlertBox>
    </PageContainer>
  );
}
