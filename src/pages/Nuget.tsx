import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Nuget() {
  return (
    <PageContainer
      title={"NuGet a fundo"}
      subtitle={"Pacotes, sources, central package management, lockfile."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet add package Serilog --version 3.1.1
dotnet remove package Serilog
dotnet list package --outdated
dotnet list package --vulnerable

# nuget.config
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget" value="https://api.nuget.org/v3/index.json" />
    <add key="meu" value="https://meu.org/feed/v3/index.json" />
  </packageSources>
</configuration>`}
      />

      <h2>Central Package Management (Directory.Packages.props)</h2>

      <CodeBlock
        language="xml"
        code={`<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Serilog" Version="3.1.1" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  </ItemGroup>
</Project>`}
      />

      <p>Cada projeto referencia <code>&lt;PackageReference Include="X" /&gt;</code> sem versão — vem do central. Adeus mismatch entre projetos.</p>
    </PageContainer>
  );
}
