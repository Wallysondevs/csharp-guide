import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(s,{title:"Repository pattern: abstraindo o acesso a dados",subtitle:"Quando faz sentido encapsular o EF Core atrás de uma interface — e quando é só burocracia.",difficulty:"intermediario",timeToRead:"16 min",children:[e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Repository pattern"}),' propõe esconder o acesso a dados atrás de uma interface, como se sua camada de domínio falasse com uma "biblioteca" sem saber se os livros estão em SQL, Mongo, em memória ou num arquivo. A ideia vem do livro ',e.jsx("em",{children:"Patterns of Enterprise Application Architecture"})," de Martin Fowler, escrito numa época em que ORMs eram primitivos. Hoje, com ",e.jsx("strong",{children:"Entity Framework Core"}),", parte dessa motivação evaporou — mas o padrão ainda tem usos legítimos. Vamos entender quando e como."]}),e.jsx("h2",{children:"A interface genérica"}),e.jsxs("p",{children:["A versão clássica usa ",e.jsx("code",{children:"IRepository<T>"})," com operações CRUD básicas. Os ",e.jsx("strong",{children:"genéricos"})," em C# permitem reaproveitar a mesma estrutura para várias entidades sem repetir código."]}),e.jsx("pre",{children:e.jsx("code",{children:`public interface IRepository<T> where T : class
{
    Task<T?> ObterPorIdAsync(int id);
    Task<IReadOnlyList<T>> ListarAsync(Expression<Func<T, bool>>? filtro = null);
    Task AdicionarAsync(T entidade);
    void Atualizar(T entidade);
    void Remover(T entidade);
}`})}),e.jsxs("p",{children:["Note ",e.jsx("code",{children:"Expression<Func<T, bool>>"}),": ele permite passar predicados que o EF traduz para SQL (em vez de buscar tudo e filtrar em memória). É o segredo para o repositório não virar gargalo."]}),e.jsx("h2",{children:"Implementação com EF Core"}),e.jsx("pre",{children:e.jsx("code",{children:`public class EfRepository<T> : IRepository<T> where T : class
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
}`})}),e.jsxs("p",{children:[e.jsx("code",{children:"AsNoTracking"})," é uma otimização: para leituras puras, evita que o EF carregue cada entidade no ",e.jsx("em",{children:"change tracker"}),". Em listagens grandes, isso reduz uso de memória pela metade. Em consultas que vão ser modificadas e salvas, ",e.jsx("strong",{children:"não"})," use ",e.jsx("code",{children:"AsNoTracking"}),"."]}),e.jsx("h2",{children:"Unit of Work"}),e.jsxs("p",{children:['Repositórios são "memória curta": eles registram intenções (adicionar, atualizar, remover), mas a confirmação no banco vem de uma ',e.jsx("strong",{children:"Unit of Work"}),' — a transação que agrupa várias mudanças num único commit. O nome vem de Fowler: "uma unidade de trabalho mantém uma lista das coisas afetadas por uma transação e coordena a escrita das mudanças."']}),e.jsx("pre",{children:e.jsx("code",{children:`public interface IUnitOfWork : IAsyncDisposable
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
}`})}),e.jsx("p",{children:"Uso típico em um serviço:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class ServicoPedido
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
}`})}),e.jsxs(o,{type:"info",title:"DbContext já é uma Unit of Work",children:["Aqui está o ponto polêmico. O ",e.jsx("code",{children:"DbContext"})," do EF ",e.jsx("em",{children:"já é"})," uma Unit of Work, e cada ",e.jsx("code",{children:"DbSet<T>"})," ",e.jsx("em",{children:"já é"})," um repositório genérico. Por isso muitos arquitetos modernos argumentam que adicionar ",e.jsx("code",{children:"IRepository<T>"})," em cima do EF é uma abstração redundante, com custo (mais código, mais testes, perda de funcionalidades específicas do EF como ",e.jsx("code",{children:"Include"})," em árvores complexas)."]}),e.jsx("h2",{children:"Quando usar de verdade"}),e.jsx("p",{children:"O Repository ganha valor quando:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Você precisa trocar o ORM ou o storage"}),": hoje SQL, amanhã Mongo, depois um cache distribuído. Sem repositório, a regra de negócio fica grudada no EF."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Você quer testar a regra de negócio sem subir banco"}),": passar uma implementação ",e.jsx("em",{children:"fake"})," em memória é trivial."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Você tem queries complexas reutilizadas em vários lugares"}),": encapsule numa interface específica (não genérica) — ex.: ",e.jsx("code",{children:"IPedidoRepositorio.PedidosAtrasadosDoMes()"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Múltiplos contextos de persistência"}),": parte das entidades em SQL, parte em Cosmos DB; a interface única esconde isso do domínio."]})]}),e.jsx("h2",{children:"Quando NÃO usar"}),e.jsxs("p",{children:["Se você está fazendo um CRUD simples sobre um único banco SQL, com pouca chance de trocar tecnologia, o EF puro é mais limpo. O genérico ",e.jsx("code",{children:"IRepository<T>"}),' "engessa" coisas que o EF faz naturalmente: ',e.jsx("code",{children:"Include"})," para carregar relacionamentos, projeções com ",e.jsx("code",{children:"Select"}),", ",e.jsx("code",{children:"GroupBy"}),", queries específicas. Você acaba reimplementando metade do ",e.jsx("code",{children:"IQueryable"})," dentro da sua interface — ou expondo o próprio ",e.jsx("code",{children:"IQueryable"}),", o que vaza o ORM e mata o argumento da abstração."]}),e.jsx("h2",{children:"Versão pragmática: repositórios específicos"}),e.jsxs("p",{children:["Em vez de ",e.jsx("code",{children:"IRepository<T>"})," genérico, muitos times preferem interfaces específicas que expressam ",e.jsx("em",{children:"intenções de domínio"})," em vez de operações de banco:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public interface IPedidoRepositorio
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
}`})}),e.jsxs("p",{children:["Essa versão é mais útil: o nome do método conta a história da intenção, oculta o uso de ",e.jsx("code",{children:"Include"})," e centraliza queries que antes seriam copiadas e coladas."]}),e.jsxs(o,{type:"warning",title:"Cuidado com IQueryable vazando",children:["Se você expõe ",e.jsx("code",{children:"IQueryable<T>"})," da sua interface, qualquer caller pode adicionar ",e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Include"})," e disparar SQL arbitrário. Isso quebra a abstração: na hora de trocar o storage, você descobre que metade do código depende de operações de IQueryable que só EF entende. Retorne sempre coleções materializadas (",e.jsx("code",{children:"List"}),", ",e.jsx("code",{children:"IReadOnlyList"}),")."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Repositório genérico que retorna ",e.jsx("code",{children:"IQueryable"})]})," — vaza o ORM."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Chamar ",e.jsx("code",{children:"SaveChanges"})," dentro do repositório"]})," — quebra a transação que envolve várias operações."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Múltiplos repositórios com ",e.jsx("code",{children:"DbContext"}),"s diferentes"]})," — cada um numa transação isolada; mudanças não atômicas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Adicionar repositório só por moda"})," em CRUDs simples — engorda o projeto sem benefício."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Repository abstrai persistência atrás de uma interface."}),e.jsx("li",{children:"Unit of Work agrupa múltiplas mudanças num único commit."}),e.jsxs("li",{children:[e.jsx("code",{children:"DbContext"})," já é UoW e ",e.jsx("code",{children:"DbSet<T>"})," já é repositório — questione duplicação."]}),e.jsxs("li",{children:["Prefira repositórios ",e.jsx("em",{children:"específicos"})," com nomes de domínio a genéricos."]}),e.jsx("li",{children:"Use Repository quando puder trocar a tecnologia ou simplificar testes — não por dogma."})]})]})}export{a as default};
