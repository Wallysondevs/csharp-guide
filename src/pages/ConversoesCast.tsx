import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConversoesCast() {
  return (
    <PageContainer
      title="Conversões e casting de tipos"
      subtitle="Como passar um valor de um tipo para outro com segurança: implícito, explícito, Parse, TryParse, as, is e boxing."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine que você tem uma jarra de água (um tipo) e quer transferir o conteúdo para um copo (outro tipo). Se o copo é maior, basta despejar — não há risco de transbordar. Mas se o copo é menor, você precisa <em>decidir conscientemente</em> que está disposto a perder água. C#, sendo uma linguagem fortemente tipada, formaliza essa ideia: conversões "seguras" (sem perda) acontecem automaticamente; conversões "arriscadas" exigem que você as escreva explicitamente. Este capítulo cobre todas as ferramentas para converter entre tipos sem dor de cabeça.
      </p>

      <h2>Conversão implícita: segura e silenciosa</h2>
      <p>
        Quando o tipo de destino é "maior" do que o de origem (cabe sem perda), o compilador faz a conversão sozinho. Funciona para inteiros menores indo para maiores, e de inteiro para ponto flutuante.
      </p>
      <pre><code>{`int i = 100;
long l = i;          // int (32 bits) cabe num long (64 bits): OK
double d = i;        // int vira double sem perder precisão: OK
float f = l;         // long vira float (com possível perda mínima): OK

byte b = 10;
int n = b;           // byte (8 bits) cabe num int: OK`}</code></pre>

      <h2>Conversão explícita (cast): "eu sei o que estou fazendo"</h2>
      <p>
        Quando o destino é menor ou tem natureza diferente, você precisa fazer um <strong>cast</strong>: prefixar o valor com o tipo entre parênteses. O compilador então confia em você — mas o resultado pode perder informação.
      </p>
      <pre><code>{`double pi = 3.14159;
int truncado = (int)pi;          // 3 (descarta a parte fracionária)

long grande = 5_000_000_000L;
int pequeno = (int)grande;       // overflow! Resultado imprevisível

// Em modo checked, dá exceção:
checked {
    int x = (int)grande;         // OverflowException
}`}</code></pre>

      <AlertBox type="warning" title="Cast não arredonda">
        <code>(int)2.9</code> dá <code>2</code>, não <code>3</code>. Para arredondar de verdade, use <code>Math.Round</code>, <code>Math.Floor</code> ou <code>Math.Ceiling</code>.
      </AlertBox>

      <h2>De string para número: <code>Parse</code> vs <code>TryParse</code></h2>
      <p>
        Casting (<code>(int)</code>) só funciona entre tipos numéricos compatíveis — não converte uma <code>string</code> em <code>int</code>. Para isso, há métodos especializados.
      </p>
      <pre><code>{`string entrada = "42";

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
int n3 = Convert.ToInt32(null);     // 0 (em vez de exceção)`}</code></pre>

      <AlertBox type="info" title="Localização derruba Parse">
        <code>double.Parse("3.14")</code> falha em máquinas em pt-BR (esperam vírgula!). Sempre passe <code>CultureInfo.InvariantCulture</code> para conversões de dados (arquivos, APIs). Use cultura local apenas para mostrar ao usuário.
      </AlertBox>

      <h2>Boxing e unboxing: a ponte com <code>object</code></h2>
      <p>
        Como todo tipo deriva de <code>object</code>, você pode atribuir um valor primitivo (<code>int</code>, <code>bool</code>) a uma variável <code>object</code>. O .NET então embrulha o valor em um objeto no heap — operação chamada <strong>boxing</strong>. Tirar de volta é <strong>unboxing</strong> e exige cast explícito.
      </p>
      <pre><code>{`int n = 42;
object obj = n;          // boxing: aloca objeto no heap
int de_volta = (int)obj; // unboxing: cast explícito

// Cast para tipo errado lança InvalidCastException:
// long l = (long)obj;   // CRASH! Era int, não long.

// Boxing é caro. Evite em laços apertados:
for (int i = 0; i < 1_000_000; i++) {
    object x = i;        // 1 milhão de alocações no heap (ruim)
}`}</code></pre>

      <h2>Operadores <code>is</code> e <code>as</code> para tipos por referência</h2>
      <p>
        <code>is</code> testa se um objeto é de um certo tipo. <code>as</code> tenta converter; devolve <code>null</code> se falhar (em vez de exceção). Combinados com <em>pattern matching</em>, são a forma idiomática moderna.
      </p>
      <pre><code>{`object obj = "Olá";

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
if (obj is not null) { … }`}</code></pre>

      <h2>Conversões customizadas: <code>operator</code></h2>
      <p>
        Você pode definir conversões para suas próprias classes/structs, declarando operadores <code>implicit</code> (sempre seguros) ou <code>explicit</code> (exigem cast).
      </p>
      <pre><code>{`public readonly struct Celsius {
    public double Valor { get; }
    public Celsius(double v) => Valor = v;

    // Conversão implícita: Celsius → double é sempre seguro
    public static implicit operator double(Celsius c) => c.Valor;

    // Conversão explícita: double → Celsius exige intenção
    public static explicit operator Celsius(double d) => new Celsius(d);
}

Celsius temp = new Celsius(36.5);
double v = temp;                  // implícito
Celsius t2 = (Celsius)40.0;       // explícito`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>InvalidCastException</code>:</strong> cast errado entre tipos por referência. Antes de cast, valide com <code>is</code>.</li>
        <li><strong><code>FormatException</code> em <code>Parse</code>:</strong> use <code>TryParse</code> sempre que o input não for confiável.</li>
        <li><strong>Cast trunca em vez de arredondar:</strong> <code>(int)2.9 == 2</code>. Use <code>Math.Round</code> conscientemente.</li>
        <li><strong>Boxing escondido:</strong> métodos antigos como <code>ArrayList</code> ou <code>String.Format("&#123;0&#125;", umInt)</code> fazem boxing. Prefira coleções genéricas e interpolação.</li>
        <li><strong>Esquecer cultura:</strong> ler "1,5" como <code>double</code> em pt-BR funciona; em en-US falha. Sempre use <code>CultureInfo.InvariantCulture</code> para dados.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Conversão implícita acontece sozinha quando não há perda.</li>
        <li>Cast explícito <code>(tipo)valor</code> é necessário quando há risco de perda.</li>
        <li>Use <code>int.TryParse</code> para input do usuário; <code>Parse</code> só quando confia 100%.</li>
        <li>Boxing leva primitivos para o heap — evite em código quente.</li>
        <li><code>is</code> + pattern matching é a forma moderna de testar e converter referências.</li>
        <li>Defina <code>implicit</code>/<code>explicit operator</code> em seus tipos quando fizer sentido.</li>
      </ul>
    </PageContainer>
  );
}
