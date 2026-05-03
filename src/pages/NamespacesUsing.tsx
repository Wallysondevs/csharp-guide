import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NamespacesUsing() {
  return (
    <PageContainer
      title="Namespaces e diretivas using"
      subtitle="Organize seu código em pastas lógicas e importe-as com elegância — do clássico ao file-scoped e global usings."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine uma biblioteca pública gigantesca com 50 mil livros. Sem prateleiras organizadas por gênero, autor e assunto, achar qualquer coisa seria impossível. <strong>Namespaces</strong> em C# são exatamente essas prateleiras: agrupam classes, interfaces, enums e structs em pastas lógicas para evitar bagunça e conflitos de nomes. <strong>Diretivas using</strong> são os atalhos que te poupam de soletrar o caminho completo toda vez que você quer pegar um livro.
      </p>

      <h2>O que é um namespace, na prática</h2>
      <p>
        Um namespace é um identificador hierárquico (separado por pontos) que prefixa o nome completo de um tipo. A classe <code>List</code> da BCL não é só "List" — seu nome <em>completo</em> é <code>System.Collections.Generic.List</code>. Esse caminho garante que sua <code>List</code> nunca colida com uma <code>List</code> que outra biblioteca defina.
      </p>
      <pre><code>{`// Sem usar 'using', é assim que ficaria:
System.Collections.Generic.List<string> nomes = new System.Collections.Generic.List<string>();
System.Console.WriteLine(nomes.Count);

// Com 'using', você simplifica para:
using System;
using System.Collections.Generic;

List<string> nomes = new List<string>();
Console.WriteLine(nomes.Count);`}</code></pre>

      <h2>Declarando seus próprios namespaces</h2>
      <p>
        Por convenção, namespaces seguem a hierarquia de pastas do projeto. Se você tem <code>MeuApp/Servicos/Pagamentos.cs</code>, o namespace dentro do arquivo deve ser <code>MeuApp.Servicos</code> e a classe se chama <code>Pagamentos</code>. Isso facilita encontrar arquivos.
      </p>

      <h3>Estilo clássico (com bloco)</h3>
      <pre><code>{`// Arquivo: MeuApp/Servicos/Pagamentos.cs
namespace MeuApp.Servicos
{
    public class Pagamentos
    {
        public void Cobrar(decimal valor)
        {
            // implementação
        }
    }
}`}</code></pre>

      <h3>Estilo file-scoped (C# 10+)</h3>
      <pre><code>{`// Mesmo arquivo, sintaxe nova
namespace MeuApp.Servicos;

public class Pagamentos
{
    public void Cobrar(decimal valor)
    {
        // implementação
    }
}`}</code></pre>
      <p>
        O file-scoped namespace (terminado em <code>;</code>) elimina um nível de indentação e deixa o código mais limpo. Vale para o <em>arquivo inteiro</em>, então não dá para misturar dois namespaces no mesmo arquivo (o que é uma boa prática mesmo). É a forma recomendada hoje.
      </p>

      <h2>As variantes do <code>using</code></h2>

      <h3>1. <code>using</code> simples</h3>
      <p>
        Importa todos os tipos do namespace. É o mais comum.
      </p>
      <pre><code>{`using System;
using System.Linq;
using System.Threading.Tasks;`}</code></pre>

      <h3>2. <code>using static</code></h3>
      <p>
        Importa <em>membros estáticos</em> de uma classe específica, permitindo chamá-los sem prefixo. Excelente para classes utilitárias muito usadas, como <code>Math</code> e <code>Console</code>:
      </p>
      <pre><code>{`using static System.Math;
using static System.Console;

WriteLine($"raiz quadrada de 16 = {Sqrt(16)}");
WriteLine($"PI vale {PI:F4}");`}</code></pre>
      <p>
        Use com moderação — abusar disso deixa o código difícil de ler ("de onde vem essa função?").
      </p>

      <h3>3. <code>using</code> alias</h3>
      <p>
        Renomeia um tipo localmente. Salva a vida quando você precisa usar duas classes com o mesmo nome curto vindas de namespaces diferentes:
      </p>
      <pre><code>{`using Json = System.Text.Json.JsonSerializer;
using NewtonJson = Newtonsoft.Json.JsonConvert;
using StringList = System.Collections.Generic.List<string>;

string a = Json.Serialize(new { Nome = "Maria" });
string b = NewtonJson.SerializeObject(new { Nome = "Maria" });
StringList nomes = ["Ana", "Bia", "Cris"];`}</code></pre>

      <AlertBox type="info" title="Type alias para tipos complexos">
        Desde C# 12, você pode dar alias para qualquer tipo, inclusive tuplas e arrays: <code>using Coord = (double X, double Y);</code>. Isso melhora muito a legibilidade quando o tipo seria longo.
      </AlertBox>

      <h3>4. <code>global using</code></h3>
      <p>
        Importa o namespace para <em>todos</em> os arquivos do projeto. Antes de C# 10, você tinha que repetir <code>using System;</code> no topo de 200 arquivos. Hoje, basta um <code>GlobalUsings.cs</code> no projeto:
      </p>
      <pre><code>{`// Arquivo: GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using static System.Math;
global using MyAlias = MeuApp.Servicos.Pagamentos;`}</code></pre>
      <p>
        Pronto — todos os arquivos do projeto agora "vêem" esses tipos sem precisar de <code>using</code> próprio.
      </p>

      <h3>5. ImplicitUsings (configurado no .csproj)</h3>
      <p>
        Quando <code>&lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;</code> está ligado, o próprio SDK gera <code>global using</code> para os namespaces mais comuns automaticamente. É por isso que projetos novos compilam <code>Console.WriteLine</code> sem nenhum <code>using</code> visível.
      </p>
      <pre><code>{`<!-- Em MeuApp.csproj -->
<PropertyGroup>
  <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>`}</code></pre>
      <p>
        Para <em>adicionar</em> um using ao conjunto implícito sem desligá-lo, use:
      </p>
      <pre><code>{`<ItemGroup>
  <Using Include="Microsoft.Extensions.Logging" />
  <Using Include="System.Console" Static="true" />
  <Using Include="System.Collections.Generic.List<string>" Alias="StrList" />
</ItemGroup>`}</code></pre>

      <h2>Resolvendo conflitos de nome</h2>
      <p>
        Cedo ou tarde você terá duas classes com o mesmo nome em namespaces diferentes. Por exemplo, <code>System.Threading.Timer</code> e <code>System.Timers.Timer</code> existem ambos. Como decidir qual está sendo usada?
      </p>
      <pre><code>{`using System.Threading;
using System.Timers;

// AMBÍGUO — compilador reclama:
// CS0104: 'Timer' is an ambiguous reference between
//   'System.Threading.Timer' and 'System.Timers.Timer'
Timer t;`}</code></pre>
      <p>
        Soluções:
      </p>
      <pre><code>{`// Opção 1: nome qualificado (cirúrgico)
System.Timers.Timer t = new System.Timers.Timer();

// Opção 2: alias para um deles
using ThreadTimer = System.Threading.Timer;
using TimersTimer = System.Timers.Timer;

ThreadTimer t1;
TimersTimer t2;

// Opção 3: remover o using desnecessário`}</code></pre>

      <AlertBox type="warning" title="Cuidado com 'using static System.Console;'">
        Combinado com vários outros usings estáticos, métodos como <code>Write</code> podem entrar em conflito. Quando em dúvida, prefira chamar com prefixo (<code>Console.WriteLine</code>) — explícito é melhor que implícito.
      </AlertBox>

      <h2>Boas práticas de organização</h2>
      <ul>
        <li><strong>Pasta = namespace</strong>: facilita navegação. <code>Servicos/Pagamentos/Boletos/Boleto.cs</code> vira <code>MeuApp.Servicos.Pagamentos.Boletos</code>.</li>
        <li><strong>Comece com a empresa/produto</strong>: <code>NomeEmpresa.NomeProduto.Modulo</code>. Ex.: <code>Acme.Vendas.Pedidos</code>.</li>
        <li><strong>Singular ou plural</strong>: a Microsoft usa plural para namespaces que agrupam várias coisas (<code>System.Collections</code>) e singular para tipos (<code>List</code>).</li>
        <li><strong>Não recrie System.*</strong>: evite criar um namespace seu chamado <code>System</code>, <code>Microsoft</code> ou <code>Windows</code> — colide com o framework.</li>
        <li><strong>Evite namespaces gigantes</strong>: 200 classes em <code>MeuApp.Tudo</code> é bagunça. Subdivida.</li>
      </ul>

      <h2>Exemplo completo: estrutura de projeto</h2>
      <pre><code>{`MeuApp/
├── MeuApp.csproj
├── GlobalUsings.cs
├── Program.cs                      // namespace MeuApp;
├── Modelos/
│   ├── Cliente.cs                  // namespace MeuApp.Modelos;
│   └── Produto.cs                  // namespace MeuApp.Modelos;
├── Servicos/
│   ├── Pagamentos/
│   │   ├── Cartao.cs               // namespace MeuApp.Servicos.Pagamentos;
│   │   └── Pix.cs
│   └── Notificacoes/
│       └── Email.cs                // namespace MeuApp.Servicos.Notificacoes;
└── Helpers/
    └── DateExtensions.cs           // namespace MeuApp.Helpers;`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>CS0246 "type or namespace not found":</strong> faltou um <code>using</code> ou um <code>PackageReference</code>. A IDE costuma sugerir o using correto via "quick fix" (Ctrl+.).</li>
        <li><strong>Misturar file-scoped e bloco:</strong> dentro do mesmo arquivo, escolha um estilo. File-scoped não permite irmãos.</li>
        <li><strong>Namespace ≠ pasta:</strong> tecnicamente o C# não exige correspondência, mas humanos sim. Não bagunce.</li>
        <li><strong>Esquecer <code>public</code>:</strong> classes sem modificador são <code>internal</code> por padrão e não enxergáveis fora do assembly.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Namespaces organizam tipos em pastas lógicas e evitam conflitos.</li>
        <li>Use <strong>file-scoped</strong> namespace (<code>namespace Foo;</code>) em projetos novos.</li>
        <li><code>using</code> simples importa um namespace; <code>using static</code> importa membros; <code>using Alias = ...</code> renomeia.</li>
        <li><code>global using</code> aplica a todos os arquivos; <code>ImplicitUsings</code> faz isso automaticamente.</li>
        <li>Resolva conflitos com nome totalmente qualificado ou alias.</li>
      </ul>
    </PageContainer>
  );
}
