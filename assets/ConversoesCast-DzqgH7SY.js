import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(i,{title:"Conversões e casting de tipos",subtitle:"Como passar um valor de um tipo para outro com segurança: implícito, explícito, Parse, TryParse, as, is e boxing.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine que você tem uma jarra de água (um tipo) e quer transferir o conteúdo para um copo (outro tipo). Se o copo é maior, basta despejar — não há risco de transbordar. Mas se o copo é menor, você precisa ",e.jsx("em",{children:"decidir conscientemente"}),' que está disposto a perder água. C#, sendo uma linguagem fortemente tipada, formaliza essa ideia: conversões "seguras" (sem perda) acontecem automaticamente; conversões "arriscadas" exigem que você as escreva explicitamente. Este capítulo cobre todas as ferramentas para converter entre tipos sem dor de cabeça.']}),e.jsx("h2",{children:"Conversão implícita: segura e silenciosa"}),e.jsx("p",{children:'Quando o tipo de destino é "maior" do que o de origem (cabe sem perda), o compilador faz a conversão sozinho. Funciona para inteiros menores indo para maiores, e de inteiro para ponto flutuante.'}),e.jsx("pre",{children:e.jsx("code",{children:`int i = 100;
long l = i;          // int (32 bits) cabe num long (64 bits): OK
double d = i;        // int vira double sem perder precisão: OK
float f = l;         // long vira float (com possível perda mínima): OK

byte b = 10;
int n = b;           // byte (8 bits) cabe num int: OK`})}),e.jsx("h2",{children:'Conversão explícita (cast): "eu sei o que estou fazendo"'}),e.jsxs("p",{children:["Quando o destino é menor ou tem natureza diferente, você precisa fazer um ",e.jsx("strong",{children:"cast"}),": prefixar o valor com o tipo entre parênteses. O compilador então confia em você — mas o resultado pode perder informação."]}),e.jsx("pre",{children:e.jsx("code",{children:`double pi = 3.14159;
int truncado = (int)pi;          // 3 (descarta a parte fracionária)

long grande = 5_000_000_000L;
int pequeno = (int)grande;       // overflow! Resultado imprevisível

// Em modo checked, dá exceção:
checked {
    int x = (int)grande;         // OverflowException
}`})}),e.jsxs(o,{type:"warning",title:"Cast não arredonda",children:[e.jsx("code",{children:"(int)2.9"})," dá ",e.jsx("code",{children:"2"}),", não ",e.jsx("code",{children:"3"}),". Para arredondar de verdade, use ",e.jsx("code",{children:"Math.Round"}),", ",e.jsx("code",{children:"Math.Floor"})," ou ",e.jsx("code",{children:"Math.Ceiling"}),"."]}),e.jsxs("h2",{children:["De string para número: ",e.jsx("code",{children:"Parse"})," vs ",e.jsx("code",{children:"TryParse"})]}),e.jsxs("p",{children:["Casting (",e.jsx("code",{children:"(int)"}),") só funciona entre tipos numéricos compatíveis — não converte uma ",e.jsx("code",{children:"string"})," em ",e.jsx("code",{children:"int"}),". Para isso, há métodos especializados."]}),e.jsx("pre",{children:e.jsx("code",{children:`string entrada = "42";

// Parse: lança FormatException se a string for inválida
int n1 = int.Parse(entrada);
double d1 = double.Parse("3.14", System.Globalization.CultureInfo.InvariantCulture);

// TryParse: NÃO lança exceção, devolve bool indicando sucesso.
// Sempre prefira esta forma quando o input vier do usuário.
if (int.TryParse(entrada, out int valor)) {
    Console.WriteLine($"Convertido: {valor}");
} else {
    Console.WriteLine("Não é um número válido");
}

// Convert.ToXxx: alternativa que trata null como zero
int n2 = Convert.ToInt32("42");
int n3 = Convert.ToInt32(null);     // 0 (em vez de exceção)`})}),e.jsxs(o,{type:"info",title:"Localização derruba Parse",children:[e.jsx("code",{children:'double.Parse("3.14")'})," falha em máquinas em pt-BR (esperam vírgula!). Sempre passe ",e.jsx("code",{children:"CultureInfo.InvariantCulture"})," para conversões de dados (arquivos, APIs). Use cultura local apenas para mostrar ao usuário."]}),e.jsxs("h2",{children:["Boxing e unboxing: a ponte com ",e.jsx("code",{children:"object"})]}),e.jsxs("p",{children:["Como todo tipo deriva de ",e.jsx("code",{children:"object"}),", você pode atribuir um valor primitivo (",e.jsx("code",{children:"int"}),", ",e.jsx("code",{children:"bool"}),") a uma variável ",e.jsx("code",{children:"object"}),". O .NET então embrulha o valor em um objeto no heap — operação chamada ",e.jsx("strong",{children:"boxing"}),". Tirar de volta é ",e.jsx("strong",{children:"unboxing"})," e exige cast explícito."]}),e.jsx("pre",{children:e.jsx("code",{children:`int n = 42;
object obj = n;          // boxing: aloca objeto no heap
int de_volta = (int)obj; // unboxing: cast explícito

// Cast para tipo errado lança InvalidCastException:
// long l = (long)obj;   // CRASH! Era int, não long.

// Boxing é caro. Evite em laços apertados:
for (int i = 0; i < 1_000_000; i++) {
    object x = i;        // 1 milhão de alocações no heap (ruim)
}`})}),e.jsxs("h2",{children:["Operadores ",e.jsx("code",{children:"is"})," e ",e.jsx("code",{children:"as"})," para tipos por referência"]}),e.jsxs("p",{children:[e.jsx("code",{children:"is"})," testa se um objeto é de um certo tipo. ",e.jsx("code",{children:"as"})," tenta converter; devolve ",e.jsx("code",{children:"null"})," se falhar (em vez de exceção). Combinados com ",e.jsx("em",{children:"pattern matching"}),", são a forma idiomática moderna."]}),e.jsx("pre",{children:e.jsx("code",{children:`object obj = "Olá";

if (obj is string s) {            // testa E declara variável
    Console.WriteLine(s.Length);  // 3
}

// Forma antiga, ainda válida:
string? s2 = obj as string;
if (s2 != null) { … }

// Pattern matching avançado:
if (obj is string { Length: > 0 } texto) {
    Console.WriteLine($"Texto não-vazio: {texto}");
}

// is com tipo negado (C# 9+):
if (obj is not null) { … }`})}),e.jsxs("h2",{children:["Conversões customizadas: ",e.jsx("code",{children:"operator"})]}),e.jsxs("p",{children:["Você pode definir conversões para suas próprias classes/structs, declarando operadores ",e.jsx("code",{children:"implicit"})," (sempre seguros) ou ",e.jsx("code",{children:"explicit"})," (exigem cast)."]}),e.jsx("pre",{children:e.jsx("code",{children:`public readonly struct Celsius {
    public double Valor { get; }
    public Celsius(double v) => Valor = v;

    // Conversão implícita: Celsius → double é sempre seguro
    public static implicit operator double(Celsius c) => c.Valor;

    // Conversão explícita: double → Celsius exige intenção
    public static explicit operator Celsius(double d) => new Celsius(d);
}

Celsius temp = new Celsius(36.5);
double v = temp;                  // implícito
Celsius t2 = (Celsius)40.0;       // explícito`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"InvalidCastException"}),":"]})," cast errado entre tipos por referência. Antes de cast, valide com ",e.jsx("code",{children:"is"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"FormatException"})," em ",e.jsx("code",{children:"Parse"}),":"]})," use ",e.jsx("code",{children:"TryParse"})," sempre que o input não for confiável."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cast trunca em vez de arredondar:"})," ",e.jsx("code",{children:"(int)2.9 == 2"}),". Use ",e.jsx("code",{children:"Math.Round"})," conscientemente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Boxing escondido:"})," métodos antigos como ",e.jsx("code",{children:"ArrayList"})," ou ",e.jsx("code",{children:'String.Format("{0}", umInt)'})," fazem boxing. Prefira coleções genéricas e interpolação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer cultura:"}),' ler "1,5" como ',e.jsx("code",{children:"double"})," em pt-BR funciona; em en-US falha. Sempre use ",e.jsx("code",{children:"CultureInfo.InvariantCulture"})," para dados."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Conversão implícita acontece sozinha quando não há perda."}),e.jsxs("li",{children:["Cast explícito ",e.jsx("code",{children:"(tipo)valor"})," é necessário quando há risco de perda."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"int.TryParse"})," para input do usuário; ",e.jsx("code",{children:"Parse"})," só quando confia 100%."]}),e.jsx("li",{children:"Boxing leva primitivos para o heap — evite em código quente."}),e.jsxs("li",{children:[e.jsx("code",{children:"is"})," + pattern matching é a forma moderna de testar e converter referências."]}),e.jsxs("li",{children:["Defina ",e.jsx("code",{children:"implicit"}),"/",e.jsx("code",{children:"explicit operator"})," em seus tipos quando fizer sentido."]})]})]})}export{n as default};
