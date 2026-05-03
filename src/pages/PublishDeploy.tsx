import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function PublishDeploy() {
  return (
    <PageContainer
      title={"dotnet publish & deploy"}
      subtitle={"Self-contained, single-file, framework-dependent — qual escolher."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="bash"
        code={`# Self-contained (inclui runtime, ~80MB)
dotnet publish -c Release -r linux-x64 --self-contained

# Framework-dependent (precisa runtime instalado, ~10MB)
dotnet publish -c Release

# Single-file
dotnet publish -c Release -r linux-x64 \\
  -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true

# AOT
dotnet publish -c Release -r linux-x64 -p:PublishAot=true`}
      />
    </PageContainer>
  );
}
