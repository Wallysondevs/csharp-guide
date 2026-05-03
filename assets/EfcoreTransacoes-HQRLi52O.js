import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(o,{title:"Transações no EF Core",subtitle:"Garantindo que um conjunto de operações no banco aconteça por inteiro — ou nada.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine uma transferência bancária: você precisa ",e.jsx("em",{children:"debitar"})," da conta A e ",e.jsx("em",{children:"creditar"})," na conta B. Se a primeira operação acontece e a segunda falha (queda de luz, exceção), o dinheiro some no ar. ",e.jsx("strong",{children:"Transações"})," resolvem isso: agrupam operações em um bloco atômico — ou todas dão certo (",e.jsx("em",{children:"commit"}),"), ou todas são desfeitas (",e.jsx("em",{children:"rollback"}),'). É o "tudo ou nada" do banco de dados.']}),e.jsx("p",{children:"EF Core trata transações de forma quase invisível na maioria dos casos. Mas saber quando elas acontecem automaticamente, quando você precisa abrir uma manualmente e como configurar comportamento sob falha é essencial para qualquer app que mexa em mais de uma tabela."}),e.jsx("h2",{children:"SaveChangesAsync já é uma transação"}),e.jsxs("p",{children:["Quando você faz várias alterações (Add, Update, Remove) e chama ",e.jsx("code",{children:"SaveChangesAsync()"}),", EF Core abre uma transação implícita, executa todos os comandos e faz commit no final. Se qualquer um falhar, ele faz rollback automaticamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Tudo isso é UMA transação implícita
db.Pedidos.Add(pedido);
db.Itens.AddRange(pedido.Itens);
cliente.PontosFidelidade += 10;
db.Estoque.Update(estoque);

await db.SaveChangesAsync();   // commit ou rollback total`})}),e.jsxs("p",{children:["Por isso, sempre que possível, agrupe mudanças em um único ",e.jsx("code",{children:"SaveChangesAsync"})," em vez de chamar várias vezes. Não só garante atomicidade como reduz round-trips ao banco."]}),e.jsx("h2",{children:"BeginTransactionAsync: transações que abrangem múltiplos SaveChanges"}),e.jsxs("p",{children:["Há cenários onde você precisa de mais de um ",e.jsx("code",{children:"SaveChanges"}),' dentro do mesmo "tudo ou nada" — por exemplo, gerar uma fatura, salvar, depois usar o ID gerado para criar registros em outra tabela com lógica condicional baseada no resultado da primeira.']}),e.jsx("pre",{children:e.jsx("code",{children:`using var transacao = await db.Database.BeginTransactionAsync();
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
}`})}),e.jsxs(a,{type:"info",title:"O using cuida do rollback",children:["Se você esquecer o ",e.jsx("code",{children:"CommitAsync"}),", o ",e.jsx("code",{children:"Dispose"})," do ",e.jsx("code",{children:"using"}),' faz rollback automaticamente — porque uma transação não confirmada é considerada cancelada. Esse comportamento "fail safe" evita commits parciais por engano.']}),e.jsx("h2",{children:"Savepoints: rollback parcial"}),e.jsxs("p",{children:["Dentro de uma transação grande, você pode querer marcar pontos intermediários e voltar até eles sem desfazer tudo. Isso são ",e.jsx("strong",{children:"savepoints"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`using var t = await db.Database.BeginTransactionAsync();

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

await t.CommitAsync();`})}),e.jsx("h2",{children:'Isolation levels: o nível de "ciúme" da transação'}),e.jsxs("p",{children:["Quando duas transações rodam ao mesmo tempo, podem se ver parcialmente. O ",e.jsx("strong",{children:"nível de isolamento"})," define o quanto uma vê o que a outra está fazendo. Os mais comuns:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"ReadCommitted"})," (padrão na maioria dos bancos): só vê o que já foi commitado. Bom equilíbrio."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"RepeatableRead"}),": garante que leituras dentro da transação sempre retornem o mesmo valor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Serializable"}),": como se as transações rodassem uma após a outra. Mais seguro, menos paralelo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Snapshot"}),': lê uma "foto" consistente do banco no início. SQL Server e Postgres suportam.']})]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Data;

using var t = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable);
// Operações críticas que não toleram qualquer interferência
await t.CommitAsync();`})}),e.jsx("h2",{children:"Concorrência otimista: detectar conflitos sem bloquear"}),e.jsxs("p",{children:["Em vez de travar linhas, você pode marcá-las com uma coluna que muda a cada update. Se outro processo modificou no meio do caminho, EF Core lança ",e.jsx("code",{children:"DbUpdateConcurrencyException"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Produto
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
}`})}),e.jsx("h2",{children:"Distributed transactions: cuidado!"}),e.jsxs("p",{children:["Transação ",e.jsx("strong",{children:"distribuída"})," abrange múltiplos bancos (ou serviços) e usa um coordenador (MSDTC no Windows). EF Core 7+ suporta via ",e.jsx("code",{children:"TransactionScope"}),", mas o custo de performance e complexidade operacional é alto. Em arquiteturas modernas, prefira o padrão ",e.jsx("em",{children:"Outbox"}),": salve uma mensagem na mesma transação local, e um worker assíncrono replica para o outro sistema."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Transactions;

using var escopo = new TransactionScope(
    TransactionScopeOption.Required,
    new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted },
    TransactionScopeAsyncFlowOption.Enabled);

await dbA.SaveChangesAsync();
await dbB.SaveChangesAsync();

escopo.Complete();   // commit nos dois`})}),e.jsxs(a,{type:"warning",title:"Transações longas matam a performance",children:["Manter uma transação aberta enquanto faz cálculos demorados ou chama APIs externas trava linhas no banco e cria congestionamento. Regra: faça o trabalho lento ",e.jsx("em",{children:"fora"})," da transação, abra a transação, salve rápido, commit."]}),e.jsx("h2",{children:"Retry policy: quando deadlock acontecer, tente de novo"}),e.jsxs("p",{children:["Em bancos com alta concorrência, deadlocks são inevitáveis. EF Core oferece ",e.jsx("em",{children:"execution strategy"})," com retry automático:"]}),e.jsx("pre",{children:e.jsx("code",{children:`opt.UseSqlServer(connectionString, sql =>
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
});`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"CommitAsync"}),":"]})," tudo é desfeito ao sair do ",e.jsx("code",{children:"using"}),". Verifique sempre."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar retry policy e transações manuais sem ",e.jsx("code",{children:"ExecutionStrategy"}),":"]})," EF Core lança exceção explícita."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Manter transações abertas durante chamadas HTTP:"})," trava o banco esperando uma API externa responder."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Achar que ",e.jsx("code",{children:"using"})," rolba se o método retorna normalmente:"]})," não — só se você não chamou ",e.jsx("code",{children:"Commit"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Cada ",e.jsx("code",{children:"SaveChangesAsync"})," é, sozinho, uma transação."]}),e.jsxs("li",{children:[e.jsx("code",{children:"BeginTransactionAsync"}),' agrupa múltiplos saves em um único "tudo ou nada".']}),e.jsx("li",{children:"Savepoints permitem rollback parcial."}),e.jsxs("li",{children:["Concorrência otimista detecta conflitos via coluna ",e.jsx("code",{children:"[Timestamp]"}),"."]}),e.jsxs("li",{children:["Use retry policy + ",e.jsx("code",{children:"ExecutionStrategy"})," para resiliência."]}),e.jsx("li",{children:"Evite transações longas e distribuídas; prefira padrão Outbox."})]})]})}export{n as default};
