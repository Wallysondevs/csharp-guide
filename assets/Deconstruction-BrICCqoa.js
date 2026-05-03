import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Deconstruction: desempacotando objetos",subtitle:"Aprenda a abrir tuplas, records e classes em variáveis individuais com uma única linha — código mais legível, sem perder tipo.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsxs("p",{children:["Imagine que você recebe uma encomenda contendo três itens diferentes. Em vez de abrir a caixa, manter tudo dentro e ficar tirando um item por vez, seria mais prático esvaziar a caixa em três pratos separados, cada um já com seu nome. ",e.jsx("strong",{children:"Deconstruction"}),' é exatamente isso em C#: um mecanismo para "esvaziar" um objeto composto em várias variáveis nomeadas, em uma única linha, com tipo preservado pelo compilador. Funciona com tuplas, records, KeyValuePair, e qualquer tipo que defina um método especial chamado ',e.jsx("code",{children:"Deconstruct"}),"."]}),e.jsx("h2",{children:"Deconstrução de tuplas"}),e.jsx("p",{children:"O caso mais comum: tuplas. Você usa parênteses do lado esquerdo de uma atribuição e dá um nome a cada componente."}),e.jsx("pre",{children:e.jsx("code",{children:`var ponto = (X: 3, Y: 4);

// Forma 1: var infere o tipo de cada variável
var (x, y) = ponto;
Console.WriteLine($"{x},{y}");   // 3,4

// Forma 2: tipos explícitos
(int a, int b) = ponto;

// Forma 3: misto, com descarte
var (_, somenteY) = ponto;
Console.WriteLine(somenteY);     // 4`})}),e.jsxs("p",{children:["O caractere ",e.jsx("code",{children:"_"})," é um ",e.jsx("strong",{children:"discard"}),' — uma promessa ao compilador de que aquele componente não será usado. É melhor que criar uma variável "ignorar" porque o compilador nem reserva slot para ela.']}),e.jsxs("h2",{children:["Implementando ",e.jsx("code",{children:"Deconstruct"})," em uma classe"]}),e.jsxs("p",{children:["Para que uma classe (ou struct) sua possa ser desempacotada, basta declarar um método ",e.jsx("code",{children:"Deconstruct"})," com parâmetros ",e.jsx("code",{children:"out"}),". O compilador procura esse método pelo nome e pela quantidade de saídas."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa {
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
Console.WriteLine($"{nome}, {idade}, {cidade}");`})}),e.jsxs("p",{children:["Você pode declarar ",e.jsx("strong",{children:"vários"})," ",e.jsx("code",{children:"Deconstruct"})," com aridades diferentes (1, 2, 3 saídas). O compilador escolhe o que casa com o número de variáveis do lado esquerdo, igual a sobrecarga de método."]}),e.jsxs(o,{type:"info",title:"Deconstruct via extension method",children:["Não pode mudar uma classe de terceiro? Crie um método de extensão ",e.jsx("code",{children:"Deconstruct"}),". O compilador aceita extensões, e você ganha o açúcar sintático sem alterar a biblioteca."]}),e.jsx("h2",{children:"Records já vêm com Deconstruct"}),e.jsxs("p",{children:["Quando você declara um ",e.jsx("code",{children:"record"})," com parâmetros posicionais, o compilador ",e.jsx("strong",{children:"gera automaticamente"})," um ",e.jsx("code",{children:"Deconstruct"})," com a mesma ordem e nomes dos parâmetros. Zero boilerplate."]}),e.jsx("pre",{children:e.jsx("code",{children:`public record Endereco(string Rua, string Cidade, string Cep);

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
}`})}),e.jsxs("h2",{children:["Deconstruction em ",e.jsx("code",{children:"foreach"})]}),e.jsx("p",{children:"Combinada com listas de tuplas, KeyValuePair (de dicionários) ou records, deconstruction torna iteração muito mais legível. Compare:"}),e.jsx("pre",{children:e.jsx("code",{children:`var precos = new Dictionary<string, decimal> {
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
}`})}),e.jsxs("p",{children:[e.jsx("code",{children:"KeyValuePair<TKey, TValue>"})," ganhou um ",e.jsx("code",{children:"Deconstruct"})," em .NET Core 2.0+. Por isso a forma ",e.jsx("code",{children:"(k, v)"}),' "simplesmente funciona" em qualquer dicionário.']}),e.jsx("h2",{children:"Pattern matching também desconstrói"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"switch"})," e ",e.jsx("code",{children:"is"}),", padrões posicionais usam o mesmo ",e.jsx("code",{children:"Deconstruct"}),". Isso permite condicionar lógica em formatos compostos sem código verboso."]}),e.jsx("pre",{children:e.jsx("code",{children:`public record Ponto(int X, int Y);

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
}`})}),e.jsxs(o,{type:"warning",title:"Cuidado com Deconstruct mal projetado",children:["Se você expõe um ",e.jsx("code",{children:"Deconstruct"})," com parâmetros em ordem confusa (ex.: ",e.jsx("code",{children:"(out string cep, out string cidade, out string rua)"})," contra a ordem visual da casa), quem usa vai trocar valores. Mantenha a ordem natural de leitura ou documente claramente."]}),e.jsx("h2",{children:"Deconstruction é só atribuição múltipla?"}),e.jsxs("p",{children:["Quase. Existem três sutilezas que vale notar: (1) você pode misturar declaração e atribuição (declarar algumas variáveis e reaproveitar outras já existentes), (2) o tipo de cada componente é ",e.jsx("strong",{children:"independentemente inferido"}),", e (3) a ordem de avaliação é estritamente da esquerda para a direita."]}),e.jsx("pre",{children:e.jsx("code",{children:`int x = 0;
// 'y' é declarado aqui; 'x' é o que já existia
(x, int y) = (10, 20);
Console.WriteLine($"{x},{y}");   // 10,20

// Erro comum: misturar tipos incompatíveis
// (int a, int b) = ("x", 1);   // ERRO: string não converte para int

// Trocar duas variáveis em uma linha — clássico:
int a = 1, b = 2;
(a, b) = (b, a);
Console.WriteLine($"{a},{b}");   // 2,1`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Quantidade errada de variáveis:"})," ",e.jsx("code",{children:"var (a, b) = (1, 2, 3);"})," não compila. Aridades têm que casar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"out"})," nos parâmetros de ",e.jsx("code",{children:"Deconstruct"}),":"]})," sem ",e.jsx("code",{children:"out"}),", o compilador não reconhece."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar desconstruir tipo sem suporte:"})," compilador acusa CS8129. Implemente ",e.jsx("code",{children:"Deconstruct"})," ou crie extension."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"(x, y) = ponto"})," com igualdade:"]})," à esquerda de ",e.jsx("code",{children:"="})," é deconstruct; em ",e.jsx("code",{children:"if"})," seria erro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mudar nomes de propriedades sem atualizar Deconstruct:"})," em records posicionais, o auto-gerado acompanha; em classes, é manual."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Deconstruction abre objetos compostos em várias variáveis em uma única linha."}),e.jsxs("li",{children:["Tuplas e records suportam de forma nativa; classes precisam de método ",e.jsx("code",{children:"Deconstruct(out ...)"}),"."]}),e.jsxs("li",{children:["Funciona em ",e.jsx("code",{children:"foreach"}),", em ",e.jsx("code",{children:"switch"})," e em ",e.jsx("code",{children:"is"})," — combinando com pattern matching."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"_"})," para descartar componentes não usados."]}),e.jsx("li",{children:"Pode misturar declaração e atribuição na mesma linha."}),e.jsxs("li",{children:["Para tipos de terceiros, escreva extensões ",e.jsx("code",{children:"Deconstruct"}),"."]})]})]})}export{i as default};
