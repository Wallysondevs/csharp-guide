import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RepositoryPattern() {
  return (
    <PageContainer
      title="Repository pattern: abstraindo o acesso a dados"
      subtitle="Quando faz sentido encapsular o EF Core atrás de uma interface — e quando é só burocracia."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        O <strong>Repository pattern</strong> propõe esconder o acesso a dados atrás de uma interface, como se sua camada de domínio falasse com uma "biblioteca" sem saber se os livros estão em SQL, Mongo, em memória ou num arquivo. A ideia vem do livro <em>Patterns of Enterprise Application Architecture</em> de Martin Fowler, escrito numa época em que ORMs eram primitivos. Hoje, com <strong>Entity Framework Core</strong>, parte dessa motivação evaporou — mas o padrão ainda tem usos legítimos. Vamos entender quando e como.
      </p>

      <h2>A interface genérica</h2>
      <p>
        A versão clássica usa <code>IRepository&lt;T&gt;</code> com operações CRUD básicas. Os <strong>genéricos</strong> em C# permitem reaproveitar a mesma estrutura para várias entidades sem repetir código.
      </p>
      <pre><code>{`public interface IRepository<T> where T : class
{
    Task<T?> ObterPorIdAsync(int id);
    Task<IReadOnlyList<T>> ListarAsync(Expression<Func<T, bool>>? filtro = null);
    Task AdicionarAsync(T entidade);
    void Atualizar(T entidade);
    void Remover(T entidade);
}`}</code></pre>
      <p>
        Note <code>Expression&lt;Func&lt;T, bool&gt;&gt;</code>: ele permite passar predicados que o EF traduz para SQL (em vez de buscar tudo e filtrar em memória). É o segredo para o repositório não virar gargalo.
      </p>

      <h2>Implementação com EF Core</h2>
      <pre><code>{`public class EfRepository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _ctx;
    private readonly DbSet<T> _set;

    public EfRepository(AppDbContext ctx)
    {
        _ctx = ctx;
        _set = ctx.Set<T>();
    }

    public Task<T?> ObterPorIdAsync(int id) => _set.FindAsync(id).AsTask();

    public async Task<IReadOnlyList<T>> ListarAsync(Expression<Func<T, bool>>? filtro = null)
    {
        IQueryable<T> q = _set.AsNoTracking();
        if (filtro is not null) q = q.Where(filtro);
        return await q.ToListAsync();
    }

    public async Task AdicionarAsync(T e) => await _set.AddAsync(e);
    public void Atualizar(T e) => _set.Update(e);
    public void Remover(T e)   => _set.Remove(e);
}`}</code></pre>
      <p>
        <code>AsNoTracking</code> é uma otimização: para leituras puras, evita que o EF carregue cada entidade no <em>change tracker</em>. Em listagens grandes, isso reduz uso de memória pela metade. Em consultas que vão ser modificadas e salvas, <strong>não</strong> use <code>AsNoTracking</code>.
      </p>

      <h2>Unit of Work</h2>
      <p>
        Repositórios são "memória curta": eles registram intenções (adicionar, atualizar, remover), mas a confirmação no banco vem de uma <strong>Unit of Work</strong> — a transação que agrupa várias mudanças num único commit. O nome vem de Fowler: "uma unidade de trabalho mantém uma lista das coisas afetadas por uma transação e coordena a escrita das mudanças."
      </p>
      <pre><code>{`public interface IUnitOfWork : IAsyncDisposable
{
    IRepository<Pedido> Pedidos { get; }
    IRepository<Cliente> Clientes { get; }
    Task<int> SalvarAsync();
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _ctx;
    public UnitOfWork(AppDbContext ctx)
    {
        _ctx = ctx;
        Pedidos  = new EfRepository<Pedido>(ctx);
        Clientes = new EfRepository<Cliente>(ctx);
    }
    public IRepository<Pedido> Pedidos { get; }
    public IRepository<Cliente> Clientes { get; }
    public Task<int> SalvarAsync() => _ctx.SaveChangesAsync();
    public ValueTask DisposeAsync() => _ctx.DisposeAsync();
}`}</code></pre>
      <p>
        Uso típico em um serviço:
      </p>
      <pre><code>{`public class ServicoPedido
{
    private readonly IUnitOfWork _uow;
    public ServicoPedido(IUnitOfWork uow) => _uow = uow;

    public async Task FinalizarAsync(int pedidoId)
    {
        var p = await _uow.Pedidos.ObterPorIdAsync(pedidoId)
                ?? throw new KeyNotFoundException();
        p.Finalizar();
        var cliente = await _uow.Clientes.ObterPorIdAsync(p.ClienteId);
        cliente!.AdicionarPontos(10);
        await _uow.SalvarAsync(); // tudo num único SaveChanges (transação)
    }
}`}</code></pre>

      <AlertBox type="info" title="DbContext já é uma Unit of Work">
        Aqui está o ponto polêmico. O <code>DbContext</code> do EF <em>já é</em> uma Unit of Work, e cada <code>DbSet&lt;T&gt;</code> <em>já é</em> um repositório genérico. Por isso muitos arquitetos modernos argumentam que adicionar <code>IRepository&lt;T&gt;</code> em cima do EF é uma abstração redundante, com custo (mais código, mais testes, perda de funcionalidades específicas do EF como <code>Include</code> em árvores complexas).
      </AlertBox>

      <h2>Quando usar de verdade</h2>
      <p>
        O Repository ganha valor quando:
      </p>
      <ul>
        <li><strong>Você precisa trocar o ORM ou o storage</strong>: hoje SQL, amanhã Mongo, depois um cache distribuído. Sem repositório, a regra de negócio fica grudada no EF.</li>
        <li><strong>Você quer testar a regra de negócio sem subir banco</strong>: passar uma implementação <em>fake</em> em memória é trivial.</li>
        <li><strong>Você tem queries complexas reutilizadas em vários lugares</strong>: encapsule numa interface específica (não genérica) — ex.: <code>IPedidoRepositorio.PedidosAtrasadosDoMes()</code>.</li>
        <li><strong>Múltiplos contextos de persistência</strong>: parte das entidades em SQL, parte em Cosmos DB; a interface única esconde isso do domínio.</li>
      </ul>

      <h2>Quando NÃO usar</h2>
      <p>
        Se você está fazendo um CRUD simples sobre um único banco SQL, com pouca chance de trocar tecnologia, o EF puro é mais limpo. O genérico <code>IRepository&lt;T&gt;</code> "engessa" coisas que o EF faz naturalmente: <code>Include</code> para carregar relacionamentos, projeções com <code>Select</code>, <code>GroupBy</code>, queries específicas. Você acaba reimplementando metade do <code>IQueryable</code> dentro da sua interface — ou expondo o próprio <code>IQueryable</code>, o que vaza o ORM e mata o argumento da abstração.
      </p>

      <h2>Versão pragmática: repositórios específicos</h2>
      <p>
        Em vez de <code>IRepository&lt;T&gt;</code> genérico, muitos times preferem interfaces específicas que expressam <em>intenções de domínio</em> em vez de operações de banco:
      </p>
      <pre><code>{`public interface IPedidoRepositorio
{
    Task<Pedido?> ObterComItensAsync(int id);
    Task<IReadOnlyList<Pedido>> AtrasadosDoMesAsync();
    Task AdicionarAsync(Pedido p);
}

public class EfPedidoRepositorio : IPedidoRepositorio
{
    private readonly AppDbContext _ctx;
    public EfPedidoRepositorio(AppDbContext c) => _ctx = c;

    public Task<Pedido?> ObterComItensAsync(int id) =>
        _ctx.Pedidos.Include(p => p.Itens).FirstOrDefaultAsync(p => p.Id == id);

    public Task<IReadOnlyList<Pedido>> AtrasadosDoMesAsync() => /* ... */;
    public async Task AdicionarAsync(Pedido p) => await _ctx.Pedidos.AddAsync(p);
}`}</code></pre>
      <p>
        Essa versão é mais útil: o nome do método conta a história da intenção, oculta o uso de <code>Include</code> e centraliza queries que antes seriam copiadas e coladas.
      </p>

      <AlertBox type="warning" title="Cuidado com IQueryable vazando">
        Se você expõe <code>IQueryable&lt;T&gt;</code> da sua interface, qualquer caller pode adicionar <code>Where</code>, <code>Include</code> e disparar SQL arbitrário. Isso quebra a abstração: na hora de trocar o storage, você descobre que metade do código depende de operações de IQueryable que só EF entende. Retorne sempre coleções materializadas (<code>List</code>, <code>IReadOnlyList</code>).
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Repositório genérico que retorna <code>IQueryable</code></strong> — vaza o ORM.</li>
        <li><strong>Chamar <code>SaveChanges</code> dentro do repositório</strong> — quebra a transação que envolve várias operações.</li>
        <li><strong>Múltiplos repositórios com <code>DbContext</code>s diferentes</strong> — cada um numa transação isolada; mudanças não atômicas.</li>
        <li><strong>Adicionar repositório só por moda</strong> em CRUDs simples — engorda o projeto sem benefício.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Repository abstrai persistência atrás de uma interface.</li>
        <li>Unit of Work agrupa múltiplas mudanças num único commit.</li>
        <li><code>DbContext</code> já é UoW e <code>DbSet&lt;T&gt;</code> já é repositório — questione duplicação.</li>
        <li>Prefira repositórios <em>específicos</em> com nomes de domínio a genéricos.</li>
        <li>Use Repository quando puder trocar a tecnologia ou simplificar testes — não por dogma.</li>
      </ul>
    </PageContainer>
  );
}
