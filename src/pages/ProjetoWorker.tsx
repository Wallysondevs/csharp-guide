import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoWorker() {
  return (
    <PageContainer
      title={"Projeto: Worker Service"}
      subtitle={"Aplicação background como serviço Windows / daemon Linux."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet new worker -o MeuWorker
cd MeuWorker
dotnet run`}
      />

      <CodeBlock
        language="csharp"
        code={`public class Worker(ILogger<Worker> log, IServiceProvider sp) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            using var scope = sp.CreateScope();
            var svc = scope.ServiceProvider.GetRequiredService<IProcessador>();

            try { await svc.RodarAsync(ct); }
            catch (Exception ex) { log.LogError(ex, "falha"); }

            await Task.Delay(TimeSpan.FromMinutes(5), ct);
        }
    }
}

// Program.cs
var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();
builder.Services.AddScoped<IProcessador, Processador>();
builder.Build().Run();`}
      />

      <AlertBox type="info" title={"systemd / Windows Service"}>
        <p>Worker rodando "puro" funciona. Pra registrar como serviço, use <code>Microsoft.Extensions.Hosting.Systemd</code> ou <code>WindowsServices</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
