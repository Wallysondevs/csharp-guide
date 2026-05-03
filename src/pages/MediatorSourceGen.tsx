import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function MediatorSourceGen() {
  return (
    <PageContainer
      title={"Mediator (source-gen)"}
      subtitle={"Alternativa AOT-friendly ao MediatR."}
      difficulty={"avancado"}
      timeToRead={"4 min"}
    >
      <p>MediatR usa reflection. <code>Mediator</code> (NuGet by martinothamar) usa source generators — gera handlers em compile-time. AOT-friendly, mais rápido.</p>

      <CodeBlock
        language="csharp"
        code={`builder.Services.AddMediator(opt => opt.ServiceLifetime = ServiceLifetime.Scoped);

public sealed record GetPessoa(int Id) : IRequest<Pessoa?>;
public sealed class GetPessoaHandler(AppDb db) : IRequestHandler<GetPessoa, Pessoa?>
{
    public ValueTask<Pessoa?> Handle(GetPessoa req, CancellationToken ct)
        => new(db.Pessoas.FirstOrDefaultAsync(p => p.Id == req.Id, ct));
}`}
      />
    </PageContainer>
  );
}
