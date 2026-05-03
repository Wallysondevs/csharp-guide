import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Datetime() {
  return (
    <PageContainer
      title={"DateTime, DateOnly, TimeOnly"}
      subtitle={"Tempo é difícil. C# tem 5 tipos pra isso e cada um existe por uma razão."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Os tipos</h2>

      <ul>
        <li><code>DateTime</code> — data + hora (legado, sem timezone embutido)</li>
        <li><code>DateTimeOffset</code> — data + hora + offset UTC (preferido pra logs/APIs)</li>
        <li><code>DateOnly</code> (.NET 6+) — só data</li>
        <li><code>TimeOnly</code> (.NET 6+) — só hora</li>
        <li><code>TimeSpan</code> — duração</li>
      </ul>

      <CodeBlock
        language="csharp"
        code={`DateTime agora = DateTime.Now;          // local
DateTime utc = DateTime.UtcNow;          // UTC
DateTimeOffset ag2 = DateTimeOffset.Now; // com offset
DateOnly hoje = DateOnly.FromDateTime(DateTime.Now);
TimeOnly horario = new TimeOnly(14, 30);
TimeSpan duracao = TimeSpan.FromMinutes(90);`}
      />

      <h2>Aritmética</h2>

      <CodeBlock
        language="csharp"
        code={`var amanha = DateTime.Today.AddDays(1);
var seculo = DateTime.Today.AddYears(100);
TimeSpan delta = fim - inicio;
double dias = delta.TotalDays;`}
      />

      <h2>Parsing e formatação</h2>

      <CodeBlock
        language="csharp"
        code={`var dt = DateTime.Parse("2024-03-15T10:30:00Z");
var br = DateTime.Parse("15/03/2024", new CultureInfo("pt-BR"));

string iso = dt.ToString("o");                  // 2024-03-15T10:30:00.0000000Z
string br2 = dt.ToString("dd/MM/yyyy HH:mm");
string mes = dt.ToString("MMMM", new CultureInfo("pt-BR")); // março

// TryParse evita exceção
if (DateTime.TryParse(input, out var d)) { /* ok */ }`}
      />

      <AlertBox type="warning" title={"Sempre UTC no banco"}>
        <p>Salve datas em UTC, formate em local só na borda (UI). Usar <code>DateTime.Now</code> em servidor distribuído entre regiões é receita pra bug.</p>
      </AlertBox>
    </PageContainer>
  );
}
