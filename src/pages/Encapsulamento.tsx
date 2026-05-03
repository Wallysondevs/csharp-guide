import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Encapsulamento() {
  return (
    <PageContainer
      title="Encapsulamento: public, private, protected, internal"
      subtitle="Aprenda a controlar quem pode enxergar e modificar cada parte da sua classe — o pilar de código seguro e fácil de manter."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Pense em uma cafeteria: o cliente vê o cardápio e o caixa (interface pública), mas não entra na cozinha (interna), nem mexe no estoque do depósito (privado), nem na sala do gerente (protegida só para funcionários). Cada espaço tem regras de acesso. <strong>Encapsulamento</strong> é exatamente isso em código: você decide quem pode ver e mexer em cada membro da sua classe. Em C#, esse controle é feito por <strong>modificadores de acesso</strong>. Usar bem esses modificadores é o que separa um código frágil de um código profissional.
      </p>

      <h2>Por que esconder coisas?</h2>
      <p>
        Quanto menos código externo enxerga seus detalhes internos, mais liberdade você tem para mudar a implementação sem quebrar quem usa sua classe. Esse é o princípio do <strong>menor privilégio</strong>: comece tudo o mais restrito possível, e só "abra" quando houver necessidade real. Isso reduz bugs, evita acoplamento e facilita refatoração.
      </p>

      <h2>Os quatro modificadores principais</h2>
      <p>
        C# tem seis modificadores de acesso, mas quatro deles cobrem 95% dos casos. Vamos do mais aberto ao mais fechado:
      </p>
      <pre><code>{`public class Conta
{
    // public: qualquer código de qualquer projeto pode usar
    public string Titular { get; init; } = "";

    // internal: visível apenas dentro do mesmo projeto/assembly
    internal int CodigoInterno { get; set; }

    // protected: visível para esta classe e suas filhas (subclasses)
    protected decimal LimiteCredito { get; set; }

    // private: SÓ esta própria classe enxerga (o padrão se você omite)
    private decimal saldo;

    public void Depositar(decimal valor) => saldo += valor;
    public decimal ConsultarSaldo() => saldo;
}`}</code></pre>
      <p>
        Note: <code>private</code> é o padrão para membros se você não escrever modificador algum (em classes). Para classes de nível superior, o padrão é <code>internal</code>.
      </p>

      <h2><code>public</code>: a porta da frente</h2>
      <p>
        Use <code>public</code> só naquilo que outras partes do programa <em>precisam</em> chamar. Pense em uma <em>API</em> — o conjunto de métodos e propriedades que sua classe oferece. Quanto menor a API pública, menos coisa você se compromete a manter estável.
      </p>
      <pre><code>{`// Uso público em outro arquivo:
var c = new Conta { Titular = "Ana" };
c.Depositar(500m);
Console.WriteLine(c.ConsultarSaldo());`}</code></pre>

      <h2><code>private</code>: estritamente íntimo</h2>
      <p>
        Tudo que é detalhe de implementação — como o campo <code>saldo</code> ou um método auxiliar — deve ser <code>private</code>. Assim, você pode trocar o tipo, renomear ou refatorar sem que ninguém de fora perceba.
      </p>
      <pre><code>{`public class Calculadora
{
    public int Somar(int a, int b)
    {
        return Validar(a) + Validar(b); // chama método privado
    }

    private int Validar(int x)
    {
        if (x < 0) throw new ArgumentException("Negativo não suportado.");
        return x;
    }
}`}</code></pre>

      <h2><code>protected</code>: para a família (herança)</h2>
      <p>
        <code>protected</code> torna o membro invisível para o mundo externo, mas visível para classes <strong>filhas</strong>. É útil quando você projeta uma classe-base que oferece "ferramentas" só para subclasses usarem.
      </p>
      <pre><code>{`public class Veiculo
{
    protected void RegistrarLog(string evento)
    {
        Console.WriteLine($"[LOG] {DateTime.Now:T} - {evento}");
    }
}

public class Carro : Veiculo
{
    public void Ligar()
    {
        RegistrarLog("Carro ligou"); // OK: filha enxerga protected
    }
}

// Em outro lugar:
// new Carro().RegistrarLog("oi"); // ERRO: protected não é público`}</code></pre>

      <h2><code>internal</code>: dentro do projeto</h2>
      <p>
        Um <em>assembly</em> é o arquivo <code>.dll</code> ou <code>.exe</code> gerado pelo seu projeto. <code>internal</code> diz: "só código que está sendo compilado junto comigo pode ver isto". Útil para tipos que você usa internamente em uma biblioteca, mas que não quer expor para quem instalar o pacote.
      </p>
      <pre><code>{`// Dentro do projeto MeuApp.dll
internal class GeradorDeId
{
    internal static Guid Novo() => Guid.NewGuid();
}

// Outro projeto que referencia MeuApp.dll NÃO consegue chamar GeradorDeId.`}</code></pre>

      <AlertBox type="info" title="InternalsVisibleTo para testes">
        Em projetos de teste, é comum querer acessar membros <code>internal</code>. Você pode liberar usando o atributo <code>[assembly: InternalsVisibleTo("MeuApp.Tests")]</code> no projeto principal.
      </AlertBox>

      <h2>Os dois "estendidos": <code>protected internal</code> e <code>private protected</code></h2>
      <p>
        Esses combinam regras dos dois mundos:
      </p>
      <ul>
        <li><strong><code>protected internal</code></strong>: visível para subclasses <em>OU</em> para qualquer código do mesmo assembly. É a união (OU lógico) dos dois.</li>
        <li><strong><code>private protected</code></strong> (C# 7.2+): visível apenas para subclasses que estão <em>dentro do mesmo assembly</em>. É a interseção (E lógico) — mais restritivo que ambos.</li>
      </ul>
      <pre><code>{`public class Base
{
    protected internal int A; // filhas (mesmo de outro projeto) OU mesmo assembly
    private protected int B;  // SÓ filhas dentro do mesmo assembly
}`}</code></pre>

      <h2>Visibilidade assimétrica em propriedades</h2>
      <p>
        Um truque elegante: a propriedade pode ter <code>get</code> público e <code>set</code> mais restrito. Assim, todo mundo lê, mas só a própria classe (ou subclasses) escreve.
      </p>
      <pre><code>{`public class Pedido
{
    public decimal Total { get; private set; }       // ler: todos; escrever: só esta classe
    public string Status { get; protected set; } = "Novo"; // escrever: filhas também

    public void Pagar(decimal valor)
    {
        Total += valor;
        Status = "Pago";
    }
}`}</code></pre>

      <AlertBox type="warning" title="Não confunda private com seguro">
        <code>private</code> protege contra acesso acidental, mas <em>não</em> é segurança contra usuários mal-intencionados — via <strong>reflexão</strong> (uma técnica avançada que veremos depois) é possível ler até campos privados. Para dados sensíveis (senhas, chaves), use criptografia, não só visibilidade.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Marcar tudo como <code>public</code></strong>: quebra encapsulamento e amarra você a manter cada detalhe estável.</li>
        <li><strong>Usar <code>internal</code> esperando que filhas em outro projeto enxerguem</strong>: não enxergam — para isso, use <code>protected</code> ou <code>protected internal</code>.</li>
        <li><strong>Esquecer que <code>private</code> é o padrão</strong>: um método sem modificador é privado, não público.</li>
        <li><strong>Usar <code>protected</code> em uma classe <code>sealed</code></strong>: como ela não pode ter filhas, <code>protected</code> equivale a <code>private</code> e o compilador avisa.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>public</code>: visível para todo mundo.</li>
        <li><code>internal</code>: visível dentro do mesmo assembly (projeto).</li>
        <li><code>protected</code>: visível para a própria classe e suas subclasses.</li>
        <li><code>private</code>: visível só dentro da própria classe (padrão).</li>
        <li><code>protected internal</code> e <code>private protected</code> combinam regras.</li>
        <li>Use o <strong>menor privilégio</strong> necessário; abra só quando for preciso.</li>
        <li>Propriedades podem ter <code>get</code> e <code>set</code> com visibilidades diferentes.</li>
      </ul>
    </PageContainer>
  );
}
