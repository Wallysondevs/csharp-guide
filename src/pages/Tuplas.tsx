import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Tuplas() {
  return (
    <PageContainer
      title="Tuplas: agrupando valores sem criar uma classe"
      subtitle="Aprenda a transportar vários valores juntos de forma leve, com nomes claros e suporte do compilador."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine que sua função precisa devolver duas coisas: o nome do usuário <em>e</em> a idade. Antes do C# 7, você teria três opções desconfortáveis: criar uma classe inteirinha só para isso, usar parâmetros <code>out</code>, ou retornar um <code>object[]</code> e perder qualquer ajuda do compilador. As <strong>tuplas</strong> resolveram esse problema de uma vez por todas: você junta vários valores em um pacote leve, com tipos preservados e — opcionalmente — nomes legíveis. Pense nelas como uma "sacola de feira" rápida: você joga os itens dentro e entrega; não vale a pena fabricar uma caixa de presente se a sacola já serve.
      </p>

      <h2>A forma mais básica: tupla posicional</h2>
      <p>
        A sintaxe <code>(int, string)</code> declara um <strong>tipo tupla</strong> com dois campos. Para criar uma instância, basta colocar valores entre parênteses. Os campos sem nome ficam acessíveis por <code>Item1</code>, <code>Item2</code> etc.
      </p>
      <pre><code>{`(int, string) pessoa = (30, "Ana");
Console.WriteLine(pessoa.Item1);   // 30
Console.WriteLine(pessoa.Item2);   // Ana

// Inferência também funciona:
var coord = (10.5, 20.0);
Console.WriteLine(coord.Item1 + coord.Item2);`}</code></pre>
      <p>
        Funciona, mas <code>Item1</code> e <code>Item2</code> são tão genéricos quanto "objeto 1" e "objeto 2". Se a tupla viajar entre arquivos, ninguém vai lembrar o que cada item significa.
      </p>

      <h2>Tuplas nomeadas: clareza no contrato</h2>
      <p>
        Adicionando nomes, você cria uma <strong>named tuple</strong>. Os nomes existem para o compilador e para quem lê o código — em tempo de execução, internamente, ainda são <code>Item1</code>, <code>Item2</code>, mas você praticamente nunca precisa usar isso.
      </p>
      <pre><code>{`(int Idade, string Nome) p = (30, "Ana");
Console.WriteLine(p.Nome);     // Ana
Console.WriteLine(p.Idade);    // 30

// Os nomes podem vir do lado direito também
var p2 = (Idade: 25, Nome: "Bruno");
Console.WriteLine(p2.Nome);    // Bruno`}</code></pre>
      <p>
        Sempre que possível, prefira tuplas <em>nomeadas</em>. A diferença em legibilidade é gigante e não custa nada em performance.
      </p>

      <AlertBox type="info" title="Tupla x ValueTuple">
        Por trás dos panos, toda tupla do C# moderno é um <code>System.ValueTuple&lt;…&gt;</code> (uma struct, ou seja, tipo por valor). A <code>System.Tuple&lt;…&gt;</code> antiga (introduzida no .NET Framework 4.0) era uma class — mais lenta e imutável de outra forma. <strong>Use sempre a sintaxe moderna</strong> com parênteses; ela já gera o <code>ValueTuple</code> certinho.
      </AlertBox>

      <h2>Devolver vários valores de um método</h2>
      <p>
        A aplicação mais comum: substituir o velho padrão de <code>out</code> por um retorno limpo. Compare:
      </p>
      <pre><code>{`// Antes: parâmetro out, verboso
bool TentarDividir(int a, int b, out int quociente, out int resto) {
    if (b == 0) { quociente = 0; resto = 0; return false; }
    quociente = a / b;
    resto = a % b;
    return true;
}

// Agora: tupla nomeada
(int Quociente, int Resto)? Dividir(int a, int b) {
    if (b == 0) return null;
    return (a / b, a % b);
}

var r = Dividir(17, 5);
if (r is (int q, int rest)) {
    Console.WriteLine($"{q} resto {rest}");   // 3 resto 2
}`}</code></pre>
      <p>
        Note como o tipo de retorno <em>documenta</em> o que sai do método: alguém lendo a assinatura imediatamente sabe que recebe um quociente e um resto.
      </p>

      <h2>Deconstruction: desempacotando em variáveis</h2>
      <p>
        Você pode "abrir" uma tupla e jogar cada componente em uma variável independente em uma única linha. Isso se chama <strong>deconstrução</strong>.
      </p>
      <pre><code>{`var pessoa = (Nome: "Carla", Idade: 28);

// Desempacotando
var (nome, idade) = pessoa;
Console.WriteLine($"{nome} tem {idade} anos");

// Tipos explícitos, se você preferir
(string n, int i) = pessoa;

// Descarte com _
var (apenasNome, _) = pessoa;
Console.WriteLine(apenasNome);

// Em foreach com lista de tuplas — fica lindo:
var pontos = new List<(int X, int Y)> { (1, 2), (3, 4), (5, 6) };
foreach (var (x, y) in pontos) {
    Console.WriteLine($"{x},{y}");
}`}</code></pre>
      <p>
        O caractere <code>_</code> é um <strong>discard</strong>: significa "não me importo com esse valor, jogue fora". Útil quando você só precisa de parte do retorno.
      </p>

      <h2>Comparação e igualdade</h2>
      <p>
        Tuplas implementam igualdade <strong>por valor</strong>: duas tuplas são iguais se cada componente for igual, na mesma ordem. Isso simplifica muito comparações.
      </p>
      <pre><code>{`var a = (1, "ola");
var b = (1, "ola");
var c = (2, "ola");

Console.WriteLine(a == b);   // True
Console.WriteLine(a == c);   // False
Console.WriteLine(a.Equals(b));  // True

// Os nomes são ignorados na comparação:
(int X, int Y) p1 = (3, 4);
(int A, int B) p2 = (3, 4);
Console.WriteLine(p1 == p2);  // True — só posições importam`}</code></pre>

      <h2>Limites e quando NÃO usar</h2>
      <p>
        Tuplas são fantásticas para retornos curtos, dados temporários e código interno. Mas evite usá-las como tipo público em APIs grandes ou em modelos de domínio: nesses casos, uma <code>record</code> ou classe oferece nome de tipo, validação no construtor, métodos auxiliares e versionamento muito melhores.
      </p>
      <pre><code>{`// Ruim: tupla cruzando muitas camadas, com 5+ campos
public (string, string, DateTime, decimal, bool) ObterPedido(int id) { ... }

// Bom: record explícito
public record Pedido(string Cliente, string Produto, DateTime Data,
                     decimal Valor, bool Pago);
public Pedido ObterPedido(int id) { ... }`}</code></pre>

      <AlertBox type="warning" title="Cuidado com nomes em assinaturas públicas">
        Se você expõe uma tupla nomeada em um método público de uma biblioteca, mudar os nomes depois é uma quebra de compatibilidade — outros projetos podem estar acessando esses nomes. Em APIs públicas duradouras, prefira um tipo nomeado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>System.Tuple</code> com tupla moderna:</strong> a antiga é class, imutável de fora, pesada. A moderna é struct, leve. Use sempre parênteses.</li>
        <li><strong>Esquecer que <code>==</code> compara por posição, não por nome:</strong> reordenar componentes muda resultado.</li>
        <li><strong>Tuplas gigantes:</strong> &gt; 4 campos viram poluição visual; promova para <code>record</code>.</li>
        <li><strong>Deconstrução com tipos errados:</strong> <code>var (a, b, c) = (1, 2);</code> não compila — quantidades têm que bater.</li>
        <li><strong>Mutabilidade:</strong> <code>ValueTuple</code> tem campos mutáveis. <code>p.Idade = 50;</code> compila e altera. Para imutabilidade, use <code>readonly</code> em quem armazena.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Tuplas agrupam vários valores sem criar uma classe.</li>
        <li>Prefira a forma <strong>nomeada</strong>: <code>(int Idade, string Nome)</code>.</li>
        <li>Substituem <code>out</code> e simplificam retornos múltiplos.</li>
        <li>Deconstrução com <code>var (a, b) = tupla;</code> e descarte com <code>_</code>.</li>
        <li>Igualdade por valor — posições importam, nomes não.</li>
        <li>Para domínio público e modelos duradouros, prefira <code>record</code>.</li>
      </ul>
    </PageContainer>
  );
}
