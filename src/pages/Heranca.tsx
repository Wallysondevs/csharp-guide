import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Heranca() {
  return (
    <PageContainer
      title="Herança: reaproveitando comportamento"
      subtitle="Aprenda a derivar uma classe a partir de outra para reaproveitar campos, métodos e comportamentos — sem repetir código."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Na biologia, um cachorro é um mamífero, e mamífero é um animal. Tudo que vale para "animal" (respira, se alimenta) automaticamente vale para "cachorro", e o cachorro adiciona seus próprios comportamentos (latir, abanar o rabo). Em código, <strong>herança</strong> é exatamente esse mecanismo: uma classe filha herda automaticamente os membros da classe pai e pode acrescentar ou modificar comportamentos. Isso evita repetir código e cria hierarquias naturais — desde que você as use com bom senso.
      </p>

      <h2>Sintaxe básica: dois pontos e o nome do pai</h2>
      <p>
        Para fazer uma classe herdar de outra, basta usar <code>:</code> seguido do nome da classe pai (chamada também de <em>base</em> ou <em>superclasse</em>). A classe filha (também chamada de <em>derivada</em> ou <em>subclasse</em>) automaticamente ganha tudo que é <code>public</code> ou <code>protected</code> da pai.
      </p>
      <pre><code>{`public class Animal
{
    public string Nome { get; set; } = "";

    public void Respirar()
    {
        Console.WriteLine($"{Nome} está respirando.");
    }
}

// Cachorro herda Nome e Respirar() automaticamente
public class Cachorro : Animal
{
    public void Latir()
    {
        Console.WriteLine($"{Nome}: Au au!");
    }
}

var rex = new Cachorro { Nome = "Rex" };
rex.Respirar(); // Rex está respirando.
rex.Latir();    // Rex: Au au!`}</code></pre>

      <h2>Single inheritance: só um pai</h2>
      <p>
        Diferente de algumas linguagens (como C++), C# permite herdar de <strong>uma única classe</strong> de cada vez. Não existe <code>class Filha : Pai1, Pai2</code>. A motivação é evitar o famoso "problema do diamante", quando dois pais têm um método com o mesmo nome e o filho não sabe qual usar. Para combinar comportamentos de várias fontes, C# oferece <strong>interfaces</strong> (vistas adiante).
      </p>

      <h2><code>base(...)</code>: passando argumentos para o construtor da pai</h2>
      <p>
        Se a pai tem um construtor com parâmetros, a filha precisa indicar como chamá-lo, usando <code>: base(...)</code> no cabeçalho do seu próprio construtor.
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

      <h2><code>virtual</code> e <code>override</code>: deixando a filha personalizar</h2>
      <p>
        Por padrão, métodos em C# <strong>não podem</strong> ser sobrescritos por filhas. Para permitir, marque o método na pai como <code>virtual</code>. Então a filha usa <code>override</code> para fornecer sua própria versão. <code>virtual</code> significa "este método pode ser substituído"; <code>override</code> significa "estou substituindo".
      </p>
      <pre><code>{`public class Animal
{
    public virtual void EmitirSom()
    {
        Console.WriteLine("Som genérico de animal.");
    }
}

public class Gato : Animal
{
    public override void EmitirSom()
    {
        Console.WriteLine("Miau!");
    }
}

public class Vaca : Animal
{
    public override void EmitirSom()
    {
        Console.WriteLine("Muuuu!");
    }
}

Animal a = new Gato();
a.EmitirSom(); // Miau! (a versão da filha é executada)`}</code></pre>
      <p>
        Esse é o coração do <strong>polimorfismo</strong>: a variável <code>a</code> tem tipo <code>Animal</code>, mas guarda um <code>Gato</code>; o C# chama, em tempo de execução, a versão correta. Veremos isso a fundo no próximo capítulo.
      </p>

      <AlertBox type="info" title="base.Metodo() para complementar"
      >
        Dentro do <code>override</code>, você pode chamar <code>base.EmitirSom()</code> para executar a versão da pai antes ou depois da sua nova lógica. Útil para aumentar comportamento, não substituir totalmente.
      </AlertBox>

      <h2><code>sealed override</code>: filha que bloqueia netas</h2>
      <p>
        Se uma classe sobrescreve um método e quer impedir que outra classe descendente também sobrescreva, use <code>sealed override</code>. É a forma de "fechar" a cadeia naquele método específico.
      </p>
      <pre><code>{`public class Cachorro : Animal
{
    public sealed override void EmitirSom()
    {
        Console.WriteLine("Au au!");
    }
}

public class Bulldog : Cachorro
{
    // public override void EmitirSom() { } // ERRO: foi selado
}`}</code></pre>

      <h2>Campos protegidos: acesso para a família</h2>
      <p>
        Use <code>protected</code> para membros que a pai expõe apenas para suas filhas (não para o mundo externo). Essa é a forma "amigável" de compartilhar estado interno em uma hierarquia.
      </p>
      <pre><code>{`public class Conta
{
    protected decimal saldo;

    public void Depositar(decimal valor) => saldo += valor;
}

public class ContaPoupanca : Conta
{
    public void Render(decimal taxa)
    {
        // OK: 'saldo' é protected, então a filha enxerga
        saldo += saldo * taxa;
    }
}`}</code></pre>

      <h2>Relação IS-A: o teste para usar herança</h2>
      <p>
        A pergunta de ouro antes de criar uma herança: "X <em>é um</em> Y?". Cachorro <em>é um</em> Animal? Sim → herança faz sentido. Carro <em>é um</em> Motor? Não, carro <em>tem um</em> motor → use <strong>composição</strong> (uma propriedade do tipo Motor dentro de Carro). Confundir "é um" com "tem um" é a fonte número 1 de hierarquias bizarras.
      </p>
      <pre><code>{`// Composição (preferível): Carro TEM UM motor
public class Motor
{
    public int Cilindradas { get; init; }
    public void Ligar() => Console.WriteLine("Vrum!");
}

public class Carro
{
    private readonly Motor motor;
    public Carro(Motor m) { motor = m; }
    public void Ligar() => motor.Ligar();
}`}</code></pre>

      <AlertBox type="warning" title="Quando NÃO usar herança">
        Se a única motivação é "reaproveitar três métodos", prefira composição (incluir um objeto auxiliar) ou interfaces. Hierarquias profundas (mais de 2-3 níveis) tendem a virar pesadelo de manutenção. A regra é: <em>composição em vez de herança</em>, sempre que houver dúvida.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>: base(...)</code> quando a pai tem construtor com parâmetros</strong>: o compilador acusa erro pedindo o construtor da pai.</li>
        <li><strong>Tentar <code>override</code> sem <code>virtual</code> na pai</strong>: o método não é "abrível" — você só consegue ocultar com <code>new</code> (assunto do próximo capítulo).</li>
        <li><strong>Herdar só para reaproveitar código</strong>: gera acoplamento desnecessário. Use composição.</li>
        <li><strong>Tornar um campo <code>public</code> na pai e contar com isso na filha</strong>: a filha já enxerga membros <code>protected</code>, sem precisar de <code>public</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>A sintaxe <code>class Filha : Pai</code> faz a Filha herdar membros públicos e protegidos.</li>
        <li>C# permite herança simples — apenas uma classe pai.</li>
        <li><code>: base(arg)</code> passa argumentos ao construtor da pai.</li>
        <li><code>virtual</code> + <code>override</code> permitem que a filha personalize um método.</li>
        <li><code>sealed override</code> impede netas de sobrescrever de novo.</li>
        <li><code>protected</code> compartilha membros com a "família" sem expor ao mundo.</li>
        <li>Use o teste IS-A; se não bater, prefira composição.</li>
      </ul>
    </PageContainer>
  );
}
