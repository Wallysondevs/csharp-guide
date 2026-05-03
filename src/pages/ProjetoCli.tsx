import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ProjetoCli() {
  return (
    <PageContainer
      title={"Projeto: CLI tool"}
      subtitle={"Build de uma ferramenta de linha de comando com System.CommandLine."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet new console -o minha-cli
dotnet add package System.CommandLine --prerelease`}
      />

      <CodeBlock
        language="csharp"
        code={`var fileOpt = new Option<FileInfo>("--file", "arquivo de entrada") { IsRequired = true };
var verboseOpt = new Option<bool>("--verbose");

var root = new RootCommand("Minha CLI") { fileOpt, verboseOpt };
root.SetHandler((file, verbose) =>
{
    if (verbose) Console.WriteLine($"Processando {file.FullName}");
    var linhas = File.ReadAllLines(file.FullName);
    Console.WriteLine($"Total: {linhas.Length}");
}, fileOpt, verboseOpt);

return await root.InvokeAsync(args);`}
      />

      <h2>Distribuir como tool global</h2>

      <CodeBlock
        language="xml"
        code={`<PropertyGroup>
  <PackAsTool>true</PackAsTool>
  <ToolCommandName>minha-cli</ToolCommandName>
</PropertyGroup>

# instalar
dotnet pack
dotnet tool install --global --add-source ./nupkg minha-cli`}
      />
    </PageContainer>
  );
}
