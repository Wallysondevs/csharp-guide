import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MediatorCqrs() {
  return (
    <PageContainer
      title={"MediatR e CQRS"}
      subtitle={"Separar comando de consulta, com handlers desacoplados."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// Command
public record CriarPessoaCmd(string Nome, int Idade) : IRequest<int>;

public class CriarPessoaHandler(AppDb db) : IRequestHandler<CriarPessoaCmd, int>
{
    public async Task<int> Handle(CriarPessoaCmd cmd, CancellationToken ct)
    {
        var p = new Pessoa { Nome = cmd.Nome, Idade = cmd.Idade };
        db.Pessoas.Add(p);
        await db.SaveChangesAsync(ct);
        return p.Id;
    }
}

// Endpoint
app.MapPost("/pessoa", (CriarPessoaCmd cmd, IMediator m) => m.Send(cmd));`}
      />

      <AlertBox type="info" title={"CQRS"}>
        <p>Commands mudam estado, Queries leem. Em sistemas grandes, podem usar até bancos diferentes (write/read).</p>
      </AlertBox>
    </PageContainer>
  );
}
