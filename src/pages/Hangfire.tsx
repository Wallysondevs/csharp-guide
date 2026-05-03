import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Hangfire() {
  return (
    <PageContainer
      title={"Hangfire: jobs em background"}
      subtitle={"Fire-and-forget, agendados, recorrentes, com dashboard web."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Services.AddHangfire(c => c.UsePostgreSqlStorage(cs));
builder.Services.AddHangfireServer();
app.UseHangfireDashboard("/hangfire");

// Fire-and-forget
BackgroundJob.Enqueue<IEmail>(e => e.EnviarAsync(to, subject, body));

// Agendado
BackgroundJob.Schedule<IEmail>(e => e.EnviarAsync(...), TimeSpan.FromMinutes(30));

// Recorrente (cron)
RecurringJob.AddOrUpdate<IRelatorio>("diario", r => r.GerarAsync(), Cron.Daily);`}
      />
    </PageContainer>
  );
}
