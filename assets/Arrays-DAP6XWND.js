import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(a,{title:"Arrays: tamanho fixo, multidimensionais e jagged",subtitle:"A coleção mais antiga e fundamental da linguagem: como guardar vários valores do mesmo tipo de forma eficiente.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"array"})," (ou ",e.jsx("em",{children:"vetor"}),', em português) é uma fileira contígua de "caixinhas" na memória, todas do mesmo tipo, numeradas a partir de zero. Pense numa cartela de ovos: você sabe exatamente onde está cada ovo pelo número do espaço, e todos têm o mesmo tamanho. Em C#, arrays existem desde a versão 1.0 e ainda são a base sobre a qual coleções como ',e.jsx("code",{children:"List<T>"})," são construídas. Saber declarar, indexar, percorrer e ordenar arrays é pré-requisito para qualquer programa não-trivial."]}),e.jsx("h2",{children:"Declaração e inicialização"}),e.jsxs("p",{children:["A sintaxe é ",e.jsx("code",{children:"tipo[] nome"}),". Você precisa decidir o ",e.jsx("strong",{children:"tamanho"})," ao criar o array, e esse tamanho não muda mais (ao contrário de listas dinâmicas)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cria array com 5 inteiros, todos iniciados em 0
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
Console.WriteLine(numeros.Length); // 5`})}),e.jsxs(r,{type:"warning",title:"Índices começam em zero",children:["Em um array de tamanho 5, os índices válidos são 0, 1, 2, 3 e 4. Tentar acessar ",e.jsx("code",{children:"numeros[5]"})," lança ",e.jsx("code",{children:"IndexOutOfRangeException"}),". Sempre use ",e.jsx("code",{children:"numeros.Length - 1"})," como o último índice válido."]}),e.jsxs("h2",{children:["Iterando: ",e.jsx("code",{children:"for"})," vs ",e.jsx("code",{children:"foreach"})]}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"foreach"})," quando só precisa do ",e.jsx("em",{children:"valor"}),". Use ",e.jsx("code",{children:"for"})," quando precisa do ",e.jsx("em",{children:"índice"})," também (para modificar o array, comparar com posição anterior, etc.)."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] notas = { 7, 8, 6, 9, 10 };

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
Console.WriteLine($"Média: {media:F2}");`})}),e.jsxs("h2",{children:["Métodos da classe ",e.jsx("code",{children:"Array"})]}),e.jsxs("p",{children:["A classe estática ",e.jsx("code",{children:"System.Array"})," oferece operações comuns: ordenar, inverter, buscar, copiar."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] valores = { 30, 10, 50, 20, 40 };

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
Array.Fill(zeros, -1);  // [-1, -1, -1, ...]`})}),e.jsx("h2",{children:"Arrays multidimensionais (retangulares)"}),e.jsxs("p",{children:["Para representar matrizes (planilhas, tabuleiros), use a sintaxe ",e.jsx("code",{children:"tipo[,]"})," com vírgula entre os colchetes. O array é um único bloco contíguo, com todas as linhas do mesmo tamanho."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Tabuleiro 3x3
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
int[,,] cubo = new int[2, 3, 4];`})}),e.jsxs("p",{children:[e.jsx("code",{children:"matriz.Length"})," em multidimensional dá o ",e.jsx("strong",{children:"total"})," de elementos (no caso, 9). Use ",e.jsx("code",{children:"GetLength(dimensao)"})," para descobrir o tamanho de uma dimensão específica."]}),e.jsx("h2",{children:"Arrays jagged (de arrays)"}),e.jsxs("p",{children:['Quando cada "linha" pode ter um tamanho diferente, use arrays ',e.jsx("strong",{children:"jagged"})," — um array cujos elementos são, eles mesmos, arrays. A sintaxe é ",e.jsx("code",{children:"tipo[][]"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cada aluno tem um número diferente de notas
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
}`})}),e.jsxs(r,{type:"info",title:"Multidimensional vs jagged",children:[e.jsx("strong",{children:"Multidimensional"})," (",e.jsx("code",{children:"int[,]"}),"): bloco contíguo, todas linhas com mesmo tamanho, mais memória-eficiente, levemente mais lento de acessar em alguns casos. ",e.jsx("strong",{children:"Jagged"})," (",e.jsx("code",{children:"int[][]"}),"): array de arrays, linhas independentes, mais flexível, geralmente mais rápido em iteração. A escolha depende do problema."]}),e.jsx("h2",{children:"Ranges e Indexers (C# 8+)"}),e.jsxs("p",{children:['C# moderno permite "fatiar" um array com a sintaxe ',e.jsx("code",{children:"arr[a..b]"})," e contar do fim com ",e.jsx("code",{children:"^n"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] a = { 10, 20, 30, 40, 50 };

int ultimo = a[^1];        // 50 — um a partir do fim
int penultimo = a[^2];     // 40

int[] meio = a[1..4];      // {20, 30, 40} — índices 1 a 3 (4 exclusivo)
int[] doInicio = a[..3];   // {10, 20, 30}
int[] doFim = a[2..];      // {30, 40, 50}
int[] tudo = a[..];        // cópia completa`})}),e.jsx("h2",{children:"Quando NÃO usar array (e usar List)"}),e.jsxs("p",{children:["Arrays têm ",e.jsx("strong",{children:"tamanho fixo"}),". Se você precisa adicionar e remover elementos com frequência, use ",e.jsx("code",{children:"List<T>"}),", que é uma lista dinâmica construída sobre arrays e cresce automaticamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Use array quando o tamanho é conhecido e constante:
int[] meses = new int[12];

// Use List quando o tamanho varia:
var carrinho = new List<string>();
carrinho.Add("Pão");
carrinho.Add("Leite");
carrinho.Remove("Pão");
Console.WriteLine(carrinho.Count);`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"IndexOutOfRangeException"}),":"]})," tentar acessar ",e.jsx("code",{children:"arr[arr.Length]"}),". Lembre que vai de 0 a ",e.jsx("code",{children:"Length - 1"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Length"})," com ",e.jsx("code",{children:"Count"}),":"]})," arrays usam ",e.jsx("code",{children:"Length"}),", listas usam ",e.jsx("code",{children:"Count"}),". Strings também usam ",e.jsx("code",{children:"Length"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar redimensionar:"})," arrays têm tamanho fixo. Use ",e.jsx("code",{children:"List<T>"})," ou ",e.jsx("code",{children:"Array.Resize"})," (que cria um novo array)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar que cópia seja independente:"})," ",e.jsx("code",{children:"int[] b = a;"})," faz ",e.jsx("code",{children:"b"})," apontar para o mesmo array. Use ",e.jsx("code",{children:"(int[])a.Clone()"})," para uma cópia real."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"[,]"})," e ",e.jsx("code",{children:"[][]"}),":"]})," são tipos diferentes; um não vira o outro automaticamente."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Arrays têm tamanho fixo definido na criação; índices vão de 0 a ",e.jsx("code",{children:"Length - 1"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"tipo[,]"})," é multidimensional retangular; ",e.jsx("code",{children:"tipo[][]"})," é jagged (linhas independentes)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Array.Sort"}),", ",e.jsx("code",{children:"Array.IndexOf"}),", ",e.jsx("code",{children:"Array.Reverse"})," resolvem operações comuns."]}),e.jsxs("li",{children:[e.jsx("code",{children:"foreach"})," para ler; ",e.jsx("code",{children:"for"})," quando precisa do índice ou modificar."]}),e.jsxs("li",{children:["Ranges ",e.jsx("code",{children:"arr[a..b]"})," e índices ",e.jsx("code",{children:"^n"})," facilitam fatiamento."]}),e.jsxs("li",{children:["Para tamanho variável, prefira ",e.jsx("code",{children:"List<T>"}),"."]})]})]})}export{o as default};
