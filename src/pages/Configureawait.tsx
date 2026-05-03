import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Configureawait() {
  return (
    <PageContainer
      title={"ConfigureAwait(false)"}
      subtitle={"Em libs, sempre. Em apps, quase nunca. Por quê?"}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <p><code>await</code> por padrão captura o <strong>SynchronizationContext</strong> atual e volta pra ele depois. Em UI desktop e ASP.NET clássico, isso é a thread de UI / contexto de request. <code>ConfigureAwait(false)</code> desativa essa volta — segue na thread do pool.</p>

      <CodeBlock
        language="csharp"
        code={`// Em biblioteca — SEMPRE
public async Task<int> CarregarAsync()
{
    var dados = await _http.GetAsync(url).ConfigureAwait(false);
    return await Processar(dados).ConfigureAwait(false);
}`}
      />

      <AlertBox type="info" title={"ASP.NET Core não tem SyncContext"}>
        <p>No ASP.NET Core moderno não há contexto pra capturar — o <code>ConfigureAwait(false)</code> não muda nada. Mas em libs cross-target ainda vale por consistência.</p>
      </AlertBox>
    </PageContainer>
  );
}
