import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Blazor() {
  return (
    <PageContainer
      title={"Blazor: SPA em C#"}
      subtitle={"Server, WebAssembly e Auto. Frontend sem JavaScript."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="razor"
        title="Contador.razor"
        code={`@page "/contador"
@rendermode InteractiveServer

<h3>Contador</h3>
<p>Valor: @valor</p>
<button @onclick="Incrementar">+1</button>

@code {
    int valor = 0;
    void Incrementar() => valor++;
}`}
      />

      <h2>Modos</h2>

      <ul>
        <li><strong>Server</strong>: tudo no servidor, UI por SignalR. Latência conta.</li>
        <li><strong>WebAssembly</strong>: roda C# no browser. App size maior, sem latência server.</li>
        <li><strong>Auto</strong> (.NET 8+): server primeiro, troca pra WASM depois de baixar.</li>
      </ul>
    </PageContainer>
  );
}
