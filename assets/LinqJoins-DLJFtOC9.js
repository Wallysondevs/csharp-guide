import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"LINQ: Join, GroupJoin e SelectMany",subtitle:"Como combinar duas coleções relacionadas — equivalente aos JOINs do SQL — usando LINQ.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:["Imagine que você tem duas listas: uma de ",e.jsx("strong",{children:"clientes"})," e outra de ",e.jsx("strong",{children:"pedidos"}),". Cada pedido carrega o ",e.jsx("code",{children:"ClienteId"}),' de quem o fez. Para gerar um relatório "Maria comprou um sofá", você precisa ',e.jsx("em",{children:"cruzar"})," as duas listas pelo identificador comum. Em bancos de dados isso se chama ",e.jsx("strong",{children:"JOIN"}),"; em LINQ, a ideia é a mesma. Este capítulo mostra três ferramentas: ",e.jsx("code",{children:"Join"})," (cruzamento simples), ",e.jsx("code",{children:"GroupJoin"})," (cruzamento agrupando o lado N) e ",e.jsx("code",{children:"SelectMany"})," (achatamento de coleções aninhadas)."]}),e.jsx("h2",{children:"Os dados de exemplo"}),e.jsxs("p",{children:["Vamos usar ",e.jsx("code",{children:"record"})," (uma forma curta de declarar uma classe imutável) para representar nossos modelos. Toda essa seção usa essas duas listas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`record Cliente(int Id, string Nome);
record Pedido(int Id, int ClienteId, string Produto, decimal Valor);

var clientes = new List<Cliente> {
    new(1, "Maria"),
    new(2, "João"),
    new(3, "Ana") // Ana nunca comprou nada
};

var pedidos = new List<Pedido> {
    new(101, 1, "Sofá",   1500m),
    new(102, 1, "Mesa",    800m),
    new(103, 2, "Cadeira", 250m)
};`})}),e.jsxs("p",{children:["Note que Ana (Id 3) não tem pedidos. Isso será importante para diferenciar ",e.jsx("code",{children:"Join"})," de ",e.jsx("code",{children:"GroupJoin"}),"."]}),e.jsx("h2",{children:'Join: o "INNER JOIN" do LINQ'}),e.jsxs("p",{children:[e.jsx("code",{children:"Join"})," casa um item da primeira coleção com cada item correspondente da segunda. Quem não tiver par é ",e.jsx("strong",{children:"descartado"})," — exatamente como o INNER JOIN do SQL. A assinatura pede quatro coisas: a coleção externa, a chave externa (",e.jsx("em",{children:"cliente.Id"}),"), a chave interna (",e.jsx("em",{children:"pedido.ClienteId"}),") e uma função que produz o resultado a partir do par casado."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Method syntax
var rel = clientes.Join(
    pedidos,
    c => c.Id,           // chave do lado externo
    p => p.ClienteId,    // chave do lado interno
    (c, p) => new { c.Nome, p.Produto, p.Valor }
);

foreach (var r in rel)
    Console.WriteLine($"{r.Nome} comprou {r.Produto} por {r.Valor:C}");

// Saída:
// Maria comprou Sofá por R$ 1.500,00
// Maria comprou Mesa por R$ 800,00
// João comprou Cadeira por R$ 250,00
// (Ana não aparece — não tinha pedidos)`})}),e.jsx("h2",{children:"A mesma coisa em query syntax"}),e.jsxs("p",{children:["A ",e.jsx("strong",{children:"sintaxe de query"})," (parecida com SQL) costuma ser mais legível para joins. O compilador converte exatamente para o ",e.jsx("code",{children:"Join"})," que acabamos de ver."]}),e.jsx("pre",{children:e.jsx("code",{children:`var rel = from c in clientes
          join p in pedidos on c.Id equals p.ClienteId
          select new { c.Nome, p.Produto, p.Valor };`})}),e.jsxs("p",{children:["Repare na palavra-chave ",e.jsx("code",{children:"equals"})," — em LINQ ela é obrigatória no lugar de ",e.jsx("code",{children:"=="})," dentro de um ",e.jsx("code",{children:"join"}),", porque o compilador precisa identificar qual lado é qual chave."]}),e.jsxs(a,{type:"info",title:"A ordem das chaves importa",children:["Em ",e.jsx("code",{children:"join p in pedidos on c.Id equals p.ClienteId"}),", o lado esquerdo do ",e.jsx("code",{children:"equals"})," deve ser a chave da coleção externa (",e.jsx("code",{children:"c"}),") e o direito a da interna (",e.jsx("code",{children:"p"}),"). Inverter dá erro de compilação."]}),e.jsx("h2",{children:'GroupJoin: o "LEFT JOIN" agrupado'}),e.jsxs("p",{children:["E se quisermos listar ",e.jsx("strong",{children:"todos"})," os clientes — inclusive Ana, que não comprou nada — junto com seus pedidos agrupados? É o trabalho do ",e.jsx("code",{children:"GroupJoin"}),". Em vez de produzir um item por par, ele produz um item por elemento da coleção externa, com uma ",e.jsx("em",{children:"sub-coleção"})," dos itens internos correspondentes."]}),e.jsx("pre",{children:e.jsx("code",{children:`var rel = clientes.GroupJoin(
    pedidos,
    c => c.Id,
    p => p.ClienteId,
    (c, ps) => new { c.Nome, Pedidos = ps.ToList() }
);

foreach (var r in rel)
    Console.WriteLine($"{r.Nome}: {r.Pedidos.Count} pedido(s)");

// Maria: 2 pedido(s)
// João:  1 pedido(s)
// Ana:   0 pedido(s)`})}),e.jsx("h2",{children:"SelectMany: aplainando coleções aninhadas"}),e.jsxs("p",{children:["Imagine que você tem uma lista de clientes e cada cliente já carrega sua própria lista de pedidos. ",e.jsx("code",{children:"Select"})," daria uma ",e.jsx("em",{children:"lista de listas"}),"; ",e.jsx("code",{children:"SelectMany"}),' "aplaina" tudo em ',e.jsx("strong",{children:"uma única sequência"}),". É o mesmo conceito de ",e.jsx("code",{children:"flatMap"})," em outras linguagens."]}),e.jsx("pre",{children:e.jsx("code",{children:`record Cliente2(string Nome, List<string> Compras);

var lista = new List<Cliente2> {
    new("Maria", new(){ "Sofá", "Mesa" }),
    new("João",  new(){ "Cadeira" })
};

// Sem SelectMany: List<List<string>>
var aninhado = lista.Select(c => c.Compras);

// Com SelectMany: List<string> direto
var planos = lista.SelectMany(c => c.Compras);
// → ["Sofá", "Mesa", "Cadeira"]

// Com sobrecarga que mantém o pai:
var pares = lista.SelectMany(
    c => c.Compras,
    (c, item) => new { c.Nome, Produto = item });
// → { Maria,Sofá }, { Maria,Mesa }, { João,Cadeira }`})}),e.jsxs("p",{children:['A versão de duas funções é especialmente útil porque preserva o "dono" de cada item achatado — exatamente o que um ',e.jsx("code",{children:"JOIN"})," faria com tabelas pai/filho."]}),e.jsxs(a,{type:"warning",title:"Join não é ordenado",children:["O resultado de ",e.jsx("code",{children:"Join"})," não garante a ordem original. Se você precisa de ordem específica, encadeie um ",e.jsx("code",{children:"OrderBy"})," no final. Em LINQ-to-Objects a ordem normalmente é preservada da coleção externa, mas em LINQ-to-SQL/EF, o banco decide."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"=="})," em vez de ",e.jsx("code",{children:"equals"})]})," dentro do ",e.jsx("code",{children:"join"})," — não compila."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:['Esperar registros "sem par" no ',e.jsx("code",{children:"Join"})]})," — eles somem. Use ",e.jsx("code",{children:"GroupJoin"})," + ",e.jsx("code",{children:"DefaultIfEmpty"})," para simular LEFT JOIN."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Select"})," e ",e.jsx("code",{children:"SelectMany"})]}),": o primeiro mantém a estrutura aninhada; o segundo aplaina."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Joins sem índice em EF"}),": se a coluna usada não tem índice no banco, o desempenho cai brutalmente."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Join"})," equivale ao INNER JOIN: descarta itens sem par."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GroupJoin"})," equivale a um LEFT JOIN agrupado: mantém todos da esquerda, com sub-coleção da direita."]}),e.jsxs("li",{children:[e.jsx("code",{children:"SelectMany"})," achata coleções aninhadas em uma única sequência."]}),e.jsxs("li",{children:["Em ",e.jsx("code",{children:"join"}),", use a palavra-chave ",e.jsx("code",{children:"equals"}),", nunca ",e.jsx("code",{children:"=="}),"."]}),e.jsx("li",{children:"Query syntax é mais legível para joins; method syntax dá mais flexibilidade."})]})]})}export{i as default};
