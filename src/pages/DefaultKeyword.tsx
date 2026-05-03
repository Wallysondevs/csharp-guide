import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DefaultKeyword() {
  return (
    <PageContainer
      title="A palavra default em generics"
      subtitle="Como obter o 'valor neutro' de um tipo qualquer — útil em métodos genéricos, parâmetros opcionais e cláusulas switch."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <p>
        Suponha que você tenha um método genérico <code>T Buscar&lt;T&gt;(...)</code> e queira retornar "nada" quando não achar resultado. Você não pode usar <code>null</code> diretamente porque <code>T</code> pode ser <code>int</code> (e <code>int</code> não aceita null). Você não pode usar <code>0</code> porque <code>T</code> pode ser <code>string</code>. A resposta do C# é a palavra-chave <code>default</code>: ela devolve o "valor padrão" do tipo, seja qual for. Pense num formulário em branco — cada campo tem um valor inicial conforme seu tipo: número fica 0, texto fica vazio/nulo, caixinha fica desmarcada.
      </p>

      <h2>O que <code>default</code> retorna para cada tipo</h2>
      <p>
        A regra é simples: para tipos numéricos, é <strong>zero</strong>; para <code>bool</code>, é <code>false</code>; para tipos de referência (classes, interfaces, strings, arrays), é <code>null</code>; para structs, é uma instância com todos os campos zerados.
      </p>
      <pre><code>{`Console.WriteLine(default(int));        // 0
Console.WriteLine(default(double));     // 0
Console.WriteLine(default(bool));       // False
Console.WriteLine(default(char));       // '\\0' (caractere nulo)
Console.WriteLine(default(string));     // (null, imprime vazio)
Console.WriteLine(default(DateTime));   // 01/01/0001 00:00:00
Console.WriteLine(default(List<int>));  // (null)

// Para um struct seu:
public struct Ponto { public int X; public int Y; }
Ponto p = default(Ponto);   // (X=0, Y=0)`}</code></pre>

      <h2><code>default(T)</code> vs <code>default</code> literal</h2>
      <p>
        Existem duas formas. A clássica <code>default(T)</code> exige você dizer o tipo entre parênteses. A nova (C# 7.1+) <code>default</code> sem parênteses é "target-typed" — o compilador deduz o tipo a partir do contexto:
      </p>
      <pre><code>{`int n = default(int);       // forma clássica
int n2 = default;           // forma nova: tipo deduzido pelo lado esquerdo

string s = default;         // tipo deduzido como string -> null

// Em retorno de método:
public string ObterNome() => default;   // null (string)
public int Contar() => default;          // 0 (int)

// Em chamada de método (tipo do parâmetro deduzido):
void Salvar(DateTime quando) { /* ... */ }
Salvar(default);            // equivale a Salvar(DateTime.MinValue)`}</code></pre>
      <p>
        Use a forma curta sempre que o tipo for óbvio pelo contexto — fica mais legível. Use <code>default(T)</code> quando precisar deixar o tipo explícito (em expressões ambíguas, por exemplo).
      </p>

      <AlertBox type="info" title="Initialização automática de campos">
        Campos de classe e elementos de array já são inicializados com <code>default</code> automaticamente, sem você escrever nada. Por isso <code>new int[3]</code> dá <code>[0, 0, 0]</code> e <code>new string[3]</code> dá <code>[null, null, null]</code>.
      </AlertBox>

      <h2>O uso clássico: em métodos genéricos</h2>
      <p>
        Esse é o motivo de <code>default</code> existir. Em código genérico, você não sabe se <code>T</code> é tipo de valor ou referência:
      </p>
      <pre><code>{`public static T PrimeiroOuPadrao<T>(IEnumerable<T> origem) {
    foreach (T item in origem) return item;
    return default!;   // ! suprime warning de nullable em reference types
}

int n = PrimeiroOuPadrao(new[] { 10, 20 });            // 10
int vazio = PrimeiroOuPadrao(Array.Empty<int>());      // 0
string? s = PrimeiroOuPadrao(Array.Empty<string>());   // null`}</code></pre>
      <p>
        Sem <code>default</code>, você teria que escrever uma versão para cada tipo possível. Ele é a "ponte" que permite código genuinamente genérico.
      </p>

      <h2>Em parâmetros opcionais</h2>
      <p>
        Parâmetros opcionais exigem um valor constante de compilação. <code>default</code> serve perfeitamente como "marcador" de "não foi passado":
      </p>
      <pre><code>{`public void Configurar(
    string nome,
    int timeout = default,           // 0
    DateTime expiracao = default,     // DateTime.MinValue
    CancellationToken ct = default    // CancellationToken.None
) {
    if (timeout == default) timeout = 30;       // valor real default
    if (expiracao == default) expiracao = DateTime.UtcNow.AddHours(1);
    // ...
}`}</code></pre>
      <p>
        O exemplo de <code>CancellationToken.None == default</code> é especialmente comum em APIs assíncronas — o <code>default</code> equivale ao token "nunca cancela".
      </p>

      <h2>Em <code>switch</code> e pattern matching</h2>
      <p>
        Cuidado: nessa posição, <code>default</code> é uma palavra-chave da linguagem com outro significado — significa "se nenhum caso anterior bateu, caia aqui":
      </p>
      <pre><code>{`int codigo = 5;

string mensagem = codigo switch {
    1 => "criado",
    2 => "atualizado",
    3 => "removido",
    _ => "desconhecido"   // padrão recomendado: descarte com _
    // 'default' funcionaria aqui também, mas '_' é o idiomático em switch expressions
};

// Em switch statement clássico:
switch (codigo) {
    case 1: break;
    case 2: break;
    default: Console.WriteLine("outro"); break;
}`}</code></pre>
      <p>
        Os dois usos não conflitam: o compilador sabe pelo contexto se você quer "valor padrão de um tipo" ou "ramo padrão de um switch".
      </p>

      <h2>Comparando com <code>default</code></h2>
      <p>
        Comparar com <code>default</code> é útil para checar "ainda não foi atribuído" — mas atenção a tipos onde a comparação não é trivial:
      </p>
      <pre><code>{`public static bool TemValor<T>(T item) {
    return !EqualityComparer<T>.Default.Equals(item, default);
}

Console.WriteLine(TemValor(0));     // False (0 é o default de int)
Console.WriteLine(TemValor(42));    // True
Console.WriteLine(TemValor(""));    // True (string vazia != null)
Console.WriteLine(TemValor((string?)null)); // False`}</code></pre>
      <p>
        Use <code>EqualityComparer&lt;T&gt;.Default.Equals(...)</code> em vez de <code>==</code> dentro de código genérico, porque <code>==</code> não está disponível para todo <code>T</code> (apenas para tipos com operador definido).
      </p>

      <AlertBox type="warning" title="default não é o mesmo que 'unset'">
        Se o "valor padrão" for um valor <em>válido</em> do seu domínio, <code>default</code> não distingue "não passei" de "passei zero". Para esses casos, use <code>Nullable&lt;T&gt;</code> (<code>int?</code>) e cheque <code>HasValue</code>, ou crie um sentinel claro.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>default</code> de struct com null:</strong> <code>default(DateTime)</code> NÃO é null — é <code>01/01/0001</code>. Datas "vazias" precisam ser <code>DateTime?</code>.</li>
        <li><strong>Esperar inicialização customizada:</strong> structs não têm como sobrescrever o "valor padrão". Toda criação por <code>default</code> ou via array dá os campos zerados, ignorando construtores e inicializadores.</li>
        <li><strong>Comparar com <code>==</code> em código genérico:</strong> use <code>EqualityComparer&lt;T&gt;.Default</code>.</li>
        <li><strong>Esquecer o <code>!</code> de null-forgiving:</strong> em projetos com nullable habilitado, <code>return default;</code> em método que devolve <code>T</code> pode acusar warning. Use <code>default!</code> ou anote a assinatura como <code>T?</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>default</code> devolve o valor neutro do tipo: <code>0</code>, <code>false</code>, <code>null</code>, struct zerado.</li>
        <li>Forma <code>default(T)</code> explícita ou <code>default</code> target-typed.</li>
        <li>Indispensável em métodos genéricos onde <code>T</code> é desconhecido.</li>
        <li>Comum em parâmetros opcionais (<code>CancellationToken ct = default</code>).</li>
        <li>Use <code>EqualityComparer&lt;T&gt;.Default.Equals</code> ao comparar genericamente.</li>
      </ul>
    </PageContainer>
  );
}
