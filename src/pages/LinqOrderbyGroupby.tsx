import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqOrderbyGroupby() {
  return (
    <PageContainer
      title="LINQ: OrderBy, ThenBy e GroupBy"
      subtitle="Ordene por um ou vários critérios e agrupe coleções como em um SELECT … GROUP BY do SQL — sem sair do C#."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Depois de filtrar e projetar, a próxima dupla de operadores LINQ que você usará todos os dias é <strong>OrderBy</strong> (ordenar) e <strong>GroupBy</strong> (agrupar). São as ferramentas que fazem relatórios saírem como você espera: "lista de funcionários ordenada por nome", "vendas agrupadas por mês", "pessoas agrupadas por faixa etária somando salários". Imagine uma planilha do Excel com botões de "ordenar" e "subtotal por categoria" — é exatamente isso, só que em código.
      </p>

      <h2>OrderBy: ordenando por um critério</h2>
      <p>
        <code>OrderBy</code> recebe uma lambda que extrai a <strong>chave de ordenação</strong> e devolve a sequência ordenada de forma crescente. <code>OrderByDescending</code> faz o oposto. Diferente de <code>List.Sort</code>, LINQ <em>não</em> modifica a coleção original — devolve uma nova sequência.
      </p>
      <pre><code>{`var pessoas = new[]
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
var maisVelhos = pessoas.OrderByDescending(p => p.Idade);`}</code></pre>

      <h2>ThenBy: critérios de desempate</h2>
      <p>
        E quando duas pessoas têm o mesmo nome, ou a mesma idade? Você precisa de <em>desempate</em>. Para isso existe <code>ThenBy</code> (e <code>ThenByDescending</code>): aplica um critério secundário <em>dentro</em> dos itens que o primeiro empatou.
      </p>
      <pre><code>{`var alunos = new[]
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
// B - 9.0 - Ana`}</code></pre>

      <AlertBox type="info" title="Sempre use ThenBy, nunca encadeie OrderBy">
        Encadear <code>.OrderBy(a).OrderBy(b)</code> faz a <em>segunda</em> ordenação <strong>desfazer</strong> a primeira (porque OrderBy ignora a ordem prévia). Para múltiplos critérios use sempre <code>OrderBy(...).ThenBy(...)</code>.
      </AlertBox>

      <h2>OrderBy com chaves customizadas</h2>
      <p>
        A chave pode ser qualquer expressão, inclusive cálculos. Você também pode passar um <code>IComparer&lt;T&gt;</code> como segundo argumento para regras malucas (ex: ordenar strings ignorando acentos).
      </p>
      <pre><code>{`var palavras = new[] { "abacaxi", "kiwi", "uva", "morango" };

// Ordenar por tamanho da palavra
var porTamanho = palavras.OrderBy(p => p.Length);
// uva, kiwi, morango, abacaxi

// Strings case-insensitive
var ci = palavras.OrderBy(p => p, StringComparer.OrdinalIgnoreCase);`}</code></pre>

      <h2>GroupBy: agrupando por chave</h2>
      <p>
        <code>GroupBy</code> separa a sequência em <em>grupos</em> baseados em uma chave que você extrai de cada item. O resultado é uma sequência de <code>IGrouping&lt;TKey, TElement&gt;</code> — cada grupo tem uma propriedade <code>Key</code> e é ele mesmo iterável.
      </p>
      <pre><code>{`var pessoas = new[]
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
// === MG (1) === Diego`}</code></pre>

      <h2>GroupBy + agregações: o relatório clássico</h2>
      <p>
        A combinação mais útil é agrupar e em seguida calcular alguma estatística por grupo (soma, média, contagem, máximo). Combine com <code>Select</code> para projetar um resumo:
      </p>
      <pre><code>{`var vendas = new[]
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
// Café: 2 un, R$ 50`}</code></pre>

      <h2>Agrupando por chaves compostas</h2>
      <p>
        Para agrupar por mais de um campo, use um <strong>tipo anônimo</strong> ou uma <strong>tupla</strong> como chave — o LINQ entende igualdade estrutural automaticamente.
      </p>
      <pre><code>{`var lancamentos = new[]
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
    Console.WriteLine($"{x.Ano}/{x.Mes}: {x.Total}");`}</code></pre>

      <AlertBox type="warning" title="GroupBy é eager-ish">
        Diferente de <code>Where</code>/<code>Select</code> (totalmente lazy), o primeiro <code>foreach</code> no resultado de <code>GroupBy</code> precisa percorrer a fonte inteira para montar os grupos. A partir daí, a iteração nos grupos é rápida — mas a primeira passada custa O(n).
      </AlertBox>

      <h2>ToLookup: a versão "indexável" do GroupBy</h2>
      <p>
        Se você vai consultar grupos por chave várias vezes, prefira <code>ToLookup</code>: ele materializa imediatamente em uma estrutura tipo dicionário onde cada chave aponta para uma sequência. Não lança exceção em chave inexistente — devolve sequência vazia.
      </p>
      <pre><code>{`var lookup = pessoas.ToLookup(p => p.Cidade);

foreach (var p in lookup["SP"]) Console.WriteLine(p.Nome);
foreach (var p in lookup["XX"]) Console.WriteLine(p.Nome); // vazio, sem erro`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Encadear <code>OrderBy</code> em vez de usar <code>ThenBy</code></strong>: a segunda chamada apaga a primeira ordenação.</li>
        <li><strong>Esperar que <code>GroupBy</code> mantenha a ordem dos grupos por chave</strong>: ele mantém a ordem em que cada chave apareceu pela primeira vez. Se quer alfabética, encadeie <code>OrderBy(g =&gt; g.Key)</code>.</li>
        <li><strong>Iterar resultado de <code>GroupBy</code> várias vezes</strong>: como qualquer query LINQ, recalcula. Materialize com <code>ToList</code> ou prefira <code>ToLookup</code>.</li>
        <li><strong>Usar classe mutável como chave</strong>: GroupBy depende de <code>Equals</code>/<code>GetHashCode</code>. Tipos anônimos e records já fazem certo; classes comuns precisam implementar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>OrderBy</code> e <code>OrderByDescending</code> ordenam por uma chave.</li>
        <li>Use <code>ThenBy</code>/<code>ThenByDescending</code> para desempate, nunca outro OrderBy.</li>
        <li><code>GroupBy</code> separa em <code>IGrouping&lt;K, T&gt;</code> com propriedade <code>Key</code>.</li>
        <li>Combine GroupBy + <code>Select</code> + agregações (Sum, Avg, Count) para relatórios.</li>
        <li>Para chaves compostas, use tipo anônimo ou tupla.</li>
        <li><code>ToLookup</code> materializa para acesso rápido por chave.</li>
      </ul>
    </PageContainer>
  );
}
