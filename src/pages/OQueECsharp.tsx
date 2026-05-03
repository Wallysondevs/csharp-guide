import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OQueECsharp() {
  return (
    <PageContainer
      title={"O que é C#"}
      subtitle={"Linguagem multiplataforma, fortemente tipada, criada pela Microsoft em 2000 e hoje a alma do .NET — usada de games (Unity) a serviços web em escala."}
      difficulty={"iniciante"}
      timeToRead={"5 min"}
    >
      <h2>Origem e propósito</h2>

      <p>C# (lê-se "C sharp") nasceu em 2000 com Anders Hejlsberg (mesmo criador do Delphi e TypeScript) como resposta da Microsoft à promessa do Java. Hoje é open source, multiplataforma e roda em Windows, Linux, macOS, iOS, Android, WebAssembly e até em microcontroladores.</p>

      <h2>Onde C# é usado</h2>

      <ul>
        <li>Web APIs e backends com ASP.NET Core (alguns dos benchmarks mais rápidos do mercado).</li>
        <li>Games com Unity (~70% dos jogos indie do Steam).</li>
        <li>Apps cross-platform com .NET MAUI / Avalonia.</li>
        <li>IA/ML com ML.NET e bindings pra ONNX.</li>
        <li>Cloud-native: microserviços, Azure Functions, AWS Lambda.</li>
        <li>Ferramentas de linha de comando, scripts, automação.</li>
      </ul>

      <AlertBox type="info" title={"C# vs .NET"}>
        <p>C# é a <strong>linguagem</strong>. .NET é a <strong>plataforma</strong> (runtime + bibliotecas + ferramentas). Você escreve C#, o compilador (Roslyn) gera IL, o runtime (CLR) executa. .NET também roda F# e VB.NET.</p>
      </AlertBox>

      <h2>Características</h2>

      <ul>
        <li>Fortemente tipada com inferência (<code>var</code>).</li>
        <li>Garbage collected, mas com controle fino de memória via <code>Span&lt;T&gt;</code> e <code>stackalloc</code>.</li>
        <li>Multi-paradigma: OO, funcional, async, pattern matching.</li>
        <li>Evolui rápido — uma versão por ano (C# 12 em 2023, C# 13 em 2024).</li>
      </ul>
    </PageContainer>
  );
}
