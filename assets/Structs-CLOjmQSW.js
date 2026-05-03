import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Structs: tipos por valor sob medida",subtitle:"Entenda quando e por que criar seus próprios value types — e os ganhos (e armadilhas) de performance que vêm junto.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:["Em C#, quando você cria uma ",e.jsx("code",{children:"class"}),", está criando um ",e.jsx("strong",{children:"tipo por referência"}),': as variáveis guardam um "endereço" para o objeto, e o objeto vive no ',e.jsx("em",{children:"heap"})," (uma área de memória administrada pelo coletor de lixo). Já uma ",e.jsx("strong",{children:"struct"})," é um ",e.jsx("strong",{children:"tipo por valor"}),": a variável carrega o conteúdo inteiro consigo, normalmente vivendo no ",e.jsx("em",{children:"stack"})," (uma pilha de memória rápida e descartada automaticamente). Pense numa class como o número de uma casa (você passa o endereço para todo mundo), e numa struct como uma cópia da planta da casa entregue em mãos."]}),e.jsx("h2",{children:"Declarando uma struct"}),e.jsxs("p",{children:["A sintaxe é quase idêntica à de uma classe — basta trocar ",e.jsx("code",{children:"class"})," por ",e.jsx("code",{children:"struct"}),". Structs típicas representam valores pequenos e indivisíveis: pontos no plano, dimensões, dinheiro, cor RGB, datas customizadas."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Uma struct simples representando um ponto 2D
public struct Ponto {
    public double X;
    public double Y;

    public Ponto(double x, double y) {
        X = x;
        Y = y;
    }

    public double DistanciaDaOrigem() => Math.Sqrt(X * X + Y * Y);

    public override string ToString() => $"({X}, {Y})";
}

class Programa {
    static void Main() {
        var p = new Ponto(3, 4);
        Console.WriteLine(p);                        // (3, 4)
        Console.WriteLine(p.DistanciaDaOrigem());    // 5
    }
}`})}),e.jsx("p",{children:"Tudo o que você sabe sobre métodos, propriedades e construtores em classes vale para structs. Mas há diferenças sutis e importantes que mudam o comportamento na prática."}),e.jsx("h2",{children:"Cópia de valor — a maior diferença"}),e.jsxs("p",{children:["Atribuir uma struct a outra variável ",e.jsx("strong",{children:"copia o conteúdo inteiro"}),". Modificar a cópia ",e.jsx("em",{children:"não"}),' afeta o original. Com classes, ao contrário, você apenas copia o endereço — duas variáveis apontam para o mesmo objeto, e mexer numa "vê" a mudança na outra.']}),e.jsx("pre",{children:e.jsx("code",{children:`var a = new Ponto(1, 1);
var b = a;          // cópia COMPLETA
b.X = 99;
Console.WriteLine(a.X);  // 1  — a não mudou
Console.WriteLine(b.X);  // 99

// Mesmo princípio ao passar para método:
void Mover(Ponto p) { p.X = 0; }   // p é uma cópia local
Mover(a);
Console.WriteLine(a.X);  // ainda 1!`})}),e.jsxs("p",{children:["Para ",e.jsx("em",{children:"realmente"})," mexer no original, é preciso usar ",e.jsx("code",{children:"ref"})," (passar por referência) ou tornar a struct mutável e devolver uma nova versão. Por isso, na prática, se você quer compartilhar e mutar, usa class; se quer um valor isolado e seguro, usa struct."]}),e.jsxs(a,{type:"warning",title:"Structs mutáveis são perigosas",children:["Quando você expõe uma struct via propriedade (",e.jsxs("code",{children:["public Ponto Pos ","{ get; }"]}),"), ",e.jsx("code",{children:"obj.Pos.X = 5;"})," modifica uma ",e.jsx("em",{children:"cópia temporária"})," e o C# avisa com erro. Para evitar bugs, declare suas structs como ",e.jsx("strong",{children:"readonly struct"})," e prefira métodos que devolvem novas instâncias."]}),e.jsx("h2",{children:"Structs não suportam herança"}),e.jsxs("p",{children:["Você não pode escrever ",e.jsx("code",{children:"struct PontoColorido : Ponto"}),". Structs sempre herdam de ",e.jsx("code",{children:"System.ValueType"})," (que herda de ",e.jsx("code",{children:"object"}),") e ponto. Isso não é arbitrário: o tamanho de um value type precisa ser conhecido em tempo de compilação para poder ser alocado no stack, e herança quebraria essa garantia. Ainda assim, structs ",e.jsx("em",{children:"podem"})," implementar ",e.jsx("strong",{children:"interfaces"}),", o que dá a flexibilidade necessária para a maioria dos casos."]}),e.jsx("pre",{children:e.jsx("code",{children:`public interface IFigura {
    double Area();
}

public readonly struct Circulo : IFigura {
    public double Raio { get; }
    public Circulo(double raio) => Raio = raio;
    public double Area() => Math.PI * Raio * Raio;
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"readonly struct"})," e ",e.jsx("code",{children:"readonly"})," em membros"]}),e.jsxs("p",{children:["Marcar a struct como ",e.jsx("code",{children:"readonly"}),' diz ao compilador: "nenhum membro vai modificar o estado". Isso permite otimizações (não é preciso copiar a struct ao chamar métodos), evita os bugs de mutabilidade descritos acima e documenta a intenção. Você também pode marcar métodos individuais com ',e.jsx("code",{children:"readonly"})," para liberar a otimização em structs mutáveis."]}),e.jsx("pre",{children:e.jsx("code",{children:`public readonly struct Dinheiro {
    public decimal Valor { get; }
    public string Moeda { get; }

    public Dinheiro(decimal valor, string moeda) {
        Valor = valor;
        Moeda = moeda;
    }

    // "Operações" devolvem NOVAS instâncias, nunca mutam
    public Dinheiro MaisJuros(decimal taxa)
        => new Dinheiro(Valor * (1 + taxa), Moeda);
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"ref struct"}),": o caso especial do Span<T>"]}),e.jsxs("p",{children:["Há uma variante poderosa chamada ",e.jsx("code",{children:"ref struct"}),". Ela tem uma regra extra: ",e.jsx("strong",{children:"nunca"})," pode ir para o heap. Não pode ser campo de classe, não pode ser ",e.jsx("em",{children:"boxed"}),", não pode ser capturada por ",e.jsx("em",{children:"lambda"}),", não pode entrar em coleção. Em troca, recebe garantias de tempo de vida que permitem coisas como ",e.jsx("code",{children:"Span<T>"}),' — uma "fatia" de memória contígua (array, stack, memória nativa) sem alocação extra.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Span<T> é um ref struct: aponta para uma região de memória
Span<int> numeros = stackalloc int[5] { 10, 20, 30, 40, 50 };
foreach (var n in numeros) Console.Write(n + " ");

// Slicing sem alocar nada novo
Span<int> meio = numeros.Slice(1, 3);   // {20, 30, 40}
meio[0] = 999;
Console.WriteLine(numeros[1]);          // 999 — mesma memória!`})}),e.jsxs("p",{children:["Você raramente ",e.jsx("em",{children:"declara"})," seus próprios ",e.jsx("code",{children:"ref struct"}),", mas usa ",e.jsx("code",{children:"Span<T>"})," e ",e.jsx("code",{children:"ReadOnlySpan<T>"})," o tempo todo em código de alta performance — análise de strings, parsing binário, manipulação de buffers."]}),e.jsx("h2",{children:"Quando usar struct em vez de class"}),e.jsxs("p",{children:["Não saia transformando suas classes em structs achando que vai ganhar performance — você pode acabar piorando, porque cópias grandes de valor custam caro. A regra prática (vinda do guia oficial da Microsoft) sugere usar ",e.jsx("code",{children:"struct"})," quando ",e.jsx("strong",{children:"todas"})," as condições abaixo são verdadeiras:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["O tipo representa logicamente um ",e.jsx("em",{children:"valor único"})," (como ",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"DateTime"}),")."]}),e.jsxs("li",{children:["É ",e.jsx("strong",{children:"pequeno"})," — geralmente até 16 bytes (mais ou menos 2 ponteiros)."]}),e.jsxs("li",{children:["É ",e.jsx("strong",{children:"imutável"}),"."]}),e.jsxs("li",{children:["Não será frequentemente ",e.jsx("em",{children:"boxed"})," (tratado como ",e.jsx("code",{children:"object"}),")."]})]}),e.jsxs("p",{children:["Se algum desses não vale, prefira ",e.jsx("code",{children:"class"})," ou ",e.jsx("code",{children:"record class"}),"."]}),e.jsxs(a,{type:"info",title:"Performance: o trade-off real",children:["Structs evitam alocação no heap (menos pressão sobre o coletor de lixo), mas pagam o custo de cópia em cada atribuição/passagem de parâmetro. Para tipos > 16 bytes, passar por ",e.jsx("code",{children:"in"})," ou ",e.jsx("code",{children:"ref readonly"})," elimina a cópia mantendo a semântica de valor."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar herdar de uma struct:"})," impossível. Use composição ou interfaces."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mutar struct via propriedade:"})," ",e.jsx("code",{children:'cliente.Endereco.Cep = "..."'})," compila se Endereco for class, mas falha (ou modifica cópia) se for struct."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Struct grande passada várias vezes:"})," cada chamada copia tudo. Use ",e.jsx("code",{children:"in"})," para passar por referência somente-leitura."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Struct em ",e.jsx("code",{children:"List<T>"})," e tentar editar via indexador:"]})," ",e.jsx("code",{children:"lista[0].X = 5;"})," dá erro porque o indexador devolve cópia."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Boxing acidental:"})," atribuir uma struct a uma variável ",e.jsx("code",{children:"object"})," ou interface aloca no heap silenciosamente — perde-se a vantagem de valor."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Structs são tipos por valor: copiadas inteiras a cada atribuição."}),e.jsx("li",{children:"Não suportam herança, mas implementam interfaces."}),e.jsxs("li",{children:["Prefira ",e.jsx("code",{children:"readonly struct"})," e devolva novas instâncias em vez de mutar."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ref struct"})," garante stack-only e habilita ",e.jsx("code",{children:"Span<T>"})," de alta performance."]}),e.jsx("li",{children:"Use struct quando o tipo é pequeno, imutável e representa um valor lógico único."}),e.jsxs("li",{children:["Para evitar cópias caras de structs grandes, passe por ",e.jsx("code",{children:"in"})," ou ",e.jsx("code",{children:"ref readonly"}),"."]})]})]})}export{i as default};
