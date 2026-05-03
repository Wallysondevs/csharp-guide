import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Aot() {
  return (
    <PageContainer
      title={"AOT (Ahead-of-Time)"}
      subtitle={"Compilar pra binário nativo. Startup instantâneo, sem JIT."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="xml"
        title="csproj.xml"
        code={`<PropertyGroup>
  <PublishAot>true</PublishAot>
  <InvariantGlobalization>true</InvariantGlobalization>
</PropertyGroup>`}
      />

      <CodeBlock
        language="bash"
        code={`dotnet publish -c Release -r linux-x64
# binário ~20MB, start em ~10ms`}
      />

      <h2>Limitações</h2>

      <ul>
        <li>Sem reflection dinâmica em código não trimável.</li>
        <li>Sem <code>Assembly.LoadFrom</code> em runtime.</li>
        <li>JSON precisa de source generator.</li>
        <li>EF Core ainda tem limitações em queries com expressions.</li>
      </ul>

      <AlertBox type="info" title={"Quando vale"}>
        <p>Serverless (Lambda/Functions), CLI tools, containers minúsculos. Pra app monolítico web grande, AOT pode dar dor de cabeça.</p>
      </AlertBox>
    </PageContainer>
  );
}
