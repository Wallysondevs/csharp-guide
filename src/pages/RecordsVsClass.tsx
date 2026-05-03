import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RecordsVsClass() {
  return (
    <PageContainer
      title="Records: classes com igualdade por valor"
      subtitle="Aprenda a usar records — o jeito moderno de C# para criar tipos imutáveis com igualdade automática e sintaxe enxuta."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine duas notas de R$ 50 idênticas: uma na sua carteira, outra na minha. Embora sejam objetos físicos diferentes, do ponto de vista do que importa (o valor monetário) elas são <em>iguais</em>. Agora pense em duas pessoas chamadas "Maria, 30 anos": fisicamente são pessoas diferentes — não basta ter o mesmo nome para serem a mesma pessoa. Em programação, esses dois mundos têm tipos diferentes: <strong>classes</strong> (igualdade por referência, "são o mesmo objeto?") e <strong>records</strong> (igualdade por valor, "têm os mesmos dados?"). Records, introduzidos no C# 9, deixaram fácil escrever tipos imutáveis e comparáveis sem dezenas de linhas de boilerplate.
      </p>

      <h2>Declarando um record</h2>
      <p>
        A forma mais curta usa um <strong>construtor primário</strong> direto na declaração. O compilador cria, sozinho, propriedades <code>init-only</code>, métodos <code>Equals</code>, <code>GetHashCode</code>, <code>ToString</code> e suporte a deconstrução.
      </p>
      <pre><code>{`// Sintaxe enxuta com construtor primário
public record Ponto(double X, double Y);

var a = new Ponto(1, 2);
Console.WriteLine(a);          // Ponto { X = 1, Y = 2 }
Console.WriteLine(a.X);        // 1
Console.WriteLine(a.GetType()); // Ponto`}</code></pre>
      <p>
        Em uma única linha você ganhou: duas propriedades imutáveis, igualdade por valor, formatação automática para debug e até deconstrução (veremos abaixo). A mesma classe equivalente teria 30+ linhas escritas à mão.
      </p>

      <h2>Igualdade por valor: a diferença que muda tudo</h2>
      <p>
        Compare como classes e records se comportam ao serem comparados. Mesmo dois objetos diferentes na memória, se têm os mesmos dados, são considerados iguais para o record:
      </p>
      <pre><code>{`public class PontoClasse
{
    public double X { get; init; }
    public double Y { get; init; }
}

public record PontoRecord(double X, double Y);

var c1 = new PontoClasse { X = 1, Y = 2 };
var c2 = new PontoClasse { X = 1, Y = 2 };
Console.WriteLine(c1 == c2); // False (compara referências)

var r1 = new PontoRecord(1, 2);
var r2 = new PontoRecord(1, 2);
Console.WriteLine(r1 == r2); // True (compara valores!)`}</code></pre>

      <AlertBox type="info" title="Por que isso importa?"
      >
        Igualdade por valor é o que você quer em <strong>DTOs</strong> (objetos de transferência de dados), parâmetros, cache keys, eventos, mensagens de fila — tudo que representa "um pacote de dados", não "uma identidade no mundo". Records evitam bugs sutis de comparação errada.
      </AlertBox>

      <h2>Imutabilidade e <code>with</code>-expression</h2>
      <p>
        Records são imutáveis por padrão (propriedades <code>init</code>). Mas como você muda algo? Você não muda — você cria uma <strong>cópia modificada</strong> usando a expressão <code>with</code>. É como fotocopiar um documento e mudar uma única linha; o original fica intacto.
      </p>
      <pre><code>{`public record Pessoa(string Nome, int Idade);

var maria = new Pessoa("Maria", 30);
var mariaMaisVelha = maria with { Idade = 31 };

Console.WriteLine(maria);          // Pessoa { Nome = Maria, Idade = 30 }
Console.WriteLine(mariaMaisVelha); // Pessoa { Nome = Maria, Idade = 31 }`}</code></pre>
      <p>
        Isso é fundamental em código <em>funcional</em> e em arquiteturas como Redux/MVU, onde modificar dado existente é proibido — você só produz novos estados.
      </p>

      <h2>Deconstrução automática</h2>
      <p>
        Como o record conhece suas próprias propriedades, ele gera um método <code>Deconstruct</code>. Você pode "desempacotar" um record em variáveis com a sintaxe de tupla:
      </p>
      <pre><code>{`var p = new Ponto(3, 4);
var (x, y) = p; // deconstrução
Console.WriteLine(x + y); // 7

// Em um switch:
string Quadrante(Ponto p) => p switch
{
    (> 0, > 0) => "I",
    (< 0, > 0) => "II",
    (< 0, < 0) => "III",
    (> 0, < 0) => "IV",
    _          => "Eixo ou origem"
};`}</code></pre>

      <h2><code>record class</code> vs <code>record struct</code></h2>
      <p>
        Por padrão, <code>record</code> equivale a <code>record class</code> — alocado no <em>heap</em> (área de memória de objetos, com coletor de lixo). Desde C# 10, você também pode declarar <code>record struct</code>, alocado no <em>stack</em> (área de chamadas, ultra-rápida). A diferença muda performance e semântica:
      </p>
      <pre><code>{`// record class (default): tipo por referência, na heap
public record class Cliente(string Nome, string Email);

// record struct: tipo por valor, na stack
public readonly record struct Coordenada(double Lat, double Lng);

// Use record struct para tipos pequenos e muito usados em loops apertados
var coord = new Coordenada(-23.55, -46.63);`}</code></pre>
      <p>
        A regra prática: use <code>record struct</code> apenas para tipos pequenos (menos de 16 bytes), imutáveis e usados em alta frequência. Em todos os outros casos, <code>record</code> (class) é o padrão seguro.
      </p>

      <h2>Records também herdam (com cuidado)</h2>
      <p>
        Você pode estender um record com outro. A igualdade leva em conta o tipo concreto — então um <code>Animal</code> com os mesmos dados de um <code>Cachorro</code> não é igual ao Cachorro.
      </p>
      <pre><code>{`public record Animal(string Nome);
public record Cachorro(string Nome, string Raca) : Animal(Nome);

var a = new Animal("Rex");
var c = new Cachorro("Rex", "Labrador");
Console.WriteLine(a == c); // False — tipos diferentes`}</code></pre>

      <AlertBox type="warning" title="Cuidado com referências aninhadas"
      >
        A igualdade por valor de um record compara <em>cada propriedade</em>. Se uma propriedade for uma <code>List&lt;T&gt;</code> ou outro tipo por referência, a comparação será por referência, não pelos itens da lista. Para listas, use coleções imutáveis ou implemente comparação custom.
      </AlertBox>

      <h2>Quando usar record vs class</h2>
      <table>
        <thead>
          <tr><th>Use record quando...</th><th>Use class quando...</th></tr>
        </thead>
        <tbody>
          <tr><td>Os dados representam um valor (DTO, evento, configuração)</td><td>O objeto representa uma entidade com identidade própria</td></tr>
          <tr><td>Você quer imutabilidade por padrão</td><td>Você precisa modificar o objeto várias vezes</td></tr>
          <tr><td>Igualdade por valor faz sentido</td><td>Igualdade por referência faz sentido (mesmo objeto na memória)</td></tr>
          <tr><td>O objeto é pequeno e simples</td><td>O objeto tem comportamento rico e estado complexo</td></tr>
        </tbody>
      </table>

      <h2>Exemplo completo: pipeline de eventos</h2>
      <p>
        Records brilham em arquiteturas orientadas a evento. Cada evento é um pacote imutável de dados:
      </p>
      <pre><code>{`public abstract record EventoDominio(DateTime OcorridoEm);
public record PedidoCriado(Guid Id, decimal Total, DateTime OcorridoEm)
    : EventoDominio(OcorridoEm);
public record PedidoPago(Guid Id, decimal Valor, DateTime OcorridoEm)
    : EventoDominio(OcorridoEm);

void Processar(EventoDominio e)
{
    switch (e)
    {
        case PedidoCriado p:
            Console.WriteLine($"Novo pedido {p.Id} de {p.Total:C}");
            break;
        case PedidoPago p:
            Console.WriteLine($"Pedido {p.Id} pago: {p.Valor:C}");
            break;
    }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar modificar uma propriedade após a construção</strong>: como elas são <code>init</code>, o compilador bloqueia. Use <code>with</code> para criar variação.</li>
        <li><strong>Esperar igualdade por valor com listas dentro</strong>: comparar dois records que contêm listas compara as referências dessas listas, não o conteúdo.</li>
        <li><strong>Usar <code>record struct</code> grande</strong>: structs grandes são copiados a cada atribuição, o que mata performance. Mantenha pequenos e prefira <code>readonly record struct</code>.</li>
        <li><strong>Usar record para entidade do EF Core</strong>: entidades costumam mudar e ter identidade. Em geral, use <em>class</em> para elas e records para DTOs.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>record</code> gera, em uma linha, propriedades imutáveis, igualdade por valor, <code>ToString</code> e deconstrução.</li>
        <li><code>with</code>-expression cria cópias modificadas sem alterar o original.</li>
        <li><code>record class</code> (default) vai na heap; <code>record struct</code> vai na stack.</li>
        <li>Compare records com <code>==</code> e funciona como esperado para valores.</li>
        <li>Use record para DTOs, eventos, mensagens; use class para entidades com identidade.</li>
        <li>Cuidado com propriedades de tipo referência (listas, dicionários): a comparação é por referência.</li>
      </ul>
    </PageContainer>
  );
}
