import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function EfcoreIntro() {
  return (
    <PageContainer
      title="EF Core: o ORM oficial do .NET"
      subtitle="Conversando com o banco de dados em C#, sem escrever uma linha de SQL (ainda)."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine que você precisa guardar pedidos, clientes e produtos. Sem ajuda, você abriria uma conexão com o banco, escreveria comandos SQL como <code>INSERT INTO Pedidos VALUES (...)</code>, leria resultados em <em>cursors</em> e converteria cada coluna em uma propriedade C# manualmente. Funciona, mas é tedioso e propenso a erro. Um <strong>ORM</strong> (Object-Relational Mapper, "mapeador objeto-relacional") faz essa ponte automaticamente: você trabalha com objetos C# e ele gera o SQL por baixo.
      </p>
      <p>
        O <strong>Entity Framework Core</strong> (apelidado de <em>EF Core</em>) é o ORM mantido pela própria Microsoft. É a evolução do antigo Entity Framework 6, mas reescrito do zero para ser multiplataforma, mais leve e capaz de rodar em Linux, macOS e Windows. Pense nele como o <em>Google Tradutor</em> entre o mundo dos objetos (C#) e o mundo das tabelas (SQL).
      </p>

      <h2>O que um ORM realmente faz</h2>
      <p>
        Sem ORM, salvar um cliente vira algo assim:
      </p>
      <pre><code>{`// ADO.NET puro — verboso e cheio de armadilhas
using var conexao = new SqlConnection(connectionString);
await conexao.OpenAsync();
using var cmd = new SqlCommand(
    "INSERT INTO Clientes (Nome, Email) VALUES (@n, @e)", conexao);
cmd.Parameters.AddWithValue("@n", "Ana");
cmd.Parameters.AddWithValue("@e", "ana@x.com");
await cmd.ExecuteNonQueryAsync();`}</code></pre>
      <p>
        Com EF Core, vira:
      </p>
      <pre><code>{`// Mesmo trabalho, sem SQL à vista
db.Clientes.Add(new Cliente { Nome = "Ana", Email = "ana@x.com" });
await db.SaveChangesAsync();`}</code></pre>
      <p>
        EF Core observa as mudanças no objeto (esse rastreamento se chama <em>change tracking</em>), gera o SQL apropriado para o banco que você está usando, executa, e ainda preenche o <code>Id</code> gerado pelo banco de volta no objeto. É bastante coisa por trás de duas linhas.
      </p>

      <h2>Code-first vs Database-first</h2>
      <p>
        Há duas filosofias para começar um projeto:
      </p>
      <ul>
        <li><strong>Code-first:</strong> você escreve as classes C# primeiro, e EF Core gera o esquema do banco a partir delas (via <em>migrations</em>). É a abordagem dominante em projetos novos.</li>
        <li><strong>Database-first:</strong> o banco já existe (sistema legado, DBA tomou conta) e você gera as classes C# a partir dele com <code>dotnet ef dbcontext scaffold</code>.</li>
      </ul>
      <pre><code>{`# Database-first: gerar classes a partir de um banco existente
dotnet ef dbcontext scaffold \\
    "Server=.;Database=Loja;Trusted_Connection=true;Encrypt=false" \\
    Microsoft.EntityFrameworkCore.SqlServer \\
    -o Modelos --context LojaContext`}</code></pre>

      <AlertBox type="info" title="Use code-first sempre que possível">
        Manter o modelo em C# torna o esquema do banco parte do controle de versão e do code review. Migrations viram diffs claros no Git — algo que o database-first não oferece.
      </AlertBox>

      <h2>Providers: um EF Core, vários bancos</h2>
      <p>
        EF Core não fala com o banco diretamente. Cada banco tem um <strong>provider</strong> (driver tradutor) instalado como pacote NuGet separado. Trocar de banco em teoria é trocar o provider; na prática, recursos avançados podem ter dialetos próprios. Os principais:
      </p>
      <pre><code>{`# SQL Server (Microsoft, on-premises ou Azure)
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# PostgreSQL (open source, muito popular em Linux/cloud)
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# SQLite (banco em arquivo único — ótimo para apps mobile/desktop)
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# MySQL / MariaDB
dotnet add package Pomelo.EntityFrameworkCore.MySql

# Cosmos DB (NoSQL da Azure)
dotnet add package Microsoft.EntityFrameworkCore.Cosmos`}</code></pre>
      <p>
        Cada provider sabe traduzir LINQ para o SQL específico do banco — porque, apesar de SQL ser "padrão", cada banco tem suas particularidades de paginação, tipos de data, funções de string etc.
      </p>

      <h2>Instalando e usando pela primeira vez</h2>
      <p>
        Vamos montar o esqueleto mínimo de uma aplicação console com EF Core e SQLite (escolha popular para começar porque não exige instalar servidor):
      </p>
      <pre><code>{`# Cria projeto
dotnet new console -n MeuPrimeiroEf
cd MeuPrimeiroEf

# Instala EF Core e o provider SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design

# Instala a ferramenta global (uma vez por máquina)
dotnet tool install --global dotnet-ef`}</code></pre>
      <pre><code>{`// Program.cs
using Microsoft.EntityFrameworkCore;

public class Cliente
{
    public int Id { get; set; }      // EF Core enxerga como chave primária
    public string Nome { get; set; } = "";
    public string Email { get; set; } = "";
}

public class LojaContext : DbContext
{
    public DbSet<Cliente> Clientes => Set<Cliente>();

    protected override void OnConfiguring(DbContextOptionsBuilder opt)
        => opt.UseSqlite("Data Source=loja.db");
}

// Uso
using var db = new LojaContext();
db.Database.EnsureCreated(); // cria o arquivo loja.db se não existir

db.Clientes.Add(new Cliente { Nome = "Ana", Email = "ana@x.com" });
await db.SaveChangesAsync();

foreach (var c in db.Clientes)
    Console.WriteLine($"{c.Id} - {c.Nome}");`}</code></pre>

      <h2>EF Core vs Dapper: quando escolher qual</h2>
      <p>
        <strong>Dapper</strong> é um <em>micro-ORM</em> popular: ele só mapeia resultados de SQL para objetos, sem rastrear mudanças nem gerar SQL. É mais rápido e mais simples, mas você escreve todo o SQL na mão.
      </p>
      <table>
        <thead>
          <tr><th>Critério</th><th>EF Core</th><th>Dapper</th></tr>
        </thead>
        <tbody>
          <tr><td>SQL automático (CRUD)</td><td>Sim</td><td>Não, você escreve</td></tr>
          <tr><td>Migrations</td><td>Sim</td><td>Não</td></tr>
          <tr><td>Performance bruta</td><td>Boa (otimizou muito)</td><td>Excelente</td></tr>
          <tr><td>Curva de aprendizado</td><td>Maior</td><td>Mínima</td></tr>
          <tr><td>Ideal para</td><td>CRUD pesado, DDD</td><td>Relatórios, queries críticas</td></tr>
        </tbody>
      </table>

      <AlertBox type="warning" title="Não é mágica">
        Um ORM esconde SQL, mas não isenta você de entender SQL. Saber ler o que EF Core gera (com <code>.ToQueryString()</code>) é essencial para diagnosticar lentidão.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>Microsoft.EntityFrameworkCore.Design</code>:</strong> sem esse pacote, <code>dotnet ef</code> reclama "design assembly não encontrado".</li>
        <li><strong>Misturar versões de pacotes:</strong> EF Core 8, provider 7 e tools 9 dão erros estranhos. Mantenha tudo na mesma major version.</li>
        <li><strong>Usar <code>EnsureCreated</code> em produção:</strong> ele cria o banco mas não suporta migrations futuras. Use só em testes/protótipos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>EF Core é o ORM oficial do .NET — mapeia objetos para tabelas.</li>
        <li>Cada banco tem um <em>provider</em> NuGet separado.</li>
        <li><em>Code-first</em> é o caminho preferido em projetos novos.</li>
        <li>Dapper é alternativa mais leve para SQL crítico.</li>
        <li>EF Core não isenta de entender SQL — só economiza digitação.</li>
      </ul>
    </PageContainer>
  );
}
