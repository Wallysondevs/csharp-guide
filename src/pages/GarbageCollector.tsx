import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GarbageCollector() {
  return (
    <PageContainer
      title={"Garbage Collector"}
      subtitle={"Gerações 0/1/2, LOH, Server vs Workstation. O que o GC do .NET faz."}
      difficulty={"intermediario"}
      timeToRead={"7 min"}
    >
      <h2>Gerações</h2>

      <ul>
        <li><strong>Gen 0</strong>: objetos novos. Coletada com frequência, rápida.</li>
        <li><strong>Gen 1</strong>: sobreviventes da Gen 0. Buffer.</li>
        <li><strong>Gen 2</strong>: tudo que sobreviveu mais. Coleta cara, full GC.</li>
        <li><strong>LOH</strong> (Large Object Heap, &gt; 85KB): coletada com Gen 2, sem compactação por padrão.</li>
      </ul>

      <h2>Server GC vs Workstation GC</h2>

      <CodeBlock
        language="xml"
        code={`<!-- csproj -->
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>
</PropertyGroup>`}
      />

      <p>Server GC tem 1 heap por core, paralelo. Bom pra serviços. Workstation é menor footprint, bom pra desktop.</p>

      <h2>Forçar GC?</h2>

      <CodeBlock
        language="csharp"
        code={`GC.Collect();
GC.WaitForPendingFinalizers();
GC.Collect();
// Quase sempre uma má ideia. Use só em casos extremos (após carregar arquivo gigante).`}
      />

      <AlertBox type="warning" title={"Não tente \"ajudar\" o GC"}>
        <p>Setar variáveis pra null, chamar GC.Collect, etc — geralmente piora. O GC é muito mais inteligente que você na maioria dos casos.</p>
      </AlertBox>
    </PageContainer>
  );
}
