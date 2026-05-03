import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsCovariance() {
  return (
    <PageContainer
      title="Covariância e contravariância em generics"
      subtitle="Por que IEnumerable<string> pode virar IEnumerable<object>, mas List<string> não pode virar List<object>."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <p>
        Imagine uma caixa de "frutas". Você espera poder colocar maçãs nela, certo? E uma caixa de "maçãs"... ela <em>é</em> uma caixa de frutas? Em programação, essa pergunta tem três respostas dependendo do uso: <strong>covariância</strong> (sim, em uma direção), <strong>contravariância</strong> (sim, na direção oposta) e <strong>invariância</strong> (não, são tipos completamente distintos). Esse capítulo explica como o C# trata isso em interfaces e delegates genéricos com as palavras-chave <code>out</code> e <code>in</code>.
      </p>

      <h2>O ponto de partida: invariância</h2>
      <p>
        Por padrão, generics em C# são <strong>invariantes</strong>: <code>List&lt;string&gt;</code> não é considerado nem subtipo nem supertipo de <code>List&lt;object&gt;</code>, mesmo que <code>string</code> seja subtipo de <code>object</code>. O motivo é prudência:
      </p>
      <pre><code>{`List<string> nomes = new() { "Ana", "Bruno" };
// List<object> objs = nomes;  // ERRO de compilação CS0029

// Imagine se fosse permitido:
//   objs.Add(42);              // 42 é object, mas a lista REAL é de string!
//   string primeiro = nomes[0]; // CRASH: 42 não é string`}</code></pre>
      <p>
        Se atribuir <code>List&lt;string&gt;</code> a uma variável <code>List&lt;object&gt;</code> fosse permitido, alguém poderia adicionar qualquer coisa nela e quebrar o tipo original. O compilador proíbe para te proteger.
      </p>

      <h2>Covariância com <code>out</code>: <em>só leitura</em></h2>
      <p>
        <strong>Covariância</strong> ("co" = junto, na mesma direção da hierarquia) significa: se <code>Filho</code> deriva de <code>Pai</code>, então <code>Generico&lt;Filho&gt;</code> pode ser tratado como <code>Generico&lt;Pai&gt;</code>. O C# permite isso <em>apenas</em> quando <code>T</code> aparece <em>somente como saída</em> — você lê <code>T</code>, mas nunca passa <code>T</code> de entrada. A palavra-chave é <code>out</code> na declaração da interface:
      </p>
      <pre><code>{`// IEnumerable<out T> é covariante porque só DEVOLVE T (no foreach)
public interface IEnumerable<out T> {
    IEnumerator<T> GetEnumerator();
}

IEnumerable<string> nomes = new[] { "Ana", "Bruno" };
IEnumerable<object> objs = nomes;   // OK! covariância

foreach (object o in objs) {        // só leitura, seguro
    Console.WriteLine(o);
}`}</code></pre>
      <p>
        É seguro porque, mesmo que você "veja" os elementos como <code>object</code>, eles continuam sendo <code>string</code> internamente — e tudo que você quer fazer é <em>obter</em>, nunca <em>adicionar</em>.
      </p>

      <AlertBox type="info" title="Mnemônico: out = out">
        <code>out</code> em variância significa "T sai" — só aparece em posição de retorno. <code>in</code> significa "T entra" — só aparece como parâmetro. Se T aparece nos dois lados (como em <code>List&lt;T&gt;</code>), o tipo é necessariamente <strong>invariante</strong>.
      </AlertBox>

      <h2>Contravariância com <code>in</code>: <em>só escrita/consumo</em></h2>
      <p>
        <strong>Contravariância</strong> é o contrário: se <code>Filho</code> deriva de <code>Pai</code>, então <code>Generico&lt;Pai&gt;</code> pode ser tratado como <code>Generico&lt;Filho&gt;</code>. Parece estranho à primeira vista! Mas faz sentido para "consumidores" — algo que recebe <code>T</code> como entrada. Um consumidor de <code>Animal</code> claramente também consegue lidar com <code>Cachorro</code> (já que cachorro é animal). A keyword é <code>in</code>:
      </p>
      <pre><code>{`// IComparer<in T> é contravariante porque só CONSOME T (no Compare)
public interface IComparer<in T> {
    int Compare(T x, T y);
}

// Comparador de objetos (compara por hash, ToString, etc.)
IComparer<object> comparadorObjetos = Comparer<object>.Create(
    (a, b) => a.ToString()!.CompareTo(b.ToString())
);

// Posso usá-lo onde preciso comparar strings (string deriva de object)
IComparer<string> comparadorStrings = comparadorObjetos;  // OK! contravariância

string[] arr = { "banana", "ana", "carlos" };
Array.Sort(arr, comparadorStrings);
Console.WriteLine(string.Join(", ", arr));  // ana, banana, carlos`}</code></pre>

      <h2>Por que <code>List&lt;T&gt;</code> não pode ter variância</h2>
      <p>
        <code>List&lt;T&gt;</code> tem o método <code>void Add(T item)</code> (T como entrada) <em>e</em> <code>T this[int]</code> (T como saída). Como T aparece nos dois lados, não há marcação <code>in</code> nem <code>out</code> que seja segura — ela permanece invariante. Esse é um <strong>princípio fundamental</strong>: variância só vale para interfaces e delegates onde você consegue restringir o uso de T a <em>uma única direção</em>.
      </p>

      <h2>Exemplos do framework</h2>
      <p>
        Veja como a BCL (Base Class Library do .NET) marca variância em tipos cotidianos:
      </p>
      <pre><code>{`// Covariantes (out T): você consome dados produzidos
public interface IEnumerable<out T> { /* ... */ }
public interface IReadOnlyList<out T> { /* ... */ }
public interface IReadOnlyCollection<out T> { /* ... */ }
public delegate TResult Func<out TResult>();

// Contravariantes (in T): você fornece T para serem consumidos
public interface IComparer<in T> { /* ... */ }
public interface IEqualityComparer<in T> { /* ... */ }
public delegate void Action<in T>(T arg);

// Invariantes (não anotadas): leem E escrevem T
public interface ICollection<T> { /* tem Add(T) e Count */ }
public interface IList<T> { /* tem indexer get e set */ }
public class List<T> { /* idem */ }`}</code></pre>

      <h2>Variância em delegates</h2>
      <p>
        <code>Func&lt;T, TResult&gt;</code> e <code>Action&lt;T&gt;</code> são delegates genéricos extremamente comuns (usados em LINQ e callbacks). Note como suas anotações combinam:
      </p>
      <pre><code>{`// Func<in T, out TResult>: T entra (contravariante), TResult sai (covariante)
Func<object, string> obj2str = o => o?.ToString() ?? "";

// Posso atribuir a Func<string, object> graças à variância:
//   - 'string' (mais derivado) entra onde se aceitava 'object'  -> contravariância em T
//   - 'object' (menos derivado) sai onde se prometia 'string'    -> covariância em TResult
Func<string, object> s2obj = obj2str;

object resultado = s2obj("ola");`}</code></pre>

      <AlertBox type="warning" title="Variância só funciona com tipos de referência">
        Variância em C# se aplica somente quando os tipos envolvidos são <em>reference types</em>. Você <em>não</em> pode atribuir <code>IEnumerable&lt;int&gt;</code> a <code>IEnumerable&lt;object&gt;</code>, porque iria exigir boxing implícito de cada elemento — e o compilador prefere ser explícito sobre conversões custosas.
      </AlertBox>

      <h2>Criando interfaces variantes próprias</h2>
      <p>
        Você pode marcar suas próprias interfaces com <code>in</code>/<code>out</code>, desde que o uso de T respeite a regra:
      </p>
      <pre><code>{`// Produtor de itens (covariante) — só devolve T
public interface IProdutor<out T> {
    T Proximo();
    IEnumerable<T> Todos();
}

// Consumidor de itens (contravariante) — só recebe T
public interface IConsumidor<in T> {
    void Receber(T item);
    void Validar(T item);
}

public class FabricaCachorros : IProdutor<Cachorro> { /*...*/ }
IProdutor<Animal> p = new FabricaCachorros();   // OK, covariância

public class LogadorAnimal : IConsumidor<Animal> { /*...*/ }
IConsumidor<Cachorro> c = new LogadorAnimal();  // OK, contravariância`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar covariar <code>List&lt;T&gt;</code>:</strong> não é variante. Use <code>IEnumerable&lt;T&gt;</code> ou <code>IReadOnlyList&lt;T&gt;</code> nas assinaturas públicas se quiser passar uma lista de derivados.</li>
        <li><strong>Marcar <code>out T</code> e usar T como parâmetro:</strong> erro de compilação. Saída só, nada de entrada.</li>
        <li><strong>Esperar variância com value types:</strong> <code>IEnumerable&lt;int&gt;</code> NÃO vira <code>IEnumerable&lt;object&gt;</code> — exigiria boxing.</li>
        <li><strong>Confundir covariância de array (legada e perigosa):</strong> <code>string[]</code> pode ser tratado como <code>object[]</code> historicamente, mas atribuir <code>objs[0] = 42</code> joga <code>ArrayTypeMismatchException</code> em runtime. Prefira <code>IReadOnlyList&lt;T&gt;</code>.</li>
        <li><strong>Achar que toda interface deveria ter variância:</strong> só faz sentido onde T é genuinamente "puro produtor" ou "puro consumidor".</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Generics em C# são <strong>invariantes por padrão</strong> — segurança em primeiro lugar.</li>
        <li><code>out T</code>: covariante. <code>Generico&lt;Derivado&gt;</code> vira <code>Generico&lt;Base&gt;</code>. T só pode aparecer como saída.</li>
        <li><code>in T</code>: contravariante. <code>Generico&lt;Base&gt;</code> vira <code>Generico&lt;Derivado&gt;</code>. T só pode aparecer como entrada.</li>
        <li>Variância só funciona em interfaces e delegates, e só com tipos de referência.</li>
        <li>Exemplos clássicos: <code>IEnumerable&lt;out T&gt;</code>, <code>IComparer&lt;in T&gt;</code>, <code>Func&lt;in T, out TResult&gt;</code>.</li>
      </ul>
    </PageContainer>
  );
}
