import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsMetodos() {
  return (
    <PageContainer
      title="Métodos genéricos: poder em métodos individuais"
      subtitle="Como criar métodos com seus próprios parâmetros de tipo, dentro de classes comuns ou genéricas."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Nem sempre faz sentido tornar a classe inteira genérica. Às vezes você tem uma classe utilitária comum e quer apenas <strong>um método</strong> que aceite qualquer tipo. É aí que entram os <strong>métodos genéricos</strong>: o parâmetro de tipo (<code>T</code>) é declarado na assinatura do método, não da classe. Pense numa caixa de ferramentas comum (a classe) com uma chave-inglesa ajustável (o método) que se adapta a parafusos de qualquer tamanho.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        Você coloca o parâmetro de tipo entre <code>&lt;</code> e <code>&gt;</code> entre o nome do método e os parênteses dos parâmetros. Pode ter quantos parâmetros de tipo quiser:
      </p>
      <pre><code>{`public static class Util {
    // Método genérico: T só existe dentro deste método
    public static void Imprimir<T>(T item) {
        Console.WriteLine($"[{typeof(T).Name}] {item}");
    }
}

Util.Imprimir(42);          // [Int32] 42
Util.Imprimir("ola");       // [String] ola
Util.Imprimir(DateTime.Now); // [DateTime] 2024-...
`}</code></pre>
      <p>
        Note: <code>typeof(T)</code> retorna o objeto <code>Type</code> que descreve o tipo concreto escolhido em cada chamada. <code>typeof</code> é um operador de compile-time — o compilador resolve durante a especialização do método.
      </p>

      <h2>Trocar valores: o exemplo clássico de <code>ref</code></h2>
      <p>
        O modificador <code>ref</code> faz o parâmetro receber a <em>referência</em> à variável original, não uma cópia. Combinado com generics, vira o famoso "swap":
      </p>
      <pre><code>{`public static void Trocar<T>(ref T a, ref T b) {
    T temp = a;
    a = b;
    b = temp;
}

int x = 10, y = 20;
Trocar(ref x, ref y);
Console.WriteLine($"x={x}, y={y}"); // x=20, y=10

string s1 = "ola", s2 = "mundo";
Trocar(ref s1, ref s2);
Console.WriteLine($"{s1} {s2}");    // mundo ola`}</code></pre>
      <p>
        O mesmo método funciona para <code>int</code>, <code>string</code>, structs próprios, qualquer coisa — o compilador <em>especializa</em> internamente cada combinação. A palavra-chave <code>ref</code> é exigida tanto na declaração quanto no chamador, evitando surpresas.
      </p>

      <h2>Inferência de tipo: o que torna isso ergonômico</h2>
      <p>
        Você raramente vai escrever <code>Util.Imprimir&lt;int&gt;(42)</code>. O compilador olha para o argumento <code>42</code> e <em>infere</em> que <code>T = int</code>. Esse processo se chama <strong>type inference</strong>. Ele funciona quando o tipo aparece em pelo menos um dos parâmetros:
      </p>
      <pre><code>{`public static T[] CriarArray<T>(int tamanho, T valorPadrao) {
    var arr = new T[tamanho];
    for (int i = 0; i < tamanho; i++) arr[i] = valorPadrao;
    return arr;
}

int[] zeros = CriarArray(5, 0);            // T inferido como int
string[] vazias = CriarArray(3, "");       // T inferido como string

// Quando NÃO dá para inferir, especifique:
public static T Criar<T>() where T : new() => new T();

var u = Criar<Usuario>();   // sem argumento -> sem como inferir, declare`}</code></pre>

      <AlertBox type="info" title="Inferência só vê argumentos">
        O retorno de um método NÃO ajuda na inferência. Se o único uso de <code>T</code> for o tipo de retorno, você precisa especificar manualmente entre <code>&lt;&gt;</code>.
      </AlertBox>

      <h2>Restrições na assinatura</h2>
      <p>
        Tudo o que vimos sobre <code>where</code> em classes genéricas vale também em métodos genéricos. Coloque a cláusula <em>antes</em> da chave de abertura:
      </p>
      <pre><code>{`public static T MaiorDeTodos<T>(IEnumerable<T> itens) where T : IComparable<T> {
    T maior = itens.First();
    foreach (var item in itens.Skip(1)) {
        if (item.CompareTo(maior) > 0) maior = item;
    }
    return maior;
}

int max = MaiorDeTodos(new[] { 3, 1, 7, 4 });   // 7
string longest = MaiorDeTodos(new[] { "ana", "bruno", "ze" }); // "bruno"`}</code></pre>

      <h2>Overload: convivendo com versão não-genérica</h2>
      <p>
        Você pode ter <strong>várias versões</strong> do mesmo método: uma genérica que cobre o caso geral e algumas especializadas para tipos comuns onde dá para fazer algo mais inteligente. O compilador escolhe a melhor:
      </p>
      <pre><code>{`public static class Logger {
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
Logger.Logar(new InvalidOperationException("x"));  // ERRO: x`}</code></pre>
      <p>
        Regra de seleção: a versão <strong>não-genérica que aceita exatamente</strong> o argumento ganha; a genérica é usada como "fallback".
      </p>

      <h2>Métodos genéricos em classes genéricas</h2>
      <p>
        A classe e o método podem ter parâmetros de tipo independentes:
      </p>
      <pre><code>{`public class Cache<TChave> {
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
DateTime agora = cache.ObterOuCriar("hora", () => DateTime.Now);`}</code></pre>

      <AlertBox type="warning" title="Cuidado com nomes iguais">
        Não dê o mesmo nome ao parâmetro de tipo da classe e do método. Compila, mas <code>T</code> do método vai <em>esconder</em> o <code>T</code> da classe, gerando bugs sutis. Use prefixos descritivos: <code>TKey</code> na classe, <code>TValue</code> no método.
      </AlertBox>

      <h2>Quando usar método genérico vs classe genérica</h2>
      <ul>
        <li><strong>Método genérico:</strong> a operação faz sentido isolada e o tipo varia por chamada. Ex.: <code>Trocar</code>, <code>Logger.Logar</code>, extensões LINQ como <code>Where&lt;T&gt;</code>.</li>
        <li><strong>Classe genérica:</strong> os dados internos dependem do tipo, e várias operações usam o mesmo <code>T</code>. Ex.: <code>List&lt;T&gt;</code>, <code>Dictionary&lt;K,V&gt;</code>, <code>Repositorio&lt;T&gt;</code>.</li>
        <li>Mistura comum: classe não-genérica com vários métodos genéricos (utilitários estáticos como <code>Enumerable</code>).</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ref</code> no chamador:</strong> <code>Trocar(x, y)</code> sem <code>ref</code> não compila — a sintaxe exige a palavra dos dois lados.</li>
        <li><strong>Esperar inferência pelo retorno:</strong> em <code>T Criar&lt;T&gt;()</code> sem argumentos do tipo <code>T</code>, sempre escreva <code>Criar&lt;Usuario&gt;()</code>.</li>
        <li><strong>Restrição diferente em overload:</strong> overloads são distinguidos pela assinatura, não pelas restrições. Não dá para sobrecarregar só pela cláusula <code>where</code>.</li>
        <li><strong>Confundir <code>typeof(T)</code> com <code>typeof(this)</code>:</strong> <code>typeof(T)</code> é o tipo passado na chamada; o tipo da instância da classe é outro.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Métodos genéricos têm seus próprios parâmetros de tipo, independentes da classe.</li>
        <li>Sintaxe: <code>Tipo Metodo&lt;T&gt;(T arg) where T : ...</code>.</li>
        <li>Inferência de tipo dispensa especificar <code>&lt;T&gt;</code> quando o argumento revela.</li>
        <li>Overloads com versão não-genérica têm prioridade quando o tipo bate exatamente.</li>
        <li>Use método genérico para operações isoladas; classe genérica para estado compartilhado.</li>
      </ul>
    </PageContainer>
  );
}
