import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Deconstruction() {
  return (
    <PageContainer
      title="Deconstruction: desempacotando objetos"
      subtitle="Aprenda a abrir tuplas, records e classes em variáveis individuais com uma única linha — código mais legível, sem perder tipo."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Imagine que você recebe uma encomenda contendo três itens diferentes. Em vez de abrir a caixa, manter tudo dentro e ficar tirando um item por vez, seria mais prático esvaziar a caixa em três pratos separados, cada um já com seu nome. <strong>Deconstruction</strong> é exatamente isso em C#: um mecanismo para "esvaziar" um objeto composto em várias variáveis nomeadas, em uma única linha, com tipo preservado pelo compilador. Funciona com tuplas, records, KeyValuePair, e qualquer tipo que defina um método especial chamado <code>Deconstruct</code>.
      </p>

      <h2>Deconstrução de tuplas</h2>
      <p>
        O caso mais comum: tuplas. Você usa parênteses do lado esquerdo de uma atribuição e dá um nome a cada componente.
      </p>
      <pre><code>{`var ponto = (X: 3, Y: 4);

// Forma 1: var infere o tipo de cada variável
var (x, y) = ponto;
Console.WriteLine($"{x},{y}");   // 3,4

// Forma 2: tipos explícitos
(int a, int b) = ponto;

// Forma 3: misto, com descarte
var (_, somenteY) = ponto;
Console.WriteLine(somenteY);     // 4`}</code></pre>
      <p>
        O caractere <code>_</code> é um <strong>discard</strong> — uma promessa ao compilador de que aquele componente não será usado. É melhor que criar uma variável "ignorar" porque o compilador nem reserva slot para ela.
      </p>

      <h2>Implementando <code>Deconstruct</code> em uma classe</h2>
      <p>
        Para que uma classe (ou struct) sua possa ser desempacotada, basta declarar um método <code>Deconstruct</code> com parâmetros <code>out</code>. O compilador procura esse método pelo nome e pela quantidade de saídas.
      </p>
      <pre><code>{`public class Pessoa {
    public string Nome { get; }
    public int Idade { get; }
    public string Cidade { get; }

    public Pessoa(string nome, int idade, string cidade) {
        Nome = nome; Idade = idade; Cidade = cidade;
    }

    // Esse método permite usar: var (n, i, c) = pessoa;
    public void Deconstruct(out string nome, out int idade, out string cidade) {
        nome   = Nome;
        idade  = Idade;
        cidade = Cidade;
    }
}

var p = new Pessoa("Ana", 30, "São Paulo");
var (nome, idade, cidade) = p;
Console.WriteLine($"{nome}, {idade}, {cidade}");`}</code></pre>
      <p>
        Você pode declarar <strong>vários</strong> <code>Deconstruct</code> com aridades diferentes (1, 2, 3 saídas). O compilador escolhe o que casa com o número de variáveis do lado esquerdo, igual a sobrecarga de método.
      </p>

      <AlertBox type="info" title="Deconstruct via extension method">
        Não pode mudar uma classe de terceiro? Crie um método de extensão <code>Deconstruct</code>. O compilador aceita extensões, e você ganha o açúcar sintático sem alterar a biblioteca.
      </AlertBox>

      <h2>Records já vêm com Deconstruct</h2>
      <p>
        Quando você declara um <code>record</code> com parâmetros posicionais, o compilador <strong>gera automaticamente</strong> um <code>Deconstruct</code> com a mesma ordem e nomes dos parâmetros. Zero boilerplate.
      </p>
      <pre><code>{`public record Endereco(string Rua, string Cidade, string Cep);

var e = new Endereco("Rua A", "SP", "01000-000");
var (rua, cidade, cep) = e;            // gerado automaticamente
Console.WriteLine($"{rua} - {cidade}");

// Em loop:
var enderecos = new List<Endereco> {
    new("R1", "SP", "01001-000"),
    new("R2", "RJ", "20000-000"),
};
foreach (var (r, c, _) in enderecos) {
    Console.WriteLine($"{r} fica em {c}");
}`}</code></pre>

      <h2>Deconstruction em <code>foreach</code></h2>
      <p>
        Combinada com listas de tuplas, KeyValuePair (de dicionários) ou records, deconstruction torna iteração muito mais legível. Compare:
      </p>
      <pre><code>{`var precos = new Dictionary<string, decimal> {
    ["Cafe"]  = 5m,
    ["Pao"]   = 0.50m,
    ["Leite"] = 4.25m
};

// Antes:
foreach (var kv in precos) {
    Console.WriteLine($"{kv.Key}: {kv.Value}");
}

// Depois — extension Deconstruct vem do .NET:
foreach (var (produto, preco) in precos) {
    Console.WriteLine($"{produto}: {preco}");
}`}</code></pre>
      <p>
        <code>KeyValuePair&lt;TKey, TValue&gt;</code> ganhou um <code>Deconstruct</code> em .NET Core 2.0+. Por isso a forma <code>(k, v)</code> "simplesmente funciona" em qualquer dicionário.
      </p>

      <h2>Pattern matching também desconstrói</h2>
      <p>
        Em <code>switch</code> e <code>is</code>, padrões posicionais usam o mesmo <code>Deconstruct</code>. Isso permite condicionar lógica em formatos compostos sem código verboso.
      </p>
      <pre><code>{`public record Ponto(int X, int Y);

string Quadrante(Ponto p) => p switch {
    (0, 0)              => "Origem",
    (> 0, > 0)          => "Quadrante I",
    (< 0, > 0)          => "Quadrante II",
    (< 0, < 0)          => "Quadrante III",
    (> 0, < 0)          => "Quadrante IV",
    _                   => "Sobre eixo"
};

if (algumPonto is (var x, var y) && x == y) {
    Console.WriteLine($"Diagonal: {x}");
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com Deconstruct mal projetado">
        Se você expõe um <code>Deconstruct</code> com parâmetros em ordem confusa (ex.: <code>(out string cep, out string cidade, out string rua)</code> contra a ordem visual da casa), quem usa vai trocar valores. Mantenha a ordem natural de leitura ou documente claramente.
      </AlertBox>

      <h2>Deconstruction é só atribuição múltipla?</h2>
      <p>
        Quase. Existem três sutilezas que vale notar: (1) você pode misturar declaração e atribuição (declarar algumas variáveis e reaproveitar outras já existentes), (2) o tipo de cada componente é <strong>independentemente inferido</strong>, e (3) a ordem de avaliação é estritamente da esquerda para a direita.
      </p>
      <pre><code>{`int x = 0;
// 'y' é declarado aqui; 'x' é o que já existia
(x, int y) = (10, 20);
Console.WriteLine($"{x},{y}");   // 10,20

// Erro comum: misturar tipos incompatíveis
// (int a, int b) = ("x", 1);   // ERRO: string não converte para int

// Trocar duas variáveis em uma linha — clássico:
int a = 1, b = 2;
(a, b) = (b, a);
Console.WriteLine($"{a},{b}");   // 2,1`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Quantidade errada de variáveis:</strong> <code>var (a, b) = (1, 2, 3);</code> não compila. Aridades têm que casar.</li>
        <li><strong>Esquecer <code>out</code> nos parâmetros de <code>Deconstruct</code>:</strong> sem <code>out</code>, o compilador não reconhece.</li>
        <li><strong>Tentar desconstruir tipo sem suporte:</strong> compilador acusa CS8129. Implemente <code>Deconstruct</code> ou crie extension.</li>
        <li><strong>Confundir <code>(x, y) = ponto</code> com igualdade:</strong> à esquerda de <code>=</code> é deconstruct; em <code>if</code> seria erro.</li>
        <li><strong>Mudar nomes de propriedades sem atualizar Deconstruct:</strong> em records posicionais, o auto-gerado acompanha; em classes, é manual.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Deconstruction abre objetos compostos em várias variáveis em uma única linha.</li>
        <li>Tuplas e records suportam de forma nativa; classes precisam de método <code>Deconstruct(out ...)</code>.</li>
        <li>Funciona em <code>foreach</code>, em <code>switch</code> e em <code>is</code> — combinando com pattern matching.</li>
        <li>Use <code>_</code> para descartar componentes não usados.</li>
        <li>Pode misturar declaração e atribuição na mesma linha.</li>
        <li>Para tipos de terceiros, escreva extensões <code>Deconstruct</code>.</li>
      </ul>
    </PageContainer>
  );
}
