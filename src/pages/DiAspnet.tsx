import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DiAspnet() {
  return (
    <PageContainer
      title={"Injeção de dependência"}
      subtitle={"Built-in DI container. Singleton, Scoped, Transient."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Services.AddSingleton<IConfig, AppConfig>();   // 1 por app
builder.Services.AddScoped<IRepo, RepoEf>();          // 1 por request
builder.Services.AddTransient<IFormatter, Formatter>();// 1 por injeção

builder.Services.AddDbContext<MeuContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Db")));

// Consumir
public class Servico(IRepo repo, ILogger<Servico> log)
{
    public async Task<Pessoa?> Get(int id) => await repo.ObterAsync(id);
}`}
      />

      <AlertBox type="warning" title={"Captive dependency"}>
        <p>Singleton recebendo Scoped vira bug — Scoped vai durar pra sempre. Container detecta quando você está em Development e avisa.</p>
      </AlertBox>
    </PageContainer>
  );
}
