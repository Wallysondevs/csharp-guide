import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CleanArchitecture() {
  return (
    <PageContainer
      title={"Clean Architecture"}
      subtitle={"Camadas concêntricas. Domain no centro, infra na borda."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <ul>
        <li><strong>Domain</strong>: entidades, value objects, regras puras. Sem dependência de infra.</li>
        <li><strong>Application</strong>: casos de uso, orquestração. Define interfaces (<code>IPessoaRepo</code>).</li>
        <li><strong>Infrastructure</strong>: implementações concretas (EF, SMTP, S3).</li>
        <li><strong>Presentation</strong>: API/UI. Só fala com Application.</li>
      </ul>

      <CodeBlock
        language="text"
        code={`Solution/
  src/
    Meu.Domain/         (entidades, sem deps)
    Meu.Application/    (use cases, deps: Domain)
    Meu.Infrastructure/ (EF, SMTP, deps: Application + Domain)
    Meu.Api/            (ASP.NET, deps: Application + Infrastructure)
  tests/
    Meu.Domain.Tests/
    Meu.Application.Tests/`}
      />

      <AlertBox type="success" title={"Por que vale"}>
        <p>Domain sem dependência externa = testável puro, mudança de DB ou framework não toca regra de negócio.</p>
      </AlertBox>
    </PageContainer>
  );
}
