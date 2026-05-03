import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(a,{title:"LINQ: OrderBy, ThenBy e GroupBy",subtitle:"Ordene por um ou vários critérios e agrupe coleções como em um SELECT … GROUP BY do SQL — sem sair do C#.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Depois de filtrar e projetar, a próxima dupla de operadores LINQ que você usará todos os dias é ",e.jsx("strong",{children:"OrderBy"})," (ordenar) e ",e.jsx("strong",{children:"GroupBy"}),' (agrupar). São as ferramentas que fazem relatórios saírem como você espera: "lista de funcionários ordenada por nome", "vendas agrupadas por mês", "pessoas agrupadas por faixa etária somando salários". Imagine uma planilha do Excel com botões de "ordenar" e "subtotal por categoria" — é exatamente isso, só que em código.']}),e.jsx("h2",{children:"OrderBy: ordenando por um critério"}),e.jsxs("p",{children:[e.jsx("code",{children:"OrderBy"})," recebe uma lambda que extrai a ",e.jsx("strong",{children:"chave de ordenação"})," e devolve a sequência ordenada de forma crescente. ",e.jsx("code",{children:"OrderByDescending"})," faz o oposto. Diferente de ",e.jsx("code",{children:"List.Sort"}),", LINQ ",e.jsx("em",{children:"não"})," modifica a coleção original — devolve uma nova sequência."]}),e.jsx("pre",{children:e.jsx("code",{children:`var pessoas = new[]
{
    new { Nome = "Bruno", Idade = 35 },
    new { Nome = "Ana",   Idade = 28 },
    new { Nome = "Carla", Idade = 22 },
    new { Nome = "Diego", Idade = 41 }
};

// Crescente por nome
var alfa = pessoas.OrderBy(p => p.Nome);
foreach (var p in alfa)
    Console.WriteLine(p.Nome);
// Ana, Bruno, Carla, Diego

// Decrescente por idade
var maisVelhos = pessoas.OrderByDescending(p => p.Idade);`})}),e.jsx("h2",{children:"ThenBy: critérios de desempate"}),e.jsxs("p",{children:["E quando duas pessoas têm o mesmo nome, ou a mesma idade? Você precisa de ",e.jsx("em",{children:"desempate"}),". Para isso existe ",e.jsx("code",{children:"ThenBy"})," (e ",e.jsx("code",{children:"ThenByDescending"}),"): aplica um critério secundário ",e.jsx("em",{children:"dentro"})," dos itens que o primeiro empatou."]}),e.jsx("pre",{children:e.jsx("code",{children:`var alunos = new[]
{
    new { Nome = "Ana",   Turma = "A", Nota = 8.5 },
    new { Nome = "Bruno", Turma = "A", Nota = 7.0 },
    new { Nome = "Ana",   Turma = "B", Nota = 9.0 },
    new { Nome = "Carla", Turma = "A", Nota = 8.5 }
};

// Ordena por turma, dentro da turma por nota desc, dentro disso por nome
var ord = alunos
    .OrderBy(a => a.Turma)
    .ThenByDescending(a => a.Nota)
    .ThenBy(a => a.Nome);

foreach (var a in ord)
    Console.WriteLine($"{a.Turma} - {a.Nota} - {a.Nome}");
// A - 8.5 - Ana
// A - 8.5 - Carla
// A - 7.0 - Bruno
// B - 9.0 - Ana`})}),e.jsxs(r,{type:"info",title:"Sempre use ThenBy, nunca encadeie OrderBy",children:["Encadear ",e.jsx("code",{children:".OrderBy(a).OrderBy(b)"})," faz a ",e.jsx("em",{children:"segunda"})," ordenação ",e.jsx("strong",{children:"desfazer"})," a primeira (porque OrderBy ignora a ordem prévia). Para múltiplos critérios use sempre ",e.jsx("code",{children:"OrderBy(...).ThenBy(...)"}),"."]}),e.jsx("h2",{children:"OrderBy com chaves customizadas"}),e.jsxs("p",{children:["A chave pode ser qualquer expressão, inclusive cálculos. Você também pode passar um ",e.jsx("code",{children:"IComparer<T>"})," como segundo argumento para regras malucas (ex: ordenar strings ignorando acentos)."]}),e.jsx("pre",{children:e.jsx("code",{children:`var palavras = new[] { "abacaxi", "kiwi", "uva", "morango" };

// Ordenar por tamanho da palavra
var porTamanho = palavras.OrderBy(p => p.Length);
// uva, kiwi, morango, abacaxi

// Strings case-insensitive
var ci = palavras.OrderBy(p => p, StringComparer.OrdinalIgnoreCase);`})}),e.jsx("h2",{children:"GroupBy: agrupando por chave"}),e.jsxs("p",{children:[e.jsx("code",{children:"GroupBy"})," separa a sequência em ",e.jsx("em",{children:"grupos"})," baseados em uma chave que você extrai de cada item. O resultado é uma sequência de ",e.jsx("code",{children:"IGrouping<TKey, TElement>"})," — cada grupo tem uma propriedade ",e.jsx("code",{children:"Key"})," e é ele mesmo iterável."]}),e.jsx("pre",{children:e.jsx("code",{children:`var pessoas = new[]
{
    new { Nome = "Ana",   Cidade = "SP" },
    new { Nome = "Bruno", Cidade = "RJ" },
    new { Nome = "Carla", Cidade = "SP" },
    new { Nome = "Diego", Cidade = "MG" },
    new { Nome = "Eva",   Cidade = "RJ" }
};

var porCidade = pessoas.GroupBy(p => p.Cidade);

foreach (var grupo in porCidade)
{
    Console.WriteLine($"=== {grupo.Key} ({grupo.Count()}) ===");
    foreach (var p in grupo)
        Console.WriteLine($"  {p.Nome}");
}
// === SP (2) === Ana, Carla
// === RJ (2) === Bruno, Eva
// === MG (1) === Diego`})}),e.jsx("h2",{children:"GroupBy + agregações: o relatório clássico"}),e.jsxs("p",{children:["A combinação mais útil é agrupar e em seguida calcular alguma estatística por grupo (soma, média, contagem, máximo). Combine com ",e.jsx("code",{children:"Select"})," para projetar um resumo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var vendas = new[]
{
    new { Produto = "Leite", Qtd = 10, Total = 50m },
    new { Produto = "Pão",   Qtd = 20, Total = 20m },
    new { Produto = "Leite", Qtd = 5,  Total = 25m },
    new { Produto = "Café",  Qtd = 2,  Total = 50m },
    new { Produto = "Pão",   Qtd = 30, Total = 30m }
};

var resumo = vendas
    .GroupBy(v => v.Produto)
    .Select(g => new
    {
        Produto    = g.Key,
        QtdTotal   = g.Sum(v => v.Qtd),
        Receita    = g.Sum(v => v.Total),
        TicketMed  = g.Average(v => v.Total)
    })
    .OrderByDescending(r => r.Receita);

foreach (var r in resumo)
    Console.WriteLine($"{r.Produto}: {r.QtdTotal} un, R$ {r.Receita}");
// Leite: 15 un, R$ 75
// Pão: 50 un, R$ 50
// Café: 2 un, R$ 50`})}),e.jsx("h2",{children:"Agrupando por chaves compostas"}),e.jsxs("p",{children:["Para agrupar por mais de um campo, use um ",e.jsx("strong",{children:"tipo anônimo"})," ou uma ",e.jsx("strong",{children:"tupla"})," como chave — o LINQ entende igualdade estrutural automaticamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`var lancamentos = new[]
{
    new { Ano = 2024, Mes = 1, Valor = 100m },
    new { Ano = 2024, Mes = 1, Valor =  50m },
    new { Ano = 2024, Mes = 2, Valor = 200m },
    new { Ano = 2025, Mes = 1, Valor =  75m }
};

var porAnoMes = lancamentos
    .GroupBy(l => new { l.Ano, l.Mes })
    .Select(g => new
    {
        g.Key.Ano,
        g.Key.Mes,
        Total = g.Sum(l => l.Valor)
    });

foreach (var x in porAnoMes)
    Console.WriteLine($"{x.Ano}/{x.Mes}: {x.Total}");`})}),e.jsxs(r,{type:"warning",title:"GroupBy é eager-ish",children:["Diferente de ",e.jsx("code",{children:"Where"}),"/",e.jsx("code",{children:"Select"})," (totalmente lazy), o primeiro ",e.jsx("code",{children:"foreach"})," no resultado de ",e.jsx("code",{children:"GroupBy"})," precisa percorrer a fonte inteira para montar os grupos. A partir daí, a iteração nos grupos é rápida — mas a primeira passada custa O(n)."]}),e.jsx("h2",{children:'ToLookup: a versão "indexável" do GroupBy'}),e.jsxs("p",{children:["Se você vai consultar grupos por chave várias vezes, prefira ",e.jsx("code",{children:"ToLookup"}),": ele materializa imediatamente em uma estrutura tipo dicionário onde cada chave aponta para uma sequência. Não lança exceção em chave inexistente — devolve sequência vazia."]}),e.jsx("pre",{children:e.jsx("code",{children:`var lookup = pessoas.ToLookup(p => p.Cidade);

foreach (var p in lookup["SP"]) Console.WriteLine(p.Nome);
foreach (var p in lookup["XX"]) Console.WriteLine(p.Nome); // vazio, sem erro`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Encadear ",e.jsx("code",{children:"OrderBy"})," em vez de usar ",e.jsx("code",{children:"ThenBy"})]}),": a segunda chamada apaga a primeira ordenação."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esperar que ",e.jsx("code",{children:"GroupBy"})," mantenha a ordem dos grupos por chave"]}),": ele mantém a ordem em que cada chave apareceu pela primeira vez. Se quer alfabética, encadeie ",e.jsx("code",{children:"OrderBy(g => g.Key)"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Iterar resultado de ",e.jsx("code",{children:"GroupBy"})," várias vezes"]}),": como qualquer query LINQ, recalcula. Materialize com ",e.jsx("code",{children:"ToList"})," ou prefira ",e.jsx("code",{children:"ToLookup"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar classe mutável como chave"}),": GroupBy depende de ",e.jsx("code",{children:"Equals"}),"/",e.jsx("code",{children:"GetHashCode"}),". Tipos anônimos e records já fazem certo; classes comuns precisam implementar."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"OrderBy"})," e ",e.jsx("code",{children:"OrderByDescending"})," ordenam por uma chave."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"ThenBy"}),"/",e.jsx("code",{children:"ThenByDescending"})," para desempate, nunca outro OrderBy."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GroupBy"})," separa em ",e.jsx("code",{children:"IGrouping<K, T>"})," com propriedade ",e.jsx("code",{children:"Key"}),"."]}),e.jsxs("li",{children:["Combine GroupBy + ",e.jsx("code",{children:"Select"})," + agregações (Sum, Avg, Count) para relatórios."]}),e.jsx("li",{children:"Para chaves compostas, use tipo anônimo ou tupla."}),e.jsxs("li",{children:[e.jsx("code",{children:"ToLookup"})," materializa para acesso rápido por chave."]})]})]})}export{n as default};
