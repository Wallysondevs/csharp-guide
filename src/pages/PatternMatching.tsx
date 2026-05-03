import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PatternMatching() {
  return (
    <PageContainer
      title="Pattern matching: switch poderoso e is melhorado"
      subtitle="Aprenda a usar os padrões modernos do C# para escrever menos if/else e expressar intenção com clareza."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        <strong>Pattern matching</strong> ("casamento de padrões") é o nome bonito para uma ideia simples: em vez de perguntar "qual o tipo desse objeto? agora extrai esse campo, agora compara com aquele valor" em três linhas, você descreve o <em>formato</em> do que está procurando em uma única expressão e o compilador faz o resto. É como passar do "vou olhar a placa, depois a cor, depois o modelo" para "me dá o carro vermelho com placa começando em ABC". Esse capítulo cobre os principais padrões disponíveis no C# moderno.
      </p>

      <h2>Type pattern: <code>is</code> com declaração</h2>
      <p>
        O operador <code>is</code> antigamente só respondia "sim" ou "não" sobre um tipo. Hoje ele também <strong>declara uma variável</strong> tipada se a verificação passa — eliminando o cast manual.
      </p>
      <pre><code>{`object x = "Alô";

// Forma antiga, verbosa
if (x is string)
{
    string s = (string)x;          // cast manual, redundante
    Console.WriteLine(s.Length);
}

// Forma moderna: declara 's' já tipada como string
if (x is string s)
{
    Console.WriteLine(s.Length);   // s só existe se a checagem passou
}`}</code></pre>
      <p>
        A variável <code>s</code> só fica disponível dentro do escopo onde o teste é verdadeiro. O compilador é esperto: se você inverter com <code>!</code> ou <code>else</code>, ela aparece no ramo correto.
      </p>

      <h2>Property pattern: testar campos do objeto</h2>
      <p>
        Para verificar tipo <em>e</em> propriedades em uma única expressão, use <code>{`{ Prop: valor }`}</code>. Isso evita aquela pirâmide de <code>if</code>s aninhados.
      </p>
      <pre><code>{`record Pedido(string Cliente, decimal Total, string Status);

Pedido p = new("Ana", 250m, "pago");

// Casa se p NÃO é null E Status == "pago" E Total > 100
if (p is { Status: "pago", Total: > 100 })
{
    Console.WriteLine("Liberar envio");
}

// Property pattern aninhado: o Cliente também é um objeto
record Endereco(string Cidade, string Uf);
record Compra(string Cliente, Endereco Entrega);

Compra c = new("Bia", new Endereco("Rio", "RJ"));
if (c is { Entrega.Uf: "RJ" })   // C# 10+: acesso encadeado
{
    Console.WriteLine("Entrega no RJ");
}`}</code></pre>

      <AlertBox type="info" title="Por que isso é seguro">
        O property pattern <em>nunca</em> dispara <code>NullReferenceException</code>. Se qualquer parte do caminho for <code>null</code>, o padrão simplesmente não casa — sem exceção, sem tratamento manual.
      </AlertBox>

      <h2>Switch expression: o switch que devolve valor</h2>
      <p>
        O <code>switch</code> tradicional é uma <em>instrução</em> (faz algo). A <strong>switch expression</strong> é uma <em>expressão</em> (devolve um valor). Sintaxe enxuta com <code>=&gt;</code> e vírgulas.
      </p>
      <pre><code>{`string Classificar(int nota) => nota switch
{
    >= 90 => "A",          // relational pattern
    >= 80 => "B",
    >= 70 => "C",
    >= 60 => "D",
    < 0   => throw new ArgumentException("nota negativa"),
    _     => "F"            // _ é o "padrão default"
};

Console.WriteLine(Classificar(85)); // "B"`}</code></pre>
      <p>
        Os símbolos <code>&gt;=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&lt;=</code> nesse contexto são <strong>relational patterns</strong>. Eles testam o valor sem precisar repetir a variável.
      </p>

      <h2>Tuple pattern: combinando dois ou mais valores</h2>
      <p>
        Quando a decisão depende de <em>mais de uma</em> variável, agrupe em uma tupla literal e descreva combinações.
      </p>
      <pre><code>{`string Resultado(bool autenticado, bool admin) =>
    (autenticado, admin) switch
    {
        (false, _)    => "Faça login",       // _ = qualquer valor
        (true, false) => "Acesso comum",
        (true, true)  => "Painel admin"
    };

Console.WriteLine(Resultado(true, true));   // "Painel admin"`}</code></pre>

      <h2>Logical patterns: <code>and</code>, <code>or</code>, <code>not</code></h2>
      <p>
        Combine padrões com palavras-chave em inglês. São muito mais legíveis do que operadores booleanos misturados com testes.
      </p>
      <pre><code>{`bool EhMaiusculaAscii(char c) => c is >= 'A' and <= 'Z';

bool EhVogal(char c) => c is 'a' or 'e' or 'i' or 'o' or 'u';

bool EhBranco(char c) => c is not (>= '!' and <= '~');

string Faixa(int idade) => idade switch
{
    < 0          => throw new ArgumentException(),
    < 13         => "criança",
    >= 13 and < 18 => "adolescente",
    >= 18 and < 60 => "adulto",
    _            => "idoso"
};`}</code></pre>

      <h2>List pattern: examinar elementos de uma coleção</h2>
      <p>
        Disponível desde o C# 11. Permite descrever a <strong>forma</strong> de um array ou lista: tamanho, primeiro elemento, último, "qualquer coisa no meio".
      </p>
      <pre><code>{`int[] dados = { 1, 2, 3 };

// Casa exatamente com [1, 2, 3]
bool a = dados is [1, 2, 3];                   // true

// _ ignora um elemento; .. ignora vários
bool b = dados is [1, _, 3];                   // true (do meio tanto faz)
bool c = dados is [1, ..];                     // true (começa com 1)
bool d = dados is [.., 3];                     // true (termina em 3)

// Capturando partes:
if (dados is [var primeiro, .., var ultimo])
{
    Console.WriteLine($"De {primeiro} a {ultimo}");
}

// Combinando com property pattern:
string[] nomes = { "Ana" };
bool soUm = nomes is [{ Length: > 0 }];        // único elemento não vazio`}</code></pre>

      <AlertBox type="warning" title="Ordem importa">
        Em uma <code>switch expression</code>, os padrões são avaliados de cima para baixo. Coloque os <strong>mais específicos primeiro</strong>: se você puser <code>_ =&gt; "padrão"</code> antes de <code>0 =&gt; "zero"</code>, o caso zero nunca casa, e o compilador avisa com warning.
      </AlertBox>

      <h2>Exemplo combinando tudo</h2>
      <pre><code>{`abstract record Forma;
record Circulo(double Raio) : Forma;
record Retangulo(double Largura, double Altura) : Forma;
record Triangulo(double Base, double Altura) : Forma;

double Area(Forma f) => f switch
{
    Circulo { Raio: > 0 } c              => Math.PI * c.Raio * c.Raio,
    Retangulo { Largura: > 0, Altura: > 0 } r => r.Largura * r.Altura,
    Triangulo (var b, var h) when b > 0 && h > 0 => b * h / 2,
    null                                 => throw new ArgumentNullException(nameof(f)),
    _                                    => throw new ArgumentException("Forma inválida")
};`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Padrão inalcançável</strong>: o compilador avisa que um <code>case</code> nunca casa — geralmente porque um padrão anterior já capturava tudo. Reordene.</li>
        <li><strong>Switch não exaustivo</strong>: warning <em>CS8509</em>. Adicione um <code>_ =&gt; ...</code> ou trate todos os tipos possíveis.</li>
        <li><strong>Confundir <code>=</code> com <code>=&gt;</code></strong> em switch expression: o resultado de cada arm usa <code>=&gt;</code> e os arms são separados por vírgula, não ponto-e-vírgula.</li>
        <li><strong>Esquecer que <code>and</code>/<code>or</code> aqui são padrões, não booleanos</strong>: <code>x is &gt; 0 and &lt; 10</code> ≠ <code>x &gt; 0 &amp;&amp; x &lt; 10</code> em escopo (apesar do mesmo efeito).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>is T nome</code> testa tipo e já declara variável tipada.</li>
        <li>Property pattern <code>{`{ Prop: valor }`}</code> casa por estrutura, ignora <code>null</code> com segurança.</li>
        <li>Switch expression devolve valor com sintaxe <code>x =&gt; resultado</code>.</li>
        <li>Tuple pattern combina múltiplas variáveis: <code>(a, b) switch</code>.</li>
        <li>Relational (<code>&gt;</code>, <code>&lt;=</code>) e logical (<code>and</code>, <code>or</code>, <code>not</code>) são primeira classe.</li>
        <li>List pattern <code>[1, .., var ultimo]</code> descreve forma de coleções.</li>
      </ul>
    </PageContainer>
  );
}
