import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Streams() {
  return (
    <PageContainer
      title={"Streams"}
      subtitle={"FileStream, MemoryStream, NetworkStream — abstração unificada de I/O."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// Ler arquivo grande sem carregar tudo
using var fs = File.OpenRead("grande.bin");
byte[] buf = new byte[8192];
int lido;
while ((lido = await fs.ReadAsync(buf)) > 0)
{
    Processar(buf.AsSpan(0, lido));
}

// Memory stream
using var ms = new MemoryStream();
ms.Write(dados, 0, dados.Length);
ms.Position = 0;
byte[] cópia = ms.ToArray();

// Pipe — copiar entre streams
using var entrada = File.OpenRead("a");
using var saida = File.Create("b");
await entrada.CopyToAsync(saida);`}
      />
    </PageContainer>
  );
}
