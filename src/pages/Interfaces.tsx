import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Interfaces() {
  return (
    <PageContainer
      title="Interfaces: contratos puros entre classes"
      subtitle="Aprenda a definir contratos que classes podem assinar — possibilitando polimorfismo sem herança."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine uma tomada de parede. Qualquer aparelho que tenha o "plugue padrão" pode se conectar — não importa se é um liquidificador, um carregador ou uma TV. A tomada não se importa <em>como</em> o aparelho funciona por dentro; ela só exige que ele tenha o plugue certo. Em C#, uma <strong>interface</strong> é o "padrão de plugue" do código: um contrato que diz "se você quer ser tratado como X, precisa ter estes métodos". A classe que <em>implementa</em> a interface se compromete a respeitar esse contrato. Esse é o coração da flexibilidade em projetos grandes.
      </p>

      <h2>O que é uma interface?</h2>
      <p>
        Uma interface é, tradicionalmente, uma lista de assinaturas (nomes de métodos, propriedades, eventos) sem implementação. Ela diz "o que", não "como". Por convenção, nomes de interfaces começam com a letra <code>I</code> maiúscula.
      </p>
      <pre><code>{`// Definição de uma interface
public interface IPagavel
{
    decimal Valor { get; }
    void Pagar();
}`}</code></pre>
      <p>
        A interface acima diz: "qualquer coisa pagável precisa ter um <code>Valor</code> que se possa ler e um método <code>Pagar()</code>". Não há corpo nem campo privado — só o contrato.
      </p>

      <h2>Implementando uma interface</h2>
      <p>
        Uma classe declara que cumpre o contrato usando <code>:</code> seguido do nome da interface, igual à sintaxe de herança. A diferença: você pode implementar <strong>quantas interfaces quiser</strong>.
      </p>
      <pre><code>{`public class Fatura : IPagavel
{
    public decimal Valor { get; init; }
    public string Cliente { get; init; } = "";

    public void Pagar()
    {
        Console.WriteLine($"Fatura de {Cliente} ({Valor:C}) paga.");
    }
}

public class Salario : IPagavel
{
    public decimal Valor { get; init; }
    public string Funcionario { get; init; } = "";

    public void Pagar()
    {
        Console.WriteLine($"Salário de {Funcionario} ({Valor:C}) depositado.");
    }
}`}</code></pre>

      <h2>Polimorfismo via interface</h2>
      <p>
        O grande ganho: você pode tratar <code>Fatura</code> e <code>Salario</code> uniformemente como <code>IPagavel</code>, mesmo que não tenham nenhuma classe-pai em comum. Isso é polimorfismo desacoplado de hierarquia.
      </p>
      <pre><code>{`IPagavel[] pendentes =
{
    new Fatura  { Cliente = "Loja X", Valor = 1500m },
    new Salario { Funcionario = "Ana", Valor = 5000m }
};

foreach (var p in pendentes) p.Pagar();
// Fatura de Loja X (R$ 1.500,00) paga.
// Salário de Ana (R$ 5.000,00) depositado.`}</code></pre>

      <AlertBox type="info" title="Por que isso é poderoso?"
      >
        A função que processa pagamentos depende só do contrato <code>IPagavel</code>. Amanhã você cria <code>Comissao</code>, <code>Reembolso</code>, <code>Boleto</code>... todas implementam <code>IPagavel</code> e o processador funciona sem mudanças. Esse é o princípio da <strong>inversão de dependência</strong>.
      </AlertBox>

      <h2>Múltipla "herança" de interfaces</h2>
      <p>
        Diferente de classes (onde você só herda de uma), uma classe pode implementar <strong>várias interfaces</strong> ao mesmo tempo. Isso é como dizer "este objeto cumpre vários contratos diferentes simultaneamente".
      </p>
      <pre><code>{`public interface IComparavel
{
    int CompararCom(object outro);
}

public interface ISerializavel
{
    string ParaJson();
}

// Cumpre os DOIS contratos
public class Produto : IComparavel, ISerializavel
{
    public string Nome { get; init; } = "";
    public decimal Preco { get; init; }

    public int CompararCom(object outro)
        => outro is Produto p ? Preco.CompareTo(p.Preco) : 0;

    public string ParaJson()
        => $"{{\\"nome\\":\\"{Nome}\\",\\"preco\\":{Preco}}}";
}`}</code></pre>

      <h2>Interfaces da própria biblioteca .NET</h2>
      <p>
        O .NET é repleto de interfaces que você consumirá o tempo todo: <code>IEnumerable&lt;T&gt;</code> (algo iterável), <code>IDisposable</code> (algo que libera recursos), <code>IComparable&lt;T&gt;</code> (algo ordenável), <code>IEquatable&lt;T&gt;</code> (algo comparável por igualdade). Implementá-las faz sua classe ganhar superpoderes que se integram ao restante da plataforma.
      </p>
      <pre><code>{`public class Versao : IComparable<Versao>
{
    public int Major { get; init; }
    public int Minor { get; init; }

    public int CompareTo(Versao? outra)
    {
        if (outra is null) return 1;
        var diff = Major.CompareTo(outra.Major);
        return diff != 0 ? diff : Minor.CompareTo(outra.Minor);
    }
}

var versoes = new List<Versao>
{
    new() { Major = 2, Minor = 0 },
    new() { Major = 1, Minor = 5 },
    new() { Major = 1, Minor = 2 }
};
versoes.Sort(); // funciona porque implementamos IComparable<Versao>`}</code></pre>

      <h2>Default interface methods (C# 8+)</h2>
      <p>
        Desde C# 8, interfaces podem trazer <strong>implementações padrão</strong> nos seus métodos. Isso permite evoluir uma interface sem quebrar quem já a implementava. Use com moderação — em geral, o objetivo de uma interface é ser puramente um contrato.
      </p>
      <pre><code>{`public interface ILogador
{
    void Logar(string mensagem);

    // Implementação padrão: qualquer classe que implemente ILogador
    // ganha LogarErro de graça
    void LogarErro(string erro)
    {
        Logar($"[ERRO] {erro}");
    }
}

public class LogadorConsole : ILogador
{
    public void Logar(string mensagem) => Console.WriteLine(mensagem);
    // Não precisamos implementar LogarErro: a versão padrão funciona
}`}</code></pre>
      <p>
        Para chamar a versão default, você precisa converter para o tipo da interface: <code>((ILogador)log).LogarErro("falha");</code>
      </p>

      <AlertBox type="warning" title="Naming convention obrigatória de fato"
      >
        Não é obrigado pelo compilador, mas é convenção universal: nomes de interfaces começam com <code>I</code> maiúsculo (<code>IRepositorio</code>, <code>IUsuario</code>, <code>IClienteHttp</code>). Quebrar isso confunde leitores e ferramentas.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>public</code> ao implementar</strong>: métodos de interface são automaticamente públicos. Se você omitir <code>public</code> na classe, o compilador acusa erro.</li>
        <li><strong>Achar que pode instanciar uma interface</strong>: <code>new IPagavel()</code> não compila. Você só instancia classes concretas que a implementem.</li>
        <li><strong>Misturar herança com interface esperando o mesmo</strong>: classe abstrata pode oferecer estado e construtor; interface (tradicionalmente) não.</li>
        <li><strong>Criar uma interface com um único método para todo lado</strong>: as vezes um <code>delegate</code> ou um <code>Func&lt;T&gt;</code> resolveria com menos cerimônia.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Interface define um contrato: o que a classe precisa oferecer.</li>
        <li>Use <code>:</code> para implementar; uma classe pode implementar várias interfaces.</li>
        <li>Convencionalmente, nomes começam com <code>I</code> maiúsculo.</li>
        <li>Polimorfismo via interface desacopla código de qualquer hierarquia de herança.</li>
        <li>O .NET tem interfaces prontas (<code>IEnumerable</code>, <code>IDisposable</code>, etc.) que valem a pena implementar.</li>
        <li>C# 8+ permite implementação default em interfaces (use com cautela).</li>
      </ul>
    </PageContainer>
  );
}
