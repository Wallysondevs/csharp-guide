import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Arrays() {
  return (
    <PageContainer
      title="Arrays: tamanho fixo, multidimensionais e jagged"
      subtitle="A coleção mais antiga e fundamental da linguagem: como guardar vários valores do mesmo tipo de forma eficiente."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Um <strong>array</strong> (ou <em>vetor</em>, em português) é uma fileira contígua de "caixinhas" na memória, todas do mesmo tipo, numeradas a partir de zero. Pense numa cartela de ovos: você sabe exatamente onde está cada ovo pelo número do espaço, e todos têm o mesmo tamanho. Em C#, arrays existem desde a versão 1.0 e ainda são a base sobre a qual coleções como <code>List&lt;T&gt;</code> são construídas. Saber declarar, indexar, percorrer e ordenar arrays é pré-requisito para qualquer programa não-trivial.
      </p>

      <h2>Declaração e inicialização</h2>
      <p>
        A sintaxe é <code>tipo[] nome</code>. Você precisa decidir o <strong>tamanho</strong> ao criar o array, e esse tamanho não muda mais (ao contrário de listas dinâmicas).
      </p>
      <pre><code>{`// Cria array com 5 inteiros, todos iniciados em 0
int[] numeros = new int[5];

// Cria e inicializa em uma linha
int[] primos = new int[] { 2, 3, 5, 7, 11 };

// Forma curta com inicializador
int[] semanasDoMes = { 1, 2, 3, 4 };

// var também funciona, desde que o inicializador exista
var nomes = new[] { "Ana", "Bruno", "Carla" };

// Acessar e modificar
numeros[0] = 10;
numeros[4] = 50;
Console.WriteLine(numeros[0]);    // 10
Console.WriteLine(numeros.Length); // 5`}</code></pre>

      <AlertBox type="warning" title="Índices começam em zero">
        Em um array de tamanho 5, os índices válidos são 0, 1, 2, 3 e 4. Tentar acessar <code>numeros[5]</code> lança <code>IndexOutOfRangeException</code>. Sempre use <code>numeros.Length - 1</code> como o último índice válido.
      </AlertBox>

      <h2>Iterando: <code>for</code> vs <code>foreach</code></h2>
      <p>
        Use <code>foreach</code> quando só precisa do <em>valor</em>. Use <code>for</code> quando precisa do <em>índice</em> também (para modificar o array, comparar com posição anterior, etc.).
      </p>
      <pre><code>{`int[] notas = { 7, 8, 6, 9, 10 };

// foreach: leitura simples
foreach (int n in notas) {
    Console.WriteLine(n);
}

// for: precisa do índice para modificar
for (int i = 0; i < notas.Length; i++) {
    notas[i] += 1;   // bônus de 1 ponto
}

// Soma e média
int soma = 0;
foreach (int n in notas) soma += n;
double media = (double)soma / notas.Length;
Console.WriteLine($"Média: {media:F2}");`}</code></pre>

      <h2>Métodos da classe <code>Array</code></h2>
      <p>
        A classe estática <code>System.Array</code> oferece operações comuns: ordenar, inverter, buscar, copiar.
      </p>
      <pre><code>{`int[] valores = { 30, 10, 50, 20, 40 };

Array.Sort(valores);
// agora: 10, 20, 30, 40, 50

Array.Reverse(valores);
// agora: 50, 40, 30, 20, 10

int idx = Array.IndexOf(valores, 30);   // 2
bool tem = Array.Exists(valores, n => n > 100);  // false

int[] copia = new int[valores.Length];
Array.Copy(valores, copia, valores.Length);

// Preencher com valor padrão
int[] zeros = new int[10];
Array.Fill(zeros, -1);  // [-1, -1, -1, ...]`}</code></pre>

      <h2>Arrays multidimensionais (retangulares)</h2>
      <p>
        Para representar matrizes (planilhas, tabuleiros), use a sintaxe <code>tipo[,]</code> com vírgula entre os colchetes. O array é um único bloco contíguo, com todas as linhas do mesmo tamanho.
      </p>
      <pre><code>{`// Tabuleiro 3x3
int[,] tabuleiro = new int[3, 3];

// Inicializado:
int[,] matriz = {
    { 1, 2, 3 },
    { 4, 5, 6 },
    { 7, 8, 9 }
};

// Acessar
int centro = matriz[1, 1];   // 5

// Iterar
for (int i = 0; i < matriz.GetLength(0); i++) {
    for (int j = 0; j < matriz.GetLength(1); j++) {
        Console.Write($"{matriz[i, j]}\\t");
    }
    Console.WriteLine();
}

// 3D também é possível
int[,,] cubo = new int[2, 3, 4];`}</code></pre>
      <p>
        <code>matriz.Length</code> em multidimensional dá o <strong>total</strong> de elementos (no caso, 9). Use <code>GetLength(dimensao)</code> para descobrir o tamanho de uma dimensão específica.
      </p>

      <h2>Arrays jagged (de arrays)</h2>
      <p>
        Quando cada "linha" pode ter um tamanho diferente, use arrays <strong>jagged</strong> — um array cujos elementos são, eles mesmos, arrays. A sintaxe é <code>tipo[][]</code>.
      </p>
      <pre><code>{`// Cada aluno tem um número diferente de notas
int[][] notas = new int[3][];
notas[0] = new int[] { 8, 9 };
notas[1] = new int[] { 6, 7, 5, 10 };
notas[2] = new int[] { 9 };

// Acesso é com colchetes separados:
int n = notas[1][2];   // 5

// Iteração:
foreach (int[] linha in notas) {
    foreach (int valor in linha) {
        Console.Write($"{valor} ");
    }
    Console.WriteLine();
}`}</code></pre>

      <AlertBox type="info" title="Multidimensional vs jagged">
        <strong>Multidimensional</strong> (<code>int[,]</code>): bloco contíguo, todas linhas com mesmo tamanho, mais memória-eficiente, levemente mais lento de acessar em alguns casos. <strong>Jagged</strong> (<code>int[][]</code>): array de arrays, linhas independentes, mais flexível, geralmente mais rápido em iteração. A escolha depende do problema.
      </AlertBox>

      <h2>Ranges e Indexers (C# 8+)</h2>
      <p>
        C# moderno permite "fatiar" um array com a sintaxe <code>arr[a..b]</code> e contar do fim com <code>^n</code>.
      </p>
      <pre><code>{`int[] a = { 10, 20, 30, 40, 50 };

int ultimo = a[^1];        // 50 — um a partir do fim
int penultimo = a[^2];     // 40

int[] meio = a[1..4];      // {20, 30, 40} — índices 1 a 3 (4 exclusivo)
int[] doInicio = a[..3];   // {10, 20, 30}
int[] doFim = a[2..];      // {30, 40, 50}
int[] tudo = a[..];        // cópia completa`}</code></pre>

      <h2>Quando NÃO usar array (e usar List)</h2>
      <p>
        Arrays têm <strong>tamanho fixo</strong>. Se você precisa adicionar e remover elementos com frequência, use <code>List&lt;T&gt;</code>, que é uma lista dinâmica construída sobre arrays e cresce automaticamente.
      </p>
      <pre><code>{`// Use array quando o tamanho é conhecido e constante:
int[] meses = new int[12];

// Use List quando o tamanho varia:
var carrinho = new List<string>();
carrinho.Add("Pão");
carrinho.Add("Leite");
carrinho.Remove("Pão");
Console.WriteLine(carrinho.Count);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>IndexOutOfRangeException</code>:</strong> tentar acessar <code>arr[arr.Length]</code>. Lembre que vai de 0 a <code>Length - 1</code>.</li>
        <li><strong>Confundir <code>Length</code> com <code>Count</code>:</strong> arrays usam <code>Length</code>, listas usam <code>Count</code>. Strings também usam <code>Length</code>.</li>
        <li><strong>Tentar redimensionar:</strong> arrays têm tamanho fixo. Use <code>List&lt;T&gt;</code> ou <code>Array.Resize</code> (que cria um novo array).</li>
        <li><strong>Esperar que cópia seja independente:</strong> <code>int[] b = a;</code> faz <code>b</code> apontar para o mesmo array. Use <code>(int[])a.Clone()</code> para uma cópia real.</li>
        <li><strong>Misturar <code>[,]</code> e <code>[][]</code>:</strong> são tipos diferentes; um não vira o outro automaticamente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Arrays têm tamanho fixo definido na criação; índices vão de 0 a <code>Length - 1</code>.</li>
        <li><code>tipo[,]</code> é multidimensional retangular; <code>tipo[][]</code> é jagged (linhas independentes).</li>
        <li><code>Array.Sort</code>, <code>Array.IndexOf</code>, <code>Array.Reverse</code> resolvem operações comuns.</li>
        <li><code>foreach</code> para ler; <code>for</code> quando precisa do índice ou modificar.</li>
        <li>Ranges <code>arr[a..b]</code> e índices <code>^n</code> facilitam fatiamento.</li>
        <li>Para tamanho variável, prefira <code>List&lt;T&gt;</code>.</li>
      </ul>
    </PageContainer>
  );
}
