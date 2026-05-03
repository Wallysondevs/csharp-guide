import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Csproj() {
  return (
    <PageContainer
      title={"csproj: o arquivo de projeto"}
      subtitle={"XML curto que define SDK, target framework, deps, propriedades."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="xml"
        title="Meu.csproj"
        code={`<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <LangVersion>latest</LangVersion>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Serilog" Version="3.1.1" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\Lib\\Lib.csproj" />
  </ItemGroup>

</Project>`}
      />

      <h2>Multi-targeting</h2>

      <CodeBlock
        language="xml"
        code={`<TargetFrameworks>net8.0;net6.0;netstandard2.0</TargetFrameworks>`}
      />
    </PageContainer>
  );
}
