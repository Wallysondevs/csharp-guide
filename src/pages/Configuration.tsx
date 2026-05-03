import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Configuration() {
  return (
    <PageContainer
      title={"Configuration & Options"}
      subtitle={"appsettings, env vars, secrets, IOptions<T>."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="json"
        title="appsettings.json"
        code={`{
  "ConnectionStrings": { "Db": "Host=..." },
  "Smtp": { "Host": "smtp.x", "Porta": 587 }
}`}
      />

      <h2>Bind pra POCO</h2>

      <CodeBlock
        language="csharp"
        code={`public class SmtpOptions
{
    public string Host { get; set; } = "";
    public int Porta { get; set; }
}

builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));

public class EmailSvc(IOptions<SmtpOptions> opt)
{
    private readonly SmtpOptions _smtp = opt.Value;
}`}
      />

      <h2>User Secrets em dev</h2>

      <CodeBlock
        language="bash"
        code={`dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Db" "Host=localhost;..."`}
      />
    </PageContainer>
  );
}
