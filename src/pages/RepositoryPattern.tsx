import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RepositoryPattern() {
  return (
    <PageContainer
      title={"Repository Pattern"}
      subtitle={"Abstrair persistência. Mas: precisa? EF já é repo."}
      difficulty={"intermediario"}
      timeToRead={"4 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public interface IPessoaRepo
{
    Task<Pessoa?> ObterAsync(int id);
    Task<IReadOnlyList<Pessoa>> ListarAsync();
    Task SalvarAsync(Pessoa p);
}

public class PessoaRepoEf(AppDb db) : IPessoaRepo
{
    public Task<Pessoa?> ObterAsync(int id) => db.Pessoas.FindAsync(id).AsTask();
    public Task<IReadOnlyList<Pessoa>> ListarAsync() => db.Pessoas.ToListAsync()
        .ContinueWith(t => (IReadOnlyList<Pessoa>)t.Result);
    public Task SalvarAsync(Pessoa p) { db.Pessoas.Add(p); return db.SaveChangesAsync(); }
}`}
      />

      <AlertBox type="warning" title={"Anti-pattern em EF"}>
        <p>Muitos arquitetos puristas argumentam: <code>DbContext</code> JÁ é Unit of Work + Repository. Repos por cima podem virar burocracia. Use só se precisa de mockability sem InMemory provider, ou se vai trocar de ORM.</p>
      </AlertBox>
    </PageContainer>
  );
}
