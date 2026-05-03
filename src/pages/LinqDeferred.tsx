import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqDeferred() {
  return (
    <PageContainer
      title={"Execução deferida vs imediata"}
      subtitle={"A pegadinha número 1 do LINQ. Sua query não roda quando você acha que roda."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <p>Métodos como <code>Where</code>, <code>Select</code>, <code>OrderBy</code> retornam <strong>queries</strong>, não resultados. A execução só acontece quando você itera (foreach, ToList, ToArray, Sum, etc).</p>

      <CodeBlock
        language="csharp"
        code={`var q = nums.Where(n => { Console.WriteLine($"avaliando {n}"); return n > 2; });
Console.WriteLine("definido");
foreach (var x in q) { }  // SÓ AGORA imprime "avaliando..."`}
      />

      <h2>Re-execução</h2>

      <CodeBlock
        language="csharp"
        code={`var ativos = pessoas.Where(p => p.Ativo);
int n1 = ativos.Count();   // executa de novo
foreach (var p in ativos) ... // executa de novo!

// pra evitar:
var lista = ativos.ToList();
int n2 = lista.Count;`}
      />

      <AlertBox type="warning" title={"Closure muda"}>
        <p>Se a query usa variável externa que muda entre definição e execução, o resultado muda também. Cuidado em loops.</p>
      </AlertBox>
    </PageContainer>
  );
}
