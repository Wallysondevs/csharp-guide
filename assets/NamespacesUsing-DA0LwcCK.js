import{j as e}from"./index-CzLAthD5.js";import{P as i,A as s}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(i,{title:"Namespaces e diretivas using",subtitle:"Organize seu código em pastas lógicas e importe-as com elegância — do clássico ao file-scoped e global usings.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Imagine uma biblioteca pública gigantesca com 50 mil livros. Sem prateleiras organizadas por gênero, autor e assunto, achar qualquer coisa seria impossível. ",e.jsx("strong",{children:"Namespaces"})," em C# são exatamente essas prateleiras: agrupam classes, interfaces, enums e structs em pastas lógicas para evitar bagunça e conflitos de nomes. ",e.jsx("strong",{children:"Diretivas using"})," são os atalhos que te poupam de soletrar o caminho completo toda vez que você quer pegar um livro."]}),e.jsx("h2",{children:"O que é um namespace, na prática"}),e.jsxs("p",{children:["Um namespace é um identificador hierárquico (separado por pontos) que prefixa o nome completo de um tipo. A classe ",e.jsx("code",{children:"List"}),' da BCL não é só "List" — seu nome ',e.jsx("em",{children:"completo"})," é ",e.jsx("code",{children:"System.Collections.Generic.List"}),". Esse caminho garante que sua ",e.jsx("code",{children:"List"})," nunca colida com uma ",e.jsx("code",{children:"List"})," que outra biblioteca defina."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem usar 'using', é assim que ficaria:
System.Collections.Generic.List<string> nomes = new System.Collections.Generic.List<string>();
System.Console.WriteLine(nomes.Count);

// Com 'using', você simplifica para:
using System;
using System.Collections.Generic;

List<string> nomes = new List<string>();
Console.WriteLine(nomes.Count);`})}),e.jsx("h2",{children:"Declarando seus próprios namespaces"}),e.jsxs("p",{children:["Por convenção, namespaces seguem a hierarquia de pastas do projeto. Se você tem ",e.jsx("code",{children:"MeuApp/Servicos/Pagamentos.cs"}),", o namespace dentro do arquivo deve ser ",e.jsx("code",{children:"MeuApp.Servicos"})," e a classe se chama ",e.jsx("code",{children:"Pagamentos"}),". Isso facilita encontrar arquivos."]}),e.jsx("h3",{children:"Estilo clássico (com bloco)"}),e.jsx("pre",{children:e.jsx("code",{children:`// Arquivo: MeuApp/Servicos/Pagamentos.cs
namespace MeuApp.Servicos
{
    public class Pagamentos
    {
        public void Cobrar(decimal valor)
        {
            // implementação
        }
    }
}`})}),e.jsx("h3",{children:"Estilo file-scoped (C# 10+)"}),e.jsx("pre",{children:e.jsx("code",{children:`// Mesmo arquivo, sintaxe nova
namespace MeuApp.Servicos;

public class Pagamentos
{
    public void Cobrar(decimal valor)
    {
        // implementação
    }
}`})}),e.jsxs("p",{children:["O file-scoped namespace (terminado em ",e.jsx("code",{children:";"}),") elimina um nível de indentação e deixa o código mais limpo. Vale para o ",e.jsx("em",{children:"arquivo inteiro"}),", então não dá para misturar dois namespaces no mesmo arquivo (o que é uma boa prática mesmo). É a forma recomendada hoje."]}),e.jsxs("h2",{children:["As variantes do ",e.jsx("code",{children:"using"})]}),e.jsxs("h3",{children:["1. ",e.jsx("code",{children:"using"})," simples"]}),e.jsx("p",{children:"Importa todos os tipos do namespace. É o mais comum."}),e.jsx("pre",{children:e.jsx("code",{children:`using System;
using System.Linq;
using System.Threading.Tasks;`})}),e.jsxs("h3",{children:["2. ",e.jsx("code",{children:"using static"})]}),e.jsxs("p",{children:["Importa ",e.jsx("em",{children:"membros estáticos"})," de uma classe específica, permitindo chamá-los sem prefixo. Excelente para classes utilitárias muito usadas, como ",e.jsx("code",{children:"Math"})," e ",e.jsx("code",{children:"Console"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using static System.Math;
using static System.Console;

WriteLine($"raiz quadrada de 16 = {Sqrt(16)}");
WriteLine($"PI vale {PI:F4}");`})}),e.jsx("p",{children:'Use com moderação — abusar disso deixa o código difícil de ler ("de onde vem essa função?").'}),e.jsxs("h3",{children:["3. ",e.jsx("code",{children:"using"})," alias"]}),e.jsx("p",{children:"Renomeia um tipo localmente. Salva a vida quando você precisa usar duas classes com o mesmo nome curto vindas de namespaces diferentes:"}),e.jsx("pre",{children:e.jsx("code",{children:`using Json = System.Text.Json.JsonSerializer;
using NewtonJson = Newtonsoft.Json.JsonConvert;
using StringList = System.Collections.Generic.List<string>;

string a = Json.Serialize(new { Nome = "Maria" });
string b = NewtonJson.SerializeObject(new { Nome = "Maria" });
StringList nomes = ["Ana", "Bia", "Cris"];`})}),e.jsxs(s,{type:"info",title:"Type alias para tipos complexos",children:["Desde C# 12, você pode dar alias para qualquer tipo, inclusive tuplas e arrays: ",e.jsx("code",{children:"using Coord = (double X, double Y);"}),". Isso melhora muito a legibilidade quando o tipo seria longo."]}),e.jsxs("h3",{children:["4. ",e.jsx("code",{children:"global using"})]}),e.jsxs("p",{children:["Importa o namespace para ",e.jsx("em",{children:"todos"})," os arquivos do projeto. Antes de C# 10, você tinha que repetir ",e.jsx("code",{children:"using System;"})," no topo de 200 arquivos. Hoje, basta um ",e.jsx("code",{children:"GlobalUsings.cs"})," no projeto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Arquivo: GlobalUsings.cs
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using static System.Math;
global using MyAlias = MeuApp.Servicos.Pagamentos;`})}),e.jsxs("p",{children:['Pronto — todos os arquivos do projeto agora "vêem" esses tipos sem precisar de ',e.jsx("code",{children:"using"})," próprio."]}),e.jsx("h3",{children:"5. ImplicitUsings (configurado no .csproj)"}),e.jsxs("p",{children:["Quando ",e.jsx("code",{children:"<ImplicitUsings>enable</ImplicitUsings>"})," está ligado, o próprio SDK gera ",e.jsx("code",{children:"global using"})," para os namespaces mais comuns automaticamente. É por isso que projetos novos compilam ",e.jsx("code",{children:"Console.WriteLine"})," sem nenhum ",e.jsx("code",{children:"using"})," visível."]}),e.jsx("pre",{children:e.jsx("code",{children:`<!-- Em MeuApp.csproj -->
<PropertyGroup>
  <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>`})}),e.jsxs("p",{children:["Para ",e.jsx("em",{children:"adicionar"})," um using ao conjunto implícito sem desligá-lo, use:"]}),e.jsx("pre",{children:e.jsx("code",{children:`<ItemGroup>
  <Using Include="Microsoft.Extensions.Logging" />
  <Using Include="System.Console" Static="true" />
  <Using Include="System.Collections.Generic.List<string>" Alias="StrList" />
</ItemGroup>`})}),e.jsx("h2",{children:"Resolvendo conflitos de nome"}),e.jsxs("p",{children:["Cedo ou tarde você terá duas classes com o mesmo nome em namespaces diferentes. Por exemplo, ",e.jsx("code",{children:"System.Threading.Timer"})," e ",e.jsx("code",{children:"System.Timers.Timer"})," existem ambos. Como decidir qual está sendo usada?"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Threading;
using System.Timers;

// AMBÍGUO — compilador reclama:
// CS0104: 'Timer' is an ambiguous reference between
//   'System.Threading.Timer' and 'System.Timers.Timer'
Timer t;`})}),e.jsx("p",{children:"Soluções:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Opção 1: nome qualificado (cirúrgico)
System.Timers.Timer t = new System.Timers.Timer();

// Opção 2: alias para um deles
using ThreadTimer = System.Threading.Timer;
using TimersTimer = System.Timers.Timer;

ThreadTimer t1;
TimersTimer t2;

// Opção 3: remover o using desnecessário`})}),e.jsxs(s,{type:"warning",title:"Cuidado com 'using static System.Console;'",children:["Combinado com vários outros usings estáticos, métodos como ",e.jsx("code",{children:"Write"})," podem entrar em conflito. Quando em dúvida, prefira chamar com prefixo (",e.jsx("code",{children:"Console.WriteLine"}),") — explícito é melhor que implícito."]}),e.jsx("h2",{children:"Boas práticas de organização"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Pasta = namespace"}),": facilita navegação. ",e.jsx("code",{children:"Servicos/Pagamentos/Boletos/Boleto.cs"})," vira ",e.jsx("code",{children:"MeuApp.Servicos.Pagamentos.Boletos"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Comece com a empresa/produto"}),": ",e.jsx("code",{children:"NomeEmpresa.NomeProduto.Modulo"}),". Ex.: ",e.jsx("code",{children:"Acme.Vendas.Pedidos"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Singular ou plural"}),": a Microsoft usa plural para namespaces que agrupam várias coisas (",e.jsx("code",{children:"System.Collections"}),") e singular para tipos (",e.jsx("code",{children:"List"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não recrie System.*"}),": evite criar um namespace seu chamado ",e.jsx("code",{children:"System"}),", ",e.jsx("code",{children:"Microsoft"})," ou ",e.jsx("code",{children:"Windows"})," — colide com o framework."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Evite namespaces gigantes"}),": 200 classes em ",e.jsx("code",{children:"MeuApp.Tudo"})," é bagunça. Subdivida."]})]}),e.jsx("h2",{children:"Exemplo completo: estrutura de projeto"}),e.jsx("pre",{children:e.jsx("code",{children:`MeuApp/
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
    └── DateExtensions.cs           // namespace MeuApp.Helpers;`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'CS0246 "type or namespace not found":'})," faltou um ",e.jsx("code",{children:"using"})," ou um ",e.jsx("code",{children:"PackageReference"}),'. A IDE costuma sugerir o using correto via "quick fix" (Ctrl+.).']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar file-scoped e bloco:"})," dentro do mesmo arquivo, escolha um estilo. File-scoped não permite irmãos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Namespace ≠ pasta:"})," tecnicamente o C# não exige correspondência, mas humanos sim. Não bagunce."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"public"}),":"]})," classes sem modificador são ",e.jsx("code",{children:"internal"})," por padrão e não enxergáveis fora do assembly."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Namespaces organizam tipos em pastas lógicas e evitam conflitos."}),e.jsxs("li",{children:["Use ",e.jsx("strong",{children:"file-scoped"})," namespace (",e.jsx("code",{children:"namespace Foo;"}),") em projetos novos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"using"})," simples importa um namespace; ",e.jsx("code",{children:"using static"})," importa membros; ",e.jsx("code",{children:"using Alias = ..."})," renomeia."]}),e.jsxs("li",{children:[e.jsx("code",{children:"global using"})," aplica a todos os arquivos; ",e.jsx("code",{children:"ImplicitUsings"})," faz isso automaticamente."]}),e.jsx("li",{children:"Resolva conflitos com nome totalmente qualificado ou alias."})]})]})}export{r as default};
