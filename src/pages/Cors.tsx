import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Cors() {
  return (
    <PageContainer
      title={"CORS"}
      subtitle={"Cross-Origin. Configurar certo evita \"Access denied\" no console do browser."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Services.AddCors(opt =>
{
    opt.AddPolicy("padrao", p => p
        .WithOrigins("https://meuapp.com", "http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

app.UseCors("padrao");`}
      />

      <AlertBox type="warning" title={"AllowAnyOrigin + Credentials = nope"}>
        <p>O navegador rejeita. Se precisa <code>AllowCredentials</code>, especifique origens.</p>
      </AlertBox>
    </PageContainer>
  );
}
