import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RoslynAnalyzers() {
  return (
    <PageContainer
      title={"Roslyn Analyzers"}
      subtitle={"Lint integrado ao build. Pega bug antes de virar PR."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="xml"
        code={`<PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="..." />
<PackageReference Include="StyleCop.Analyzers" Version="..." PrivateAssets="all" />
<PackageReference Include="SonarAnalyzer.CSharp" Version="..." PrivateAssets="all" />`}
      />

      <h2>.editorconfig</h2>

      <CodeBlock
        language="ini"
        code={`[*.cs]
dotnet_analyzer_diagnostic.severity = warning
dotnet_diagnostic.CA1822.severity = none      # member can be static
dotnet_diagnostic.IDE0058.severity = warning  # discard return value`}
      />

      <AlertBox type="success" title={"Tratamento como erro"}>
        <p>Em CI, ligue <code>TreatWarningsAsErrors</code>. Combinado com analyzers, força qualidade desde o build.</p>
      </AlertBox>
    </PageContainer>
  );
}
