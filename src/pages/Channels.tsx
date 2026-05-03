import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Channels() {
  return (
    <PageContainer
      title={"Channels"}
      subtitle={"Producer/consumer assíncrono, type-safe, com backpressure."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.Threading.Channels;

var ch = Channel.CreateBounded<int>(capacity: 10);

// produtor
_ = Task.Run(async () =>
{
    for (int i = 0; i < 100; i++)
        await ch.Writer.WriteAsync(i);
    ch.Writer.Complete();
});

// consumidor
await foreach (var x in ch.Reader.ReadAllAsync())
    Console.WriteLine(x);`}
      />

      <AlertBox type="success" title={"Substituiu BlockingCollection"}>
        <p>Channels são async-first, com Bounded/Unbounded, single/multi reader/writer. API moderna pra pipelines.</p>
      </AlertBox>
    </PageContainer>
  );
}
