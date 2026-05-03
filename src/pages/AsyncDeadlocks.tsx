import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncDeadlocks() {
  return (
    <PageContainer
      title={"Async deadlocks: como evitar"}
      subtitle={"Os deadlocks clássicos do .NET Framework e como o .NET Core mata eles."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// CLÁSSICO BUG (UI ou ASP.NET clássico)
public string Carregar()
{
    return CarregarAsync().Result;   // deadlock
}

private async Task<string> CarregarAsync()
{
    await DoAlgo();   // captura sync context, esperando voltar...
    return "ok";       // ...mas o thread de UI tá bloqueado em .Result
}

// FIX 1: tudo async
public async Task<string> CarregarAsync() { ... }

// FIX 2: ConfigureAwait(false) na lib
await DoAlgo().ConfigureAwait(false);`}
      />

      <AlertBox type="info" title={"ASP.NET Core seguro"}>
        <p>No ASP.NET Core não há SynchronizationContext — esse deadlock específico não acontece. Em WPF/WinForms ainda existe.</p>
      </AlertBox>
    </PageContainer>
  );
}
