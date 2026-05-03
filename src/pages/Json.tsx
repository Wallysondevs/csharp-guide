import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Json() {
  return (
    <PageContainer
      title={"System.Text.Json"}
      subtitle={"JSON oficial e rápido do .NET. Substituto do Newtonsoft.Json em projetos novos."}
      difficulty={"intermediario"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="csharp"
        code={`using System.Text.Json;

public record Pessoa(string Nome, int Idade);

var p = new Pessoa("Ana", 30);

// serializar
string json = JsonSerializer.Serialize(p);
string indentado = JsonSerializer.Serialize(p, new JsonSerializerOptions { WriteIndented = true });

// desserializar
var p2 = JsonSerializer.Deserialize<Pessoa>(json);

// async com stream
await using var fs = File.Create("p.json");
await JsonSerializer.SerializeAsync(fs, p);

await using var fs2 = File.OpenRead("p.json");
var p3 = await JsonSerializer.DeserializeAsync<Pessoa>(fs2);`}
      />

      <h2>Opções comuns</h2>

      <CodeBlock
        language="csharp"
        code={`var opts = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    PropertyNameCaseInsensitive = true
};`}
      />

      <AlertBox type="info" title={"Source generation"}>
        <p>Pra AOT/Trim e mais performance, use <code>[JsonSerializable]</code> com partial context — gera código sem reflection.</p>
      </AlertBox>
    </PageContainer>
  );
}
