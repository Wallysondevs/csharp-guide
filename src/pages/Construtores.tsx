import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Construtores() {
  return (
    <PageContainer
      title="Construtores: dando vida aos objetos"
      subtitle="Construtores são as fábricas dos seus objetos. Aprenda a garantir que cada instância nasça em um estado válido."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Imagine que toda vez que um bebê nasce, ele já precisa ter nome registrado, data de nascimento e tipo sanguíneo definidos — caso contrário, vira um problema. Em C#, o <strong>construtor</strong> é o "cartório" que garante que todo objeto nasça com as informações essenciais já preenchidas. É um método especial chamado automaticamente quando você usa <code>new</code>. Sem entender construtores, você cria objetos quebrados, com campos vazios e bugs imprevisíveis.
      </p>

      <h2>Construtor padrão (sem parâmetros)</h2>
      <p>
        Se você não escreve nenhum construtor, o compilador <strong>fabrica um sozinho</strong>: o chamado <em>construtor padrão</em>, que não recebe nada e apenas inicializa os campos com seus valores default (0 para <code>int</code>, <code>null</code> para referências, <code>false</code> para <code>bool</code>). É por isso que <code>new Carro()</code> funciona mesmo sem você ter escrito nada.
      </p>
      <pre><code>{`public class Animal
{
    public string Nome { get; set; } = "Sem nome";
    public int Idade { get; set; }
    // Nenhum construtor escrito. O compilador cria:
    // public Animal() { }
}

var bicho = new Animal(); // Funciona; Nome = "Sem nome", Idade = 0`}</code></pre>

      <h2>Construtores com parâmetros</h2>
      <p>
        Para forçar quem cria o objeto a fornecer dados essenciais, escreva um construtor explícito. Note que ele tem o <strong>mesmo nome da classe</strong> e <strong>nenhum tipo de retorno</strong> (nem <code>void</code>).
      </p>
      <pre><code>{`public class Pessoa
{
    public string Nome { get; }
    public DateTime Nascimento { get; }

    // Construtor: obriga a passar nome e data de nascimento
    public Pessoa(string nome, DateTime nascimento)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome obrigatório.", nameof(nome));

        Nome = nome;
        Nascimento = nascimento;
    }
}

var maria = new Pessoa("Maria", new DateTime(1990, 5, 12));
// var x = new Pessoa(); // ERRO: não existe mais construtor sem parâmetros`}</code></pre>
      <p>
        Quando você define <em>qualquer</em> construtor explícito, o compilador deixa de criar o construtor padrão automaticamente. Se ainda quiser permitir <code>new Pessoa()</code>, precisa adicionar um construtor sem parâmetros à mão.
      </p>

      <AlertBox type="info" title="Por que validar no construtor?">
        Validar no construtor garante que <strong>nunca</strong> exista uma instância em estado inválido. Se a regra "nome não pode ser vazio" estiver no construtor, você pode confiar nessa regra em todo o resto do código.
      </AlertBox>

      <h2>Encadeamento com <code>this(...)</code></h2>
      <p>
        Quando você quer várias formas de criar o mesmo objeto, sem repetir código, use <code>this(...)</code> para um construtor chamar outro da mesma classe.
      </p>
      <pre><code>{`public class Retangulo
{
    public double Largura { get; }
    public double Altura { get; }

    public Retangulo(double largura, double altura)
    {
        Largura = largura;
        Altura = altura;
    }

    // Quadrado é só um retângulo com largura == altura
    public Retangulo(double lado) : this(lado, lado) { }
}

var quadrado = new Retangulo(5);     // chama o construtor de 2 args via this(...)
var retang   = new Retangulo(4, 7);`}</code></pre>

      <h2>Encadeamento com <code>base(...)</code> em herança</h2>
      <p>
        Quando uma classe filha herda de uma pai, o construtor da filha precisa garantir que o construtor da pai também rode (afinal, a pai pode ter regras próprias). Use <code>base(...)</code> para passar os argumentos.
      </p>
      <pre><code>{`public class Veiculo
{
    public string Modelo { get; }
    public Veiculo(string modelo) { Modelo = modelo; }
}

public class Caminhao : Veiculo
{
    public int CapacidadeKg { get; }

    public Caminhao(string modelo, int capacidade)
        : base(modelo) // chama o construtor da pai
    {
        CapacidadeKg = capacidade;
    }
}`}</code></pre>

      <h2>Construtor estático</h2>
      <p>
        Existe também o <strong>construtor estático</strong>, marcado com <code>static</code>. Ele roda <em>uma única vez</em>, automaticamente, antes de qualquer uso da classe. Serve para inicializar dados estáticos (compartilhados por todas as instâncias).
      </p>
      <pre><code>{`public class Configuracao
{
    public static string Versao { get; }

    // Construtor estático: roda uma vez, sem parâmetros, sem modificador de acesso
    static Configuracao()
    {
        Versao = "1.0.0-" + DateTime.UtcNow.Year;
        Console.WriteLine("Configuracao inicializada.");
    }
}`}</code></pre>

      <h2>Primary constructors (C# 12)</h2>
      <p>
        A partir do C# 12, você pode declarar parâmetros direto no cabeçalho da classe — o chamado <strong>construtor primário</strong>. Eles ficam disponíveis em qualquer membro da classe, sem precisar atribuir manualmente a campos. Ótimo para reduzir boilerplate.
      </p>
      <pre><code>{`// Construtor primário: parâmetros disponíveis em todo o corpo
public class Funcionario(string nome, decimal salario)
{
    public string Nome { get; } = nome;
    public decimal Salario { get; private set; } = salario;

    public void Aumentar(decimal percentual)
    {
        Salario += Salario * percentual;
        Console.WriteLine($"{nome} agora ganha {Salario:C}.");
    }
}

var f = new Funcionario("Ana", 5000m);
f.Aumentar(0.10m); // Ana agora ganha R$ 5.500,00.`}</code></pre>

      <h2>Object initializer: o atalho elegante</h2>
      <p>
        Quando o construtor não cobre todas as propriedades, você pode complementar com <strong>object initializer</strong>, usando chaves <code>{`{ }`}</code> logo após o <code>new</code>. Funciona com qualquer propriedade que tenha <code>set</code> ou <code>init</code>.
      </p>
      <pre><code>{`public class Carro
{
    public string Modelo { get; init; } = "";
    public string Cor { get; init; } = "";
    public int Ano { get; init; }
}

var c = new Carro
{
    Modelo = "Civic",
    Cor = "Preto",
    Ano = 2025
};`}</code></pre>

      <AlertBox type="warning" title="Object initializer roda DEPOIS do construtor">
        As atribuições do <code>{`{ }`}</code> ocorrem após o construtor terminar. Se sua validação está no construtor e o valor obrigatório vem só pelo initializer, a validação não funciona. Use <code>required</code> (C# 11+) para forçar a presença de propriedades.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar construtor padrão depois de criar um com parâmetros</strong>: o compilador deixa de fabricá-lo automaticamente.</li>
        <li><strong>Tentar usar <code>this</code> antes da chamada <code>: this(...)</code> ou <code>: base(...)</code></strong>: a inicialização da pai/encadeada acontece antes do corpo.</li>
        <li><strong>Esquecer que construtor estático não tem modificador de acesso</strong>: ele é sempre privado por natureza, controlado pelo runtime.</li>
        <li><strong>Misturar lógica pesada no construtor</strong>: chamar I/O, banco ou rede no construtor torna o objeto difícil de testar. Prefira métodos como <code>Carregar()</code> ou <em>factory methods</em>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Construtor é um método especial com o nome da classe e sem retorno.</li>
        <li>O construtor padrão só existe se você não definir nenhum.</li>
        <li><code>: this(...)</code> evita repetição entre construtores da mesma classe.</li>
        <li><code>: base(...)</code> chama o construtor da classe pai.</li>
        <li>Construtor <code>static</code> roda uma vez, automaticamente, para a classe.</li>
        <li>C# 12 traz construtores primários direto no cabeçalho da classe.</li>
        <li>Object initializer <code>{`{ ... }`}</code> roda depois do construtor.</li>
      </ul>
    </PageContainer>
  );
}
