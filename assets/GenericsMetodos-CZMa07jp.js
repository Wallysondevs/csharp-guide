import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Métodos genéricos: poder em métodos individuais",subtitle:"Como criar métodos com seus próprios parâmetros de tipo, dentro de classes comuns ou genéricas.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Nem sempre faz sentido tornar a classe inteira genérica. Às vezes você tem uma classe utilitária comum e quer apenas ",e.jsx("strong",{children:"um método"})," que aceite qualquer tipo. É aí que entram os ",e.jsx("strong",{children:"métodos genéricos"}),": o parâmetro de tipo (",e.jsx("code",{children:"T"}),") é declarado na assinatura do método, não da classe. Pense numa caixa de ferramentas comum (a classe) com uma chave-inglesa ajustável (o método) que se adapta a parafusos de qualquer tamanho."]}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsxs("p",{children:["Você coloca o parâmetro de tipo entre ",e.jsx("code",{children:"<"})," e ",e.jsx("code",{children:">"})," entre o nome do método e os parênteses dos parâmetros. Pode ter quantos parâmetros de tipo quiser:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static class Util {
    // Método genérico: T só existe dentro deste método
    public static void Imprimir<T>(T item) {
        Console.WriteLine($"[{typeof(T).Name}] {item}");
    }
}

Util.Imprimir(42);          // [Int32] 42
Util.Imprimir("ola");       // [String] ola
Util.Imprimir(DateTime.Now); // [DateTime] 2024-...
`})}),e.jsxs("p",{children:["Note: ",e.jsx("code",{children:"typeof(T)"})," retorna o objeto ",e.jsx("code",{children:"Type"})," que descreve o tipo concreto escolhido em cada chamada. ",e.jsx("code",{children:"typeof"})," é um operador de compile-time — o compilador resolve durante a especialização do método."]}),e.jsxs("h2",{children:["Trocar valores: o exemplo clássico de ",e.jsx("code",{children:"ref"})]}),e.jsxs("p",{children:["O modificador ",e.jsx("code",{children:"ref"})," faz o parâmetro receber a ",e.jsx("em",{children:"referência"}),' à variável original, não uma cópia. Combinado com generics, vira o famoso "swap":']}),e.jsx("pre",{children:e.jsx("code",{children:`public static void Trocar<T>(ref T a, ref T b) {
    T temp = a;
    a = b;
    b = temp;
}

int x = 10, y = 20;
Trocar(ref x, ref y);
Console.WriteLine($"x={x}, y={y}"); // x=20, y=10

string s1 = "ola", s2 = "mundo";
Trocar(ref s1, ref s2);
Console.WriteLine($"{s1} {s2}");    // mundo ola`})}),e.jsxs("p",{children:["O mesmo método funciona para ",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"string"}),", structs próprios, qualquer coisa — o compilador ",e.jsx("em",{children:"especializa"})," internamente cada combinação. A palavra-chave ",e.jsx("code",{children:"ref"})," é exigida tanto na declaração quanto no chamador, evitando surpresas."]}),e.jsx("h2",{children:"Inferência de tipo: o que torna isso ergonômico"}),e.jsxs("p",{children:["Você raramente vai escrever ",e.jsx("code",{children:"Util.Imprimir<int>(42)"}),". O compilador olha para o argumento ",e.jsx("code",{children:"42"})," e ",e.jsx("em",{children:"infere"})," que ",e.jsx("code",{children:"T = int"}),". Esse processo se chama ",e.jsx("strong",{children:"type inference"}),". Ele funciona quando o tipo aparece em pelo menos um dos parâmetros:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static T[] CriarArray<T>(int tamanho, T valorPadrao) {
    var arr = new T[tamanho];
    for (int i = 0; i < tamanho; i++) arr[i] = valorPadrao;
    return arr;
}

int[] zeros = CriarArray(5, 0);            // T inferido como int
string[] vazias = CriarArray(3, "");       // T inferido como string

// Quando NÃO dá para inferir, especifique:
public static T Criar<T>() where T : new() => new T();

var u = Criar<Usuario>();   // sem argumento -> sem como inferir, declare`})}),e.jsxs(o,{type:"info",title:"Inferência só vê argumentos",children:["O retorno de um método NÃO ajuda na inferência. Se o único uso de ",e.jsx("code",{children:"T"})," for o tipo de retorno, você precisa especificar manualmente entre ",e.jsx("code",{children:"<>"}),"."]}),e.jsx("h2",{children:"Restrições na assinatura"}),e.jsxs("p",{children:["Tudo o que vimos sobre ",e.jsx("code",{children:"where"})," em classes genéricas vale também em métodos genéricos. Coloque a cláusula ",e.jsx("em",{children:"antes"})," da chave de abertura:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static T MaiorDeTodos<T>(IEnumerable<T> itens) where T : IComparable<T> {
    T maior = itens.First();
    foreach (var item in itens.Skip(1)) {
        if (item.CompareTo(maior) > 0) maior = item;
    }
    return maior;
}

int max = MaiorDeTodos(new[] { 3, 1, 7, 4 });   // 7
string longest = MaiorDeTodos(new[] { "ana", "bruno", "ze" }); // "bruno"`})}),e.jsx("h2",{children:"Overload: convivendo com versão não-genérica"}),e.jsxs("p",{children:["Você pode ter ",e.jsx("strong",{children:"várias versões"})," do mesmo método: uma genérica que cobre o caso geral e algumas especializadas para tipos comuns onde dá para fazer algo mais inteligente. O compilador escolhe a melhor:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static class Logger {
    // Versão genérica: cai aqui para qualquer tipo
    public static void Logar<T>(T valor) {
        Console.WriteLine($"valor={valor}");
    }

    // Especialização para string (não-genérica): tem prioridade quando aplicável
    public static void Logar(string mensagem) {
        Console.WriteLine($"texto: {mensagem}");
    }

    // Especialização para Exception
    public static void Logar(Exception ex) {
        Console.WriteLine($"ERRO: {ex.Message}");
    }
}

Logger.Logar(42);                       // valor=42
Logger.Logar("oi");                     // texto: oi  (prefere a não-genérica)
Logger.Logar(new InvalidOperationException("x"));  // ERRO: x`})}),e.jsxs("p",{children:["Regra de seleção: a versão ",e.jsx("strong",{children:"não-genérica que aceita exatamente"}),' o argumento ganha; a genérica é usada como "fallback".']}),e.jsx("h2",{children:"Métodos genéricos em classes genéricas"}),e.jsx("p",{children:"A classe e o método podem ter parâmetros de tipo independentes:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Cache<TChave> {
    private readonly Dictionary<TChave, object> _dict = new();

    // O método tem seu próprio parâmetro TValor, separado de TChave
    public TValor ObterOuCriar<TValor>(TChave chave, Func<TValor> fabrica) where TValor : notnull {
        if (_dict.TryGetValue(chave, out var existente)) return (TValor)existente;
        TValor novo = fabrica();
        _dict[chave] = novo;
        return novo;
    }
}

var cache = new Cache<string>();
int n = cache.ObterOuCriar("contador", () => 42);
DateTime agora = cache.ObterOuCriar("hora", () => DateTime.Now);`})}),e.jsxs(o,{type:"warning",title:"Cuidado com nomes iguais",children:["Não dê o mesmo nome ao parâmetro de tipo da classe e do método. Compila, mas ",e.jsx("code",{children:"T"})," do método vai ",e.jsx("em",{children:"esconder"})," o ",e.jsx("code",{children:"T"})," da classe, gerando bugs sutis. Use prefixos descritivos: ",e.jsx("code",{children:"TKey"})," na classe, ",e.jsx("code",{children:"TValue"})," no método."]}),e.jsx("h2",{children:"Quando usar método genérico vs classe genérica"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Método genérico:"})," a operação faz sentido isolada e o tipo varia por chamada. Ex.: ",e.jsx("code",{children:"Trocar"}),", ",e.jsx("code",{children:"Logger.Logar"}),", extensões LINQ como ",e.jsx("code",{children:"Where<T>"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Classe genérica:"})," os dados internos dependem do tipo, e várias operações usam o mesmo ",e.jsx("code",{children:"T"}),". Ex.: ",e.jsx("code",{children:"List<T>"}),", ",e.jsx("code",{children:"Dictionary<K,V>"}),", ",e.jsx("code",{children:"Repositorio<T>"}),"."]}),e.jsxs("li",{children:["Mistura comum: classe não-genérica com vários métodos genéricos (utilitários estáticos como ",e.jsx("code",{children:"Enumerable"}),")."]})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"ref"})," no chamador:"]})," ",e.jsx("code",{children:"Trocar(x, y)"})," sem ",e.jsx("code",{children:"ref"})," não compila — a sintaxe exige a palavra dos dois lados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar inferência pelo retorno:"})," em ",e.jsx("code",{children:"T Criar<T>()"})," sem argumentos do tipo ",e.jsx("code",{children:"T"}),", sempre escreva ",e.jsx("code",{children:"Criar<Usuario>()"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Restrição diferente em overload:"})," overloads são distinguidos pela assinatura, não pelas restrições. Não dá para sobrecarregar só pela cláusula ",e.jsx("code",{children:"where"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"typeof(T)"})," com ",e.jsx("code",{children:"typeof(this)"}),":"]})," ",e.jsx("code",{children:"typeof(T)"})," é o tipo passado na chamada; o tipo da instância da classe é outro."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Métodos genéricos têm seus próprios parâmetros de tipo, independentes da classe."}),e.jsxs("li",{children:["Sintaxe: ",e.jsx("code",{children:"Tipo Metodo<T>(T arg) where T : ..."}),"."]}),e.jsxs("li",{children:["Inferência de tipo dispensa especificar ",e.jsx("code",{children:"<T>"})," quando o argumento revela."]}),e.jsx("li",{children:"Overloads com versão não-genérica têm prioridade quando o tipo bate exatamente."}),e.jsx("li",{children:"Use método genérico para operações isoladas; classe genérica para estado compartilhado."})]})]})}export{s as default};
