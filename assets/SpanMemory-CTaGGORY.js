import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"Span<T> e Memory<T>: zero-copy de alta performance",subtitle:"Tipos modernos para fatiar buffers sem alocar memória — a base da performance do .NET moderno.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs("p",{children:['Imagine que você tem uma régua de 1 metro e quer trabalhar com o pedaço entre 30 cm e 50 cm. A forma "ingênua" seria ',e.jsx("em",{children:"cortar"}),' a régua e fazer uma nova de 20 cm — desperdício de material. A forma inteligente é só apontar: "minha região vai do 30 ao 50". É isso que ',e.jsx("strong",{children:"Span<T>"})," faz com memória: oferece uma ",e.jsx("em",{children:"visão"})," sobre um pedaço de buffer existente, sem copiar nem alocar nada novo. Esse conceito é a espinha dorsal da performance do .NET moderno (parsing JSON, networking, strings) e este capítulo vai desmistificá-lo."]}),e.jsx("h2",{children:"O problema que Span resolve"}),e.jsxs("p",{children:["Antes de Span, fatiar uma string ou array em C# sempre alocava. Cada ",e.jsx("code",{children:"Substring"}),", cada ",e.jsx("code",{children:"string.Split"}),", cada ",e.jsx("code",{children:"array[i..j]"})," criava uma cópia nova no ",e.jsx("strong",{children:"heap"})," (a área de memória gerenciada pelo Garbage Collector). Em código quente, isso pressiona o GC e mata performance."]}),e.jsx("pre",{children:e.jsx("code",{children:`string entrada = "user=ana;age=28;city=sp";

// Forma antiga: cada Substring aloca uma string nova
string[] partes = entrada.Split(';'); // 3 strings novas + 1 array
foreach (var p in partes)
{
    int eq = p.IndexOf('=');
    string chave = p.Substring(0, eq);   // ALOCA
    string valor = p.Substring(eq + 1);  // ALOCA
}`})}),e.jsx("h2",{children:"O que é Span<T>?"}),e.jsxs("p",{children:[e.jsx("code",{children:"Span<T>"})," é um ",e.jsx("strong",{children:"ref struct"})," — um tipo de valor especial que ",e.jsx("em",{children:"só pode viver na pilha"})," (stack), nunca no heap. Ele guarda dois campos: um ponteiro para o início de uma região e um tamanho. Não possui a memória; apenas a observa."]}),e.jsx("pre",{children:e.jsx("code",{children:`int[] numeros = { 10, 20, 30, 40, 50 };

// Cria um Span sobre o array inteiro
Span<int> tudo = numeros.AsSpan();

// Slicing: ZERO alocação, só ajusta ponteiro/tamanho
Span<int> meio = tudo.Slice(start: 1, length: 3); // {20,30,40}
Span<int> meio2 = tudo[1..4];                     // sintaxe de range

meio[0] = 999;
Console.WriteLine(numeros[1]); // 999! Span aponta para o original`})}),e.jsxs(a,{type:"info",title:"O que é ‘ref struct’?",children:["Um ",e.jsx("code",{children:"ref struct"})," é um struct que o compilador garante que ",e.jsx("em",{children:"nunca"})," vai parar no heap. Não pode virar campo de classe, não pode ser capturado por lambda, não pode ser usado em ",e.jsx("code",{children:"async"}),". Essas restrições parecem chatas, mas são o que permitem ao Span apontar para memória da stack ou de buffers nativos com segurança."]}),e.jsx("h2",{children:"Span sobre strings: ReadOnlySpan<char>"}),e.jsxs("p",{children:["Strings em C# são imutáveis. Para fatiá-las sem alocar, existe ",e.jsx("code",{children:"ReadOnlySpan<char>"}),". APIs modernas (parsing de número, JSON, datas) aceitam ReadOnlySpan diretamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`string texto = "12345 abc";
ReadOnlySpan<char> span = texto.AsSpan();

// Pega só os 5 primeiros chars, sem alocar
ReadOnlySpan<char> numero = span.Slice(0, 5);

// int.Parse aceita ReadOnlySpan<char> — zero alocação!
int valor = int.Parse(numero);
Console.WriteLine(valor); // 12345

// Comparação de pedaço sem Substring
bool igual = span.Slice(0, 5).SequenceEqual("12345".AsSpan());`})}),e.jsx("h2",{children:"stackalloc: buffer na pilha"}),e.jsxs("p",{children:["Combinado com ",e.jsx("code",{children:"stackalloc"}),", Span permite alocar buffers temporários ",e.jsx("em",{children:"na stack"})," — extremamente rápido e sem trabalho para o GC."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Aloca 64 ints direto na pilha (256 bytes)
Span<int> buffer = stackalloc int[64];

for (int i = 0; i < buffer.Length; i++)
    buffer[i] = i * i;

int soma = 0;
foreach (var x in buffer) soma += x;
Console.WriteLine(soma);

// Quando a função retorna, a memória "some" sozinha — sem GC.
// Cuidado: não use stackalloc para tamanhos grandes (>1 KB)
// para evitar StackOverflowException.`})}),e.jsxs(a,{type:"warning",title:"Limites do stackalloc",children:["A pilha tem normalmente 1 MB por thread. Alocar buffers grandes pode estourá-la (StackOverflowException, sem chance de recuperação). Mantenha ",e.jsx("code",{children:"stackalloc"})," para buffers pequenos (algumas centenas de bytes)."]}),e.jsx("h2",{children:"Memory<T>: quando Span não cabe"}),e.jsxs("p",{children:["As restrições de ref struct impedem Span em código ",e.jsx("code",{children:"async"})," ou em campos de classe. Para esses casos existe ",e.jsx("code",{children:"Memory<T>"}),': também é uma "vista" sobre memória, mas pode viver no heap. Você converte para Span apenas quando vai operar.']}),e.jsx("pre",{children:e.jsx("code",{children:`async Task ProcessarAsync(Memory<byte> dados)
{
    // 'await' impossível com Span; com Memory funciona
    await Task.Delay(10);

    // Quando é hora de trabalhar, vire um Span
    Span<byte> trabalho = dados.Span;
    for (int i = 0; i < trabalho.Length; i++)
        trabalho[i] = (byte)(trabalho[i] ^ 0xFF);
}

byte[] arr = new byte[100];
await ProcessarAsync(arr.AsMemory());`})}),e.jsx("h2",{children:"Caso real: parser de CSV sem alocação"}),e.jsx("p",{children:'Veja como ler "10,20,30" e somar os números sem alocar nenhuma string nova:'}),e.jsx("pre",{children:e.jsx("code",{children:`int SomarCsv(ReadOnlySpan<char> linha)
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
Console.WriteLine(s); // 100`})}),e.jsx("h2",{children:"Quando NÃO usar Span"}),e.jsxs("p",{children:['Span é uma ferramenta de otimização. Não use em código não-crítico só porque "é moderno". Você paga em complexidade: regras de ref struct, mais cuidado com tempo de vida do buffer, código menos fluído. Aplique em ',e.jsx("em",{children:"hot paths"})," de parsing, networking, serialização — onde alocações importam."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar usar Span em ",e.jsx("code",{children:"async"})]}),": o compilador reclama porque ref struct não pode atravessar await. Use ",e.jsx("code",{children:"Memory<T>"})," e converta para Span dentro do método sync."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Guardar Span em campo de classe"}),": proibido pelo compilador. Use Memory."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar buffer enquanto há Span apontando"}),": ex: passar ",e.jsx("code",{children:"List.AsSpan()"})," e depois fazer ",e.jsx("code",{children:"list.Add"}),", que pode realocar e invalidar o Span."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"stackalloc com tamanho variável grande"}),": risco de StackOverflowException — sempre limite e use ",e.jsx("code",{children:"ArrayPool<T>"})," para tamanhos maiores."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Span<T> é uma vista sobre memória — sem alocação."}),e.jsxs("li",{children:["É ",e.jsx("code",{children:"ref struct"}),": só vive na stack, com restrições rígidas."]}),e.jsxs("li",{children:["Slicing (",e.jsx("code",{children:"Slice"})," ou ",e.jsx("code",{children:"span[a..b]"}),") é zero-cost."]}),e.jsxs("li",{children:[e.jsx("code",{children:"stackalloc"})," + Span = buffer rápido sem GC."]}),e.jsxs("li",{children:["Para async ou campo de classe, use ",e.jsx("code",{children:"Memory<T>"}),"."]}),e.jsx("li",{children:"APIs modernas (Parse, Json, IO) aceitam Span nativamente."})]})]})}export{n as default};
