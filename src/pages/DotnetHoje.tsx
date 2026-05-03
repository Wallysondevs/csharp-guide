import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DotnetHoje() {
  return (
    <PageContainer
      title={".NET hoje (8/9)"}
      subtitle={".NET 8 LTS é o padrão de produção em 2024-2025. Esquece .NET Framework antigo: hoje é tudo cross-platform, open-source e MIT."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <h2>Linha do tempo curta</h2>

      <ul>
        <li><strong>.NET Framework</strong> (2002-2019): só Windows, legado. Use somente pra manter app existente.</li>
        <li><strong>.NET Core</strong> (2016-2019): a reescrita cross-platform.</li>
        <li><strong>.NET 5</strong> (2020): unificou tudo, removeu o "Core" do nome.</li>
        <li><strong>.NET 6 LTS</strong> (2021), <strong>.NET 8 LTS</strong> (2023), <strong>.NET 9</strong> (2024 STS), <strong>.NET 10 LTS</strong> (2025).</li>
      </ul>

      <AlertBox type="warning" title={"LTS vs STS"}>
        <p>LTS (Long-Term Support) tem 3 anos de suporte; STS, 18 meses. Em produção, prefira LTS (8, 10, 12...).</p>
      </AlertBox>

      <h2>Componentes principais</h2>

      <ul>
        <li><strong>CLR</strong>: runtime que roda IL com JIT/AOT.</li>
        <li><strong>BCL</strong>: Base Class Library — <code>System.*</code>, coleções, IO, threading.</li>
        <li><strong>ASP.NET Core</strong>: web stack.</li>
        <li><strong>EF Core</strong>: ORM.</li>
        <li><strong>NuGet</strong>: gerenciador de pacotes.</li>
        <li><strong>Roslyn</strong>: compilador de C# como serviço (analisadores, source generators).</li>
      </ul>

      <h2>Verificando o que está instalado</h2>

      <CodeBlock
        language="bash"
        code={`dotnet --list-sdks
dotnet --list-runtimes
dotnet --info`}
      />
    </PageContainer>
  );
}
