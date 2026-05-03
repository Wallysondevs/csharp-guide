import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"EF Core: o ORM oficial do .NET",subtitle:"Conversando com o banco de dados em C#, sem escrever uma linha de SQL (ainda).",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine que você precisa guardar pedidos, clientes e produtos. Sem ajuda, você abriria uma conexão com o banco, escreveria comandos SQL como ",e.jsx("code",{children:"INSERT INTO Pedidos VALUES (...)"}),", leria resultados em ",e.jsx("em",{children:"cursors"})," e converteria cada coluna em uma propriedade C# manualmente. Funciona, mas é tedioso e propenso a erro. Um ",e.jsx("strong",{children:"ORM"}),' (Object-Relational Mapper, "mapeador objeto-relacional") faz essa ponte automaticamente: você trabalha com objetos C# e ele gera o SQL por baixo.']}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Entity Framework Core"})," (apelidado de ",e.jsx("em",{children:"EF Core"}),") é o ORM mantido pela própria Microsoft. É a evolução do antigo Entity Framework 6, mas reescrito do zero para ser multiplataforma, mais leve e capaz de rodar em Linux, macOS e Windows. Pense nele como o ",e.jsx("em",{children:"Google Tradutor"})," entre o mundo dos objetos (C#) e o mundo das tabelas (SQL)."]}),e.jsx("h2",{children:"O que um ORM realmente faz"}),e.jsx("p",{children:"Sem ORM, salvar um cliente vira algo assim:"}),e.jsx("pre",{children:e.jsx("code",{children:`// ADO.NET puro — verboso e cheio de armadilhas
using var conexao = new SqlConnection(connectionString);
await conexao.OpenAsync();
using var cmd = new SqlCommand(
    "INSERT INTO Clientes (Nome, Email) VALUES (@n, @e)", conexao);
cmd.Parameters.AddWithValue("@n", "Ana");
cmd.Parameters.AddWithValue("@e", "ana@x.com");
await cmd.ExecuteNonQueryAsync();`})}),e.jsx("p",{children:"Com EF Core, vira:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Mesmo trabalho, sem SQL à vista
db.Clientes.Add(new Cliente { Nome = "Ana", Email = "ana@x.com" });
await db.SaveChangesAsync();`})}),e.jsxs("p",{children:["EF Core observa as mudanças no objeto (esse rastreamento se chama ",e.jsx("em",{children:"change tracking"}),"), gera o SQL apropriado para o banco que você está usando, executa, e ainda preenche o ",e.jsx("code",{children:"Id"})," gerado pelo banco de volta no objeto. É bastante coisa por trás de duas linhas."]}),e.jsx("h2",{children:"Code-first vs Database-first"}),e.jsx("p",{children:"Há duas filosofias para começar um projeto:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Code-first:"})," você escreve as classes C# primeiro, e EF Core gera o esquema do banco a partir delas (via ",e.jsx("em",{children:"migrations"}),"). É a abordagem dominante em projetos novos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Database-first:"})," o banco já existe (sistema legado, DBA tomou conta) e você gera as classes C# a partir dele com ",e.jsx("code",{children:"dotnet ef dbcontext scaffold"}),"."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`# Database-first: gerar classes a partir de um banco existente
dotnet ef dbcontext scaffold \\
    "Server=.;Database=Loja;Trusted_Connection=true;Encrypt=false" \\
    Microsoft.EntityFrameworkCore.SqlServer \\
    -o Modelos --context LojaContext`})}),e.jsx(o,{type:"info",title:"Use code-first sempre que possível",children:"Manter o modelo em C# torna o esquema do banco parte do controle de versão e do code review. Migrations viram diffs claros no Git — algo que o database-first não oferece."}),e.jsx("h2",{children:"Providers: um EF Core, vários bancos"}),e.jsxs("p",{children:["EF Core não fala com o banco diretamente. Cada banco tem um ",e.jsx("strong",{children:"provider"})," (driver tradutor) instalado como pacote NuGet separado. Trocar de banco em teoria é trocar o provider; na prática, recursos avançados podem ter dialetos próprios. Os principais:"]}),e.jsx("pre",{children:e.jsx("code",{children:`# SQL Server (Microsoft, on-premises ou Azure)
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# PostgreSQL (open source, muito popular em Linux/cloud)
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# SQLite (banco em arquivo único — ótimo para apps mobile/desktop)
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# MySQL / MariaDB
dotnet add package Pomelo.EntityFrameworkCore.MySql

# Cosmos DB (NoSQL da Azure)
dotnet add package Microsoft.EntityFrameworkCore.Cosmos`})}),e.jsx("p",{children:'Cada provider sabe traduzir LINQ para o SQL específico do banco — porque, apesar de SQL ser "padrão", cada banco tem suas particularidades de paginação, tipos de data, funções de string etc.'}),e.jsx("h2",{children:"Instalando e usando pela primeira vez"}),e.jsx("p",{children:"Vamos montar o esqueleto mínimo de uma aplicação console com EF Core e SQLite (escolha popular para começar porque não exige instalar servidor):"}),e.jsx("pre",{children:e.jsx("code",{children:`# Cria projeto
dotnet new console -n MeuPrimeiroEf
cd MeuPrimeiroEf

# Instala EF Core e o provider SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design

# Instala a ferramenta global (uma vez por máquina)
dotnet tool install --global dotnet-ef`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
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
    Console.WriteLine($"{c.Id} - {c.Nome}");`})}),e.jsx("h2",{children:"EF Core vs Dapper: quando escolher qual"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Dapper"})," é um ",e.jsx("em",{children:"micro-ORM"})," popular: ele só mapeia resultados de SQL para objetos, sem rastrear mudanças nem gerar SQL. É mais rápido e mais simples, mas você escreve todo o SQL na mão."]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Critério"}),e.jsx("th",{children:"EF Core"}),e.jsx("th",{children:"Dapper"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"SQL automático (CRUD)"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Não, você escreve"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Migrations"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Não"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Performance bruta"}),e.jsx("td",{children:"Boa (otimizou muito)"}),e.jsx("td",{children:"Excelente"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Curva de aprendizado"}),e.jsx("td",{children:"Maior"}),e.jsx("td",{children:"Mínima"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Ideal para"}),e.jsx("td",{children:"CRUD pesado, DDD"}),e.jsx("td",{children:"Relatórios, queries críticas"})]})]})]}),e.jsxs(o,{type:"warning",title:"Não é mágica",children:["Um ORM esconde SQL, mas não isenta você de entender SQL. Saber ler o que EF Core gera (com ",e.jsx("code",{children:".ToQueryString()"}),") é essencial para diagnosticar lentidão."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"Microsoft.EntityFrameworkCore.Design"}),":"]})," sem esse pacote, ",e.jsx("code",{children:"dotnet ef"}),' reclama "design assembly não encontrado".']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar versões de pacotes:"})," EF Core 8, provider 7 e tools 9 dão erros estranhos. Mantenha tudo na mesma major version."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"EnsureCreated"})," em produção:"]})," ele cria o banco mas não suporta migrations futuras. Use só em testes/protótipos."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"EF Core é o ORM oficial do .NET — mapeia objetos para tabelas."}),e.jsxs("li",{children:["Cada banco tem um ",e.jsx("em",{children:"provider"})," NuGet separado."]}),e.jsxs("li",{children:[e.jsx("em",{children:"Code-first"})," é o caminho preferido em projetos novos."]}),e.jsx("li",{children:"Dapper é alternativa mais leve para SQL crítico."}),e.jsx("li",{children:"EF Core não isenta de entender SQL — só economiza digitação."})]})]})}export{i as default};
