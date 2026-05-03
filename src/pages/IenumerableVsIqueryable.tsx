import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IenumerableVsIqueryable() {
  return (
    <PageContainer
      title="IEnumerable vs IQueryable: a diferença crucial"
      subtitle="A escolha entre essas duas interfaces define se sua query roda na memória ou no banco — e pode mudar o desempenho em ordens de magnitude."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine duas formas de pesquisar livros numa biblioteca. Na primeira, você pede ao bibliotecário uma <em>cópia inteira</em> do catálogo, leva para casa e depois vai filtrando os títulos que te interessam. Na segunda, você apenas <em>descreve</em> o que quer ("livros de C# de 2020 em diante") e o bibliotecário busca diretamente nas estantes, te entregando apenas o que precisa. <code>IEnumerable&lt;T&gt;</code> é a primeira abordagem; <code>IQueryable&lt;T&gt;</code> é a segunda. Confundir as duas em uma aplicação real com banco de dados pode fazer você puxar uma tabela inteira de milhões de linhas para filtrar 10 — um desastre de performance. Este capítulo explica de uma vez por todas a diferença.
      </p>

      <h2>O que é IEnumerable&lt;T&gt;</h2>
      <p>
        <code>IEnumerable&lt;T&gt;</code> é a interface mais básica de coleções no .NET. Tudo o que ela promete é "eu sei te dar um item por vez, em sequência". Quase toda coleção (<code>List</code>, <code>Array</code>, <code>HashSet</code>, <code>Dictionary</code>) implementa <code>IEnumerable&lt;T&gt;</code>. Quando você aplica LINQ sobre ela, os métodos como <code>Where</code> e <code>Select</code> recebem <strong>delegates</strong> (funções) e os executam em memória, item a item.
      </p>
      <pre><code>{`using System.Linq;

IEnumerable<int> numeros = new List<int> { 1, 2, 3, 4, 5 };

// O Where recebe um Func<int, bool> — uma função normal.
// Filtra na memória, item por item.
var pares = numeros.Where(n => n % 2 == 0);

foreach (var n in pares)
    Console.WriteLine(n);  // 2, 4`}</code></pre>

      <h2>O que é IQueryable&lt;T&gt;</h2>
      <p>
        <code>IQueryable&lt;T&gt;</code> herda de <code>IEnumerable&lt;T&gt;</code>, mas com um superpoder: em vez de receber um delegate executável, ele recebe uma <code>Expression&lt;Func&lt;...&gt;&gt;</code> — uma <strong>árvore de expressões</strong>, ou seja, o seu lambda <em>analisado e representado como dados</em>. Um <em>provedor</em> (como o EF Core) lê essa árvore e <strong>traduz</strong> para outra linguagem — tipicamente SQL.
      </p>
      <pre><code>{`using Microsoft.EntityFrameworkCore;

// db.Clientes é IQueryable<Cliente>
IQueryable<Cliente> q = db.Clientes
    .Where(c => c.Cidade == "São Paulo")
    .OrderBy(c => c.Nome)
    .Take(10);

// Até aqui, NENHUM SQL foi enviado ao banco.
// O EF construiu uma árvore de expressões que descreve a query.

// Quando você materializa, o EF traduz e dispara:
//   SELECT TOP(10) * FROM Clientes
//   WHERE Cidade = 'São Paulo' ORDER BY Nome
List<Cliente> resultado = await q.ToListAsync();`}</code></pre>

      <h2>O bug clássico: cast acidental para IEnumerable</h2>
      <p>
        O perigo aparece quando você converte (intencionalmente ou não) um <code>IQueryable</code> em <code>IEnumerable</code> antes de filtrar. A partir desse ponto, toda operação <strong>roda na memória</strong> — e o EF é obrigado a puxar a tabela inteira do banco para você filtrar localmente.
      </p>
      <pre><code>{`// ❌ DESASTRE: AsEnumerable() materializa em memória
var caros = db.Produtos
    .AsEnumerable()                       // baixa TODA a tabela
    .Where(p => p.Preco > 1000m)          // filtra em memória
    .ToList();
// Se a tabela tem 10 milhões de linhas: 10M de linhas vão pelo cabo.

// ✅ CERTO: filtro acontece no banco
var caros2 = db.Produtos
    .Where(p => p.Preco > 1000m)          // vira WHERE em SQL
    .ToList();
// Apenas as linhas que casam descem pelo cabo.`}</code></pre>

      <AlertBox type="danger" title="Cuidado com chamadas que não traduzem">
        Se você usa um método dentro do <code>Where</code> que o EF não sabe traduzir para SQL (ex.: uma função sua de C#), em versões antigas do EF a query inteira era materializada silenciosamente. No EF Core 3+ você recebe uma <strong>exceção</strong>. A mensagem é longa, mas é amiga: ela está te impedindo de detonar o desempenho.
      </AlertBox>

      <h2>Por que Expression&lt;Func&gt; e não Func direto?</h2>
      <p>
        Compare as duas assinaturas de <code>Where</code>:
      </p>
      <pre><code>{`// Sobre IEnumerable<T> — recebe Func executável
IEnumerable<T> Where<T>(this IEnumerable<T> src, Func<T, bool> predicado);

// Sobre IQueryable<T> — recebe Expression<Func<...>>
IQueryable<T> Where<T>(this IQueryable<T> src,
                       Expression<Func<T, bool>> predicado);`}</code></pre>
      <p>
        A diferença é mágica: quando você escreve <code>c =&gt; c.Cidade == "SP"</code>, o compilador precisa decidir o que produzir. Se o método espera <code>Func</code>, gera código executável. Se espera <code>Expression&lt;Func&gt;</code>, gera uma <em>estrutura de dados</em> que descreve a operação ("igualdade", "propriedade Cidade", "literal SP"). É essa estrutura que o EF caminha para gerar SQL.
      </p>

      <h2>Quando converter de propósito?</h2>
      <p>
        Há momentos em que materializar é o certo: quando você precisa usar uma função C# que o EF não traduz, ou quando vai aplicar muitas operações sobre o mesmo conjunto pequeno. O método se chama <code>AsEnumerable()</code> — e você o usa <em>conscientemente</em>.
      </p>
      <pre><code>{`// Filtra no banco (rápido), depois aplica formatação local complexa:
var resultado = db.Produtos
    .Where(p => p.Categoria == "Eletrônico")    // SQL no banco
    .AsEnumerable()                              // baixa só esses
    .Select(p => new {
        p.Nome,
        Slug = MeuFormatador.Slugify(p.Nome)    // C# puro, ok agora
    })
    .ToList();`}</code></pre>

      <h2>Resumo da diferença em uma tabela</h2>
      <table>
        <thead>
          <tr><th>Aspecto</th><th>IEnumerable&lt;T&gt;</th><th>IQueryable&lt;T&gt;</th></tr>
        </thead>
        <tbody>
          <tr><td>Onde executa</td><td>Memória (cliente)</td><td>Onde o provedor implementa (banco, API...)</td></tr>
          <tr><td>Lambda recebida</td><td><code>Func&lt;T, bool&gt;</code></td><td><code>Expression&lt;Func&lt;T, bool&gt;&gt;</code></td></tr>
          <tr><td>Filtro reduz dados na rede?</td><td>Não — tudo já veio</td><td>Sim — vira WHERE no SQL</td></tr>
          <tr><td>Suporta C# arbitrário</td><td>Sim</td><td>Só o que o provedor sabe traduzir</td></tr>
          <tr><td>Casa de uso</td><td>Coleções na memória</td><td>EF Core, LINQ-to-SQL, OData...</td></tr>
        </tbody>
      </table>

      <h2>Como saber qual está em uso?</h2>
      <p>
        Olhe o tipo declarado da variável. <code>List</code>, <code>[]</code>, <code>HashSet</code> → você está em <code>IEnumerable</code>. <code>DbSet&lt;T&gt;</code>, qualquer coisa que veio de <code>db.MinhaTabela</code> → você está em <code>IQueryable</code>. Quando em dúvida, hover do IDE mostra o tipo. Use <code>var</code> com cuidado — ela esconde a diferença visualmente.
      </p>
      <pre><code>{`var q1 = db.Produtos.Where(p => p.Ativo);
// IDE mostra: IQueryable<Produto>  ✅

var q2 = db.Produtos.ToList().Where(p => p.Ativo);
// IDE mostra: IEnumerable<Produto> — virou memória após ToList()`}</code></pre>

      <AlertBox type="warning" title="Repositórios mal feitos">
        Um anti-padrão comum é encapsular <code>db.Tabela</code> dentro de um repositório que devolve <code>IEnumerable&lt;T&gt;</code>. Isso <strong>destrói</strong> a capacidade de filtrar no banco. Devolva <code>IQueryable&lt;T&gt;</code> se quiser deixar o consumidor compor; ou ofereça métodos específicos por caso de uso.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>.ToList().Where(...)</code></strong> — materializa antes de filtrar; carrega tudo do banco.</li>
        <li><strong>Chamar funções C# dentro de <code>Where</code> em IQueryable</strong> — o EF não traduz e lança exceção.</li>
        <li><strong>Repositório que retorna <code>IEnumerable</code></strong> — perde toda a otimização do EF.</li>
        <li><strong>Usar <code>AsEnumerable</code> sem precisar</strong> — defeito de performance disfarçado.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>IEnumerable&lt;T&gt;</code>: roda na memória; aceita qualquer lambda C#.</li>
        <li><code>IQueryable&lt;T&gt;</code>: árvore de expressões traduzida pelo provedor (EF Core → SQL).</li>
        <li>A diferença é o tipo do parâmetro: <code>Func</code> vs <code>Expression&lt;Func&gt;</code>.</li>
        <li>Filtros em <code>IQueryable</code> reduzem dados <em>no banco</em> antes de viajarem pela rede.</li>
        <li><code>AsEnumerable()</code> e <code>ToList()</code> "aterrissam" a query — use com consciência.</li>
        <li>Devolver <code>IEnumerable</code> em camadas de repositório é um anti-padrão.</li>
      </ul>
    </PageContainer>
  );
}
