import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreMigrations() {
  return (
    <PageContainer
      title="Migrations: versionando o schema do banco"
      subtitle="Como evoluir as tabelas do seu banco de dados ao mesmo tempo que o código C#, com histórico no Git."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine que seu código C# é um filme e o banco de dados é o cenário. Toda vez que você muda uma cena (adiciona uma propriedade), o cenário também precisa mudar (nova coluna). <strong>Migrations</strong> são o roteiro que descreve, passo a passo, como sair do cenário antigo para o novo — e como voltar, se algo der errado. Cada migration é uma classe C# que o EF Core gera comparando o estado atual do seu modelo com o estado anterior, gravado num <em>snapshot</em>.
      </p>
      <p>
        Sem migrations, alguém precisaria escrever scripts SQL <code>ALTER TABLE</code> manualmente, garantir que rodaram em todos os ambientes (dev, staging, produção), e rezar para ninguém esquecer. Migrations transformam isso em commits versionados no Git, revisáveis em pull request e aplicáveis com um único comando.
      </p>

      <h2>Instalando a ferramenta</h2>
      <p>
        O comando <code>dotnet ef</code> não vem por padrão; instale uma vez por máquina:
      </p>
      <pre><code>{`# Instala a ferramenta global
dotnet tool install --global dotnet-ef

# E no projeto, adicione o pacote de design (uma vez por projeto)
dotnet add package Microsoft.EntityFrameworkCore.Design`}</code></pre>
      <p>
        O pacote <em>Design</em> contém o código que a ferramenta CLI precisa para inspecionar seu <code>DbContext</code> em tempo de design (antes de compilar para produção).
      </p>

      <h2>Criando sua primeira migration</h2>
      <p>
        Suponha que você tenha definido as entidades <code>Cliente</code> e <code>Pedido</code>. O comando abaixo gera a migration inicial:
      </p>
      <pre><code>{`# Cria uma migration chamada "Inicial"
dotnet ef migrations add Inicial

# Resultado: pasta Migrations/ com:
#   20250115093015_Inicial.cs        ← Up() e Down()
#   20250115093015_Inicial.Designer.cs
#   LojaContextModelSnapshot.cs       ← estado atual completo`}</code></pre>
      <p>
        O timestamp no nome (<code>20250115093015</code>) é a chave de ordenação — migrations sempre rodam em ordem cronológica, jamais por nome.
      </p>
      <pre><code>{`// O conteúdo gerado é uma classe com dois métodos:
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
}`}</code></pre>

      <AlertBox type="info" title="Up sobe, Down desce">
        Toda migration tem <code>Up()</code> (aplicar) e <code>Down()</code> (reverter). Sempre revise o <code>Down()</code> — em produção você pode precisar voltar atrás.
      </AlertBox>

      <h2>Aplicando migrations ao banco</h2>
      <p>
        Há três formas principais de aplicar:
      </p>
      <pre><code>{`# 1) CLI — para dev local
dotnet ef database update

# 2) Aplicar até uma migration específica (volta ou avança)
dotnet ef database update Inicial

# 3) Em código (útil em apps que se auto-atualizam)
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<LojaContext>();
await db.Database.MigrateAsync();`}</code></pre>
      <p>
        EF Core mantém uma tabela chamada <code>__EFMigrationsHistory</code> no próprio banco para saber quais migrations já foram aplicadas — assim ele nunca aplica duas vezes.
      </p>

      <h2>Gerando scripts SQL para produção</h2>
      <p>
        Em produção, raramente se roda <code>dotnet ef database update</code> direto. O time de DBA prefere revisar SQL. Use <code>migrations script</code>:
      </p>
      <pre><code>{`# Gera SQL com TODAS as migrations
dotnet ef migrations script -o cria_tudo.sql

# Gera SQL apenas de uma migration para outra
dotnet ef migrations script Inicial AdicionarPedidos -o delta.sql

# IDEMPOTENT — script que só aplica o que ainda não foi aplicado
dotnet ef migrations script --idempotent -o seguro.sql`}</code></pre>
      <p>
        A flag <code>--idempotent</code> é ouro: o script gerado verifica <code>__EFMigrationsHistory</code> antes de cada bloco e pula o que já existe — você pode rodar sem medo de quebrar.
      </p>

      <h2>Removendo, renomeando, evoluindo</h2>
      <pre><code>{`# Remove a última migration (só funciona se ela ainda NÃO foi aplicada ao banco)
dotnet ef migrations remove

# Lista todas
dotnet ef migrations list

# Adiciona migration depois de mudar entidades
dotnet ef migrations add AdicionarColunaTelefone

# Reverter o banco até antes de uma migration
dotnet ef database update NomeDaMigrationAnterior`}</code></pre>

      <AlertBox type="warning" title="Nunca edite migration aplicada">
        Se uma migration já rodou em produção, ela está cravada no <code>__EFMigrationsHistory</code>. Editar o arquivo <code>.cs</code> dela depois quebra o histórico. Crie uma nova migration que <em>corrige</em> o que faltou.
      </AlertBox>

      <h2>Multi-ambiente: dev, staging, produção</h2>
      <p>
        Você precisa apontar para connection strings diferentes em cada ambiente. EF Core respeita a variável <code>ASPNETCORE_ENVIRONMENT</code>:
      </p>
      <pre><code>{`# Aplicar migrations contra staging
ASPNETCORE_ENVIRONMENT=Staging dotnet ef database update

# Especificar o projeto e startup separadamente
dotnet ef database update \\
    --project src/Loja.Data \\
    --startup-project src/Loja.Api \\
    --connection "Server=prod;Database=Loja;User Id=app;Password=$DB_SENHA;"`}</code></pre>

      <h2>Seed data: populando dados iniciais</h2>
      <p>
        <strong>Seed</strong> ("semente") é o conjunto de dados que devem existir desde o primeiro deploy — categorias padrão, usuário admin, países etc. Use <code>HasData</code> no <code>OnModelCreating</code>:
      </p>
      <pre><code>{`protected override void OnModelCreating(ModelBuilder mb)
{
    mb.Entity<Categoria>().HasData(
        new Categoria { Id = 1, Nome = "Eletrônicos" },
        new Categoria { Id = 2, Nome = "Livros" },
        new Categoria { Id = 3, Nome = "Vestuário" }
    );
}

// Depois disso, rode:
//   dotnet ef migrations add SeedCategorias
//   dotnet ef database update`}</code></pre>
      <p>
        EF Core gera <code>INSERT</code>s no <code>Up()</code> e <code>DELETE</code>s no <code>Down()</code>. Se você editar o seed depois, ele detecta e gera <code>UPDATE</code>s na próxima migration.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"Unable to create object of type 'LojaContext'":</strong> a ferramenta não conseguiu instanciar seu DbContext. Implemente <code>IDesignTimeDbContextFactory&lt;LojaContext&gt;</code> ou aceite <code>DbContextOptions</code> no construtor.</li>
        <li><strong>Editar migration depois de aplicar:</strong> quebra a história. Adicione uma migration nova em vez disso.</li>
        <li><strong>Versão do <code>dotnet ef</code> diferente da do EF Core no projeto:</strong> rode <code>dotnet tool update --global dotnet-ef</code>.</li>
        <li><strong>Esquecer <code>--idempotent</code> ao gerar SQL para produção:</strong> rodar duas vezes pode tentar criar tabela já existente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Migrations versionam o schema junto do código.</li>
        <li><code>add</code>, <code>update</code>, <code>remove</code>, <code>script</code> são os comandos essenciais.</li>
        <li>Em produção, prefira gerar script SQL idempotente.</li>
        <li><code>HasData</code> popula dados iniciais via migration.</li>
        <li>Nunca edite migrations já aplicadas — sempre crie novas.</li>
      </ul>
    </PageContainer>
  );
}
