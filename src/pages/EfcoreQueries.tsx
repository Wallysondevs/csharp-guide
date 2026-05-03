import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreQueries() {
  return (
    <PageContainer
      title="Consultando dados com LINQ no EF Core"
      subtitle="Como buscar, filtrar e projetar dados do banco usando código C# tipado, sem escrever SQL."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        <strong>LINQ</strong> (Language Integrated Query, "consulta integrada à linguagem") permite escrever consultas em C# como se fossem listas em memória — <code>Where</code>, <code>Select</code>, <code>OrderBy</code>. EF Core captura essas chamadas, traduz para SQL específico do banco e devolve objetos preenchidos. É como falar com um maître de restaurante em português: ele anota seu pedido em um idioma que a cozinha (o banco) entende.
      </p>
      <p>
        Mas há armadilhas: nem toda expressão LINQ pode ser traduzida; trazer mais colunas que o necessário desperdiça banda; rastrear objetos que você só vai exibir consome memória. Este capítulo cobre as práticas que separam consultas elegantes das que derrubam o servidor.
      </p>

      <h2>Where, OrderBy, Take: o básico</h2>
      <pre><code>{`// Filtro simples
var ativos = await db.Clientes
    .Where(c => c.Ativo && c.DataCadastro >= DateTime.UtcNow.AddYears(-1))
    .OrderByDescending(c => c.DataCadastro)
    .Take(50)
    .ToListAsync();

// SQL gerado (aproximado):
// SELECT TOP(50) * FROM Clientes
// WHERE Ativo = 1 AND DataCadastro >= @p0
// ORDER BY DataCadastro DESC`}</code></pre>
      <p>
        EF Core <em>não executa nada</em> até você chamar um método terminal como <code>ToListAsync</code>, <code>FirstOrDefaultAsync</code>, <code>CountAsync</code> ou <code>foreach</code>. Esse adiamento se chama <em>execução tardia</em> e é o que permite encadear chamadas eficientemente.
      </p>

      <h2>FirstOrDefault, Single, Find: buscando um único item</h2>
      <pre><code>{`// FirstOrDefaultAsync: retorna primeiro ou null
var c = await db.Clientes.FirstOrDefaultAsync(c => c.Email == "ana@x.com");

// SingleOrDefaultAsync: garante que só há 1 (ou nenhum) — joga se houver 2+
var unico = await db.Clientes.SingleOrDefaultAsync(c => c.Cpf == cpf);

// FindAsync: busca pela CHAVE PRIMÁRIA, e antes consulta o cache local
var porId = await db.Clientes.FindAsync(42);

// Se já estiver no change tracker, FindAsync nem vai ao banco`}</code></pre>
      <p>
        Use <code>FirstOrDefault</code> quando "qualquer um que bata serve", <code>Single</code> quando você espera unicidade (e quer falhar se não houver), e <code>Find</code> quando estiver consultando por chave primária.
      </p>

      <h2>Select: projetando só o que precisa</h2>
      <p>
        Trazer a entidade inteira quando você só precisa do nome é o <strong>over-fetch</strong> mais comum. <code>Select</code> projeta para um tipo anônimo ou DTO (<em>Data Transfer Object</em>):
      </p>
      <pre><code>{`// RUIM: traz todas as colunas, mesmo que use só duas
var nomes = (await db.Clientes.ToListAsync())
    .Select(c => new { c.Nome, c.Email });

// BOM: SELECT só Nome, Email no SQL
var nomes2 = await db.Clientes
    .Select(c => new { c.Nome, c.Email })
    .ToListAsync();

// Para DTO tipado (recomendado em APIs):
public record ClienteResumo(int Id, string Nome, int QtdPedidos);

var resumo = await db.Clientes
    .Select(c => new ClienteResumo(
        c.Id,
        c.Nome,
        c.Pedidos.Count()))            // já vira COUNT(*) no SQL
    .ToListAsync();`}</code></pre>

      <AlertBox type="success" title="Projeção desliga rastreamento de graça">
        Quando você projeta para um tipo que <em>não</em> é a entidade, EF Core não rastreia nada — porque DTOs não fazem parte do modelo. Isso já melhora bastante a performance sem precisar de <code>AsNoTracking</code>.
      </AlertBox>

      <h2>AsNoTracking: leitura pura, sem cache</h2>
      <p>
        Por padrão, todo objeto que vem do banco é guardado no <strong>change tracker</strong> — uma estrutura interna que detecta mudanças. Isso custa memória e CPU. Em telas de listagem onde você só vai exibir os dados, ative <code>AsNoTracking</code>:
      </p>
      <pre><code>{`// Lista para exibição: sem rastreamento
var produtos = await db.Produtos
    .AsNoTracking()
    .Where(p => p.Estoque > 0)
    .OrderBy(p => p.Nome)
    .ToListAsync();

// Variante: AsNoTrackingWithIdentityResolution
// Mantém deduplicação de objetos sem rastrear mudanças
var pedidos = await db.Pedidos
    .Include(p => p.Cliente)
    .AsNoTrackingWithIdentityResolution()
    .ToListAsync();`}</code></pre>
      <p>
        Você pode tornar o padrão "no tracking" para o contexto inteiro: <code>opt.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)</code> no <code>OnConfiguring</code>.
      </p>

      <h2>Async é obrigatório em apps web</h2>
      <p>
        Métodos como <code>ToListAsync</code>, <code>FirstOrDefaultAsync</code>, <code>CountAsync</code> liberam a thread do servidor enquanto o banco responde. Em uma API ASP.NET Core, usar a versão síncrona pode esgotar o pool de threads sob carga. Async é o padrão.
      </p>
      <pre><code>{`// Versão errada para web — bloqueia thread
var lista = db.Clientes.ToList();

// Versão correta
var listaAsync = await db.Clientes.ToListAsync();

// Nunca chame .Result ou .Wait() — risco de deadlock
var perigoso = db.Clientes.ToListAsync().Result; // EVITAR`}</code></pre>

      <h2>AsSplitQuery: múltiplos Includes sem explosão cartesiana</h2>
      <p>
        Quando você faz <code>Include</code> de várias coleções, o SQL gerado por padrão usa um único JOIN. Isso pode resultar em milhares de linhas duplicadas (produto cartesiano). <code>AsSplitQuery</code> divide em várias queries menores — geralmente mais rápido:
      </p>
      <pre><code>{`var pedidos = await db.Pedidos
    .Include(p => p.Itens)        // 1:N
    .Include(p => p.Pagamentos)    // outra 1:N
    .AsSplitQuery()                 // executa 3 SELECTs separados
    .ToListAsync();`}</code></pre>

      <h2>Operações de agregação</h2>
      <pre><code>{`// Contagem
var total = await db.Pedidos.CountAsync(p => p.Status == "Pago");

// Soma
var receita = await db.Pedidos
    .Where(p => p.Status == "Pago")
    .SumAsync(p => p.ValorTotal);

// Média e máximo
var ticketMedio = await db.Pedidos.AverageAsync(p => p.ValorTotal);
var maior = await db.Pedidos.MaxAsync(p => p.ValorTotal);

// Agrupamento
var porMes = await db.Pedidos
    .GroupBy(p => new { p.DataPedido.Year, p.DataPedido.Month })
    .Select(g => new {
        g.Key.Year, g.Key.Month,
        Quantidade = g.Count(),
        Receita = g.Sum(p => p.ValorTotal)
    })
    .ToListAsync();`}</code></pre>

      <h2>Inspecionando o SQL gerado</h2>
      <p>
        Para entender (e otimizar) o que EF Core está fazendo, use <code>ToQueryString()</code>:
      </p>
      <pre><code>{`var query = db.Clientes
    .Where(c => c.Ativo)
    .OrderBy(c => c.Nome);

Console.WriteLine(query.ToQueryString());
// Imprime o SQL exato com parâmetros — sem executar`}</code></pre>

      <AlertBox type="warning" title="Cuidado com client evaluation">
        Funções C# que EF Core não consegue traduzir (ex.: <code>MeuMetodoLocal(c)</code>) eram avaliadas no cliente em versões antigas, escondendo lentidão. Hoje, EF Core <em>lança exceção</em> em vez de fazer isso silenciosamente. Bom — é melhor falhar cedo que processar 10 milhões de linhas em memória.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>Async</code>:</strong> bloqueia threads em apps web. Sempre <code>ToListAsync</code>, <code>FirstOrDefaultAsync</code>, etc.</li>
        <li><strong>Carregar entidade inteira só pra mostrar nome:</strong> use <code>Select</code> para projetar.</li>
        <li><strong>Esquecer <code>AsNoTracking</code> em listagens read-only:</strong> consome memória à toa.</li>
        <li><strong>Materializar antes de filtrar:</strong> <code>db.X.ToList().Where(...)</code> traz tudo do banco e filtra no cliente. Inverta a ordem.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>LINQ + EF Core = consultas tipadas que viram SQL.</li>
        <li>Sempre <code>Async</code> em apps web.</li>
        <li><code>Select</code> para evitar over-fetch.</li>
        <li><code>AsNoTracking</code> para listagens read-only.</li>
        <li><code>AsSplitQuery</code> evita explosão cartesiana com múltiplos Includes.</li>
        <li><code>ToQueryString()</code> mostra o SQL gerado para debug.</li>
      </ul>
    </PageContainer>
  );
}
