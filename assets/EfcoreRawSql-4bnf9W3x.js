import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function d(){return e.jsxs(r,{title:"SQL bruto e stored procedures no EF Core",subtitle:"Quando o LINQ não dá conta, escreva SQL diretamente — com segurança contra injeção.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["EF Core é poderoso, mas não traduz tudo. Janelas analíticas (",e.jsx("code",{children:"OVER PARTITION BY"}),"), CTEs recursivas, ",e.jsx("code",{children:"UPSERT"}),"s específicos do banco, hints de otimização — tudo isso exige SQL escrito à mão. Em vez de abandonar o EF Core nesses casos, ele oferece uma ponte segura: você escreve o SQL e ele cuida de mapear o resultado para suas entidades, ainda com proteção contra ",e.jsx("strong",{children:"SQL injection"})," (técnica de ataque em que o usuário insere SQL malicioso através de campos de entrada)."]}),e.jsxs("p",{children:["A regra de ouro: nunca concatene strings em SQL. Sempre use parâmetros. EF Core dá duas APIs para isso — ",e.jsx("code",{children:"FromSqlRaw"})," (parâmetros explícitos) e ",e.jsx("code",{children:"FromSqlInterpolated"})," (interpolação automática segura). A segunda é quase sempre a melhor escolha."]}),e.jsx("h2",{children:"FromSqlInterpolated: a forma segura"}),e.jsxs("p",{children:["A interpolação de string em C# usa ",e.jsx("code",{children:'$"texto {variavel}"'}),". Quando passada para ",e.jsx("code",{children:"FromSqlInterpolated"}),", EF Core ",e.jsx("strong",{children:"não"})," coloca o valor na string — ele cria um parâmetro SQL apropriado por baixo, evitando injeção."]}),e.jsx("pre",{children:e.jsx("code",{children:`var nomeBusca = "Ana";

// SEGURO: vira "WHERE Nome LIKE @p0" com @p0 = '%Ana%'
var clientes = await db.Clientes
    .FromSqlInterpolated($"SELECT * FROM Clientes WHERE Nome LIKE {"%" + nomeBusca + "%"}")
    .ToListAsync();

// Combinando com LINQ regular
var ativos = await db.Clientes
    .FromSqlInterpolated($"SELECT * FROM Clientes WHERE Cidade = {cidade}")
    .Where(c => c.Ativo)
    .OrderBy(c => c.Nome)
    .ToListAsync();`})}),e.jsxs(a,{type:"danger",title:"Nunca concatene SQL",children:[e.jsx("code",{children:`FromSqlRaw($"... WHERE Nome = '" + entradaUsuario + "'")`})," abre porta para SQL injection. Use ",e.jsx("code",{children:"FromSqlInterpolated"})," ou ",e.jsx("code",{children:"FromSqlRaw"})," com parâmetros nomeados."]}),e.jsx("h2",{children:"FromSqlRaw: parâmetros explícitos"}),e.jsx("p",{children:"Use quando o SQL vem de fora (arquivo, configuração) e você precisa de controle manual:"}),e.jsx("pre",{children:e.jsx("code",{children:`var clientes = await db.Clientes
    .FromSqlRaw(
        "SELECT * FROM Clientes WHERE Cidade = {0} AND Ativo = {1}",
        "São Paulo", true)
    .ToListAsync();

// Com parâmetros nomeados via SqlParameter
var p = new SqlParameter("@cidade", "São Paulo");
var lista = await db.Clientes
    .FromSqlRaw("SELECT * FROM Clientes WHERE Cidade = @cidade", p)
    .ToListAsync();`})}),e.jsx("h2",{children:"Mapear para entidade existente"}),e.jsxs("p",{children:["O resultado precisa retornar ",e.jsx("em",{children:"todas"})," as colunas que sua entidade espera, com os mesmos nomes. Senão EF Core lança erro de mapeamento. Aliases de coluna ajudam:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var top10 = await db.Produtos
    .FromSqlRaw(@"
        SELECT TOP 10
            Id, Nome, Preco, Estoque, CategoriaId
        FROM Produtos
        ORDER BY Estoque DESC")
    .AsNoTracking()
    .ToListAsync();`})}),e.jsx("h2",{children:"Keyless entities: para projeções e relatórios"}),e.jsxs("p",{children:["Quando o SQL retorna algo que não é uma entidade do seu domínio (uma view, um relatório agregado), use ",e.jsx("strong",{children:"keyless entity types"}),": classes sem chave primária declaradas só para receber resultados."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class RelatorioVendas
{
    public string Categoria { get; set; } = "";
    public int QtdItens { get; set; }
    public decimal Receita { get; set; }
    public DateTime Mes { get; set; }
}

// No DbContext:
public DbSet<RelatorioVendas> RelatoriosVendas => Set<RelatorioVendas>();

protected override void OnModelCreating(ModelBuilder mb)
{
    mb.Entity<RelatorioVendas>(e =>
    {
        e.HasNoKey();
        e.ToView(null);    // não vinculado a tabela física
    });
}

// Uso:
var dados = await db.RelatoriosVendas
    .FromSqlRaw(@"
        SELECT c.Nome AS Categoria,
               SUM(i.Quantidade) AS QtdItens,
               SUM(i.ValorTotal) AS Receita,
               DATEFROMPARTS(YEAR(p.Data), MONTH(p.Data), 1) AS Mes
        FROM Itens i
        JOIN Pedidos p ON p.Id = i.PedidoId
        JOIN Categorias c ON c.Id = i.CategoriaId
        WHERE p.Status = 'Pago'
        GROUP BY c.Nome, DATEFROMPARTS(YEAR(p.Data), MONTH(p.Data), 1)")
    .ToListAsync();`})}),e.jsx("h2",{children:"ExecuteSqlRaw / ExecuteSqlInterpolated: comandos sem retorno"}),e.jsxs("p",{children:["Para ",e.jsx("code",{children:"UPDATE"}),", ",e.jsx("code",{children:"DELETE"}),", ",e.jsx("code",{children:"INSERT"})," ou DDL (criar índice, alterar tabela) que não retornam linhas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Atualização em massa (alternativa a ExecuteUpdateAsync)
int afetados = await db.Database.ExecuteSqlInterpolatedAsync(
    $"UPDATE Pedidos SET Status = 'Cancelado' WHERE Data < {DateTime.UtcNow.AddYears(-5)}");

Console.WriteLine($"Cancelados: {afetados} pedidos");

// Executar DDL ad-hoc
await db.Database.ExecuteSqlRawAsync(
    "CREATE INDEX IX_Pedidos_Data ON Pedidos (Data) INCLUDE (Total)");`})}),e.jsx("h2",{children:"Stored procedures"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Stored procedure"})," (procedimento armazenado) é um bloco de SQL salvo dentro do banco, com parâmetros, lógica e retorno. É comum em sistemas corporativos para encapsular regras complexas."]}),e.jsx("pre",{children:e.jsx("code",{children:`-- No banco:
CREATE PROCEDURE sp_ClientesPorCidade
    @cidade NVARCHAR(100)
AS
BEGIN
    SELECT * FROM Clientes WHERE Cidade = @cidade AND Ativo = 1
    ORDER BY Nome
END`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Chamando procedure que retorna entidades
var clientes = await db.Clientes
    .FromSqlInterpolated($"EXEC sp_ClientesPorCidade {cidade}")
    .ToListAsync();

// Procedure de update sem retorno
await db.Database.ExecuteSqlInterpolatedAsync(
    $"EXEC sp_RecalcularSaldoCliente {clienteId}");

// Procedure com OUT parameter (forma manual)
var saldoOut = new SqlParameter
{
    ParameterName = "@saldo",
    SqlDbType = SqlDbType.Decimal,
    Direction = ParameterDirection.Output,
    Precision = 18, Scale = 2
};

await db.Database.ExecuteSqlRawAsync(
    "EXEC sp_CalcularSaldo @clienteId, @saldo OUTPUT",
    new SqlParameter("@clienteId", clienteId), saldoOut);

decimal saldo = (decimal)saldoOut.Value;`})}),e.jsxs(a,{type:"info",title:"EF Core 7+ tem suporte direto a stored procedures",children:["Você pode mapear inserts/updates/deletes de uma entidade para procedures via Fluent API: ",e.jsx("code",{children:"e.InsertUsingStoredProcedure(...)"}),". Útil quando a empresa exige passar por procedures."]}),e.jsx("h2",{children:"Quando recorrer ao SQL bruto"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Janelas analíticas:"})," ",e.jsx("code",{children:"ROW_NUMBER()"}),", ",e.jsx("code",{children:"RANK()"}),", ",e.jsx("code",{children:"LAG/LEAD"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CTE recursivas:"})," hierarquias (estrutura organizacional, BOM)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"UPSERT específico do banco:"})," ",e.jsx("code",{children:"MERGE"}),", ",e.jsx("code",{children:"ON CONFLICT"})," do Postgres."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hints de otimização:"})," ",e.jsx("code",{children:"WITH (NOLOCK)"}),", ",e.jsx("code",{children:"FORCESEEK"})," no SQL Server."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Funções específicas do banco"})," que LINQ não traduz."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Performance crítica:"})," uma query lenta gerada por LINQ pode ficar 10x mais rápida reescrita à mão."]})]}),e.jsx("h2",{children:"Quando NÃO usar SQL bruto"}),e.jsx("p",{children:"Para CRUD trivial, LINQ é mais legível, type-safe e refatorável. SQL bruto vira dívida técnica: rename de coluna não atualiza strings, SQL é específico do banco (rompe portabilidade), e quem ler depois precisa entender SQL e C#."}),e.jsxs(a,{type:"warning",title:"SQL bruto não é tracking-friendly",children:["Resultados de ",e.jsx("code",{children:"FromSqlRaw"})," são rastreados se forem do tipo da entidade — mas EF Core não consegue compor mais cláusulas em cima de SQL com ",e.jsx("code",{children:"JOIN"})," ou ",e.jsx("code",{children:"GROUP BY"})," complexos. Use ",e.jsx("code",{children:"AsNoTracking"})," para evitar surpresas."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Concatenar input do usuário:"})," SQL injection garantida."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Faltar colunas no SELECT:"}),' EF Core lança "column X is required" ao mapear.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar compor LINQ em cima de SQL incompatível:"})," ",e.jsx("code",{children:".OrderBy"})," depois de ",e.jsx("code",{children:"FromSqlRaw"})," com ",e.jsx("code",{children:"GROUP BY"})," falha."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não usar ",e.jsx("code",{children:"ExecuteSqlInterpolatedAsync"}),":"]})," a versão sync bloqueia threads em apps web."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"FromSqlInterpolated"})," é a primeira escolha — segura por padrão."]}),e.jsxs("li",{children:["Use ",e.jsx("em",{children:"keyless entities"})," para relatórios e views."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ExecuteSqlInterpolatedAsync"})," para comandos sem retorno."]}),e.jsxs("li",{children:["Stored procedures se chamam via ",e.jsx("code",{children:"EXEC"})," dentro de ",e.jsx("code",{children:"FromSqlInterpolated"}),"."]}),e.jsx("li",{children:"Recorra a SQL bruto só quando LINQ não consegue traduzir ou quando performance exige."})]})]})}export{d as default};
