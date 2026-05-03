import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hashset() {
  return (
    <PageContainer
      title="HashSet<T>: conjuntos sem duplicatas"
      subtitle="A coleção que garante itens únicos e oferece operações de conjunto (união, interseção, diferença) com lookup O(1)."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine uma lista de convidados de um casamento: cada nome só pode aparecer uma vez, e quando alguém chega na porta, o segurança precisa verificar instantaneamente se o nome consta. Essa é exatamente a função do <strong>HashSet&lt;T&gt;</strong> em C#: uma coleção que <em>não admite duplicatas</em> e que responde "este item já está aqui?" em tempo constante (O(1)). Por trás, ele usa a mesma técnica do Dictionary — <em>hashing</em> — mas guarda só as chaves, sem valores associados.
      </p>

      <h2>Criando e adicionando</h2>
      <p>
        O método <code>Add</code> tem um detalhe importante: ele devolve um <code>bool</code> que indica se a inserção realmente ocorreu. <code>true</code> = item novo; <code>false</code> = já existia, foi ignorado.
      </p>
      <pre><code>{`using System.Collections.Generic;

var unicos = new HashSet<string>();
bool inserido1 = unicos.Add("ana");    // true
bool inserido2 = unicos.Add("bruno");  // true
bool inserido3 = unicos.Add("ana");    // false (duplicata)

Console.WriteLine(unicos.Count); // 2

// Inicializador funciona igual à List
var pares = new HashSet<int> { 2, 4, 6, 8, 4, 2 };
Console.WriteLine(pares.Count); // 4 (duplicatas descartadas)`}</code></pre>

      <h2>O caso clássico: deduplicação</h2>
      <p>
        Uma das aplicações mais comuns é remover repetições de uma sequência. Você pode passar a coleção original direto para o construtor:
      </p>
      <pre><code>{`var emails = new List<string>
{
    "a@x.com", "b@x.com", "a@x.com", "c@x.com", "b@x.com"
};

// Construtor aceita IEnumerable<T> e descarta duplicatas
var unicos = new HashSet<string>(emails);
Console.WriteLine(unicos.Count); // 3

// Equivalente em LINQ (mas cria um IEnumerable preguiçoso)
var distintos = emails.Distinct().ToList();`}</code></pre>

      <AlertBox type="info" title="HashSet vs Distinct()">
        Ambos servem para remover duplicatas, mas têm casos de uso diferentes. Use <code>HashSet</code> quando você vai <em>consultar muitas vezes</em> "este item existe?". Use <code>Distinct()</code> quando você só quer iterar uma única vez por valores únicos.
      </AlertBox>

      <h2>Operações de conjunto: união, interseção, diferença</h2>
      <p>
        Aqui o HashSet brilha: ele tem métodos para fazer aritmética de conjuntos como em matemática. Todos modificam o set <em>chamador</em> in-place.
      </p>
      <pre><code>{`var a = new HashSet<int> { 1, 2, 3, 4 };
var b = new HashSet<int> { 3, 4, 5, 6 };

// União: a fica com tudo de a + tudo de b (sem duplicatas)
var uniao = new HashSet<int>(a);
uniao.UnionWith(b);            // {1,2,3,4,5,6}

// Interseção: só os que estão em ambos
var inter = new HashSet<int>(a);
inter.IntersectWith(b);        // {3,4}

// Diferença: a sem os que estão em b
var dif = new HashSet<int>(a);
dif.ExceptWith(b);             // {1,2}

// Diferença simétrica: o que está em só um dos dois
var sim = new HashSet<int>(a);
sim.SymmetricExceptWith(b);    // {1,2,5,6}`}</code></pre>

      <h2>Verificando relações entre conjuntos</h2>
      <p>
        Além das operações que modificam, há métodos de <em>consulta</em> que devolvem bool, úteis para checar se um conjunto contém outro:
      </p>
      <pre><code>{`var todos = new HashSet<string> { "ler", "escrever", "executar" };
var meus = new HashSet<string> { "ler", "executar" };

bool eSub = meus.IsSubsetOf(todos);     // true
bool eSuper = todos.IsSupersetOf(meus); // true
bool sobrepoe = meus.Overlaps(todos);   // true
bool igual = meus.SetEquals(todos);     // false`}</code></pre>

      <h2>Performance e Contains O(1)</h2>
      <p>
        O método <code>Contains</code> é o ponto forte: ele usa hash, então é O(1) <em>amortizado</em>. Comparado a <code>List.Contains</code> (que é O(n)), em coleções grandes a diferença é gritante.
      </p>
      <pre><code>{`var lista = Enumerable.Range(0, 1_000_000).ToList();
var set = new HashSet<int>(lista);

// Lento: percorre até achar (pior caso, 1M comparações)
bool emLista = lista.Contains(999_999);

// Rápido: 1 cálculo de hash
bool emSet = set.Contains(999_999);

// Em loops com muitas verificações de existência,
// converter para HashSet é uma otimização clássica.`}</code></pre>

      <h2>Igualdade customizada com IEqualityComparer</h2>
      <p>
        O HashSet usa <code>Equals</code> e <code>GetHashCode</code> do tipo. Para classes próprias, você pode passar um <strong>IEqualityComparer&lt;T&gt;</strong> que define uma regra alternativa — útil para comparar strings ignorando caixa, por exemplo:
      </p>
      <pre><code>{`// Set de strings que ignora maiúsculas/minúsculas
var nomes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
nomes.Add("Ana");
nomes.Add("ANA");      // já existe (case insensitive)
Console.WriteLine(nomes.Count); // 1`}</code></pre>

      <AlertBox type="warning" title="Tipos próprios precisam de igualdade correta">
        Para usar uma classe sua em <code>HashSet&lt;T&gt;</code>, ela precisa implementar <code>IEquatable&lt;T&gt;</code> ou sobrescrever <code>Equals</code>+<code>GetHashCode</code>. Sem isso, dois objetos com mesmos valores serão considerados diferentes (igualdade por referência). <strong>Records</strong> resolvem isso automaticamente.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar ordem definida</strong>: HashSet não preserva a ordem de inserção. Se você precisa, use <code>List&lt;T&gt;</code> + verificação manual ou um <code>OrderedSet</code> (não existe nativo).</li>
        <li><strong>Esquecer que Add devolve bool</strong>: o retorno é útil para detectar duplicatas; ignorá-lo perde uma oportunidade.</li>
        <li><strong>Usar com tipos mutáveis</strong>: se você muda o objeto depois de inseri-lo, o hash pode mudar e o item "some" do set.</li>
        <li><strong>Confundir <code>UnionWith</code> com criar novo set</strong>: ele <em>modifica</em> o chamador. Se você quer manter o original intacto, copie antes: <code>new HashSet&lt;int&gt;(a)</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>HashSet&lt;T&gt; guarda valores únicos com lookup O(1).</li>
        <li><code>Add</code> devolve <code>true</code>/<code>false</code> indicando inserção.</li>
        <li>Operações de conjunto: <code>UnionWith</code>, <code>IntersectWith</code>, <code>ExceptWith</code>, <code>SymmetricExceptWith</code>.</li>
        <li>Comparações: <code>IsSubsetOf</code>, <code>IsSupersetOf</code>, <code>Overlaps</code>, <code>SetEquals</code>.</li>
        <li>Para chaves customizadas, implemente <code>IEquatable&lt;T&gt;</code> ou use record.</li>
      </ul>
    </PageContainer>
  );
}
