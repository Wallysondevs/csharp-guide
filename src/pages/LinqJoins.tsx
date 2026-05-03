import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqJoins() {
  return (
    <PageContainer
      title="LINQ: Join, GroupJoin e SelectMany"
      subtitle="Como combinar duas coleções relacionadas — equivalente aos JOINs do SQL — usando LINQ."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Imagine que você tem duas listas: uma de <strong>clientes</strong> e outra de <strong>pedidos</strong>. Cada pedido carrega o <code>ClienteId</code> de quem o fez. Para gerar um relatório "Maria comprou um sofá", você precisa <em>cruzar</em> as duas listas pelo identificador comum. Em bancos de dados isso se chama <strong>JOIN</strong>; em LINQ, a ideia é a mesma. Este capítulo mostra três ferramentas: <code>Join</code> (cruzamento simples), <code>GroupJoin</code> (cruzamento agrupando o lado N) e <code>SelectMany</code> (achatamento de coleções aninhadas).
      </p>

      <h2>Os dados de exemplo</h2>
      <p>
        Vamos usar <code>record</code> (uma forma curta de declarar uma classe imutável) para representar nossos modelos. Toda essa seção usa essas duas listas:
      </p>
      <pre><code>{`record Cliente(int Id, string Nome);
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
};`}</code></pre>
      <p>
        Note que Ana (Id 3) não tem pedidos. Isso será importante para diferenciar <code>Join</code> de <code>GroupJoin</code>.
      </p>

      <h2>Join: o "INNER JOIN" do LINQ</h2>
      <p>
        <code>Join</code> casa um item da primeira coleção com cada item correspondente da segunda. Quem não tiver par é <strong>descartado</strong> — exatamente como o INNER JOIN do SQL. A assinatura pede quatro coisas: a coleção externa, a chave externa (<em>cliente.Id</em>), a chave interna (<em>pedido.ClienteId</em>) e uma função que produz o resultado a partir do par casado.
      </p>
      <pre><code>{`// Method syntax
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
// (Ana não aparece — não tinha pedidos)`}</code></pre>

      <h2>A mesma coisa em query syntax</h2>
      <p>
        A <strong>sintaxe de query</strong> (parecida com SQL) costuma ser mais legível para joins. O compilador converte exatamente para o <code>Join</code> que acabamos de ver.
      </p>
      <pre><code>{`var rel = from c in clientes
          join p in pedidos on c.Id equals p.ClienteId
          select new { c.Nome, p.Produto, p.Valor };`}</code></pre>
      <p>
        Repare na palavra-chave <code>equals</code> — em LINQ ela é obrigatória no lugar de <code>==</code> dentro de um <code>join</code>, porque o compilador precisa identificar qual lado é qual chave.
      </p>

      <AlertBox type="info" title="A ordem das chaves importa">
        Em <code>join p in pedidos on c.Id equals p.ClienteId</code>, o lado esquerdo do <code>equals</code> deve ser a chave da coleção externa (<code>c</code>) e o direito a da interna (<code>p</code>). Inverter dá erro de compilação.
      </AlertBox>

      <h2>GroupJoin: o "LEFT JOIN" agrupado</h2>
      <p>
        E se quisermos listar <strong>todos</strong> os clientes — inclusive Ana, que não comprou nada — junto com seus pedidos agrupados? É o trabalho do <code>GroupJoin</code>. Em vez de produzir um item por par, ele produz um item por elemento da coleção externa, com uma <em>sub-coleção</em> dos itens internos correspondentes.
      </p>
      <pre><code>{`var rel = clientes.GroupJoin(
    pedidos,
    c => c.Id,
    p => p.ClienteId,
    (c, ps) => new { c.Nome, Pedidos = ps.ToList() }
);

foreach (var r in rel)
    Console.WriteLine($"{r.Nome}: {r.Pedidos.Count} pedido(s)");

// Maria: 2 pedido(s)
// João:  1 pedido(s)
// Ana:   0 pedido(s)`}</code></pre>

      <h2>SelectMany: aplainando coleções aninhadas</h2>
      <p>
        Imagine que você tem uma lista de clientes e cada cliente já carrega sua própria lista de pedidos. <code>Select</code> daria uma <em>lista de listas</em>; <code>SelectMany</code> "aplaina" tudo em <strong>uma única sequência</strong>. É o mesmo conceito de <code>flatMap</code> em outras linguagens.
      </p>
      <pre><code>{`record Cliente2(string Nome, List<string> Compras);

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
// → { Maria,Sofá }, { Maria,Mesa }, { João,Cadeira }`}</code></pre>

      <p>
        A versão de duas funções é especialmente útil porque preserva o "dono" de cada item achatado — exatamente o que um <code>JOIN</code> faria com tabelas pai/filho.
      </p>

      <AlertBox type="warning" title="Join não é ordenado">
        O resultado de <code>Join</code> não garante a ordem original. Se você precisa de ordem específica, encadeie um <code>OrderBy</code> no final. Em LINQ-to-Objects a ordem normalmente é preservada da coleção externa, mas em LINQ-to-SQL/EF, o banco decide.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>==</code> em vez de <code>equals</code></strong> dentro do <code>join</code> — não compila.</li>
        <li><strong>Esperar registros "sem par" no <code>Join</code></strong> — eles somem. Use <code>GroupJoin</code> + <code>DefaultIfEmpty</code> para simular LEFT JOIN.</li>
        <li><strong>Confundir <code>Select</code> e <code>SelectMany</code></strong>: o primeiro mantém a estrutura aninhada; o segundo aplaina.</li>
        <li><strong>Joins sem índice em EF</strong>: se a coluna usada não tem índice no banco, o desempenho cai brutalmente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Join</code> equivale ao INNER JOIN: descarta itens sem par.</li>
        <li><code>GroupJoin</code> equivale a um LEFT JOIN agrupado: mantém todos da esquerda, com sub-coleção da direita.</li>
        <li><code>SelectMany</code> achata coleções aninhadas em uma única sequência.</li>
        <li>Em <code>join</code>, use a palavra-chave <code>equals</code>, nunca <code>==</code>.</li>
        <li>Query syntax é mais legível para joins; method syntax dá mais flexibilidade.</li>
      </ul>
    </PageContainer>
  );
}
