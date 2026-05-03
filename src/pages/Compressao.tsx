import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Compressao() {
  return (
    <PageContainer
      title={"Compressão (gzip, brotli, zip)"}
      subtitle={"Comprimir streams in-flight ou criar/extrair zip."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.IO.Compression;

// gzip stream
using var fs = File.Create("data.gz");
using var gz = new GZipStream(fs, CompressionLevel.Optimal);
await gz.WriteAsync(dados);

// ler
using var input = File.OpenRead("data.gz");
using var dec = new GZipStream(input, CompressionMode.Decompress);
byte[] orig = ...;

// Zip files
ZipFile.CreateFromDirectory("pasta", "saida.zip");
ZipFile.ExtractToDirectory("saida.zip", "destino");

// Brotli (mais compacto, .NET Core 2+)
using var br = new BrotliStream(fs, CompressionLevel.SmallestSize);`}
      />
    </PageContainer>
  );
}
