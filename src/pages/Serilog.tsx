import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Serilog() {
  return (
    <PageContainer
      title={"Serilog: logging estruturado"}
      subtitle={"Sai do Console.WriteLine pro mundo de logs JSON com sinks."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .WriteTo.Console(new RenderedCompactJsonFormatter())
    .WriteTo.Seq("http://seq:5341")
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day));

// Uso (via ILogger<T> normal)
public class Svc(ILogger<Svc> log)
{
    public void Process(int id)
    {
        log.LogInformation("Processando {Id} para {User}", id, "ana");
        // Logs ficam estruturados: { Id: 42, User: "ana" }
    }
}`}
      />

      <AlertBox type="success" title={"Estruturado &gt; texto"}>
        <p>Em vez de "User ana fez X", você loga campos. Em ferramentas (Seq, ELK), você filtra por <code>User=ana</code> sem regex.</p>
      </AlertBox>
    </PageContainer>
  );
}
