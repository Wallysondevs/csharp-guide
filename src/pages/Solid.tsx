import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Solid() {
  return (
    <PageContainer
      title="Princípios SOLID com exemplos em C#"
      subtitle="Cinco regras que separam código que cresce do código que vira pesadelo."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        SOLID é um acrônimo cunhado por Robert C. Martin que reúne cinco princípios de design orientado a objetos. Não são leis — são <em>diretrizes</em> que ajudam o seu código a aceitar mudanças sem quebrar tudo. Pense neles como regras de boa engenharia civil: você pode construir uma casa ignorando, mas no primeiro terremoto (mudança de requisito) ela cai. Vamos ver cada um com um exemplo "ruim" e a versão "boa".
      </p>

      <h2>S — Single Responsibility (Responsabilidade Única)</h2>
      <p>
        "Uma classe deve ter <strong>um, e apenas um, motivo para mudar</strong>." Se o departamento financeiro pede uma alteração e você tem que mexer numa classe que também envia e-mails, você violou esse princípio.
      </p>
      <pre><code>{`// RUIM: a classe faz três coisas
public class Pedido
{
    public void Salvar() { /* SQL no banco */ }
    public void EnviarEmailConfirmacao() { /* SMTP */ }
    public decimal CalcularTotalComImposto() { /* regra fiscal */ }
}

// BOM: cada responsabilidade em sua classe
public class Pedido { public decimal Subtotal { get; set; } }
public class CalculadoraImposto { public decimal Calcular(Pedido p) => p.Subtotal * 1.10m; }
public class PedidoRepositorio { public void Salvar(Pedido p) { /* ... */ } }
public class NotificadorEmail { public Task EnviarAsync(Pedido p) => /* ... */ Task.CompletedTask; }`}</code></pre>
      <p>
        Agora a regra fiscal pode mudar sem tocar em e-mail; o servidor SMTP pode trocar sem tocar no SQL. Cada classe tem um único motivo para evoluir.
      </p>

      <h2>O — Open/Closed (Aberto/Fechado)</h2>
      <p>
        "Entidades devem ser <strong>abertas para extensão, fechadas para modificação</strong>." Você consegue adicionar comportamento novo sem editar o código existente — usando herança, interfaces ou composição.
      </p>
      <pre><code>{`// RUIM: cada novo tipo de pagamento exige editar este if
public decimal CalcularTaxa(string tipo, decimal valor) {
    if (tipo == "credito") return valor * 0.03m;
    if (tipo == "debito")  return valor * 0.01m;
    if (tipo == "pix")     return 0;
    throw new Exception("Tipo desconhecido");
}

// BOM: cada forma é uma classe que implementa a mesma interface
public interface IFormaPagamento { decimal Taxa(decimal valor); }
public class Credito : IFormaPagamento { public decimal Taxa(decimal v) => v * 0.03m; }
public class Debito  : IFormaPagamento { public decimal Taxa(decimal v) => v * 0.01m; }
public class Pix     : IFormaPagamento { public decimal Taxa(decimal v) => 0; }

// Usuário do código permanece intacto:
decimal Cobrar(IFormaPagamento fp, decimal v) => v + fp.Taxa(v);`}</code></pre>

      <AlertBox type="info" title="Polimorfismo é a chave">
        Sempre que você ver uma cadeia de <code>if/else</code> ou <code>switch</code> sobre o "tipo" de algo, há uma boa chance de poder substituir por polimorfismo (interfaces ou classes derivadas). Isso é o coração do princípio Aberto/Fechado.
      </AlertBox>

      <h2>L — Liskov Substitution (Substituição de Liskov)</h2>
      <p>
        "Uma classe derivada deve poder <strong>substituir a classe base sem quebrar o programa</strong>." Se <code>Quadrado</code> herda de <code>Retangulo</code> mas se comporta diferente quando você muda <code>Largura</code>, você violou Liskov — qualquer código que esperava um Retângulo pode falhar.
      </p>
      <pre><code>{`// RUIM
public class Retangulo
{
    public virtual int Largura  { get; set; }
    public virtual int Altura   { get; set; }
    public int Area => Largura * Altura;
}
public class Quadrado : Retangulo
{
    public override int Largura { set { base.Largura = base.Altura = value; } }
    public override int Altura  { set { base.Largura = base.Altura = value; } }
}
// Função que recebe Retangulo:
void Esticar(Retangulo r) { r.Largura = 10; r.Altura = 5; Debug.Assert(r.Area == 50); }
Esticar(new Quadrado()); // assert quebra: Area == 25!

// BOM: não force a herança quando a relação não é "é-um" perfeita
public abstract class Forma { public abstract int Area(); }
public class Retangulo : Forma { public int Largura; public int Altura; public override int Area() => Largura * Altura; }
public class Quadrado  : Forma { public int Lado;     public override int Area() => Lado * Lado; }`}</code></pre>

      <h2>I — Interface Segregation (Segregação de Interfaces)</h2>
      <p>
        "Nenhum cliente deve ser <strong>forçado a depender de métodos que não usa</strong>." Interfaces "gordas" obrigam implementações a lançar <code>NotImplementedException</code> ou deixar métodos vazios — sinal claro de que precisam ser quebradas.
      </p>
      <pre><code>{`// RUIM: nem toda impressora escaneia, mas todas precisam implementar
public interface IMultifuncional {
    void Imprimir(string doc);
    void Escanear();
    void EnviarFax();
}
public class ImpressoraSimples : IMultifuncional {
    public void Imprimir(string doc) { /* ok */ }
    public void Escanear()  => throw new NotSupportedException();
    public void EnviarFax() => throw new NotSupportedException();
}

// BOM: interfaces pequenas, combinadas por composição
public interface IImpressora { void Imprimir(string doc); }
public interface IScanner    { void Escanear(); }
public interface IFax        { void EnviarFax(); }

public class ImpressoraSimples  : IImpressora { public void Imprimir(string d) {} }
public class Multifuncional     : IImpressora, IScanner, IFax { /* ... */ }`}</code></pre>

      <h2>D — Dependency Inversion (Inversão de Dependência)</h2>
      <p>
        "Módulos de alto nível não devem depender de módulos de baixo nível. <strong>Ambos devem depender de abstrações.</strong>" Em vez do seu serviço criar diretamente um <code>SqlConnection</code>, ele recebe uma <code>IConexao</code>. Isso permite testes (passe um mock) e troca (passe outra implementação).
      </p>
      <pre><code>{`// RUIM: o serviço cria a dependência concreta
public class ServicoPedido
{
    private readonly SqlPedidoRepositorio _repo = new SqlPedidoRepositorio();
    public void Salvar(Pedido p) => _repo.Salvar(p);
}

// BOM: depende de abstração e recebe via construtor
public interface IPedidoRepositorio { void Salvar(Pedido p); }

public class ServicoPedido
{
    private readonly IPedidoRepositorio _repo;
    public ServicoPedido(IPedidoRepositorio repo) => _repo = repo; // injeção de dependência
    public void Salvar(Pedido p) => _repo.Salvar(p);
}

// Em produção:
services.AddScoped<IPedidoRepositorio, SqlPedidoRepositorio>();
// Em testes:
var fake = new Mock<IPedidoRepositorio>();
var sut = new ServicoPedido(fake.Object);`}</code></pre>

      <AlertBox type="warning" title="SOLID não é dogma">
        Aplicar SOLID custa código extra (mais classes, mais interfaces). Em scripts curtos, isso é peso morto. Use SOLID quando o código <em>vai mudar muito</em> ou <em>vai ser testado em isolamento</em>. Para um script de migração rodado uma vez, prosa direta basta.
      </AlertBox>

      <h2>Como saber se já estou aplicando bem?</h2>
      <p>
        Alguns sinais práticos: 1) você consegue trocar o banco por um <em>in-memory</em> nos testes sem reescrever o serviço; 2) adicionar um novo tipo de pagamento, formato de exportação ou provedor de e-mail toca apenas um arquivo novo, sem modificar os existentes; 3) suas classes cabem na tela sem rolagem; 4) os nomes descrevem precisamente uma única responsabilidade — se você precisa usar "e" para descrever o que a classe faz, ela faz demais.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Quebrar uma classe em 15 outras só por ortodoxia</strong> — mais arquivos não significa melhor design.</li>
        <li><strong>Criar interfaces com uma única implementação</strong> "para o caso de precisar" — adicione quando precisar.</li>
        <li><strong>Confundir herança com reuso</strong> — herde apenas quando "B é-um A" for verdadeiro em qualquer contexto (Liskov).</li>
        <li><strong>Injetar tudo, inclusive <code>DateTime.Now</code></strong> — sim, faça isso (use <code>TimeProvider</code> no .NET 8+) só quando o teste realmente precisar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><strong>S</strong> — Uma classe, um motivo de mudança.</li>
        <li><strong>O</strong> — Estenda comportamento sem editar o existente.</li>
        <li><strong>L</strong> — Subclasses devem honrar o contrato da base.</li>
        <li><strong>I</strong> — Interfaces pequenas e específicas.</li>
        <li><strong>D</strong> — Dependa de abstrações, não de detalhes concretos.</li>
      </ul>
    </PageContainer>
  );
}
