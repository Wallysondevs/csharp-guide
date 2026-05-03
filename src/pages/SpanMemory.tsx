import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SpanMemory() {
  return (
    <PageContainer
      title="Span<T> e Memory<T>: zero-copy de alta performance"
      subtitle="Tipos modernos para fatiar buffers sem alocar memória — a base da performance do .NET moderno."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine que você tem uma régua de 1 metro e quer trabalhar com o pedaço entre 30 cm e 50 cm. A forma "ingênua" seria <em>cortar</em> a régua e fazer uma nova de 20 cm — desperdício de material. A forma inteligente é só apontar: "minha região vai do 30 ao 50". É isso que <strong>Span&lt;T&gt;</strong> faz com memória: oferece uma <em>visão</em> sobre um pedaço de buffer existente, sem copiar nem alocar nada novo. Esse conceito é a espinha dorsal da performance do .NET moderno (parsing JSON, networking, strings) e este capítulo vai desmistificá-lo.
      </p>

      <h2>O problema que Span resolve</h2>
      <p>
        Antes de Span, fatiar uma string ou array em C# sempre alocava. Cada <code>Substring</code>, cada <code>string.Split</code>, cada <code>array[i..j]</code> criava uma cópia nova no <strong>heap</strong> (a área de memória gerenciada pelo Garbage Collector). Em código quente, isso pressiona o GC e mata performance.
      </p>
      <pre><code>{`string entrada = "user=ana;age=28;city=sp";

// Forma antiga: cada Substring aloca uma string nova
string[] partes = entrada.Split(';'); // 3 strings novas + 1 array
foreach (var p in partes)
{
    int eq = p.IndexOf('=');
    string chave = p.Substring(0, eq);   // ALOCA
    string valor = p.Substring(eq + 1);  // ALOCA
}`}</code></pre>

      <h2>O que é Span&lt;T&gt;?</h2>
      <p>
        <code>Span&lt;T&gt;</code> é um <strong>ref struct</strong> — um tipo de valor especial que <em>só pode viver na pilha</em> (stack), nunca no heap. Ele guarda dois campos: um ponteiro para o início de uma região e um tamanho. Não possui a memória; apenas a observa.
      </p>
      <pre><code>{`int[] numeros = { 10, 20, 30, 40, 50 };

// Cria um Span sobre o array inteiro
Span<int> tudo = numeros.AsSpan();

// Slicing: ZERO alocação, só ajusta ponteiro/tamanho
Span<int> meio = tudo.Slice(start: 1, length: 3); // {20,30,40}
Span<int> meio2 = tudo[1..4];                     // sintaxe de range

meio[0] = 999;
Console.WriteLine(numeros[1]); // 999! Span aponta para o original`}</code></pre>

      <AlertBox type="info" title="O que é ‘ref struct’?">
        Um <code>ref struct</code> é um struct que o compilador garante que <em>nunca</em> vai parar no heap. Não pode virar campo de classe, não pode ser capturado por lambda, não pode ser usado em <code>async</code>. Essas restrições parecem chatas, mas são o que permitem ao Span apontar para memória da stack ou de buffers nativos com segurança.
      </AlertBox>

      <h2>Span sobre strings: ReadOnlySpan&lt;char&gt;</h2>
      <p>
        Strings em C# são imutáveis. Para fatiá-las sem alocar, existe <code>ReadOnlySpan&lt;char&gt;</code>. APIs modernas (parsing de número, JSON, datas) aceitam ReadOnlySpan diretamente.
      </p>
      <pre><code>{`string texto = "12345 abc";
ReadOnlySpan<char> span = texto.AsSpan();

// Pega só os 5 primeiros chars, sem alocar
ReadOnlySpan<char> numero = span.Slice(0, 5);

// int.Parse aceita ReadOnlySpan<char> — zero alocação!
int valor = int.Parse(numero);
Console.WriteLine(valor); // 12345

// Comparação de pedaço sem Substring
bool igual = span.Slice(0, 5).SequenceEqual("12345".AsSpan());`}</code></pre>

      <h2>stackalloc: buffer na pilha</h2>
      <p>
        Combinado com <code>stackalloc</code>, Span permite alocar buffers temporários <em>na stack</em> — extremamente rápido e sem trabalho para o GC.
      </p>
      <pre><code>{`// Aloca 64 ints direto na pilha (256 bytes)
Span<int> buffer = stackalloc int[64];

for (int i = 0; i < buffer.Length; i++)
    buffer[i] = i * i;

int soma = 0;
foreach (var x in buffer) soma += x;
Console.WriteLine(soma);

// Quando a função retorna, a memória "some" sozinha — sem GC.
// Cuidado: não use stackalloc para tamanhos grandes (>1 KB)
// para evitar StackOverflowException.`}</code></pre>

      <AlertBox type="warning" title="Limites do stackalloc">
        A pilha tem normalmente 1 MB por thread. Alocar buffers grandes pode estourá-la (StackOverflowException, sem chance de recuperação). Mantenha <code>stackalloc</code> para buffers pequenos (algumas centenas de bytes).
      </AlertBox>

      <h2>Memory&lt;T&gt;: quando Span não cabe</h2>
      <p>
        As restrições de ref struct impedem Span em código <code>async</code> ou em campos de classe. Para esses casos existe <code>Memory&lt;T&gt;</code>: também é uma "vista" sobre memória, mas pode viver no heap. Você converte para Span apenas quando vai operar.
      </p>
      <pre><code>{`async Task ProcessarAsync(Memory<byte> dados)
{
    // 'await' impossível com Span; com Memory funciona
    await Task.Delay(10);

    // Quando é hora de trabalhar, vire um Span
    Span<byte> trabalho = dados.Span;
    for (int i = 0; i < trabalho.Length; i++)
        trabalho[i] = (byte)(trabalho[i] ^ 0xFF);
}

byte[] arr = new byte[100];
await ProcessarAsync(arr.AsMemory());`}</code></pre>

      <h2>Caso real: parser de CSV sem alocação</h2>
      <p>
        Veja como ler "10,20,30" e somar os números sem alocar nenhuma string nova:
      </p>
      <pre><code>{`int SomarCsv(ReadOnlySpan<char> linha)
{
    int total = 0;
    while (!linha.IsEmpty)
    {
        int virgula = linha.IndexOf(',');
        ReadOnlySpan<char> token = virgula >= 0
            ? linha.Slice(0, virgula)
            : linha;

        total += int.Parse(token);

        linha = virgula >= 0 ? linha.Slice(virgula + 1) : default;
    }
    return total;
}

int s = SomarCsv("10,20,30,40".AsSpan());
Console.WriteLine(s); // 100`}</code></pre>

      <h2>Quando NÃO usar Span</h2>
      <p>
        Span é uma ferramenta de otimização. Não use em código não-crítico só porque "é moderno". Você paga em complexidade: regras de ref struct, mais cuidado com tempo de vida do buffer, código menos fluído. Aplique em <em>hot paths</em> de parsing, networking, serialização — onde alocações importam.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar usar Span em <code>async</code></strong>: o compilador reclama porque ref struct não pode atravessar await. Use <code>Memory&lt;T&gt;</code> e converta para Span dentro do método sync.</li>
        <li><strong>Guardar Span em campo de classe</strong>: proibido pelo compilador. Use Memory.</li>
        <li><strong>Modificar buffer enquanto há Span apontando</strong>: ex: passar <code>List.AsSpan()</code> e depois fazer <code>list.Add</code>, que pode realocar e invalidar o Span.</li>
        <li><strong>stackalloc com tamanho variável grande</strong>: risco de StackOverflowException — sempre limite e use <code>ArrayPool&lt;T&gt;</code> para tamanhos maiores.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Span&lt;T&gt; é uma vista sobre memória — sem alocação.</li>
        <li>É <code>ref struct</code>: só vive na stack, com restrições rígidas.</li>
        <li>Slicing (<code>Slice</code> ou <code>span[a..b]</code>) é zero-cost.</li>
        <li><code>stackalloc</code> + Span = buffer rápido sem GC.</li>
        <li>Para async ou campo de classe, use <code>Memory&lt;T&gt;</code>.</li>
        <li>APIs modernas (Parse, Json, IO) aceitam Span nativamente.</li>
      </ul>
    </PageContainer>
  );
}
