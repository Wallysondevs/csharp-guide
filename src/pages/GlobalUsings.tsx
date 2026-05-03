import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function GlobalUsings() {
  return (
    <PageContainer
      title={"Global usings e implicit usings"}
      subtitle={"Importar uma vez no projeto, valer pra todos os arquivos."}
      difficulty={"iniciante"}
      timeToRead={"3 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using MinhaApp.Modelos;`}
      />

      <h2>Implicit usings (csproj)</h2>

      <CodeBlock
        language="xml"
        code={`<PropertyGroup>
  <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>`}
      />

      <p>Habilita um conjunto padrão (varia por SDK: console traz <code>System</code>, <code>System.IO</code>, <code>LINQ</code>...; web traz mais).</p>
    </PageContainer>
  );
}
