import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(r,{title:"LINQ: Sum, Average, Count, Aggregate",subtitle:"Como reduzir uma coleção inteira a um único valor — somar, contar, achar máximo, ou criar sua própria operação.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Pense em uma planilha de Excel: você tem uma coluna de valores e na última célula coloca ",e.jsx("code",{children:"=SOMA(...)"})," ou ",e.jsx("code",{children:"=MÉDIA(...)"}),". As ",e.jsx("strong",{children:"funções de agregação"})," em LINQ fazem exatamente isso para coleções em código C#: pegam vários itens e devolvem ",e.jsx("em",{children:"um único"})," resultado. Este capítulo cobre as agregadoras prontas (",e.jsx("code",{children:"Sum"}),", ",e.jsx("code",{children:"Average"}),", ",e.jsx("code",{children:"Min"}),", ",e.jsx("code",{children:"Max"}),", ",e.jsx("code",{children:"Count"}),", ",e.jsx("code",{children:"Any"}),", ",e.jsx("code",{children:"All"}),") e a poderosa ",e.jsx("code",{children:"Aggregate"}),", que permite criar reduções customizadas."]}),e.jsx("h2",{children:"Sum, Average, Min e Max"}),e.jsxs("p",{children:["Esses quatro métodos só funcionam diretamente em coleções de números (",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"decimal"}),", ",e.jsx("code",{children:"double"}),"...). Quando você tem uma coleção de objetos, passa um ",e.jsx("strong",{children:"seletor"})," dizendo qual propriedade somar."]}),e.jsx("pre",{children:e.jsx("code",{children:`record Produto(string Nome, decimal Preco, int Estoque);

var produtos = new[] {
    new Produto("Caneta", 2.50m, 100),
    new Produto("Caderno", 15.00m, 30),
    new Produto("Livro",  45.00m, 10)
};

decimal total   = produtos.Sum(p => p.Preco);       // 62,50
decimal media   = produtos.Average(p => p.Preco);   // 20,83...
decimal maisCar = produtos.Max(p => p.Preco);       // 45,00
decimal maisBar = produtos.Min(p => p.Preco);       // 2,50

// MaxBy / MinBy retornam o OBJETO inteiro (C# 6+ no .NET 6+):
Produto produtoMaisCaro = produtos.MaxBy(p => p.Preco)!;
Console.WriteLine(produtoMaisCaro.Nome); // Livro`})}),e.jsxs("p",{children:["Note a diferença: ",e.jsx("code",{children:"Max"})," devolve o ",e.jsx("em",{children:"valor"})," máximo (45,00); ",e.jsx("code",{children:"MaxBy"})," devolve o ",e.jsx("em",{children:"objeto"})," que tem esse máximo. Em códigos modernos, prefira ",e.jsx("code",{children:"MaxBy"}),"/",e.jsx("code",{children:"MinBy"}),"."]}),e.jsx("h2",{children:"Count e LongCount"}),e.jsxs("p",{children:[e.jsx("code",{children:"Count()"})," sem argumento conta todos os elementos. Com um ",e.jsx("strong",{children:"predicado"})," (uma função que devolve ",e.jsx("code",{children:"bool"}),'), conta só os que satisfazem a condição — é o jeito idiomático de "quantos itens cumprem X".']}),e.jsx("pre",{children:e.jsx("code",{children:`int totalProdutos     = produtos.Count();
int produtosEmFalta   = produtos.Count(p => p.Estoque == 0);
int produtosCaros     = produtos.Count(p => p.Preco > 20m);

// LongCount serve para coleções gigantes (> 2 bilhões),
// onde o int normal estouraria.
long contagem = enormeColecao.LongCount();`})}),e.jsxs(o,{type:"warning",title:"Cuidado com Count() em IEnumerable",children:["Se a coleção é um ",e.jsx("code",{children:"IEnumerable<T>"}),' "puro" (sem ser uma ',e.jsx("code",{children:"List"})," ou um ",e.jsx("code",{children:"Array"}),"), ",e.jsx("code",{children:"Count()"})," percorre todos os elementos para contar. Para grandes coleções, prefira armazenar em ",e.jsx("code",{children:"List"})," antes ou use ",e.jsx("code",{children:"Any()"})," quando só precisar saber se existe ao menos um item."]}),e.jsx("h2",{children:"Any e All"}),e.jsxs("p",{children:["Estes dois devolvem ",e.jsx("code",{children:"bool"}),' e respondem perguntas de "existe?" / "todos?":']}),e.jsx("pre",{children:e.jsx("code",{children:`bool temFalta    = produtos.Any(p => p.Estoque == 0);   // false
bool temItens    = produtos.Any();                       // true
bool todosCaros  = produtos.All(p => p.Preco > 1m);      // true
bool todosFalta  = produtos.All(p => p.Estoque == 0);    // false

// Any() é MUITO mais barato que Count() > 0 porque para
// no primeiro elemento encontrado.
if (lista.Any()) { /* ... */ }      // ✅ idiomático
if (lista.Count() > 0) { /* ... */ } // ❌ percorre tudo se IEnumerable`})}),e.jsx("h2",{children:"Aggregate: faça sua própria redução"}),e.jsxs("p",{children:[e.jsx("code",{children:"Aggregate"}),' é a "navalha suíça" das agregações. Ele recebe um ',e.jsx("strong",{children:"acumulador"})," e uma função que combina o acumulador com cada elemento. É o equivalente de ",e.jsx("code",{children:"reduce"})," em JavaScript ou ",e.jsx("code",{children:"foldl"})," em linguagens funcionais."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] numeros = { 1, 2, 3, 4, 5 };

// Sem semente: primeiro elemento vira o acumulador inicial
int soma = numeros.Aggregate((acc, n) => acc + n);   // 15

// Com semente (valor inicial explícito) — preferido:
int soma2 = numeros.Aggregate(0, (acc, n) => acc + n); // 15

// Com semente E projeção final:
string lista = numeros.Aggregate(
    seed: new System.Text.StringBuilder(),
    func: (sb, n) => sb.Append(n).Append(','),
    resultSelector: sb => sb.ToString().TrimEnd(','));
// "1,2,3,4,5"

// Exemplo prático: produto fatorial
int fat = Enumerable.Range(1, 5).Aggregate(1, (a, n) => a * n); // 120`})}),e.jsxs("p",{children:["A versão sem semente ",e.jsx("strong",{children:"lança exceção"})," se a coleção estiver vazia. A versão com semente devolve a própria semente nesse caso — sempre prefira a versão com semente em código de produção."]}),e.jsx("h2",{children:"Performance: o que o iniciante precisa saber"}),e.jsxs("p",{children:["Cada agregadora percorre a coleção ",e.jsx("strong",{children:"uma vez"}),". Mas se você encadear várias (",e.jsx("code",{children:"lista.Sum() + lista.Count() + lista.Average()"}),"), está percorrendo três vezes. Para coleções grandes, materialize em ",e.jsx("code",{children:"List"})," e, se possível, calcule tudo num único ",e.jsx("code",{children:"Aggregate"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 3 passes:
var s = lista.Sum();
var c = lista.Count();
var m = (double)s / c;

// 1 pass:
var (soma, qtd) = lista.Aggregate(
    (Soma: 0L, Qtd: 0),
    (acc, n) => (acc.Soma + n, acc.Qtd + 1));
double media = qtd == 0 ? 0 : (double)soma / qtd;`})}),e.jsxs(o,{type:"info",title:"Average com inteiros",children:[e.jsxs("code",{children:["new[]","{1,2,3}",".Average()"]})," devolve ",e.jsx("code",{children:"double"})," (2.0), não ",e.jsx("code",{children:"int"}),". Já ",e.jsx("code",{children:"Sum"})," sobre ",e.jsx("code",{children:"int[]"})," devolve ",e.jsx("code",{children:"int"}),", e ",e.jsx("strong",{children:"pode estourar"})," silenciosamente — use ",e.jsx("code",{children:".Select(x => (long)x).Sum()"})," em coleções enormes."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Chamar ",e.jsx("code",{children:"Average"})," em coleção vazia"]})," — lança ",e.jsx("code",{children:"InvalidOperationException"}),". Verifique com ",e.jsx("code",{children:"Any()"})," antes."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Count() > 0"})]})," em vez de ",e.jsx("code",{children:"Any()"})," — desperdício em coleções não-materializadas."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer overflow no ",e.jsx("code",{children:"Sum"})]})," de ",e.jsx("code",{children:"int"})," — vira número negativo silenciosamente."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Max"})," com ",e.jsx("code",{children:"MaxBy"})]})," — o primeiro devolve o valor, o segundo o objeto."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Sum"}),", ",e.jsx("code",{children:"Average"}),", ",e.jsx("code",{children:"Min"}),", ",e.jsx("code",{children:"Max"})," reduzem uma coleção numérica a um valor."]}),e.jsxs("li",{children:[e.jsx("code",{children:"MinBy"}),"/",e.jsx("code",{children:"MaxBy"})," devolvem o objeto inteiro, não o valor."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Count(predicado)"})," conta itens que satisfazem uma condição."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Any"}),"/",e.jsx("code",{children:"All"}),' respondem "existe algum?" / "todos cumprem?".']}),e.jsxs("li",{children:[e.jsx("code",{children:"Aggregate"})," permite reduções customizadas; sempre passe a semente."]}),e.jsx("li",{children:"Cada agregadora percorre a coleção uma vez — encadear várias custa caro."})]})]})}export{a as default};
