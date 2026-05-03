import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function TryCatchFinally() {
  return (
    <PageContainer
      title={"try / catch / finally"}
      subtitle={"Como C# trata erros: quem joga, quem pega, quando re-jogar."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`try
{
    var n = int.Parse(input);
    Process(n);
}
catch (FormatException ex)
{
    log.LogWarning(ex, "input inválido");
}
catch (Exception ex) when (!(ex is OutOfMemoryException))
{
    log.LogError(ex, "falha");
    throw;        // re-joga preservando stack trace
    // throw ex; // RUIM — perde stack trace
}
finally
{
    // sempre roda, com ou sem exceção
    LiberarRecursos();
}`}
      />

      <h2>Hierarquia</h2>

      <ul>
        <li><code>Exception</code> → raiz</li>
        <li><code>SystemException</code> → da BCL (NullReference, InvalidOperation...)</li>
        <li><code>ApplicationException</code> → era pra ser pra app, hoje desencorajado</li>
        <li>Crie suas próprias herdando de <code>Exception</code> direto</li>
      </ul>
    </PageContainer>
  );
}
