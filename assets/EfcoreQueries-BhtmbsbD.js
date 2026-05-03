import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Consultando dados com LINQ no EF Core",subtitle:"Como buscar, filtrar e projetar dados do banco usando código C# tipado, sem escrever SQL.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"LINQ"}),' (Language Integrated Query, "consulta integrada à linguagem") permite escrever consultas em C# como se fossem listas em memória — ',e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Select"}),", ",e.jsx("code",{children:"OrderBy"}),". EF Core captura essas chamadas, traduz para SQL específico do banco e devolve objetos preenchidos. É como falar com um maître de restaurante em português: ele anota seu pedido em um idioma que a cozinha (o banco) entende."]}),e.jsx("p",{children:"Mas há armadilhas: nem toda expressão LINQ pode ser traduzida; trazer mais colunas que o necessário desperdiça banda; rastrear objetos que você só vai exibir consome memória. Este capítulo cobre as práticas que separam consultas elegantes das que derrubam o servidor."}),e.jsx("h2",{children:"Where, OrderBy, Take: o básico"}),e.jsx("pre",{children:e.jsx("code",{children:`// Filtro simples
var ativos = await db.Clientes
    .Where(c => c.Ativo && c.DataCadastro >= DateTime.UtcNow.AddYears(-1))
    .OrderByDescending(c => c.DataCadastro)
    .Take(50)
    .ToListAsync();

// SQL gerado (aproximado):
// SELECT TOP(50) * FROM Clientes
// WHERE Ativo = 1 AND DataCadastro >= @p0
// ORDER BY DataCadastro DESC`})}),e.jsxs("p",{children:["EF Core ",e.jsx("em",{children:"não executa nada"})," até você chamar um método terminal como ",e.jsx("code",{children:"ToListAsync"}),", ",e.jsx("code",{children:"FirstOrDefaultAsync"}),", ",e.jsx("code",{children:"CountAsync"})," ou ",e.jsx("code",{children:"foreach"}),". Esse adiamento se chama ",e.jsx("em",{children:"execução tardia"})," e é o que permite encadear chamadas eficientemente."]}),e.jsx("h2",{children:"FirstOrDefault, Single, Find: buscando um único item"}),e.jsx("pre",{children:e.jsx("code",{children:`// FirstOrDefaultAsync: retorna primeiro ou null
var c = await db.Clientes.FirstOrDefaultAsync(c => c.Email == "ana@x.com");

// SingleOrDefaultAsync: garante que só há 1 (ou nenhum) — joga se houver 2+
var unico = await db.Clientes.SingleOrDefaultAsync(c => c.Cpf == cpf);

// FindAsync: busca pela CHAVE PRIMÁRIA, e antes consulta o cache local
var porId = await db.Clientes.FindAsync(42);

// Se já estiver no change tracker, FindAsync nem vai ao banco`})}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"FirstOrDefault"}),' quando "qualquer um que bata serve", ',e.jsx("code",{children:"Single"})," quando você espera unicidade (e quer falhar se não houver), e ",e.jsx("code",{children:"Find"})," quando estiver consultando por chave primária."]}),e.jsx("h2",{children:"Select: projetando só o que precisa"}),e.jsxs("p",{children:["Trazer a entidade inteira quando você só precisa do nome é o ",e.jsx("strong",{children:"over-fetch"})," mais comum. ",e.jsx("code",{children:"Select"})," projeta para um tipo anônimo ou DTO (",e.jsx("em",{children:"Data Transfer Object"}),"):"]}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM: traz todas as colunas, mesmo que use só duas
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
    .ToListAsync();`})}),e.jsxs(a,{type:"success",title:"Projeção desliga rastreamento de graça",children:["Quando você projeta para um tipo que ",e.jsx("em",{children:"não"})," é a entidade, EF Core não rastreia nada — porque DTOs não fazem parte do modelo. Isso já melhora bastante a performance sem precisar de ",e.jsx("code",{children:"AsNoTracking"}),"."]}),e.jsx("h2",{children:"AsNoTracking: leitura pura, sem cache"}),e.jsxs("p",{children:["Por padrão, todo objeto que vem do banco é guardado no ",e.jsx("strong",{children:"change tracker"})," — uma estrutura interna que detecta mudanças. Isso custa memória e CPU. Em telas de listagem onde você só vai exibir os dados, ative ",e.jsx("code",{children:"AsNoTracking"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Lista para exibição: sem rastreamento
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
    .ToListAsync();`})}),e.jsxs("p",{children:['Você pode tornar o padrão "no tracking" para o contexto inteiro: ',e.jsx("code",{children:"opt.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)"})," no ",e.jsx("code",{children:"OnConfiguring"}),"."]}),e.jsx("h2",{children:"Async é obrigatório em apps web"}),e.jsxs("p",{children:["Métodos como ",e.jsx("code",{children:"ToListAsync"}),", ",e.jsx("code",{children:"FirstOrDefaultAsync"}),", ",e.jsx("code",{children:"CountAsync"})," liberam a thread do servidor enquanto o banco responde. Em uma API ASP.NET Core, usar a versão síncrona pode esgotar o pool de threads sob carga. Async é o padrão."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Versão errada para web — bloqueia thread
var lista = db.Clientes.ToList();

// Versão correta
var listaAsync = await db.Clientes.ToListAsync();

// Nunca chame .Result ou .Wait() — risco de deadlock
var perigoso = db.Clientes.ToListAsync().Result; // EVITAR`})}),e.jsx("h2",{children:"AsSplitQuery: múltiplos Includes sem explosão cartesiana"}),e.jsxs("p",{children:["Quando você faz ",e.jsx("code",{children:"Include"})," de várias coleções, o SQL gerado por padrão usa um único JOIN. Isso pode resultar em milhares de linhas duplicadas (produto cartesiano). ",e.jsx("code",{children:"AsSplitQuery"})," divide em várias queries menores — geralmente mais rápido:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var pedidos = await db.Pedidos
    .Include(p => p.Itens)        // 1:N
    .Include(p => p.Pagamentos)    // outra 1:N
    .AsSplitQuery()                 // executa 3 SELECTs separados
    .ToListAsync();`})}),e.jsx("h2",{children:"Operações de agregação"}),e.jsx("pre",{children:e.jsx("code",{children:`// Contagem
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
    .ToListAsync();`})}),e.jsx("h2",{children:"Inspecionando o SQL gerado"}),e.jsxs("p",{children:["Para entender (e otimizar) o que EF Core está fazendo, use ",e.jsx("code",{children:"ToQueryString()"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var query = db.Clientes
    .Where(c => c.Ativo)
    .OrderBy(c => c.Nome);

Console.WriteLine(query.ToQueryString());
// Imprime o SQL exato com parâmetros — sem executar`})}),e.jsxs(a,{type:"warning",title:"Cuidado com client evaluation",children:["Funções C# que EF Core não consegue traduzir (ex.: ",e.jsx("code",{children:"MeuMetodoLocal(c)"}),") eram avaliadas no cliente em versões antigas, escondendo lentidão. Hoje, EF Core ",e.jsx("em",{children:"lança exceção"})," em vez de fazer isso silenciosamente. Bom — é melhor falhar cedo que processar 10 milhões de linhas em memória."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"Async"}),":"]})," bloqueia threads em apps web. Sempre ",e.jsx("code",{children:"ToListAsync"}),", ",e.jsx("code",{children:"FirstOrDefaultAsync"}),", etc."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Carregar entidade inteira só pra mostrar nome:"})," use ",e.jsx("code",{children:"Select"})," para projetar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"AsNoTracking"})," em listagens read-only:"]})," consome memória à toa."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Materializar antes de filtrar:"})," ",e.jsx("code",{children:"db.X.ToList().Where(...)"})," traz tudo do banco e filtra no cliente. Inverta a ordem."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"LINQ + EF Core = consultas tipadas que viram SQL."}),e.jsxs("li",{children:["Sempre ",e.jsx("code",{children:"Async"})," em apps web."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Select"})," para evitar over-fetch."]}),e.jsxs("li",{children:[e.jsx("code",{children:"AsNoTracking"})," para listagens read-only."]}),e.jsxs("li",{children:[e.jsx("code",{children:"AsSplitQuery"})," evita explosão cartesiana com múltiplos Includes."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ToQueryString()"})," mostra o SQL gerado para debug."]})]})]})}export{i as default};
