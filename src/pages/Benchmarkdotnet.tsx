import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Benchmarkdotnet() {
  return (
    <PageContainer
      title={"BenchmarkDotNet"}
      subtitle={"O padrão pra microbenchmarks corretos."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;

[MemoryDiagnoser]
public class StringBench
{
    private string[] _v = Enumerable.Range(0, 100).Select(i => i.ToString()).ToArray();

    [Benchmark(Baseline = true)]
    public string Concat() {
        string r = "";
        foreach (var s in _v) r += s;
        return r;
    }

    [Benchmark]
    public string Builder() {
        var sb = new StringBuilder();
        foreach (var s in _v) sb.Append(s);
        return sb.ToString();
    }
}

BenchmarkRunner.Run<StringBench>();`}
      />

      <AlertBox type="warning" title={"Não use Stopwatch pra microbench"}>
        <p>BenchmarkDotNet faz warmup, várias rodadas, calcula média/desvio, mostra alocações. <code>Stopwatch</code> num <code>for</code> mente.</p>
      </AlertBox>
    </PageContainer>
  );
}
