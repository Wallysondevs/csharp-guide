import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Solid() {
  return (
    <PageContainer
      title={"SOLID em C#"}
      subtitle={"Os 5 princípios com exemplos C# concretos."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <h2>S — Single Responsibility</h2>

      <p>Uma classe, uma razão pra mudar. <code>UsuarioServico</code> não envia email — pede pra <code>IEmailSender</code>.</p>

      <h2>O — Open/Closed</h2>

      <p>Aberto pra extensão, fechado pra modificação. Adicionar tipo de pagamento = nova classe que implementa <code>IPagamento</code>, sem editar processador.</p>

      <h2>L — Liskov</h2>

      <p>Subclasse deve poder substituir base sem quebrar caller. <code>Quadrado : Retangulo</code> que sobrescreve setters quebra LSP.</p>

      <h2>I — Interface Segregation</h2>

      <p>Interfaces pequenas e focadas. <code>IRepoLeitura</code> + <code>IRepoEscrita</code> &gt; <code>IRepo</code> gigante.</p>

      <h2>D — Dependency Inversion</h2>

      <p>Dependa de abstrações, não de concretos. Construtor recebe <code>ILogger</code>, não <code>FileLogger</code>.</p>

      <CodeBlock
        language="csharp"
        code={`// Errado
public class PedidoSvc
{
    private readonly SqlServerRepo _repo = new();    // acoplamento duro
    public void Salvar(Pedido p) => _repo.Insert(p);
}

// Certo
public class PedidoSvc(IPedidoRepo repo)
{
    public Task SalvarAsync(Pedido p) => repo.SalvarAsync(p);
}`}
      />
    </PageContainer>
  );
}
