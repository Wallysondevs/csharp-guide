import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(o,{title:"Migrations: versionando o schema do banco",subtitle:"Como evoluir as tabelas do seu banco de dados ao mesmo tempo que o código C#, com histórico no Git.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine que seu código C# é um filme e o banco de dados é o cenário. Toda vez que você muda uma cena (adiciona uma propriedade), o cenário também precisa mudar (nova coluna). ",e.jsx("strong",{children:"Migrations"})," são o roteiro que descreve, passo a passo, como sair do cenário antigo para o novo — e como voltar, se algo der errado. Cada migration é uma classe C# que o EF Core gera comparando o estado atual do seu modelo com o estado anterior, gravado num ",e.jsx("em",{children:"snapshot"}),"."]}),e.jsxs("p",{children:["Sem migrations, alguém precisaria escrever scripts SQL ",e.jsx("code",{children:"ALTER TABLE"})," manualmente, garantir que rodaram em todos os ambientes (dev, staging, produção), e rezar para ninguém esquecer. Migrations transformam isso em commits versionados no Git, revisáveis em pull request e aplicáveis com um único comando."]}),e.jsx("h2",{children:"Instalando a ferramenta"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"dotnet ef"})," não vem por padrão; instale uma vez por máquina:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Instala a ferramenta global
dotnet tool install --global dotnet-ef

# E no projeto, adicione o pacote de design (uma vez por projeto)
dotnet add package Microsoft.EntityFrameworkCore.Design`})}),e.jsxs("p",{children:["O pacote ",e.jsx("em",{children:"Design"})," contém o código que a ferramenta CLI precisa para inspecionar seu ",e.jsx("code",{children:"DbContext"})," em tempo de design (antes de compilar para produção)."]}),e.jsx("h2",{children:"Criando sua primeira migration"}),e.jsxs("p",{children:["Suponha que você tenha definido as entidades ",e.jsx("code",{children:"Cliente"})," e ",e.jsx("code",{children:"Pedido"}),". O comando abaixo gera a migration inicial:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria uma migration chamada "Inicial"
dotnet ef migrations add Inicial

# Resultado: pasta Migrations/ com:
#   20250115093015_Inicial.cs        ← Up() e Down()
#   20250115093015_Inicial.Designer.cs
#   LojaContextModelSnapshot.cs       ← estado atual completo`})}),e.jsxs("p",{children:["O timestamp no nome (",e.jsx("code",{children:"20250115093015"}),") é a chave de ordenação — migrations sempre rodam em ordem cronológica, jamais por nome."]}),e.jsx("pre",{children:e.jsx("code",{children:`// O conteúdo gerado é uma classe com dois métodos:
public partial class Inicial : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Clientes",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Nome = table.Column<string>(maxLength: 100, nullable: false),
                Email = table.Column<string>(maxLength: 200, nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_Clientes", x => x.Id));

        migrationBuilder.CreateIndex(
            name: "IX_Clientes_Email",
            table: "Clientes",
            column: "Email",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Clientes");
    }
}`})}),e.jsxs(a,{type:"info",title:"Up sobe, Down desce",children:["Toda migration tem ",e.jsx("code",{children:"Up()"})," (aplicar) e ",e.jsx("code",{children:"Down()"})," (reverter). Sempre revise o ",e.jsx("code",{children:"Down()"})," — em produção você pode precisar voltar atrás."]}),e.jsx("h2",{children:"Aplicando migrations ao banco"}),e.jsx("p",{children:"Há três formas principais de aplicar:"}),e.jsx("pre",{children:e.jsx("code",{children:`# 1) CLI — para dev local
dotnet ef database update

# 2) Aplicar até uma migration específica (volta ou avança)
dotnet ef database update Inicial

# 3) Em código (útil em apps que se auto-atualizam)
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<LojaContext>();
await db.Database.MigrateAsync();`})}),e.jsxs("p",{children:["EF Core mantém uma tabela chamada ",e.jsx("code",{children:"__EFMigrationsHistory"})," no próprio banco para saber quais migrations já foram aplicadas — assim ele nunca aplica duas vezes."]}),e.jsx("h2",{children:"Gerando scripts SQL para produção"}),e.jsxs("p",{children:["Em produção, raramente se roda ",e.jsx("code",{children:"dotnet ef database update"})," direto. O time de DBA prefere revisar SQL. Use ",e.jsx("code",{children:"migrations script"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Gera SQL com TODAS as migrations
dotnet ef migrations script -o cria_tudo.sql

# Gera SQL apenas de uma migration para outra
dotnet ef migrations script Inicial AdicionarPedidos -o delta.sql

# IDEMPOTENT — script que só aplica o que ainda não foi aplicado
dotnet ef migrations script --idempotent -o seguro.sql`})}),e.jsxs("p",{children:["A flag ",e.jsx("code",{children:"--idempotent"})," é ouro: o script gerado verifica ",e.jsx("code",{children:"__EFMigrationsHistory"})," antes de cada bloco e pula o que já existe — você pode rodar sem medo de quebrar."]}),e.jsx("h2",{children:"Removendo, renomeando, evoluindo"}),e.jsx("pre",{children:e.jsx("code",{children:`# Remove a última migration (só funciona se ela ainda NÃO foi aplicada ao banco)
dotnet ef migrations remove

# Lista todas
dotnet ef migrations list

# Adiciona migration depois de mudar entidades
dotnet ef migrations add AdicionarColunaTelefone

# Reverter o banco até antes de uma migration
dotnet ef database update NomeDaMigrationAnterior`})}),e.jsxs(a,{type:"warning",title:"Nunca edite migration aplicada",children:["Se uma migration já rodou em produção, ela está cravada no ",e.jsx("code",{children:"__EFMigrationsHistory"}),". Editar o arquivo ",e.jsx("code",{children:".cs"})," dela depois quebra o histórico. Crie uma nova migration que ",e.jsx("em",{children:"corrige"})," o que faltou."]}),e.jsx("h2",{children:"Multi-ambiente: dev, staging, produção"}),e.jsxs("p",{children:["Você precisa apontar para connection strings diferentes em cada ambiente. EF Core respeita a variável ",e.jsx("code",{children:"ASPNETCORE_ENVIRONMENT"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`# Aplicar migrations contra staging
ASPNETCORE_ENVIRONMENT=Staging dotnet ef database update

# Especificar o projeto e startup separadamente
dotnet ef database update \\
    --project src/Loja.Data \\
    --startup-project src/Loja.Api \\
    --connection "Server=prod;Database=Loja;User Id=app;Password=$DB_SENHA;"`})}),e.jsx("h2",{children:"Seed data: populando dados iniciais"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Seed"}),' ("semente") é o conjunto de dados que devem existir desde o primeiro deploy — categorias padrão, usuário admin, países etc. Use ',e.jsx("code",{children:"HasData"})," no ",e.jsx("code",{children:"OnModelCreating"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`protected override void OnModelCreating(ModelBuilder mb)
{
    mb.Entity<Categoria>().HasData(
        new Categoria { Id = 1, Nome = "Eletrônicos" },
        new Categoria { Id = 2, Nome = "Livros" },
        new Categoria { Id = 3, Nome = "Vestuário" }
    );
}

// Depois disso, rode:
//   dotnet ef migrations add SeedCategorias
//   dotnet ef database update`})}),e.jsxs("p",{children:["EF Core gera ",e.jsx("code",{children:"INSERT"}),"s no ",e.jsx("code",{children:"Up()"})," e ",e.jsx("code",{children:"DELETE"}),"s no ",e.jsx("code",{children:"Down()"}),". Se você editar o seed depois, ele detecta e gera ",e.jsx("code",{children:"UPDATE"}),"s na próxima migration."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:`"Unable to create object of type 'LojaContext'":`})," a ferramenta não conseguiu instanciar seu DbContext. Implemente ",e.jsx("code",{children:"IDesignTimeDbContextFactory<LojaContext>"})," ou aceite ",e.jsx("code",{children:"DbContextOptions"})," no construtor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Editar migration depois de aplicar:"})," quebra a história. Adicione uma migration nova em vez disso."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Versão do ",e.jsx("code",{children:"dotnet ef"})," diferente da do EF Core no projeto:"]})," rode ",e.jsx("code",{children:"dotnet tool update --global dotnet-ef"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"--idempotent"})," ao gerar SQL para produção:"]})," rodar duas vezes pode tentar criar tabela já existente."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Migrations versionam o schema junto do código."}),e.jsxs("li",{children:[e.jsx("code",{children:"add"}),", ",e.jsx("code",{children:"update"}),", ",e.jsx("code",{children:"remove"}),", ",e.jsx("code",{children:"script"})," são os comandos essenciais."]}),e.jsx("li",{children:"Em produção, prefira gerar script SQL idempotente."}),e.jsxs("li",{children:[e.jsx("code",{children:"HasData"})," popula dados iniciais via migration."]}),e.jsx("li",{children:"Nunca edite migrations já aplicadas — sempre crie novas."})]})]})}export{n as default};
