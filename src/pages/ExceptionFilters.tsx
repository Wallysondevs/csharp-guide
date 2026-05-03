import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ExceptionFilters() {
  return (
    <PageContainer
      title={"Exception filters (when)"}
      subtitle={"Filtrar antes de capturar. Não desenrola a stack se condição falhar."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`try { Operacao(); }
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    return null;
}
catch (HttpRequestException ex) when (ex.StatusCode >= HttpStatusCode.InternalServerError)
{
    await PoliticaRetry();
}

// log sem capturar
catch (Exception ex) when (Log(ex)) { /* nunca executa */ }
static bool Log(Exception ex) { _logger.Log(ex); return false; }`}
      />
    </PageContainer>
  );
}
