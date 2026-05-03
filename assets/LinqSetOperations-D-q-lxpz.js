import{j as e}from"./index-CzLAthD5.js";import{P as o,A as s}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(o,{title:"LINQ: Distinct, Union, Intersect, Except",subtitle:"Operações de conjunto: remover duplicatas, juntar sem repetir, achar comuns ou diferenças entre coleções.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Lembra dos diagramas de Venn da escola — aqueles dois círculos que se sobrepõem? As ",e.jsx("strong",{children:"operações de conjunto"})," em LINQ são exatamente isso, mas em código. Você tem duas coleções e quer saber: o que existe em ambas? Só na primeira? Tudo junto sem duplicar? Para isso, LINQ oferece quatro operadores fundamentais: ",e.jsx("code",{children:"Distinct"}),", ",e.jsx("code",{children:"Union"}),", ",e.jsx("code",{children:"Intersect"})," e ",e.jsx("code",{children:"Except"}),". Eles compartilham uma característica: ",e.jsx("strong",{children:"tratam a coleção como um conjunto matemático"}),", ou seja, sem itens repetidos no resultado."]}),e.jsx("h2",{children:"Distinct: removendo duplicatas"}),e.jsxs("p",{children:[e.jsx("code",{children:"Distinct"})," percorre a coleção e devolve cada valor único ",e.jsx("em",{children:"uma única vez"}),", na ordem em que apareceu pela primeira vez. Por baixo dos panos, ele usa um ",e.jsx("code",{children:"HashSet"}),' — uma estrutura otimizada que checa "já vi este?" em tempo praticamente constante.']}),e.jsx("pre",{children:e.jsx("code",{children:`int[] numeros = { 1, 2, 2, 3, 3, 3, 4 };
var unicos = numeros.Distinct();
// → 1, 2, 3, 4

string[] tags = { "csharp", "CSHARP", "csharp", "linq" };
var deduplicado = tags.Distinct(StringComparer.OrdinalIgnoreCase);
// → "csharp", "linq"  (ignora caixa)`})}),e.jsxs("p",{children:["Para ",e.jsx("strong",{children:"tipos primitivos e strings"}),", o ",e.jsx("code",{children:"Distinct"})," sem argumentos já funciona. Para classes próprias, leia abaixo sobre ",e.jsx("code",{children:"IEqualityComparer"}),"."]}),e.jsx("h2",{children:"DistinctBy: deduplicar por uma propriedade"}),e.jsxs("p",{children:["Disponível desde o .NET 6, ",e.jsx("code",{children:"DistinctBy"})," permite remover duplicatas com base numa ",e.jsx("em",{children:"chave"})," extraída de cada item — sem precisar implementar comparadores complicados."]}),e.jsx("pre",{children:e.jsx("code",{children:`record Pessoa(string Nome, int Idade);

var lista = new[] {
    new Pessoa("Ana",  30),
    new Pessoa("João", 25),
    new Pessoa("Ana",  31)   // mesmo nome, idade diferente
};

var unicas = lista.DistinctBy(p => p.Nome);
// → Ana(30), João(25)  — a segunda Ana some`})}),e.jsx("h2",{children:"Union: juntar sem repetir"}),e.jsxs("p",{children:[e.jsx("code",{children:"Union"})," combina duas coleções em uma só, eliminando duplicatas. É como concatenar (",e.jsx("code",{children:"Concat"}),") e depois aplicar ",e.jsx("code",{children:"Distinct"}),", mas em uma operação única e mais eficiente."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] a = { 1, 2, 3 };
int[] b = { 3, 4, 5 };

var todos    = a.Concat(b);  // 1,2,3,3,4,5  (mantém duplicata)
var conjunto = a.Union(b);   // 1,2,3,4,5    (sem duplicata)`})}),e.jsxs(s,{type:"info",title:"Concat vs Union",children:["Use ",e.jsx("code",{children:"Concat"})," quando quiser ",e.jsx("em",{children:"todos"})," os elementos (preservando repetição). Use ",e.jsx("code",{children:"Union"})," quando quiser tratar como conjunto. ",e.jsx("code",{children:"Concat"})," é mais barato, então não pague o custo de remover duplicatas se não precisa."]}),e.jsx("h2",{children:"Intersect: o que existe em ambas"}),e.jsxs("p",{children:[e.jsx("code",{children:"Intersect"})," devolve apenas os elementos que aparecem nas ",e.jsx("strong",{children:"duas"}),' coleções. É como perguntar "quais clientes compraram tanto em janeiro quanto em fevereiro?".']}),e.jsx("pre",{children:e.jsx("code",{children:`int[] janeiro  = { 1, 2, 3, 4 };
int[] fevereiro = { 3, 4, 5, 6 };

var fieis = janeiro.Intersect(fevereiro);
// → 3, 4`})}),e.jsx("h2",{children:"Except: o que está em A mas não em B"}),e.jsxs("p",{children:[e.jsx("code",{children:"Except"})," devolve os elementos da primeira coleção que ",e.jsx("em",{children:"não"}),' estão na segunda. É a "diferença" matemática (A − B). Útil para "quais pedidos pendentes ainda não foram processados".']}),e.jsx("pre",{children:e.jsx("code",{children:`int[] todos      = { 1, 2, 3, 4, 5 };
int[] processados = { 2, 4 };

var pendentes = todos.Except(processados);
// → 1, 3, 5

// IntersectBy / ExceptBy / UnionBy (NET 6+) aceitam seletor de chave:
var clientesDuplicados = clientesA.IntersectBy(
    clientesB.Select(c => c.Id),
    c => c.Id);`})}),e.jsx("h2",{children:"Custom IEqualityComparer: comparar objetos como você quer"}),e.jsxs("p",{children:["Quando trabalha com ",e.jsx("strong",{children:"classes próprias"}),", o C# por padrão compara por ",e.jsx("em",{children:"referência"})," (mesmo objeto na memória), o que quase nunca é o que você quer. Há duas saídas: implementar ",e.jsx("code",{children:"Equals"}),"/",e.jsx("code",{children:"GetHashCode"})," na classe, ou passar um ",e.jsx("code",{children:"IEqualityComparer"})," ad-hoc."]}),e.jsx("pre",{children:e.jsx("code",{children:`record Cliente(int Id, string Nome);

class CmpPorId : IEqualityComparer<Cliente> {
    public bool Equals(Cliente? a, Cliente? b) =>
        a?.Id == b?.Id;
    public int GetHashCode(Cliente c) => c.Id.GetHashCode();
}

var lista = new[] {
    new Cliente(1, "Ana"),
    new Cliente(1, "Ana Maria"), // mesmo Id
    new Cliente(2, "João")
};
var unicos = lista.Distinct(new CmpPorId());
// → Ana, João  (Ana Maria some, mesmo Id)`})}),e.jsxs("p",{children:["Atalho: como ",e.jsx("code",{children:"record"})," em C# já implementa ",e.jsx("code",{children:"Equals"})," baseado em ",e.jsx("em",{children:"todas"})," as propriedades, dois ",e.jsx("code",{children:"record"}),"s com mesmas propriedades são considerados iguais sem você precisar fazer nada. É um dos motivos de ",e.jsx("code",{children:"record"})," ser tão útil para modelos de dados."]}),e.jsx("h2",{children:"Performance: o HashSet escondido"}),e.jsxs("p",{children:["Todas essas operações constroem internamente um ",e.jsx("code",{children:"HashSet<T>"})," da segunda coleção (ou da própria, no caso de ",e.jsx("code",{children:"Distinct"}),"). Isso significa:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Custo de tempo: ",e.jsx("strong",{children:"O(n + m)"})," — bem rápido."]}),e.jsxs("li",{children:["Custo de memória: ",e.jsx("strong",{children:"O(menor das duas)"})," — a segunda coleção é totalmente carregada na memória."]}),e.jsxs("li",{children:["Para ",e.jsx("code",{children:"IQueryable"})," (EF Core), o operador é traduzido para SQL (",e.jsx("code",{children:"UNION"}),", ",e.jsx("code",{children:"INTERSECT"}),", ",e.jsx("code",{children:"EXCEPT"}),") e roda no banco."]})]}),e.jsxs(s,{type:"warning",title:"Ordem do resultado",children:["A documentação NÃO garante ordem em ",e.jsx("code",{children:"Distinct"}),"/",e.jsx("code",{children:"Union"}),"/etc. Em LINQ-to-Objects, na prática, a ordem da primeira aparição é preservada — mas não confie nisso. Se precisa de ordem, use ",e.jsx("code",{children:"OrderBy"})," depois."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Aplicar ",e.jsx("code",{children:"Distinct"})," em classes"]})," sem ",e.jsx("code",{children:"Equals"}),"/",e.jsx("code",{children:"GetHashCode"})," — não dedupa nada porque compara por referência."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Concat"})," com ",e.jsx("code",{children:"Union"})]})," — o primeiro mantém duplicatas, o segundo não."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Inverter ",e.jsx("code",{children:"Except"})]}),": ",e.jsx("code",{children:"A.Except(B)"})," ≠ ",e.jsx("code",{children:"B.Except(A)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar ordenação"})," do resultado — não é garantida."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Distinct"})," remove duplicatas; ",e.jsx("code",{children:"DistinctBy"})," deduplica por chave."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Union"})," = união sem duplicatas; ",e.jsx("code",{children:"Concat"})," = concatenação simples."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Intersect"})," = elementos comuns às duas coleções."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Except"})," = elementos de A que não estão em B."]}),e.jsxs("li",{children:["Para classes próprias, use ",e.jsx("code",{children:"IEqualityComparer"})," ou ",e.jsx("code",{children:"record"}),"."]}),e.jsxs("li",{children:["Implementação interna usa ",e.jsx("code",{children:"HashSet"}),": O(n+m) em tempo, O(m) em memória."]})]})]})}export{n as default};
