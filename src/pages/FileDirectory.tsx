import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function FileDirectory() {
  return (
    <PageContainer
      title={"File, Directory, Path"}
      subtitle={"API mais usada. File.ReadAllText pro 90% dos casos."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// ler / escrever texto
string txt = File.ReadAllText("a.txt");
await File.WriteAllTextAsync("b.txt", "olá");

string[] linhas = File.ReadAllLines("a.txt");
await File.WriteAllLinesAsync("c.txt", linhas);

// bytes
byte[] dados = await File.ReadAllBytesAsync("img.png");

// existe? deletar?
File.Exists(path);
File.Delete(path);
File.Copy(src, dst, overwrite: true);
File.Move(src, dst);

// diretórios
Directory.CreateDirectory("logs");
foreach (var f in Directory.EnumerateFiles("logs", "*.log", SearchOption.AllDirectories))
    Console.WriteLine(f);

// path
var combinado = Path.Combine("dados", "users", "ana.json");
var ext = Path.GetExtension(combinado);   // ".json"
var nome = Path.GetFileNameWithoutExtension(combinado);
var dir = Path.GetDirectoryName(combinado);`}
      />
    </PageContainer>
  );
}
