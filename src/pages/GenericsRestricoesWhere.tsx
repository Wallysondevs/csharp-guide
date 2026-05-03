import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsRestricoesWhere() {
  return (
    <PageContainer
      title="Restrições genéricas com where"
      subtitle="Como dizer ao compilador: 'meu T não pode ser qualquer coisa — ele precisa ter características X, Y e Z'."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Generics dão liberdade total: <code>T</code> pode ser <code>int</code>, <code>string</code>, <code>HttpClient</code>, qualquer coisa. Mas essa liberdade tem um preço: dentro do método genérico, você só pode chamar membros que <em>todo</em> tipo possui — basicamente <code>ToString()</code>, <code>Equals()</code> e <code>GetHashCode()</code>. Para fazer mais que isso, você precisa <strong>restringir</strong> o que <code>T</code> pode ser. É aqui que entra a cláusula <code>where</code>: ela é como o requisito de uma vaga de emprego — "candidatos precisam saber inglês e ter carteira de motorista". Só tipos que cumprem viram <code>T</code>.
      </p>

      <h2>Por que precisamos restringir</h2>
      <p>
        Considere um método que ordena dois valores. Sem restrição, o compilador não deixa você chamar <code>CompareTo</code>:
      </p>
      <pre><code>{`public static T Maior<T>(T a, T b) {
    // Erro CS1061: 'T' does not contain a definition for 'CompareTo'
    return a.CompareTo(b) > 0 ? a : b;
}`}</code></pre>
      <p>
        O compilador está certo: nada garante que o <code>T</code> que vier tenha <code>CompareTo</code>. A solução é restringir <code>T</code> a tipos que implementam <code>IComparable&lt;T&gt;</code>:
      </p>
      <pre><code>{`public static T Maior<T>(T a, T b) where T : IComparable<T> {
    return a.CompareTo(b) > 0 ? a : b;
}

int x = Maior(3, 7);            // 7
string s = Maior("ana", "bia"); // bia (ordem alfabética)
// Maior(new object(), new object()); // ERRO: object não implementa IComparable<object>`}</code></pre>

      <h2>O catálogo completo de restrições</h2>
      <p>
        O C# oferece um conjunto rico de palavras que podem aparecer depois de <code>where T :</code>. Cada uma garante uma característica diferente:
      </p>
      <table>
        <thead>
          <tr><th>Restrição</th><th>Significado</th></tr>
        </thead>
        <tbody>
          <tr><td><code>class</code></td><td><code>T</code> é um tipo de referência (class, interface, delegate, array). Permite atribuir <code>null</code>.</td></tr>
          <tr><td><code>class?</code></td><td>Igual, mas explicitamente permite <code>T</code> ser nullable reference.</td></tr>
          <tr><td><code>struct</code></td><td><code>T</code> é um value type não-nullable (int, DateTime, structs próprios).</td></tr>
          <tr><td><code>new()</code></td><td><code>T</code> tem construtor público sem parâmetros. Permite <code>new T()</code>.</td></tr>
          <tr><td><code>NomeBase</code></td><td><code>T</code> herda da classe <code>NomeBase</code> (ou é ela mesma).</td></tr>
          <tr><td><code>IInterface</code></td><td><code>T</code> implementa <code>IInterface</code>. Pode ser combinada.</td></tr>
          <tr><td><code>notnull</code></td><td><code>T</code> não pode ser tipo nullable (nem <code>string?</code> nem <code>int?</code>).</td></tr>
          <tr><td><code>unmanaged</code></td><td><code>T</code> é um value type que não contém referências (uso em interop com C nativo).</td></tr>
          <tr><td><code>U</code> (outro param)</td><td><code>T</code> deve derivar de <code>U</code>. Útil em hierarquias.</td></tr>
        </tbody>
      </table>

      <AlertBox type="info" title="Ordem importa">
        Quando combina múltiplas restrições, a ordem é fixa: <code>class</code>/<code>struct</code> primeiro, depois classe base, depois interfaces, depois <code>new()</code>. Por exemplo: <code>where T : MeuTipo, IDisposable, new()</code>.
      </AlertBox>

      <h2>Múltiplas restrições no mesmo <code>T</code></h2>
      <p>
        Você pode encadear várias restrições separadas por vírgula. Cada uma adiciona uma exigência:
      </p>
      <pre><code>{`// T precisa ser uma classe, implementar IDisposable e ter ctor sem parâmetros
public class Fabrica<T> where T : class, IDisposable, new() {
    public T Criar() {
        T instancia = new T();   // OK por causa de new()
        return instancia;
    }

    public void Liberar(T item) {
        item?.Dispose();          // OK por causa de IDisposable e class
    }
}`}</code></pre>

      <h2>Restrições em múltiplos parâmetros</h2>
      <p>
        Quando há mais de um parâmetro genérico, repita <code>where</code> uma vez para cada:
      </p>
      <pre><code>{`public class Repositorio<TEntidade, TChave>
    where TEntidade : class, new()
    where TChave : struct, IEquatable<TChave>
{
    public TEntidade? BuscarPorId(TChave id) {
        // ... lógica de busca
        return new TEntidade();
    }
}

// Uso
var repo = new Repositorio<Usuario, Guid>();`}</code></pre>

      <h2><code>notnull</code>: a restrição contra null</h2>
      <p>
        Com nullable reference types ativados (<code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> no <code>.csproj</code>), você ganha aviso ao usar valores potencialmente nulos. <code>where T : notnull</code> diz: <em>"meu método não tolera <code>T</code> ser nulo nem como anotação"</em>:
      </p>
      <pre><code>{`public static void Logar<T>(T valor) where T : notnull {
    Console.WriteLine(valor.ToString());  // sem warning de null
}

Logar(42);              // OK
Logar("ola");           // OK
// Logar<string?>("oi"); // Warning: 'string?' does not satisfy 'notnull'`}</code></pre>

      <h2><code>unmanaged</code>: structs sem referências internas</h2>
      <p>
        Um tipo é <em>unmanaged</em> quando seus dados podem ser representados como um bloco contínuo de bytes sem ponteiros para o heap. Útil para interop, serialização binária, e <code>stackalloc</code>:
      </p>
      <pre><code>{`public static unsafe int TamanhoBytes<T>() where T : unmanaged {
    return sizeof(T);   // sizeof só funciona com unmanaged
}

Console.WriteLine(TamanhoBytes<int>());        // 4
Console.WriteLine(TamanhoBytes<DateTime>());   // 8
// TamanhoBytes<string>();   // ERRO: string contém referência`}</code></pre>

      <h2>Restrição de "deriva de outro parâmetro"</h2>
      <p>
        Útil em padrões de "fluent builder" e em frameworks. Diz que <code>TFilho</code> precisa derivar de <code>TPai</code>:
      </p>
      <pre><code>{`public class Builder<TConcreto> where TConcreto : Builder<TConcreto> {
    public TConcreto Encadear() {
        // retorno do tipo concreto, permitindo chamadas em cadeia
        return (TConcreto)this;
    }
}

public class MeuBuilder : Builder<MeuBuilder> {
    public MeuBuilder ComNome(string n) { /*...*/ return this; }
}`}</code></pre>

      <AlertBox type="warning" title="Restrições não 'criam' funcionalidade">
        Restrições só <em>filtram</em> os tipos aceitos e <em>liberam</em> chamadas que dependem dessas características. Elas não adicionam comportamento. Se você precisa de operações como soma genérica, use <em>generic math</em> com <code>INumber&lt;T&gt;</code> (capítulo dedicado).
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>new()</code> e tentar instanciar:</strong> <code>new T()</code> só funciona com a restrição <code>new()</code>.</li>
        <li><strong>Pôr restrição na classe e <em>repetir</em> no método:</strong> métodos herdam as restrições da classe; só repita se quiser <em>adicionar</em> mais.</li>
        <li><strong>Combinar <code>class</code> e <code>struct</code>:</strong> são mutuamente exclusivas, dão erro de compilação.</li>
        <li><strong>Usar <code>unmanaged</code> sem entender:</strong> qualquer struct com um campo <code>string</code>, <code>List</code> ou similar deixa de ser unmanaged.</li>
        <li><strong>Esperar resolução de operadores sem generic math:</strong> mesmo restringindo a <code>IComparable</code>, você não pode escrever <code>a + b</code> em <code>T</code> genérico — para isso precisa de <code>INumber&lt;T&gt;</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>where T :</code> impõe requisitos sobre o que <code>T</code> pode ser.</li>
        <li>Disponíveis: <code>class</code>, <code>struct</code>, <code>new()</code>, classe base, interfaces, <code>notnull</code>, <code>unmanaged</code>, derivação de outro param.</li>
        <li>Múltiplas restrições combinadas por vírgula, com ordem fixa.</li>
        <li>Cada parâmetro genérico tem seu próprio <code>where</code>.</li>
        <li>Restrições liberam chamadas a membros específicos do tipo restringido.</li>
      </ul>
    </PageContainer>
  );
}
