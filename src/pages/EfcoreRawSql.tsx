import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreRawSql() {
  return (
    <PageContainer
      title="SQL bruto e stored procedures no EF Core"
      subtitle="Quando o LINQ não dá conta, escreva SQL diretamente — com segurança contra injeção."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        EF Core é poderoso, mas não traduz tudo. Janelas analíticas (<code>OVER PARTITION BY</code>), CTEs recursivas, <code>UPSERT</code>s específicos do banco, hints de otimização — tudo isso exige SQL escrito à mão. Em vez de abandonar o EF Core nesses casos, ele oferece uma ponte segura: você escreve o SQL e ele cuida de mapear o resultado para suas entidades, ainda com proteção contra <strong>SQL injection</strong> (técnica de ataque em que o usuário insere SQL malicioso através de campos de entrada).
      </p>
      <p>
        A regra de ouro: nunca concatene strings em SQL. Sempre use parâmetros. EF Core dá duas APIs para isso — <code>FromSqlRaw</code> (parâmetros explícitos) e <code>FromSqlInterpolated</code> (interpolação automática segura). A segunda é quase sempre a melhor escolha.
      </p>

      <h2>FromSqlInterpolated: a forma segura</h2>
      <p>
        A interpolação de string em C# usa <code>$"texto &#123;variavel&#125;"</code>. Quando passada para <code>FromSqlInterpolated</code>, EF Core <strong>não</strong> coloca o valor na string — ele cria um parâmetro SQL apropriado por baixo, evitando injeção.
      </p>
      <pre><code>{`var nomeBusca = "Ana";

// SEGURO: vira "WHERE Nome LIKE @p0" com @p0 = '%Ana%'
var clientes = await db.Clientes
    .FromSqlInterpolated($"SELECT * FROM Clientes WHERE Nome LIKE {"%" + nomeBusca + "%"}")
    .ToListAsync();

// Combinando com LINQ regular
var ativos = await db.Clientes
    .FromSqlInterpolated($"SELECT * FROM Clientes WHERE Cidade = {cidade}")
    .Where(c => c.Ativo)
    .OrderBy(c => c.Nome)
    .ToListAsync();`}</code></pre>

      <AlertBox type="danger" title="Nunca concatene SQL">
        <code>FromSqlRaw($"... WHERE Nome = '" + entradaUsuario + "'")</code> abre porta para SQL injection. Use <code>FromSqlInterpolated</code> ou <code>FromSqlRaw</code> com parâmetros nomeados.
      </AlertBox>

      <h2>FromSqlRaw: parâmetros explícitos</h2>
      <p>
        Use quando o SQL vem de fora (arquivo, configuração) e você precisa de controle manual:
      </p>
      <pre><code>{`var clientes = await db.Clientes
    .FromSqlRaw(
        "SELECT * FROM Clientes WHERE Cidade = {0} AND Ativo = {1}",
        "São Paulo", true)
    .ToListAsync();

// Com parâmetros nomeados via SqlParameter
var p = new SqlParameter("@cidade", "São Paulo");
var lista = await db.Clientes
    .FromSqlRaw("SELECT * FROM Clientes WHERE Cidade = @cidade", p)
    .ToListAsync();`}</code></pre>

      <h2>Mapear para entidade existente</h2>
      <p>
        O resultado precisa retornar <em>todas</em> as colunas que sua entidade espera, com os mesmos nomes. Senão EF Core lança erro de mapeamento. Aliases de coluna ajudam:
      </p>
      <pre><code>{`var top10 = await db.Produtos
    .FromSqlRaw(@"
        SELECT TOP 10
            Id, Nome, Preco, Estoque, CategoriaId
        FROM Produtos
        ORDER BY Estoque DESC")
    .AsNoTracking()
    .ToListAsync();`}</code></pre>

      <h2>Keyless entities: para projeções e relatórios</h2>
      <p>
        Quando o SQL retorna algo que não é uma entidade do seu domínio (uma view, um relatório agregado), use <strong>keyless entity types</strong>: classes sem chave primária declaradas só para receber resultados.
      </p>
      <pre><code>{`public class RelatorioVendas
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
    .ToListAsync();`}</code></pre>

      <h2>ExecuteSqlRaw / ExecuteSqlInterpolated: comandos sem retorno</h2>
      <p>
        Para <code>UPDATE</code>, <code>DELETE</code>, <code>INSERT</code> ou DDL (criar índice, alterar tabela) que não retornam linhas:
      </p>
      <pre><code>{`// Atualização em massa (alternativa a ExecuteUpdateAsync)
int afetados = await db.Database.ExecuteSqlInterpolatedAsync(
    $"UPDATE Pedidos SET Status = 'Cancelado' WHERE Data < {DateTime.UtcNow.AddYears(-5)}");

Console.WriteLine($"Cancelados: {afetados} pedidos");

// Executar DDL ad-hoc
await db.Database.ExecuteSqlRawAsync(
    "CREATE INDEX IX_Pedidos_Data ON Pedidos (Data) INCLUDE (Total)");`}</code></pre>

      <h2>Stored procedures</h2>
      <p>
        <strong>Stored procedure</strong> (procedimento armazenado) é um bloco de SQL salvo dentro do banco, com parâmetros, lógica e retorno. É comum em sistemas corporativos para encapsular regras complexas.
      </p>
      <pre><code>{`-- No banco:
CREATE PROCEDURE sp_ClientesPorCidade
    @cidade NVARCHAR(100)
AS
BEGIN
    SELECT * FROM Clientes WHERE Cidade = @cidade AND Ativo = 1
    ORDER BY Nome
END`}</code></pre>
      <pre><code>{`// Chamando procedure que retorna entidades
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

decimal saldo = (decimal)saldoOut.Value;`}</code></pre>

      <AlertBox type="info" title="EF Core 7+ tem suporte direto a stored procedures">
        Você pode mapear inserts/updates/deletes de uma entidade para procedures via Fluent API: <code>e.InsertUsingStoredProcedure(...)</code>. Útil quando a empresa exige passar por procedures.
      </AlertBox>

      <h2>Quando recorrer ao SQL bruto</h2>
      <ul>
        <li><strong>Janelas analíticas:</strong> <code>ROW_NUMBER()</code>, <code>RANK()</code>, <code>LAG/LEAD</code>.</li>
        <li><strong>CTE recursivas:</strong> hierarquias (estrutura organizacional, BOM).</li>
        <li><strong>UPSERT específico do banco:</strong> <code>MERGE</code>, <code>ON CONFLICT</code> do Postgres.</li>
        <li><strong>Hints de otimização:</strong> <code>WITH (NOLOCK)</code>, <code>FORCESEEK</code> no SQL Server.</li>
        <li><strong>Funções específicas do banco</strong> que LINQ não traduz.</li>
        <li><strong>Performance crítica:</strong> uma query lenta gerada por LINQ pode ficar 10x mais rápida reescrita à mão.</li>
      </ul>

      <h2>Quando NÃO usar SQL bruto</h2>
      <p>
        Para CRUD trivial, LINQ é mais legível, type-safe e refatorável. SQL bruto vira dívida técnica: rename de coluna não atualiza strings, SQL é específico do banco (rompe portabilidade), e quem ler depois precisa entender SQL e C#.
      </p>

      <AlertBox type="warning" title="SQL bruto não é tracking-friendly">
        Resultados de <code>FromSqlRaw</code> são rastreados se forem do tipo da entidade — mas EF Core não consegue compor mais cláusulas em cima de SQL com <code>JOIN</code> ou <code>GROUP BY</code> complexos. Use <code>AsNoTracking</code> para evitar surpresas.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Concatenar input do usuário:</strong> SQL injection garantida.</li>
        <li><strong>Faltar colunas no SELECT:</strong> EF Core lança "column X is required" ao mapear.</li>
        <li><strong>Tentar compor LINQ em cima de SQL incompatível:</strong> <code>.OrderBy</code> depois de <code>FromSqlRaw</code> com <code>GROUP BY</code> falha.</li>
        <li><strong>Não usar <code>ExecuteSqlInterpolatedAsync</code>:</strong> a versão sync bloqueia threads em apps web.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>FromSqlInterpolated</code> é a primeira escolha — segura por padrão.</li>
        <li>Use <em>keyless entities</em> para relatórios e views.</li>
        <li><code>ExecuteSqlInterpolatedAsync</code> para comandos sem retorno.</li>
        <li>Stored procedures se chamam via <code>EXEC</code> dentro de <code>FromSqlInterpolated</code>.</li>
        <li>Recorra a SQL bruto só quando LINQ não consegue traduzir ou quando performance exige.</li>
      </ul>
    </PageContainer>
  );
}
