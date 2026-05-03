import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DiPadroes() {
  return (
    <PageContainer
      title={"Padrões de DI avançados"}
      subtitle={"Decorator, factory, named clients, options pattern."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <h2>Decorator</h2>

      <CodeBlock
        language="csharp"
        code={`builder.Services.AddScoped<IRepo, RepoEf>();
builder.Services.Decorate<IRepo, RepoCache>();   // Scrutor

// RepoCache recebe IRepo (o RepoEf) por construtor`}
      />

      <h2>Named/keyed services (.NET 8+)</h2>

      <CodeBlock
        language="csharp"
        code={`builder.Services.AddKeyedScoped<INotificador, Email>("email");
builder.Services.AddKeyedScoped<INotificador, Sms>("sms");

public class Svc([FromKeyedServices("email")] INotificador n) { }`}
      />
    </PageContainer>
  );
}
