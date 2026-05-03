import{j as e}from"./index-CzLAthD5.js";import{P as a,A as i}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(a,{title:"Relacionamentos no EF Core: 1:1, 1:N e N:N",subtitle:"Como modelar associações entre entidades — clientes têm pedidos, pedidos têm itens, alunos têm cursos.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:["No mundo real, dados raramente vivem isolados. Um cliente tem pedidos, um pedido tem itens, um aluno está matriculado em vários cursos. No banco, essas conexões são feitas com ",e.jsx("strong",{children:"chaves estrangeiras"})," (foreign keys, FKs) — colunas que apontam para a chave primária de outra tabela. Em EF Core, você não precisa pensar em FKs o tempo todo: você declara ",e.jsx("em",{children:"navigation properties"})," (propriedades de navegação) — referências diretas de uma entidade a outra — e o EF Core deduz a FK."]}),e.jsxs("p",{children:["Há três cardinalidades clássicas: ",e.jsx("strong",{children:"um-para-um"})," (1:1), ",e.jsx("strong",{children:"um-para-muitos"})," (1:N) e ",e.jsx("strong",{children:"muitos-para-muitos"})," (N:N). Vamos modelar cada uma com analogias e exemplos."]}),e.jsx("h2",{children:"1:N — o caso mais comum"}),e.jsx("p",{children:'"Um cliente tem muitos pedidos, mas cada pedido pertence a um único cliente." Esse é o relacionamento 1:N. A tabela do "muitos" (Pedidos) carrega a FK apontando para o "um" (Clientes).'}),e.jsx("pre",{children:e.jsx("code",{children:`public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";

    // Coleção: lado "muitos" do relacionamento
    public List<Pedido> Pedidos { get; set; } = new();
}

public class Pedido
{
    public int Id { get; set; }
    public DateTime Data { get; set; }
    public decimal Total { get; set; }

    // FK explícita (boa prática)
    public int ClienteId { get; set; }

    // Navigation property: referência ao "um"
    public Cliente Cliente { get; set; } = null!;
}`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"= null!;"}),' é uma promessa ao compilador: "EF Core vai preencher isso, confie em mim". Sem isso, com ',e.jsx("em",{children:"nullable reference types"})," ativado, o compilador reclamaria que a propriedade pode ser nula."]}),e.jsxs(i,{type:"info",title:"Shadow Foreign Key",children:["Se você omitir ",e.jsx("code",{children:"ClienteId"}),", EF Core cria a FK automaticamente como ",e.jsx("em",{children:"shadow property"})," (propriedade-sombra): existe no banco mas não na classe. Funciona, mas tê-la explícita facilita queries e setters diretos."]}),e.jsx("h2",{children:"1:1 — pares exclusivos"}),e.jsx("p",{children:'"Cada pedido tem exatamente um endereço de entrega, e esse endereço pertence só àquele pedido." Modelar 1:1 é mais sutil: EF Core precisa saber qual lado é o "principal" (carrega a chave primária) e qual é o "dependente" (carrega a FK que também é única).'}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pedido
{
    public int Id { get; set; }
    public EnderecoEntrega? Endereco { get; set; }
}

public class EnderecoEntrega
{
    public int Id { get; set; }
    public string Rua { get; set; } = "";
    public string Cidade { get; set; } = "";

    public int PedidoId { get; set; }    // FK + única
    public Pedido Pedido { get; set; } = null!;
}

// Configuração via Fluent API
mb.Entity<Pedido>()
  .HasOne(p => p.Endereco)
  .WithOne(e => e.Pedido)
  .HasForeignKey<EnderecoEntrega>(e => e.PedidoId);`})}),e.jsx("h2",{children:"N:N — alunos e cursos"}),e.jsxs("p",{children:['"Um aluno cursa várias disciplinas; cada disciplina tem vários alunos." Tradicionalmente, isso exige uma ',e.jsx("em",{children:"tabela de junção"})," (",e.jsx("code",{children:"AlunoDisciplina"}),"). A partir do EF Core 5, basta declarar coleções nos dois lados — a tabela é gerada automaticamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Aluno
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public List<Disciplina> Disciplinas { get; set; } = new();
}

public class Disciplina
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public List<Aluno> Alunos { get; set; } = new();
}

// EF Core gera tabela "AlunoDisciplina" com (AlunosId, DisciplinasId)`})}),e.jsxs("p",{children:["Se você precisar de colunas extras na junção (por exemplo, ",e.jsx("code",{children:"DataMatricula"})," ou ",e.jsx("code",{children:"Nota"}),"), declare a entidade explicitamente:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Matricula
{
    public int AlunoId { get; set; }
    public Aluno Aluno { get; set; } = null!;
    public int DisciplinaId { get; set; }
    public Disciplina Disciplina { get; set; } = null!;
    public DateTime Data { get; set; }
    public decimal? Nota { get; set; }
}

mb.Entity<Aluno>()
  .HasMany(a => a.Disciplinas)
  .WithMany(d => d.Alunos)
  .UsingEntity<Matricula>();`})}),e.jsx("h2",{children:"Eager loading com Include e ThenInclude"}),e.jsxs("p",{children:["Por padrão, EF Core ",e.jsx("strong",{children:"não carrega"})," as navigation properties — elas chegam vazias. ",e.jsx("code",{children:"Include"}),' ("inclua") instrui a carregar junto, em uma única query (eager loading, "carregamento adiantado"):']}),e.jsx("pre",{children:e.jsx("code",{children:`// Carrega cada Pedido com seu Cliente
var pedidos = await db.Pedidos
    .Include(p => p.Cliente)
    .ToListAsync();

// Múltiplos níveis: pedidos → itens → produto
var detalhados = await db.Pedidos
    .Include(p => p.Itens)
        .ThenInclude(i => i.Produto)
    .Include(p => p.Cliente)
    .ToListAsync();

// Filtrar dentro do Include (filtered include, EF Core 5+)
var ativos = await db.Clientes
    .Include(c => c.Pedidos.Where(p => p.Status == "Pago"))
    .ToListAsync();`})}),e.jsx("h2",{children:"Lazy loading: carregar sob demanda"}),e.jsx("p",{children:'Lazy loading ("carregamento preguiçoso") faz EF Core ir ao banco automaticamente quando você acessa a navigation property pela primeira vez. Conveniente, mas perigoso — esconde queries.'}),e.jsx("pre",{children:e.jsx("code",{children:`# Instalar pacote de proxies
dotnet add package Microsoft.EntityFrameworkCore.Proxies`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Habilitar
opt.UseLazyLoadingProxies()
   .UseSqlServer(connectionString);

// E declarar navigations como VIRTUAL
public class Cliente
{
    public int Id { get; set; }
    public virtual List<Pedido> Pedidos { get; set; } = new();
}

// Agora isso dispara um SELECT por trás:
var cliente = await db.Clientes.FindAsync(1);
foreach (var p in cliente.Pedidos) // <-- query aqui!
    Console.WriteLine(p.Total);`})}),e.jsxs(i,{type:"danger",title:"O problema N+1",children:["Se você listar 100 clientes e dentro do loop acessar ",e.jsx("code",{children:"cliente.Pedidos"})," com lazy loading, dispara 1 query para clientes + 100 queries para pedidos = 101 queries no total. É a causa #1 de lentidão com ORMs. Use ",e.jsx("code",{children:"Include"})," explícito antes do loop."]}),e.jsx("h2",{children:"Configurando relacionamentos com Fluent API"}),e.jsx("p",{children:"Para casos não-convencionais — nome de FK diferente, comportamento de delete, FK composta — use Fluent API:"}),e.jsx("pre",{children:e.jsx("code",{children:`mb.Entity<Pedido>(e =>
{
    // Relacionamento explícito
    e.HasOne(p => p.Cliente)
     .WithMany(c => c.Pedidos)
     .HasForeignKey(p => p.ClienteId)
     .OnDelete(DeleteBehavior.Restrict);   // não apaga cliente em cascata
});

// Comportamentos de OnDelete:
// Cascade   → apaga filhos junto (perigoso em produção)
// Restrict  → impede delete se houver filhos
// SetNull   → seta FK como null (FK precisa ser nullable)
// NoAction  → deixa para o banco decidir (geralmente igual a Restrict)`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"Include"})," e cair em N+1:"]})," meça com logs ou Application Insights."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cascade delete sem pensar:"})," apagar um cliente apaga todos os pedidos dele. Use ",e.jsx("code",{children:"Restrict"})," em domínios contábeis."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Lazy loading sem ",e.jsx("code",{children:"virtual"}),":"]})," proxies não interceptam — a navigation chega null silenciosamente."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Múltiplos Includes sem ",e.jsx("code",{children:"AsSplitQuery"}),":"]})," gera produto cartesiano enorme em queries com várias coleções."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:'1:N usa FK no lado "muitos"; declare navigation + FK explícita.'}),e.jsx("li",{children:"1:1 exige Fluent API para definir o lado dependente."}),e.jsx("li",{children:"N:N pode ser implícita (EF Core 5+) ou com entidade de junção própria."}),e.jsxs("li",{children:[e.jsx("code",{children:"Include"}),"/",e.jsx("code",{children:"ThenInclude"})," são a forma segura de carregar relacionados."]}),e.jsx("li",{children:"Lazy loading existe, mas N+1 é o monstro do armário."}),e.jsxs("li",{children:["Configure ",e.jsx("code",{children:"OnDelete"})," conscientemente."]})]})]})}export{n as default};
