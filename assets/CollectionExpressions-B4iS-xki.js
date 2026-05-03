import{j as e}from"./index-CzLAthD5.js";import{P as s,A as i}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(s,{title:"Collection expressions: literais para coleções (C# 12)",subtitle:"Uma sintaxe única que serve para arrays, listas, spans e qualquer coleção compatível — com spread e ótima performance.",difficulty:"intermediario",timeToRead:"10 min",children:[e.jsxs("p",{children:["Antes do C# 12, criar uma lista, um array ou um span pequeno exigia sintaxes diferentes: ",e.jsxs("code",{children:["new int[] ","{ 1, 2, 3 }"]}),", ",e.jsxs("code",{children:["new List<int> ","{ 1, 2, 3 }"]}),", ",e.jsxs("code",{children:["stackalloc int[] ","{ 1, 2, 3 }"]}),'... Cada coleção tinha sua "ladainha". O C# 12 introduziu as ',e.jsx("strong",{children:"collection expressions"}),": uma sintaxe única, com colchetes ",e.jsx("code",{children:"[]"}),", que se adapta ao tipo do destino. Pense em colchetes como ",e.jsx("em",{children:"uma caixa universal"}),' — o conteúdo é o mesmo, mas o "formato da embalagem" depende do que você vai colocar dentro.']}),e.jsx("h2",{children:"A sintaxe básica"}),e.jsxs("p",{children:["Você escreve ",e.jsx("code",{children:"[a, b, c]"})," e o compilador escolhe o construtor adequado conforme o tipo declarado da variável (esse mecanismo se chama ",e.jsx("strong",{children:"target-typing"}),"):"]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] arr = [1, 2, 3];                 // gera array de int
List<int> lista = [1, 2, 3];           // gera List<int>
ReadOnlySpan<int> span = [1, 2, 3];    // gera span otimizado
HashSet<string> set = ["a", "b", "c"]; // gera HashSet<string>
IEnumerable<int> enu = [1, 2, 3];      // gera coleção apropriada (array)`})}),e.jsxs("p",{children:["A vantagem é dupla: o código fica mais curto e mais legível, e fica trivial trocar o tipo da variável sem reescrever o lado direito. Quer mudar de ",e.jsx("code",{children:"List<int>"})," para ",e.jsx("code",{children:"int[]"}),"? Mude só a declaração."]}),e.jsxs("h2",{children:["Spread com ",e.jsx("code",{children:".."}),": combinando coleções"]}),e.jsxs("p",{children:["O operador ",e.jsx("strong",{children:"spread"})," (",e.jsx("code",{children:".."}),') "despeja" os elementos de uma coleção dentro de outra. Pense em despejar uma garrafa em um copo:']}),e.jsx("pre",{children:e.jsx("code",{children:`int[] primeiros = [1, 2, 3];
int[] ultimos = [8, 9, 10];

// Combina dois arrays e adiciona elementos no meio
int[] todos = [..primeiros, 4, 5, 6, 7, ..ultimos];
// Resultado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Funciona com qualquer IEnumerable
var fonte = Enumerable.Range(100, 3);   // 100, 101, 102
int[] mix = [0, ..fonte, 999];           // [0, 100, 101, 102, 999]`})}),e.jsx("p",{children:"Você pode usar quantos spreads quiser, e misturar com elementos individuais em qualquer ordem. O compilador gera código que pré-aloca o tamanho exato quando possível, evitando realocações."}),e.jsxs(i,{type:"info",title:"Equivalente a Concat?",children:["Funcionalmente parecido com ",e.jsx("code",{children:"Enumerable.Concat"}),", mas as collection expressions com spread são mais eficientes: o compilador conhece o tamanho final em tempo de compilação para fontes de tamanho conhecido (arrays, listas) e aloca uma vez só."]}),e.jsx("h2",{children:"Coleção vazia"}),e.jsxs("p",{children:["Para criar uma coleção vazia, basta ",e.jsx("code",{children:"[]"}),". Substitui idiomas como ",e.jsx("code",{children:"Array.Empty<T>()"})," e ",e.jsx("code",{children:"new List<T>()"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] vazio = [];
List<string> semNomes = [];
ReadOnlySpan<byte> bytes = [];

// Em retornos:
public IReadOnlyList<int> Ids() => [];   // não aloca em alguns casos`})}),e.jsx("h2",{children:"Em métodos genéricos"}),e.jsx("p",{children:"Collection expressions também funcionam quando o tipo é um parâmetro genérico — desde que esse parâmetro seja de uma coleção suportada:"}),e.jsx("pre",{children:e.jsx("code",{children:`public static T[] Concat<T>(T[] a, T[] b) => [..a, ..b];

public static void Imprimir<T>(IEnumerable<T> itens) {
    foreach (var x in itens) Console.WriteLine(x);
}

Imprimir<int>([10, 20, 30]);   // funciona
Imprimir(["a", "b"]);          // T inferido como string`})}),e.jsx("h2",{children:"Tipos suportados"}),e.jsx("p",{children:"O compilador sabe gerar para uma lista pré-definida de tipos:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Tipo destino"}),e.jsx("th",{children:"Como é construído"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"T[]"})}),e.jsx("td",{children:"Array com tamanho exato."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"List<T>"})}),e.jsxs("td",{children:[e.jsx("code",{children:"new List<T>"})," + ",e.jsx("code",{children:"Add"}),"."]})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("code",{children:"Span<T>"}),", ",e.jsx("code",{children:"ReadOnlySpan<T>"})]}),e.jsxs("td",{children:["Frequentemente alocado em pilha (",e.jsx("code",{children:"stackalloc"}),")."]})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("code",{children:"IEnumerable<T>"}),", ",e.jsx("code",{children:"IReadOnlyList<T>"}),", ",e.jsx("code",{children:"IReadOnlyCollection<T>"})]}),e.jsx("td",{children:"Array internamente."})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("code",{children:"HashSet<T>"}),", ",e.jsx("code",{children:"Queue<T>"}),", ",e.jsx("code",{children:"Stack<T>"})," e similares"]}),e.jsxs("td",{children:["Construtor com capacidade + ",e.jsx("code",{children:"Add"}),"/",e.jsx("code",{children:"Enqueue"}),"/",e.jsx("code",{children:"Push"}),"."]})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:["Tipos com ",e.jsx("code",{children:"[CollectionBuilder(...)]"})]}),e.jsx("td",{children:"Você pode marcar suas próprias coleções para suportar a sintaxe."})]})]})]}),e.jsx("h2",{children:"Performance: por que é melhor que o antigo"}),e.jsxs("p",{children:["Quando o compilador conhece o tamanho final, ele aloca o array com a capacidade certa de uma vez só. Para ",e.jsx("code",{children:"Span"})," de itens primitivos, ele pode usar ",e.jsx("code",{children:"stackalloc"})," evitando alocação no heap. Compare:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Antes: aloca com capacidade default e pode realocar várias vezes
var antes = new List<int>();
antes.Add(1); antes.Add(2); antes.Add(3);

// Agora: aloca exatamente o necessário
List<int> agora = [1, 2, 3];

// Para spans pequenos, sem alocação no heap
ReadOnlySpan<int> chaves = [10, 20, 30];   // tipicamente stackalloc`})}),e.jsxs(i,{type:"warning",title:"Não confunda com pattern matching",children:["A sintaxe ",e.jsx("code",{children:"[1, 2, 3]"})," aparece em dois lugares no C# moderno:",e.jsx("br",{}),"— Em ",e.jsx("strong",{children:"expressões"}),": ",e.jsx("em",{children:"cria"})," uma coleção (collection expression).",e.jsx("br",{}),"— Em ",e.jsx("code",{children:"switch"}),"/",e.jsx("code",{children:"is"}),": ",e.jsx("em",{children:"casa"})," contra uma coleção (list pattern, do C# 11). Ex.: ",e.jsx("code",{children:"if (arr is [1, _, 3])"}),". São primos próximos mas servem propósitos opostos."]}),e.jsx("h2",{children:"Tornando seu tipo compatível"}),e.jsxs("p",{children:["Você pode permitir collection expressions na sua própria coleção implementando o atributo ",e.jsx("code",{children:"[CollectionBuilder]"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Runtime.CompilerServices;

[CollectionBuilder(typeof(MinhaListaBuilder), "Create")]
public class MinhaLista<T> {
    private readonly T[] _itens;
    internal MinhaLista(T[] itens) { _itens = itens; }
    public T this[int i] => _itens[i];
    public int Count => _itens.Length;
}

public static class MinhaListaBuilder {
    public static MinhaLista<T> Create<T>(ReadOnlySpan<T> itens) =>
        new MinhaLista<T>(itens.ToArray());
}

// Agora a sintaxe funciona:
MinhaLista<int> ml = [1, 2, 3];`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar com ",e.jsx("code",{children:"var"}),":"]})," ",e.jsx("code",{children:"var x = [1, 2, 3];"})," NÃO compila — não há tipo declarado para o target-typing inferir."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Spread de tipo errado:"})," ",e.jsx("code",{children:".."})," exige um ",e.jsx("code",{children:"IEnumerable<T>"})," compatível com o elemento da coleção destino. Misturar tipos dá erro."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esperar ",e.jsx("code",{children:"Dictionary"}),":"]})," ainda NÃO há sintaxe oficial de collection expression para dicionários (esperada para versões futuras)."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"[]"})," vazio com ",e.jsx("code",{children:"null"}),":"]})," ",e.jsx("code",{children:"[]"})," sempre cria uma coleção vazia, nunca ",e.jsx("code",{children:"null"}),". Use ",e.jsx("code",{children:"null"})," explicitamente quando quiser ausência."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"[a, b, c]"})," serve para arrays, listas, spans, hashsets e mais."]}),e.jsxs("li",{children:["O tipo é decidido por ",e.jsx("em",{children:"target-typing"}),": declare a variável e o compilador escolhe."]}),e.jsxs("li",{children:["Spread ",e.jsx("code",{children:".."})," combina coleções de forma eficiente."]}),e.jsxs("li",{children:["Performance: alocação exata, possível ",e.jsx("code",{children:"stackalloc"})," para spans."]}),e.jsxs("li",{children:["Você pode habilitar a sintaxe em seus tipos via ",e.jsx("code",{children:"[CollectionBuilder]"}),"."]})]})]})}export{r as default};
