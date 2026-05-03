import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreTransacoes() {
  return (
    <PageContainer
      title="Transações no EF Core"
      subtitle="Garantindo que um conjunto de operações no banco aconteça por inteiro — ou nada."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine uma transferência bancária: você precisa <em>debitar</em> da conta A e <em>creditar</em> na conta B. Se a primeira operação acontece e a segunda falha (queda de luz, exceção), o dinheiro some no ar. <strong>Transações</strong> resolvem isso: agrupam operações em um bloco atômico — ou todas dão certo (<em>commit</em>), ou todas são desfeitas (<em>rollback</em>). É o "tudo ou nada" do banco de dados.
      </p>
      <p>
        EF Core trata transações de forma quase invisível na maioria dos casos. Mas saber quando elas acontecem automaticamente, quando você precisa abrir uma manualmente e como configurar comportamento sob falha é essencial para qualquer app que mexa em mais de uma tabela.
      </p>

      <h2>SaveChangesAsync já é uma transação</h2>
      <p>
        Quando você faz várias alterações (Add, Update, Remove) e chama <code>SaveChangesAsync()</code>, EF Core abre uma transação implícita, executa todos os comandos e faz commit no final. Se qualquer um falhar, ele faz rollback automaticamente.
      </p>
      <pre><code>{`// Tudo isso é UMA transação implícita
db.Pedidos.Add(pedido);
db.Itens.AddRange(pedido.Itens);
cliente.PontosFidelidade += 10;
db.Estoque.Update(estoque);

await db.SaveChangesAsync();   // commit ou rollback total`}</code></pre>
      <p>
        Por isso, sempre que possível, agrupe mudanças em um único <code>SaveChangesAsync</code> em vez de chamar várias vezes. Não só garante atomicidade como reduz round-trips ao banco.
      </p>

      <h2>BeginTransactionAsync: transações que abrangem múltiplos SaveChanges</h2>
      <p>
        Há cenários onde você precisa de mais de um <code>SaveChanges</code> dentro do mesmo "tudo ou nada" — por exemplo, gerar uma fatura, salvar, depois usar o ID gerado para criar registros em outra tabela com lógica condicional baseada no resultado da primeira.
      </p>
      <pre><code>{`using var transacao = await db.Database.BeginTransactionAsync();
try
{
    db.Pedidos.Add(pedido);
    await db.SaveChangesAsync();   // gera ID

    // Lógica que depende do ID gerado
    var auditoria = new AuditoriaPedido
    {
        PedidoId = pedido.Id,
        Acao = "Criado",
        Quando = DateTime.UtcNow
    };
    db.Auditorias.Add(auditoria);
    await db.SaveChangesAsync();

    await transacao.CommitAsync();  // confirma TUDO
}
catch
{
    // O Dispose do using já faria rollback, mas explicitar é mais claro
    await transacao.RollbackAsync();
    throw;
}`}</code></pre>

      <AlertBox type="info" title="O using cuida do rollback">
        Se você esquecer o <code>CommitAsync</code>, o <code>Dispose</code> do <code>using</code> faz rollback automaticamente — porque uma transação não confirmada é considerada cancelada. Esse comportamento "fail safe" evita commits parciais por engano.
      </AlertBox>

      <h2>Savepoints: rollback parcial</h2>
      <p>
        Dentro de uma transação grande, você pode querer marcar pontos intermediários e voltar até eles sem desfazer tudo. Isso são <strong>savepoints</strong>.
      </p>
      <pre><code>{`using var t = await db.Database.BeginTransactionAsync();

db.Pedidos.Add(pedido);
await db.SaveChangesAsync();
await t.CreateSavepointAsync("antes_dos_itens");

try
{
    foreach (var item in itensTemDuvidas)
    {
        db.Itens.Add(item);
    }
    await db.SaveChangesAsync();
}
catch
{
    // Volta só os itens; o pedido permanece
    await t.RollbackToSavepointAsync("antes_dos_itens");
}

await t.CommitAsync();`}</code></pre>

      <h2>Isolation levels: o nível de "ciúme" da transação</h2>
      <p>
        Quando duas transações rodam ao mesmo tempo, podem se ver parcialmente. O <strong>nível de isolamento</strong> define o quanto uma vê o que a outra está fazendo. Os mais comuns:
      </p>
      <ul>
        <li><strong>ReadCommitted</strong> (padrão na maioria dos bancos): só vê o que já foi commitado. Bom equilíbrio.</li>
        <li><strong>RepeatableRead</strong>: garante que leituras dentro da transação sempre retornem o mesmo valor.</li>
        <li><strong>Serializable</strong>: como se as transações rodassem uma após a outra. Mais seguro, menos paralelo.</li>
        <li><strong>Snapshot</strong>: lê uma "foto" consistente do banco no início. SQL Server e Postgres suportam.</li>
      </ul>
      <pre><code>{`using System.Data;

using var t = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);
// Operações críticas que não toleram qualquer interferência
await t.CommitAsync();`}</code></pre>

      <h2>Concorrência otimista: detectar conflitos sem bloquear</h2>
      <p>
        Em vez de travar linhas, você pode marcá-las com uma coluna que muda a cada update. Se outro processo modificou no meio do caminho, EF Core lança <code>DbUpdateConcurrencyException</code>:
      </p>
      <pre><code>{`public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public int Estoque { get; set; }

    [Timestamp]   // SQL Server: rowversion; Postgres: xmin
    public byte[] RowVersion { get; set; } = [];
}

try
{
    produto.Estoque -= 1;
    await db.SaveChangesAsync();
}
catch (DbUpdateConcurrencyException)
{
    // Outra transação alterou o produto. Recarregue e tente de novo.
}`}</code></pre>

      <h2>Distributed transactions: cuidado!</h2>
      <p>
        Transação <strong>distribuída</strong> abrange múltiplos bancos (ou serviços) e usa um coordenador (MSDTC no Windows). EF Core 7+ suporta via <code>TransactionScope</code>, mas o custo de performance e complexidade operacional é alto. Em arquiteturas modernas, prefira o padrão <em>Outbox</em>: salve uma mensagem na mesma transação local, e um worker assíncrono replica para o outro sistema.
      </p>
      <pre><code>{`using System.Transactions;

using var escopo = new TransactionScope(
    TransactionScopeOption.Required,
    new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted },
    TransactionScopeAsyncFlowOption.Enabled);

await dbA.SaveChangesAsync();
await dbB.SaveChangesAsync();

escopo.Complete();   // commit nos dois`}</code></pre>

      <AlertBox type="warning" title="Transações longas matam a performance">
        Manter uma transação aberta enquanto faz cálculos demorados ou chama APIs externas trava linhas no banco e cria congestionamento. Regra: faça o trabalho lento <em>fora</em> da transação, abra a transação, salve rápido, commit.
      </AlertBox>

      <h2>Retry policy: quando deadlock acontecer, tente de novo</h2>
      <p>
        Em bancos com alta concorrência, deadlocks são inevitáveis. EF Core oferece <em>execution strategy</em> com retry automático:
      </p>
      <pre><code>{`opt.UseSqlServer(connectionString, sql =>
    sql.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: TimeSpan.FromSeconds(10),
        errorNumbersToAdd: null));

// Atenção: ao usar retry, você precisa envolver
// transações manuais em ExecutionStrategy:
var strategy = db.Database.CreateExecutionStrategy();
await strategy.ExecuteAsync(async () =>
{
    using var t = await db.Database.BeginTransactionAsync();
    // ...
    await t.CommitAsync();
});`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>CommitAsync</code>:</strong> tudo é desfeito ao sair do <code>using</code>. Verifique sempre.</li>
        <li><strong>Misturar retry policy e transações manuais sem <code>ExecutionStrategy</code>:</strong> EF Core lança exceção explícita.</li>
        <li><strong>Manter transações abertas durante chamadas HTTP:</strong> trava o banco esperando uma API externa responder.</li>
        <li><strong>Achar que <code>using</code> rolba se o método retorna normalmente:</strong> não — só se você não chamou <code>Commit</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Cada <code>SaveChangesAsync</code> é, sozinho, uma transação.</li>
        <li><code>BeginTransactionAsync</code> agrupa múltiplos saves em um único "tudo ou nada".</li>
        <li>Savepoints permitem rollback parcial.</li>
        <li>Concorrência otimista detecta conflitos via coluna <code>[Timestamp]</code>.</li>
        <li>Use retry policy + <code>ExecutionStrategy</code> para resiliência.</li>
        <li>Evite transações longas e distribuídas; prefira padrão Outbox.</li>
      </ul>
    </PageContainer>
  );
}
