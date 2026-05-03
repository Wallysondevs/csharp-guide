import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function d(){return e.jsxs(r,{title:"Records: classes com igualdade por valor",subtitle:"Aprenda a usar records — o jeito moderno de C# para criar tipos imutáveis com igualdade automática e sintaxe enxuta.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine duas notas de R$ 50 idênticas: uma na sua carteira, outra na minha. Embora sejam objetos físicos diferentes, do ponto de vista do que importa (o valor monetário) elas são ",e.jsx("em",{children:"iguais"}),'. Agora pense em duas pessoas chamadas "Maria, 30 anos": fisicamente são pessoas diferentes — não basta ter o mesmo nome para serem a mesma pessoa. Em programação, esses dois mundos têm tipos diferentes: ',e.jsx("strong",{children:"classes"}),' (igualdade por referência, "são o mesmo objeto?") e ',e.jsx("strong",{children:"records"}),' (igualdade por valor, "têm os mesmos dados?"). Records, introduzidos no C# 9, deixaram fácil escrever tipos imutáveis e comparáveis sem dezenas de linhas de boilerplate.']}),e.jsx("h2",{children:"Declarando um record"}),e.jsxs("p",{children:["A forma mais curta usa um ",e.jsx("strong",{children:"construtor primário"})," direto na declaração. O compilador cria, sozinho, propriedades ",e.jsx("code",{children:"init-only"}),", métodos ",e.jsx("code",{children:"Equals"}),", ",e.jsx("code",{children:"GetHashCode"}),", ",e.jsx("code",{children:"ToString"})," e suporte a deconstrução."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sintaxe enxuta com construtor primário
public record Ponto(double X, double Y);

var a = new Ponto(1, 2);
Console.WriteLine(a);          // Ponto { X = 1, Y = 2 }
Console.WriteLine(a.X);        // 1
Console.WriteLine(a.GetType()); // Ponto`})}),e.jsx("p",{children:"Em uma única linha você ganhou: duas propriedades imutáveis, igualdade por valor, formatação automática para debug e até deconstrução (veremos abaixo). A mesma classe equivalente teria 30+ linhas escritas à mão."}),e.jsx("h2",{children:"Igualdade por valor: a diferença que muda tudo"}),e.jsx("p",{children:"Compare como classes e records se comportam ao serem comparados. Mesmo dois objetos diferentes na memória, se têm os mesmos dados, são considerados iguais para o record:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class PontoClasse
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
Console.WriteLine(r1 == r2); // True (compara valores!)`})}),e.jsxs(o,{type:"info",title:"Por que isso importa?",children:["Igualdade por valor é o que você quer em ",e.jsx("strong",{children:"DTOs"}),' (objetos de transferência de dados), parâmetros, cache keys, eventos, mensagens de fila — tudo que representa "um pacote de dados", não "uma identidade no mundo". Records evitam bugs sutis de comparação errada.']}),e.jsxs("h2",{children:["Imutabilidade e ",e.jsx("code",{children:"with"}),"-expression"]}),e.jsxs("p",{children:["Records são imutáveis por padrão (propriedades ",e.jsx("code",{children:"init"}),"). Mas como você muda algo? Você não muda — você cria uma ",e.jsx("strong",{children:"cópia modificada"})," usando a expressão ",e.jsx("code",{children:"with"}),". É como fotocopiar um documento e mudar uma única linha; o original fica intacto."]}),e.jsx("pre",{children:e.jsx("code",{children:`public record Pessoa(string Nome, int Idade);

var maria = new Pessoa("Maria", 30);
var mariaMaisVelha = maria with { Idade = 31 };

Console.WriteLine(maria);          // Pessoa { Nome = Maria, Idade = 30 }
Console.WriteLine(mariaMaisVelha); // Pessoa { Nome = Maria, Idade = 31 }`})}),e.jsxs("p",{children:["Isso é fundamental em código ",e.jsx("em",{children:"funcional"})," e em arquiteturas como Redux/MVU, onde modificar dado existente é proibido — você só produz novos estados."]}),e.jsx("h2",{children:"Deconstrução automática"}),e.jsxs("p",{children:["Como o record conhece suas próprias propriedades, ele gera um método ",e.jsx("code",{children:"Deconstruct"}),'. Você pode "desempacotar" um record em variáveis com a sintaxe de tupla:']}),e.jsx("pre",{children:e.jsx("code",{children:`var p = new Ponto(3, 4);
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
};`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"record class"})," vs ",e.jsx("code",{children:"record struct"})]}),e.jsxs("p",{children:["Por padrão, ",e.jsx("code",{children:"record"})," equivale a ",e.jsx("code",{children:"record class"})," — alocado no ",e.jsx("em",{children:"heap"})," (área de memória de objetos, com coletor de lixo). Desde C# 10, você também pode declarar ",e.jsx("code",{children:"record struct"}),", alocado no ",e.jsx("em",{children:"stack"})," (área de chamadas, ultra-rápida). A diferença muda performance e semântica:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// record class (default): tipo por referência, na heap
public record class Cliente(string Nome, string Email);

// record struct: tipo por valor, na stack
public readonly record struct Coordenada(double Lat, double Lng);

// Use record struct para tipos pequenos e muito usados em loops apertados
var coord = new Coordenada(-23.55, -46.63);`})}),e.jsxs("p",{children:["A regra prática: use ",e.jsx("code",{children:"record struct"})," apenas para tipos pequenos (menos de 16 bytes), imutáveis e usados em alta frequência. Em todos os outros casos, ",e.jsx("code",{children:"record"})," (class) é o padrão seguro."]}),e.jsx("h2",{children:"Records também herdam (com cuidado)"}),e.jsxs("p",{children:["Você pode estender um record com outro. A igualdade leva em conta o tipo concreto — então um ",e.jsx("code",{children:"Animal"})," com os mesmos dados de um ",e.jsx("code",{children:"Cachorro"})," não é igual ao Cachorro."]}),e.jsx("pre",{children:e.jsx("code",{children:`public record Animal(string Nome);
public record Cachorro(string Nome, string Raca) : Animal(Nome);

var a = new Animal("Rex");
var c = new Cachorro("Rex", "Labrador");
Console.WriteLine(a == c); // False — tipos diferentes`})}),e.jsxs(o,{type:"warning",title:"Cuidado com referências aninhadas",children:["A igualdade por valor de um record compara ",e.jsx("em",{children:"cada propriedade"}),". Se uma propriedade for uma ",e.jsx("code",{children:"List<T>"})," ou outro tipo por referência, a comparação será por referência, não pelos itens da lista. Para listas, use coleções imutáveis ou implemente comparação custom."]}),e.jsx("h2",{children:"Quando usar record vs class"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Use record quando..."}),e.jsx("th",{children:"Use class quando..."})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Os dados representam um valor (DTO, evento, configuração)"}),e.jsx("td",{children:"O objeto representa uma entidade com identidade própria"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Você quer imutabilidade por padrão"}),e.jsx("td",{children:"Você precisa modificar o objeto várias vezes"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Igualdade por valor faz sentido"}),e.jsx("td",{children:"Igualdade por referência faz sentido (mesmo objeto na memória)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"O objeto é pequeno e simples"}),e.jsx("td",{children:"O objeto tem comportamento rico e estado complexo"})]})]})]}),e.jsx("h2",{children:"Exemplo completo: pipeline de eventos"}),e.jsx("p",{children:"Records brilham em arquiteturas orientadas a evento. Cada evento é um pacote imutável de dados:"}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract record EventoDominio(DateTime OcorridoEm);
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
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar modificar uma propriedade após a construção"}),": como elas são ",e.jsx("code",{children:"init"}),", o compilador bloqueia. Use ",e.jsx("code",{children:"with"})," para criar variação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar igualdade por valor com listas dentro"}),": comparar dois records que contêm listas compara as referências dessas listas, não o conteúdo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"record struct"})," grande"]}),": structs grandes são copiados a cada atribuição, o que mata performance. Mantenha pequenos e prefira ",e.jsx("code",{children:"readonly record struct"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar record para entidade do EF Core"}),": entidades costumam mudar e ter identidade. Em geral, use ",e.jsx("em",{children:"class"})," para elas e records para DTOs."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"record"})," gera, em uma linha, propriedades imutáveis, igualdade por valor, ",e.jsx("code",{children:"ToString"})," e deconstrução."]}),e.jsxs("li",{children:[e.jsx("code",{children:"with"}),"-expression cria cópias modificadas sem alterar o original."]}),e.jsxs("li",{children:[e.jsx("code",{children:"record class"})," (default) vai na heap; ",e.jsx("code",{children:"record struct"})," vai na stack."]}),e.jsxs("li",{children:["Compare records com ",e.jsx("code",{children:"=="})," e funciona como esperado para valores."]}),e.jsx("li",{children:"Use record para DTOs, eventos, mensagens; use class para entidades com identidade."}),e.jsx("li",{children:"Cuidado com propriedades de tipo referência (listas, dicionários): a comparação é por referência."})]})]})}export{d as default};
