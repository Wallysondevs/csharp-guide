import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinqDeferredExecution() {
  return (
    <PageContainer
      title="Execução adiada (deferred) em LINQ"
      subtitle="Por que sua query LINQ não roda quando você a escreve — e o que isso significa na prática."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine que você anota uma <strong>receita</strong> num papel: "pegar tomate, picar, refogar". Ler a receita não cozinha nada — ela só descreve <em>o que fazer</em>. Cozinhar acontece quando você executa os passos. LINQ funciona assim: quando você escreve <code>lista.Where(x =&gt; x &gt; 10).Select(x =&gt; x * 2)</code>, nenhum item é processado. Você criou uma <strong>receita</strong>. A execução real só ocorre quando alguém "consome" essa receita iterando sobre ela. Isso se chama <strong>execução adiada</strong> (deferred execution) e é uma das ideias mais importantes para entender LINQ de verdade.
      </p>

      <h2>O experimento que prova tudo</h2>
      <p>
        Vamos provar isso com um exemplo simples. Observe quando o <code>Console.WriteLine</code> dentro do <code>Where</code> é impresso:
      </p>
      <pre><code>{`var numeros = new List<int> { 1, 2, 3 };

var query = numeros.Where(n => {
    Console.WriteLine($"Filtrando {n}");
    return n > 1;
});

Console.WriteLine("Query criada. Nada foi filtrado ainda.");

foreach (var n in query)
    Console.WriteLine($"Resultado: {n}");

// Saída:
// Query criada. Nada foi filtrado ainda.
// Filtrando 1
// Filtrando 2
// Resultado: 2
// Filtrando 3
// Resultado: 3`}</code></pre>
      <p>
        Note dois fatos surpreendentes: (1) "Filtrando" só apareceu <em>depois</em> de "Query criada" — porque o <code>Where</code> não rodou na hora; e (2) o filtro é executado <em>item a item</em>, intercalado com os <code>foreach</code>, não tudo de uma vez.
      </p>

      <h2>Repetir o foreach reexecuta a query</h2>
      <p>
        Como a query é uma "receita", iterar duas vezes <strong>reexecuta tudo</strong>. Isso é especialmente perigoso quando há custo (chamada de banco, leitura de arquivo, geração aleatória).
      </p>
      <pre><code>{`var random = new Random();
var query = Enumerable.Range(1, 3).Select(_ => random.Next(100));

foreach (var n in query) Console.Write($"{n} ");
Console.WriteLine();
foreach (var n in query) Console.Write($"{n} ");

// Saída (exemplo):
// 42 17 88
// 5 91 23      ← valores DIFERENTES!`}</code></pre>

      <AlertBox type="warning" title="Bug clássico">
        Se você pega resultados diferentes a cada iteração de uma "mesma" query, é quase certeza que você está reexecutando uma query adiada. A solução é <strong>materializar</strong> com <code>ToList()</code>.
      </AlertBox>

      <h2>Materializando: ToList, ToArray, ToDictionary, ToHashSet</h2>
      <p>
        Os métodos <code>To...</code> forçam a execução <em>imediata</em>: eles percorrem a receita uma vez e guardam o resultado em uma coleção concreta na memória. A partir daí, iterar é só ler a coleção (sem custo extra).
      </p>
      <pre><code>{`// Adiada — não roda nada:
IEnumerable<int> queryAdiada = numeros.Where(n => n > 10);

// Materializada — roda agora e guarda na memória:
List<int>             lista = queryAdiada.ToList();
int[]                 array = queryAdiada.ToArray();
Dictionary<int, bool> dic   = queryAdiada.ToDictionary(n => n, n => true);
HashSet<int>          conj  = queryAdiada.ToHashSet();`}</code></pre>
      <p>
        Outros métodos que <strong>também</strong> forçam execução: <code>Count</code>, <code>Sum</code>, <code>First</code>, <code>Single</code>, <code>Any</code>, <code>All</code>, <code>Aggregate</code>, e o próprio <code>foreach</code>. Em geral, qualquer método que <em>não</em> devolva outra <code>IEnumerable</code> executa imediatamente.
      </p>

      <h2>Erros que só aparecem quando você itera</h2>
      <p>
        Como a query só roda na hora de iterar, exceções (como divisão por zero ou referência nula) só estouram lá — bem longe da linha onde você escreveu a query. Isso confunde muito iniciantes que esperam o erro acontecer onde a query foi declarada.
      </p>
      <pre><code>{`int[] dados = { 10, 5, 0, 2 };

// Esta linha NÃO lança nada. Cria só a "receita".
var query = dados.Select(d => 100 / d);

try {
    foreach (var x in query) Console.WriteLine(x);
} catch (DivideByZeroException) {
    Console.WriteLine("Boom — só agora!");
}`}</code></pre>

      <h2>IQueryable: a árvore de expressões</h2>
      <p>
        Em coleções na memória (<code>List</code>, <code>Array</code>), LINQ usa <code>IEnumerable</code> e simplesmente armazena os <em>delegates</em> (funções) para chamar depois. Mas em <strong>EF Core</strong> (Entity Framework, o ORM padrão da Microsoft que conversa com banco de dados), o tipo é <code>IQueryable&lt;T&gt;</code>, e algo mais sofisticado acontece: cada operação (<code>Where</code>, <code>Select</code>...) <em>constrói uma árvore de expressões</em> — uma estrutura que descreve "filtrar X tal que Y, projetar para Z".
      </p>
      <pre><code>{`// EF Core — query NÃO executa, só constrói árvore:
IQueryable<Cliente> q = db.Clientes
    .Where(c => c.Cidade == "SP")
    .OrderBy(c => c.Nome);

// Quando você itera, EF traduz a árvore para SQL:
//   SELECT * FROM Clientes WHERE Cidade='SP' ORDER BY Nome
// e só aí dispara a chamada ao banco.
var lista = q.ToList(); // dispara o SELECT`}</code></pre>
      <p>
        É por isso que adicionar <code>.Where()</code> em uma query do EF não puxa nada — só refina a árvore. Quando você finalmente chama <code>ToList()</code>, <code>First()</code>, ou faz <code>foreach</code>, o EF traduz tudo num SQL único, otimizado, e executa.
      </p>

      <AlertBox type="info" title="Quando materializar?">
        Se você vai iterar a coleção <strong>uma única vez</strong>, deixe adiada. Se vai iterar várias vezes, ou usar em vários lugares, <code>ToList()</code> uma vez e reutilize. A regra de ouro: nunca iterar duas vezes uma <code>IEnumerable</code> que custa caro.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Iterar a mesma query múltiplas vezes</strong> — reexecuta tudo. Use <code>ToList()</code>.</li>
        <li><strong>Achar que um <code>Where</code> "filtrou" a coleção</strong> — não filtrou nada; só descreveu o filtro.</li>
        <li><strong>Capturar variável em closure</strong> dentro do <code>Select</code> e mudá-la depois — quando a query rodar, vai usar o valor atualizado, não o antigo.</li>
        <li><strong>Aplicar regras "in-memory" em <code>IQueryable</code></strong> que o EF não consegue traduzir — vira exceção em runtime.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>LINQ adia execução: <code>Where</code>/<code>Select</code> só descrevem a operação.</li>
        <li>Iterar (<code>foreach</code>, <code>ToList</code>, <code>Count</code>...) <em>dispara</em> a execução.</li>
        <li>Iterar várias vezes <strong>reexecuta</strong> a query inteira.</li>
        <li><code>ToList()</code>, <code>ToArray()</code> materializam o resultado em memória.</li>
        <li>Em <code>IQueryable</code> (EF Core), uma <em>árvore de expressões</em> é construída e traduzida para SQL na execução.</li>
        <li>Exceções dentro da query estouram só ao iterar — não ao declarar.</li>
      </ul>
    </PageContainer>
  );
}
