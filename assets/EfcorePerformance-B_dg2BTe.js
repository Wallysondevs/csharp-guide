import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"Performance no EF Core: armadilhas e soluções",subtitle:"Como diagnosticar e eliminar os gargalos mais comuns que transformam seu app em uma tartaruga.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsx("p",{children:'EF Core é rápido — mas é também muito fácil de tornar lento. Cada conveniência (rastreamento, lazy loading, navegações ricas) tem um custo. A boa notícia é que 80% dos problemas de performance se resolvem com cinco ou seis técnicas conhecidas. Pense nelas como hábitos de "boa higiene" para queries, na linha de "olhar para os dois lados antes de atravessar a rua".'}),e.jsxs("p",{children:["Antes de otimizar, ",e.jsx("strong",{children:"meça"}),". Use logs de SQL (",e.jsx("code",{children:"opt.LogTo(Console.WriteLine)"}),"), Application Insights, ou MiniProfiler. Otimizar sem dados é chutar no escuro. Depois disso, aplique as ferramentas abaixo na ordem do impacto."]}),e.jsx("h2",{children:"1. AsNoTracking em listagens read-only"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"change tracker"})," é a estrutura interna que detecta mudanças nos seus objetos. Ele custa memória (uma cópia de cada entidade) e CPU (comparações na hora do ",e.jsx("code",{children:"SaveChanges"}),"). Se a query é só para exibir dados, desligue:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Lista de produtos para exibição na home — não vai ser modificada
var produtos = await db.Produtos
    .AsNoTracking()
    .Where(p => p.Ativo)
    .OrderBy(p => p.Nome)
    .ToListAsync();

// Para o contexto inteiro virar no-tracking por padrão:
opt.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);`})}),e.jsx("p",{children:"O ganho é tipicamente 30–50% em queries grandes, sem perder nada se você não vai modificar os objetos."}),e.jsx("h2",{children:"2. Projeção com Select para evitar over-fetch"}),e.jsx("p",{children:"Carregar a entidade inteira para mostrar só dois campos é desperdício. Projete para um DTO ou tipo anônimo:"}),e.jsx("pre",{children:e.jsx("code",{children:`// LENTO: SELECT * FROM Pedidos
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
    .ToListAsync();`})}),e.jsx(a,{type:"success",title:"Select também desliga tracking",children:"Quando você projeta para um tipo que não é a entidade rastreada, EF Core nem cadastra no change tracker — ganho duplo de graça."}),e.jsx("h2",{children:"3. Cuidado com Includes desnecessários"}),e.jsxs("p",{children:["Cada ",e.jsx("code",{children:"Include"})," aumenta o JOIN. Pergunte: você realmente vai usar essa navegação? Se for para mostrar uma única propriedade do relacionado, projete:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// EVITE — traz Cliente inteiro só para mostrar nome
var pedidos = await db.Pedidos
    .Include(p => p.Cliente)
    .ToListAsync();
foreach (var p in pedidos) Console.WriteLine(p.Cliente.Nome);

// PREFIRA — traz só o que precisa
var resumo = await db.Pedidos
    .Select(p => new { p.Id, NomeCliente = p.Cliente.Nome })
    .ToListAsync();`})}),e.jsx("h2",{children:"4. SplitQuery vs SingleQuery"}),e.jsxs("p",{children:["Quando há múltiplos ",e.jsx("code",{children:"Include"})," de coleções (1:N), EF Core gera uma única query com JOINs — que produz o ",e.jsx("strong",{children:"produto cartesiano"}),": linhas duplicadas que ele depois deduplica em memória. Para 1 pedido com 5 itens e 3 pagamentos, vêm 15 linhas. Em escala, é desastroso."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1 query enorme, com explosão cartesiana
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
opt.UseSqlServer(cs, sql => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));`})}),e.jsx("h2",{children:"5. Compiled queries para queries hot-path"}),e.jsxs("p",{children:['EF Core "compila" cada LINQ em SQL na primeira vez e ',e.jsx("em",{children:"cacheia"})," internamente. Para queries chamadas milhares de vezes por segundo, você pode pré-compilar manualmente, eliminando o overhead de lookup:"]}),e.jsx("pre",{children:e.jsx("code",{children:`private static readonly Func<LojaContext, int, Task<Cliente?>> BuscarPorIdCompilado =
    EF.CompileAsyncQuery((LojaContext db, int id) =>
        db.Clientes.FirstOrDefault(c => c.Id == id));

// Uso (10–20% mais rápido em alta frequência):
var c = await BuscarPorIdCompilado(db, 42);`})}),e.jsx("h2",{children:"6. Batching: SaveChanges agrupa automaticamente"}),e.jsxs("p",{children:["Por padrão, EF Core já agrupa até 42 comandos em um único batch SQL. O que você precisa fazer é ",e.jsxs("strong",{children:["não chamar ",e.jsx("code",{children:"SaveChangesAsync"})," dentro de loops"]}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// LENTO: 1000 round-trips
foreach (var item in itens)
{
    db.Itens.Add(item);
    await db.SaveChangesAsync();   // PÉSSIMO
}

// RÁPIDO: 1 round-trip (ou poucos)
db.Itens.AddRange(itens);
await db.SaveChangesAsync();`})}),e.jsx("h2",{children:"7. ExecuteUpdate / ExecuteDelete (EF Core 7+)"}),e.jsxs("p",{children:['Para updates/deletes em massa sem carregar entidades, use as APIs de "bulk" — geram um único ',e.jsx("code",{children:"UPDATE"})," ou ",e.jsx("code",{children:"DELETE"})," SQL:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Marca todos os pedidos antigos como arquivados — em uma única instrução SQL
await db.Pedidos
    .Where(p => p.Data < DateTime.UtcNow.AddYears(-2))
    .ExecuteUpdateAsync(s => s
        .SetProperty(p => p.Arquivado, true)
        .SetProperty(p => p.ArquivadoEm, DateTime.UtcNow));

// Delete em massa
await db.Logs
    .Where(l => l.Data < DateTime.UtcNow.AddDays(-30))
    .ExecuteDeleteAsync();`})}),e.jsx("h2",{children:"8. DbContext pooling"}),e.jsxs("p",{children:["Em apps web, criar e descartar ",e.jsx("code",{children:"DbContext"})," a cada request tem custo. ",e.jsx("code",{children:"AddDbContextPool"})," mantém um pool de instâncias reutilizáveis:"]}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddDbContextPool<LojaContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Loja")));

// Pool padrão de 1024 instâncias. Pode ajustar:
builder.Services.AddDbContextPool<LojaContext>(opt => opt.UseSqlServer(cs), poolSize: 256);`})}),e.jsx("p",{children:'EF Core "reseta" cada instância antes de devolver — você não precisa se preocupar com estado vazado entre requests. Ganho típico: 5–15% em apps de tráfego alto.'}),e.jsxs(a,{type:"warning",title:"Pooling tem regras",children:["Com pooling, o construtor do seu ",e.jsx("code",{children:"DbContext"})," não pode receber dependências mutáveis (ex.: ",e.jsx("code",{children:"IHttpContextAccessor"}),") — porque a instância pode ser reutilizada entre requests. Use somente ",e.jsx("code",{children:"DbContextOptions"}),"."]}),e.jsx("h2",{children:"9. Logando SQL para diagnosticar"}),e.jsx("pre",{children:e.jsx("code",{children:`// Em dev: logar todas as queries no console
opt.UseSqlServer(cs)
   .EnableSensitiveDataLogging()
   .LogTo(Console.WriteLine, LogLevel.Information);

// Específico para detectar queries lentas
opt.UseSqlServer(cs).LogTo(
    msg => Console.WriteLine(msg),
    new[] { RelationalEventId.CommandExecuted },
    LogLevel.Information);`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"SaveChanges em loop:"})," a maior fonte de lentidão evitável."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Include "por garantia":'})," traga só o que vai usar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer AsNoTracking em listagens:"})," grids e exports ficam lentos sem motivo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Otimizar sem medir:"})," sempre logue/profile antes de mexer."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"AsNoTracking"}),", ",e.jsx("code",{children:"Select"}),", ",e.jsx("code",{children:"AsSplitQuery"})," são as ferramentas básicas."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ExecuteUpdate"}),"/",e.jsx("code",{children:"ExecuteDelete"})," para bulk sem carregar."]}),e.jsxs("li",{children:[e.jsx("code",{children:"AddDbContextPool"})," em apps de alta demanda."]}),e.jsx("li",{children:"Compiled queries para hot paths."}),e.jsx("li",{children:"Sempre meça antes e depois — performance é prática, não opinião."})]})]})}export{i as default};
