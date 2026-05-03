import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArrayVsList() {
  return (
    <PageContainer
      title="Array vs List<T>: quando usar cada um"
      subtitle="As duas coleções mais usadas em C#, suas diferenças de memória, performance e quando escolher cada uma."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que você precisa guardar uma lista de nomes de alunos. Em C#, existem duas formas clássicas de fazer isso: usar um <strong>array</strong> (vetor de tamanho fixo) ou usar uma <strong>List&lt;T&gt;</strong> (lista dinâmica). Saber qual escolher é uma das primeiras decisões importantes da sua jornada — e a resposta nem sempre é "use List". Este capítulo dissecca os dois e mostra quando cada um brilha.
      </p>

      <h2>O que é um array?</h2>
      <p>
        Um <strong>array</strong> é um bloco contínuo de memória que guarda um número <em>fixo</em> de elementos do mesmo tipo. Pense em uma cartela de ovos: ela tem espaço para 12 ovos, nem 11, nem 13. Se você quiser 24 ovos, precisa de outra cartela. Em C#, declarar um array exige saber o tamanho desde o início.
      </p>
      <pre><code>{`// Array de inteiros com 5 posições, todas começando em 0
int[] numeros = new int[5];
numeros[0] = 10;
numeros[4] = 50;
// numeros[5] = 99; // ERRO: IndexOutOfRangeException em runtime

// Array já inicializado com valores
string[] dias = { "seg", "ter", "qua", "qui", "sex" };

Console.WriteLine(dias.Length); // 5
Console.WriteLine(dias[2]);     // qua`}</code></pre>
      <p>
        Note <code>numeros.Length</code>: arrays têm uma propriedade <code>Length</code> (não método). Eles são <em>tipos de referência</em> (vivem no <strong>heap</strong>, a área de memória gerenciada pelo Garbage Collector), mas seu conteúdo é contíguo — todas as 5 posições estão lado a lado na memória, o que torna a leitura por índice extremamente rápida.
      </p>

      <h2>O que é List&lt;T&gt;?</h2>
      <p>
        A <strong>List&lt;T&gt;</strong> é uma coleção <em>genérica</em> (o <code>&lt;T&gt;</code> significa "do tipo T", você escolhe) que cresce e encolhe sob demanda. Por baixo dos panos, ela usa um array — mas se esconde a complexidade: quando enche, ela aloca um array maior e copia tudo.
      </p>
      <pre><code>{`using System.Collections.Generic;

// Lista vazia, capaz de guardar strings
List<string> alunos = new List<string>();
alunos.Add("Ana");
alunos.Add("Bruno");
alunos.Add("Carla");

// Inicializador de coleção (mais conciso)
List<int> idades = new() { 20, 30, 40 };

Console.WriteLine(alunos.Count);   // 3 (note: Count, não Length)
alunos.Remove("Bruno");
alunos.Insert(0, "Zé");            // insere no início
foreach (var nome in alunos)
    Console.WriteLine(nome);`}</code></pre>
      <p>
        A grande vantagem é a flexibilidade: <code>Add</code>, <code>Remove</code>, <code>Insert</code>, <code>Clear</code>. A grande "pegadinha" é a propriedade <code>Capacity</code>, que veremos a seguir.
      </p>

      <h2>Capacity vs Count</h2>
      <p>
        Toda <code>List&lt;T&gt;</code> tem dois números: <code>Count</code> (quantos itens estão de fato lá) e <code>Capacity</code> (quantos cabem antes de precisar realocar). Quando <code>Count</code> chega em <code>Capacity</code>, a List dobra de tamanho — aloca novo array, copia tudo. Essa cópia custa O(n).
      </p>
      <pre><code>{`var lista = new List<int>();
Console.WriteLine(lista.Capacity); // 0
lista.Add(1);
Console.WriteLine(lista.Capacity); // 4
for (int i = 0; i < 10; i++) lista.Add(i);
Console.WriteLine(lista.Capacity); // 16 (cresceu 4 -> 8 -> 16)

// Se você sabe o tamanho aproximado, pré-aloque:
var rapida = new List<int>(capacity: 1000);`}</code></pre>

      <AlertBox type="info" title="Dica de performance">
        Pré-alocar a <code>Capacity</code> quando você conhece (mesmo que aproximadamente) o tamanho final evita várias realocações e cópias. Para listas grandes, isso pode ser 5–10x mais rápido.
      </AlertBox>

      <h2>Performance comparada</h2>
      <p>
        Acesso por índice é O(1) em ambos — pode parecer surpreendente, mas List internamente é só um array. Adicionar no final é O(1) <em>amortizado</em> em List (raras realocações dobrando o custo). Inserir/remover no meio é O(n) em ambos. Arrays não têm <code>Add</code>, então para "crescer" você precisa criar um novo.
      </p>
      <pre><code>{`// Acesso indexado: idêntico
int x = numeros[3];
int y = lista[3];

// Iteração com foreach: igualmente rápida
foreach (var item in numeros) { /* ... */ }

// Para arrays "fixos" pequenos e quentes, prefira array:
// menos overhead, sem ponteiros extras.
Span<int> stackBuffer = stackalloc int[16];`}</code></pre>

      <h2>Convertendo entre eles</h2>
      <p>
        Você raramente fica preso a uma escolha. As conversões são triviais e usadas o tempo todo:
      </p>
      <pre><code>{`int[] arr = { 1, 2, 3, 4 };
List<int> lista = arr.ToList();          // array -> list
int[] arr2 = lista.ToArray();            // list -> array

// Construindo List a partir de qualquer IEnumerable
var nomes = new List<string>(new[] { "Ana", "Bia" });`}</code></pre>

      <AlertBox type="warning" title="Cuidado com cópias">
        <code>ToList()</code> e <code>ToArray()</code> <strong>copiam</strong> os dados. Se a coleção for grande, isso aloca memória nova. Em loops quentes, evite chamar essas conversões repetidamente.
      </AlertBox>

      <h2>Quando escolher cada um</h2>
      <ul>
        <li><strong>Array</strong>: tamanho conhecido e fixo, performance crítica, interoperabilidade com APIs (muitas APIs nativas pedem arrays), buffers temporários.</li>
        <li><strong>List&lt;T&gt;</strong>: na esmagadora maioria dos casos do dia a dia — quando o número de itens varia, quando você quer <code>Add</code>/<code>Remove</code>, quando você não sabe o tamanho final.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>Length</code> e <code>Count</code></strong>: arrays usam <code>Length</code>, List usa <code>Count</code>. <code>String</code> também usa <code>Length</code>.</li>
        <li><strong>Acessar índice inválido</strong>: ambos lançam <code>IndexOutOfRangeException</code>/<code>ArgumentOutOfRangeException</code>. Sempre cheque <code>i &lt; coll.Count</code> antes.</li>
        <li><strong>Modificar a List dentro de um <code>foreach</code></strong>: dispara <code>InvalidOperationException</code>. Use <code>for</code> reverso ou <code>RemoveAll</code>.</li>
        <li><strong>Trocar tipo do array</strong>: arrays são <em>covariantes</em> (<code>object[] o = new string[] &#123;...&#125;</code> compila), mas atribuir um <code>int</code> nele estoura em runtime. Prefira List sempre que possível.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Array tem tamanho fixo, memória contígua, propriedade <code>Length</code>.</li>
        <li>List&lt;T&gt; cresce dinamicamente, propriedade <code>Count</code> e <code>Capacity</code>.</li>
        <li>Acesso por índice é O(1) em ambos; <code>Add</code> é O(1) amortizado em List.</li>
        <li>Pré-alocar <code>Capacity</code> evita realocações caras.</li>
        <li>Use array para tamanhos fixos e perfomance; List para o dia a dia.</li>
      </ul>
    </PageContainer>
  );
}
