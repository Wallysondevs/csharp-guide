import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"StringBuilder: concatenando strings sem desperdiçar memória",subtitle:"Por que somar strings com + dentro de loops é um desastre — e como o StringBuilder resolve isso elegantemente.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Imagine que você está montando um texto longo letra por letra. Em C#, escrever ",e.jsx("code",{children:'texto = texto + "a"'})," mil vezes parece inocente — mas escondidamente cria ",e.jsx("strong",{children:"mil strings novas"})," na memória, descartando todas exceto a última. Para textos pequenos isso não importa; para milhares de concatenações, vira um gargalo absurdo. A solução é ",e.jsx("code",{children:"StringBuilder"}),", uma classe especialmente projetada para construir texto ",e.jsx("em",{children:"passo a passo"})," sem alocar lixo. Pense num caderno em branco onde você só escreve no final — em vez de arrancar a página e copiar tudo de novo a cada palavra."]}),e.jsx("h2",{children:'Por que strings são "imutáveis"?'}),e.jsxs("p",{children:["No .NET, todo objeto ",e.jsx("code",{children:"string"})," é ",e.jsx("strong",{children:"imutável"}),": uma vez criada, a memória que ela ocupa nunca muda. Quando você faz ",e.jsx("code",{children:'s = s + "x"'}),", o runtime aloca uma ",e.jsx("em",{children:"nova"})," string com o conteúdo somado e a antiga vira lixo (a ser coletado pelo GC). Isso é uma decisão de design que torna strings seguras para compartilhar entre threads, mas paga um preço alto em manipulação intensiva."]}),e.jsx("pre",{children:e.jsx("code",{children:`string s = "Olá";
s = s + " mundo";
// Existem agora 2 strings na memória:
//   "Olá"        ← a antiga, lixo
//   "Olá mundo"  ← a nova, apontada por s`})}),e.jsx("h2",{children:"O experimento que prova a diferença"}),e.jsxs("p",{children:["Vamos comparar concatenação ingênua com ",e.jsx("code",{children:"StringBuilder"})," em um loop de 50 mil iterações. A diferença chega a ",e.jsx("strong",{children:"mil vezes"})," em tempo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Diagnostics;
using System.Text;

const int N = 50_000;

// Versão ingênua — cria 50.000 strings descartáveis
var sw1 = Stopwatch.StartNew();
string ruim = "";
for (int i = 0; i < N; i++)
    ruim += i;
sw1.Stop();
Console.WriteLine($"+= : {sw1.ElapsedMilliseconds} ms");

// Versão com StringBuilder — buffer mutável
var sw2 = Stopwatch.StartNew();
var sb = new StringBuilder();
for (int i = 0; i < N; i++)
    sb.Append(i);
string bom = sb.ToString();
sw2.Stop();
Console.WriteLine($"SB : {sw2.ElapsedMilliseconds} ms");

// Saída típica:
// += : ~7000 ms
// SB : ~5 ms`})}),e.jsxs(a,{type:"warning",title:"Quando NÃO usar StringBuilder",children:["Para 2 ou 3 concatenações simples (",e.jsx("code",{children:'"Olá " + nome + "!"'}),"), o compilador ",e.jsx("em",{children:"já"})," usa ",e.jsx("code",{children:"String.Concat"})," otimizado. Não troque por StringBuilder — código fica mais feio sem ganho. Use SB quando: tem loop, ou monta texto em vários métodos, ou são mais de ~10 concatenações."]}),e.jsx("h2",{children:"Os principais métodos"}),e.jsxs("p",{children:[e.jsx("code",{children:"StringBuilder"}),' é uma "string escrevível". Você acrescenta no final com ',e.jsx("code",{children:"Append"}),", e ao terminar chama ",e.jsx("code",{children:"ToString()"})," uma única vez para fixar o resultado."]}),e.jsx("pre",{children:e.jsx("code",{children:`var sb = new StringBuilder();

sb.Append("Olá ");                         // texto puro
sb.Append(42);                              // qualquer ToString
sb.AppendLine();                            // adiciona \\n
sb.AppendLine("Linha 2");                   // texto + \\n
sb.AppendFormat("Total: {0:C}", 99.5m);    // formatação

// Manipulação posicional:
sb.Insert(0, ">>> ");                       // insere no início
sb.Replace("Olá", "Oi");                    // substitui
sb.Remove(0, 4);                            // remove 4 chars do início

// Acesso e tamanho:
char primeiro = sb[0];                      // indexação
int  tam      = sb.Length;
sb.Length     = 5;                          // trunca

string final = sb.ToString();               // congela em string`})}),e.jsx("h2",{children:"Capacidade inicial: um detalhe que economiza alocações"}),e.jsxs("p",{children:["Internamente, o SB mantém um buffer de caracteres. Quando o buffer enche, ele ",e.jsx("em",{children:"dobra"})," de tamanho (alocando um novo array e copiando). Se você sabe quanto vai escrever, passe a ",e.jsx("strong",{children:"capacidade"})," no construtor para evitar redimensionamentos."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem capacidade: começa com 16, vai dobrando: 16→32→64→128…→8192
var sb1 = new StringBuilder();

// Com capacidade: aloca 10 mil chars de cara, sem redimensionar
var sb2 = new StringBuilder(capacity: 10_000);

// Ainda dá para definir um teto máximo:
var sb3 = new StringBuilder(capacity: 100, maxCapacity: 500);
// Ultrapassar maxCapacity lança ArgumentOutOfRangeException`})}),e.jsx("h2",{children:"Encadeamento (fluent)"}),e.jsxs("p",{children:["Quase todos os métodos de ",e.jsx("code",{children:"StringBuilder"}),' retornam o próprio SB, permitindo encadeamento estilo "fluent". Útil para construir blocos de texto inteiros em uma só expressão.']}),e.jsx("pre",{children:e.jsx("code",{children:`string html = new StringBuilder()
    .Append("<ul>")
    .AppendLine()
    .AppendFormat("  <li>{0}</li>", "Item A").AppendLine()
    .AppendFormat("  <li>{0}</li>", "Item B").AppendLine()
    .Append("</ul>")
    .ToString();`})}),e.jsx("h2",{children:"Quando o compilador faz o trabalho por você"}),e.jsxs("p",{children:["Em interpolação simples (",e.jsxs("code",{children:['$"Oi ',"{nome}",'"']}),"), versões modernas do .NET (6+) usam internamente um tipo otimizado chamado ",e.jsx("code",{children:"DefaultInterpolatedStringHandler"}),", que trabalha de forma muito parecida com SB nos bastidores. Por isso, em 95% dos casos do dia-a-dia, basta interpolação. Reserve SB para os outros 5% (loops, IO de texto, geração de relatórios)."]}),e.jsxs(a,{type:"info",title:"StringBuilder e Span",children:["Em código de altíssimo desempenho, ",e.jsx("code",{children:"StringBuilder"})," ainda aloca um array. Para zero-alocação, há alternativas como ",e.jsx("code",{children:"string.Create"})," com ",e.jsx("code",{children:"Span<char>"}),". Mas isso é tema avançado — comece com SB e só evolua se profiler mostrar gargalo."]}),e.jsx("h2",{children:"Pequeno truque: AppendJoin"}),e.jsxs("p",{children:["Em vez de ",e.jsx("code",{children:"foreach"}),"+",e.jsx("code",{children:"Append"}),"+separador manual, existe ",e.jsx("code",{children:"AppendJoin"})," — análogo a ",e.jsx("code",{children:"string.Join"})," mas direto no SB:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var sb = new StringBuilder("Frutas: ");
sb.AppendJoin(", ", new[] { "maçã", "pera", "uva" });
// → "Frutas: maçã, pera, uva"`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"ToString()"})]})," e passar o ",e.jsx("code",{children:"StringBuilder"})," direto a um método que espera ",e.jsx("code",{children:"string"})," — não compila."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reusar SB sem limpar"})," — para reaproveitar, faça ",e.jsx("code",{children:"sb.Clear()"})," (não desaloca o buffer; só zera o tamanho)."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Trocar ",e.jsx("code",{children:"+"})," por SB em concatenações pequenas"]})," — é um pessimismo prematuro; código fica feio sem benefício."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar a string retornada"})," — não dá: ",e.jsx("code",{children:"ToString()"})," devolve uma string normal e imutável."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Strings em C# são imutáveis: ",e.jsx("code",{children:"+"})," aloca uma nova a cada vez."]}),e.jsxs("li",{children:[e.jsx("code",{children:"StringBuilder"})," é um buffer de caracteres mutável e crescente."]}),e.jsx("li",{children:"Use SB em loops e construções de texto longas; ignore-o em concatenações triviais."}),e.jsxs("li",{children:["Métodos principais: ",e.jsx("code",{children:"Append"}),", ",e.jsx("code",{children:"AppendLine"}),", ",e.jsx("code",{children:"AppendFormat"}),", ",e.jsx("code",{children:"Insert"}),", ",e.jsx("code",{children:"Replace"}),", ",e.jsx("code",{children:"Remove"}),"."]}),e.jsxs("li",{children:["Defina ",e.jsx("code",{children:"capacity"})," inicial quando souber o tamanho aproximado."]}),e.jsxs("li",{children:["Termine sempre chamando ",e.jsx("code",{children:"ToString()"})," para obter a string final."]})]})]})}export{n as default};
