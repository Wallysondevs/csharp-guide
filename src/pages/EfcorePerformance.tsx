import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcorePerformance() {
  return (
    <PageContainer
      title="Performance no EF Core: armadilhas e soluções"
      subtitle="Como diagnosticar e eliminar os gargalos mais comuns que transformam seu app em uma tartaruga."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        EF Core é rápido — mas é também muito fácil de tornar lento. Cada conveniência (rastreamento, lazy loading, navegações ricas) tem um custo. A boa notícia é que 80% dos problemas de performance se resolvem com cinco ou seis técnicas conhecidas. Pense nelas como hábitos de "boa higiene" para queries, na linha de "olhar para os dois lados antes de atravessar a rua".
      </p>
      <p>
        Antes de otimizar, <strong>meça</strong>. Use logs de SQL (<code>opt.LogTo(Console.WriteLine)</code>), Application Insights, ou MiniProfiler. Otimizar sem dados é chutar no escuro. Depois disso, aplique as ferramentas abaixo na ordem do impacto.
      </p>

      <h2>1. AsNoTracking em listagens read-only</h2>
      <p>
        O <strong>change tracker</strong> é a estrutura interna que detecta mudanças nos seus objetos. Ele custa memória (uma cópia de cada entidade) e CPU (comparações na hora do <code>SaveChanges</code>). Se a query é só para exibir dados, desligue:
      </p>
      <pre><code>{`// Lista de produtos para exibição na home — não vai ser modificada
var produtos = await db.Produtos
    .AsNoTracking()
    .Where(p => p.Ativo)
    .OrderBy(p => p.Nome)
    .ToListAsync();

// Para o contexto inteiro virar no-tracking por padrão:
opt.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);`}</code></pre>
      <p>
        O ganho é tipicamente 30–50% em queries grandes, sem perder nada se você não vai modificar os objetos.
      </p>

      <h2>2. Projeção com Select para evitar over-fetch</h2>
      <p>
        Carregar a entidade inteira para mostrar só dois campos é desperdício. Projete para um DTO ou tipo anônimo:
      </p>
      <pre><code>{`// LENTO: SELECT * FROM Pedidos
var lista = await db.Pedidos.AsNoTracking().ToListAsync();
return lista.Select(p => new { p.Id, p.Total });

// RÁPIDO: SELECT Id, Total FROM Pedidos
var lista2 = await db.Pedidos
    .Select(p => new { p.Id, p.Total })
    .ToListAsync();

// Em APIs, projete direto para o DTO de resposta
public record PedidoResumoDto(int Id, DateTime Data, decimal Total);

var resposta = await db.Pedidos
    .Where(p => p.ClienteId == clienteId)
    .Select(p => new PedidoResumoDto(p.Id, p.Data, p.Total))
    .ToListAsync();`}</code></pre>

      <AlertBox type="success" title="Select também desliga tracking">
        Quando você projeta para um tipo que não é a entidade rastreada, EF Core nem cadastra no change tracker — ganho duplo de graça.
      </AlertBox>

      <h2>3. Cuidado com Includes desnecessários</h2>
      <p>
        Cada <code>Include</code> aumenta o JOIN. Pergunte: você realmente vai usar essa navegação? Se for para mostrar uma única propriedade do relacionado, projete:
      </p>
      <pre><code>{`// EVITE — traz Cliente inteiro só para mostrar nome
var pedidos = await db.Pedidos
    .Include(p => p.Cliente)
    .ToListAsync();
foreach (var p in pedidos) Console.WriteLine(p.Cliente.Nome);

// PREFIRA — traz só o que precisa
var resumo = await db.Pedidos
    .Select(p => new { p.Id, NomeCliente = p.Cliente.Nome })
    .ToListAsync();`}</code></pre>

      <h2>4. SplitQuery vs SingleQuery</h2>
      <p>
        Quando há múltiplos <code>Include</code> de coleções (1:N), EF Core gera uma única query com JOINs — que produz o <strong>produto cartesiano</strong>: linhas duplicadas que ele depois deduplica em memória. Para 1 pedido com 5 itens e 3 pagamentos, vêm 15 linhas. Em escala, é desastroso.
      </p>
      <pre><code>{`// 1 query enorme, com explosão cartesiana
var pedidos = await db.Pedidos
    .Include(p => p.Itens)
    .Include(p => p.Pagamentos)
    .ToListAsync();

// 3 queries menores, sem cartesiano
var pedidosOk = await db.Pedidos
    .Include(p => p.Itens)
    .Include(p => p.Pagamentos)
    .AsSplitQuery()
    .ToListAsync();

// Definir como padrão para o contexto:
opt.UseSqlServer(cs, sql => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));`}</code></pre>

      <h2>5. Compiled queries para queries hot-path</h2>
      <p>
        EF Core "compila" cada LINQ em SQL na primeira vez e <em>cacheia</em> internamente. Para queries chamadas milhares de vezes por segundo, você pode pré-compilar manualmente, eliminando o overhead de lookup:
      </p>
      <pre><code>{`private static readonly Func<LojaContext, int, Task<Cliente?>> BuscarPorIdCompilado =
    EF.CompileAsyncQuery((LojaContext db, int id) =>
        db.Clientes.FirstOrDefault(c => c.Id == id));

// Uso (10–20% mais rápido em alta frequência):
var c = await BuscarPorIdCompilado(db, 42);`}</code></pre>

      <h2>6. Batching: SaveChanges agrupa automaticamente</h2>
      <p>
        Por padrão, EF Core já agrupa até 42 comandos em um único batch SQL. O que você precisa fazer é <strong>não chamar <code>SaveChangesAsync</code> dentro de loops</strong>:
      </p>
      <pre><code>{`// LENTO: 1000 round-trips
foreach (var item in itens)
{
    db.Itens.Add(item);
    await db.SaveChangesAsync();   // PÉSSIMO
}

// RÁPIDO: 1 round-trip (ou poucos)
db.Itens.AddRange(itens);
await db.SaveChangesAsync();`}</code></pre>

      <h2>7. ExecuteUpdate / ExecuteDelete (EF Core 7+)</h2>
      <p>
        Para updates/deletes em massa sem carregar entidades, use as APIs de "bulk" — geram um único <code>UPDATE</code> ou <code>DELETE</code> SQL:
      </p>
      <pre><code>{`// Marca todos os pedidos antigos como arquivados — em uma única instrução SQL
await db.Pedidos
    .Where(p => p.Data < DateTime.UtcNow.AddYears(-2))
    .ExecuteUpdateAsync(s => s
        .SetProperty(p => p.Arquivado, true)
        .SetProperty(p => p.ArquivadoEm, DateTime.UtcNow));

// Delete em massa
await db.Logs
    .Where(l => l.Data < DateTime.UtcNow.AddDays(-30))
    .ExecuteDeleteAsync();`}</code></pre>

      <h2>8. DbContext pooling</h2>
      <p>
        Em apps web, criar e descartar <code>DbContext</code> a cada request tem custo. <code>AddDbContextPool</code> mantém um pool de instâncias reutilizáveis:
      </p>
      <pre><code>{`builder.Services.AddDbContextPool<LojaContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Loja")));

// Pool padrão de 1024 instâncias. Pode ajustar:
builder.Services.AddDbContextPool<LojaContext>(opt => opt.UseSqlServer(cs), poolSize: 256);`}</code></pre>
      <p>
        EF Core "reseta" cada instância antes de devolver — você não precisa se preocupar com estado vazado entre requests. Ganho típico: 5–15% em apps de tráfego alto.
      </p>

      <AlertBox type="warning" title="Pooling tem regras">
        Com pooling, o construtor do seu <code>DbContext</code> não pode receber dependências mutáveis (ex.: <code>IHttpContextAccessor</code>) — porque a instância pode ser reutilizada entre requests. Use somente <code>DbContextOptions</code>.
      </AlertBox>

      <h2>9. Logando SQL para diagnosticar</h2>
      <pre><code>{`// Em dev: logar todas as queries no console
opt.UseSqlServer(cs)
   .EnableSensitiveDataLogging()
   .LogTo(Console.WriteLine, LogLevel.Information);

// Específico para detectar queries lentas
opt.UseSqlServer(cs).LogTo(
    msg => Console.WriteLine(msg),
    new[] { RelationalEventId.CommandExecuted },
    LogLevel.Information);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>SaveChanges em loop:</strong> a maior fonte de lentidão evitável.</li>
        <li><strong>Include "por garantia":</strong> traga só o que vai usar.</li>
        <li><strong>Esquecer AsNoTracking em listagens:</strong> grids e exports ficam lentos sem motivo.</li>
        <li><strong>Otimizar sem medir:</strong> sempre logue/profile antes de mexer.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>AsNoTracking</code>, <code>Select</code>, <code>AsSplitQuery</code> são as ferramentas básicas.</li>
        <li><code>ExecuteUpdate</code>/<code>ExecuteDelete</code> para bulk sem carregar.</li>
        <li><code>AddDbContextPool</code> em apps de alta demanda.</li>
        <li>Compiled queries para hot paths.</li>
        <li>Sempre meça antes e depois — performance é prática, não opinião.</li>
      </ul>
    </PageContainer>
  );
}
