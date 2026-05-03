import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimaryConstructors() {
  return (
    <PageContainer
      title={"Primary constructors (C# 12)"}
      subtitle={"Construtor declarado direto na assinatura da classe. Funciona pra struct, class, record."}
      difficulty={"intermediario"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Servico(IRepo repo, ILogger<Servico> log)
{
    public async Task ProcessarAsync(int id)
    {
        var ent = await repo.ObterAsync(id);
        log.LogInformation("processando {Id}", id);
    }
}

// Equivalente clássico
public class Servico
{
    private readonly IRepo _repo;
    private readonly ILogger<Servico> _log;
    public Servico(IRepo repo, ILogger<Servico> log)
    { _repo = repo; _log = log; }
    // ...
}`}
      />

      <AlertBox type="info" title={"Não cria propriedade"}>
        <p>Em <code>class</code>, os parâmetros do primary constructor viram <em>capture</em> dos métodos — não são propriedades públicas. Em <code>record</code>, sim, são propriedades.</p>
      </AlertBox>
    </PageContainer>
  );
}
