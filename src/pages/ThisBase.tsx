import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ThisBase() {
  return (
    <PageContainer
      title="As palavras-chave this e base"
      subtitle="Duas palavras curtas que resolvem ambiguidade, encadeiam construtores e dão acesso à classe pai. Indispensáveis em POO."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Quando você está numa reunião de família e diz "passa o sal", todo mundo entende. Mas se há dois "Joãos" na mesa, você precisa especificar: "João pai, passa o sal". Em programação acontece a mesma coisa: dentro de um método, quando um parâmetro tem o mesmo nome de um campo, ou quando uma classe filha precisa chamar o método "do pai", você precisa de palavras que apontem com clareza para <em>quem</em> está falando. Em C#, essas palavras são <code>this</code> (a instância atual) e <code>base</code> (a classe pai).
      </p>

      <h2><code>this</code> para desambiguar</h2>
      <p>
        O uso mais comum: você tem um campo chamado <code>nome</code> e um parâmetro do construtor também chamado <code>nome</code>. Quem é quem? Por padrão, o nome local "ganha", e o campo fica esquecido. <code>this.nome</code> diz: "este aqui é o campo da instância".
      </p>
      <pre><code>{`public class Pessoa
{
    private string nome;

    public Pessoa(string nome)
    {
        // Sem 'this', você atribuiria o parâmetro a si mesmo (bug silencioso!)
        this.nome = nome;
    }
}`}</code></pre>

      <h2><code>this</code> como referência ao próprio objeto</h2>
      <p>
        <code>this</code> também pode ser usado como argumento, para passar "eu mesmo" para outro método. Isso aparece, por exemplo, em padrões fluentes ou quando um objeto se registra em um observador.
      </p>
      <pre><code>{`public class Botao
{
    private readonly EventoCentral central;

    public Botao(EventoCentral central)
    {
        this.central = central;
        // Passa o próprio botão para se registrar como inscrito
        central.Registrar(this);
    }
}

public class EventoCentral
{
    private readonly List<Botao> inscritos = new();
    public void Registrar(Botao b) => inscritos.Add(b);
}`}</code></pre>

      <h2><code>this(...)</code>: encadeando construtores</h2>
      <p>
        Quando uma classe tem vários construtores e você quer que um chame o outro, use <code>: this(...)</code> logo após a assinatura. Isso evita repetir lógica de inicialização.
      </p>
      <pre><code>{`public class Cliente
{
    public string Nome { get; }
    public string Email { get; }
    public bool Ativo { get; private set; }

    public Cliente(string nome, string email)
    {
        Nome = nome;
        Email = email;
        Ativo = true;
    }

    // Construtor curto que delega para o completo
    public Cliente(string nome) : this(nome, "sem-email@indefinido")
    {
        // O corpo aqui roda DEPOIS do this(...) terminar
    }
}`}</code></pre>

      <AlertBox type="info" title="Ordem de execução">
        Quando você escreve <code>: this(...)</code> ou <code>: base(...)</code>, esse encadeamento roda <em>antes</em> do corpo do construtor que você está escrevendo. É como dizer "primeiro faça aquilo, depois faça isto".
      </AlertBox>

      <h2><code>base.Metodo()</code>: chamando o método da classe pai</h2>
      <p>
        Quando a classe filha sobrescreve um método da pai com <code>override</code>, ela pode querer <em>complementar</em> o que o pai faz, não substituir totalmente. <code>base.Metodo()</code> chama a versão original.
      </p>
      <pre><code>{`public class Animal
{
    public virtual void Apresentar()
    {
        Console.WriteLine("Sou um animal.");
    }
}

public class Cachorro : Animal
{
    public override void Apresentar()
    {
        base.Apresentar(); // mantém o comportamento original
        Console.WriteLine("E mais especificamente, um cachorro.");
    }
}

new Cachorro().Apresentar();
// Sou um animal.
// E mais especificamente, um cachorro.`}</code></pre>

      <h2><code>: base(...)</code> no construtor da filha</h2>
      <p>
        A classe pai pode exigir parâmetros no seu próprio construtor. A filha precisa "passar adiante" esses dados usando <code>: base(...)</code>. Sem isso, o compilador acusa erro.
      </p>
      <pre><code>{`public class Veiculo
{
    public string Placa { get; }
    public Veiculo(string placa)
    {
        Placa = placa;
    }
}

public class Moto : Veiculo
{
    public int Cilindradas { get; }

    public Moto(string placa, int cilindradas) : base(placa)
    {
        Cilindradas = cilindradas;
    }
}`}</code></pre>

      <h2>Quando NÃO usar <code>this</code></h2>
      <p>
        Em código moderno, <code>this</code> só é necessário para desambiguar. Escrever <code>this.</code> em todo lugar é considerado ruído visual — o compilador entende perfeitamente sem ele. Use só quando há choque de nomes ou quando você precisa passar a instância como argumento.
      </p>
      <pre><code>{`public class Pedido
{
    public decimal Total { get; private set; }

    public void AdicionarItem(decimal valor)
    {
        // Não precisa de this.Total: não há ambiguidade
        Total += valor;
    }
}`}</code></pre>

      <AlertBox type="warning" title="base só funciona com herança"
      >
        <code>base</code> só faz sentido dentro de uma classe que herda de outra. Em uma classe sem pai explícito (que herda apenas de <code>object</code>), <code>base.Metodo()</code> só consegue chamar métodos do próprio <code>object</code>, como <code>ToString()</code> ou <code>GetHashCode()</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>this</code> em construtor</strong>: <code>nome = nome;</code> atribui o parâmetro a si mesmo e o campo fica vazio. Sem erro de compilação, com bug silencioso.</li>
        <li><strong>Usar <code>this</code> em método estático</strong>: métodos <code>static</code> não pertencem a uma instância, então <code>this</code> simplesmente não existe nesse contexto.</li>
        <li><strong>Tentar chamar <code>base</code> sem o objeto pai esperar</strong>: se a pai não definiu o método como <code>virtual</code>, a filha não pode <code>override</code>, e <code>base.Metodo()</code> só compila se o método realmente existir.</li>
        <li><strong>Confundir <code>: base(...)</code> e <code>base.Metodo()</code></strong>: o primeiro só pode aparecer no cabeçalho do construtor; o segundo é chamada normal dentro do corpo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>this</code> = "este objeto aqui" — útil para desambiguar e para passar a instância adiante.</li>
        <li><code>this(...)</code> no cabeçalho de construtor = chama outro construtor da mesma classe.</li>
        <li><code>base.Metodo()</code> = invoca a versão da classe pai.</li>
        <li><code>: base(...)</code> no cabeçalho = passa argumentos para o construtor da pai.</li>
        <li>Use <code>this</code> com moderação: só onde realmente esclarece o código.</li>
      </ul>
    </PageContainer>
  );
}
