import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericMath() {
  return (
    <PageContainer
      title="Generic Math: aritmética genérica com INumber<T>"
      subtitle="Como o .NET 7 finalmente permitiu escrever 'somar duas coisas' sem saber se são int, double ou decimal."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <p>
        Por décadas, programadores de C# bateram a cabeça com um problema aparentemente trivial: escrever um método <code>Somar&lt;T&gt;(T a, T b)</code>. O obstáculo? Operadores como <code>+</code>, <code>-</code> e <code>*</code> não fazem parte de nenhuma interface — eles são <em>operadores estáticos</em> definidos no próprio tipo. Como restringir <code>T</code> a "tipos que sabem somar"? Era preciso escrever uma versão para <code>int</code>, outra para <code>double</code>, outra para <code>decimal</code>... A solução chegou no .NET 7 / C# 11 com <strong>Generic Math</strong>, uma família de interfaces que finalmente expõe os operadores. Pense numa receita de bolo que aceita "qualquer farinha" — antes você precisava de receitas separadas, agora uma só serve.
      </p>

      <h2>O problema histórico</h2>
      <p>
        Tente escrever isso em C# pré-7:
      </p>
      <pre><code>{`public static T Somar<T>(T a, T b) {
    return a + b;   // ERRO CS0019: Operator '+' cannot be applied to operands of type 'T' and 'T'
}`}</code></pre>
      <p>
        O compilador não tem ideia de que <code>T</code> tenha o operador <code>+</code>. Restrições como <code>where T : IComparable</code> ajudam para <code>CompareTo</code>, mas não há <code>IAddable</code> no .NET clássico. As soluções <em>workarounds</em> envolviam <code>dynamic</code> (lento) ou <code>Expression</code> (complicado).
      </p>

      <h2>O ingrediente novo: <code>static abstract</code> em interfaces</h2>
      <p>
        Para que uma interface possa exigir um operador, ela precisa exigir <strong>membros estáticos</strong>. Isso era impossível antes — interfaces só podiam ter membros de instância. O C# 11 introduziu <code>static abstract</code> e <code>static virtual</code> em interfaces. Isso significa: "todo tipo que implementa esta interface tem que fornecer este método estático."
      </p>
      <pre><code>{`// Versão simplificada do que existe em System.Numerics
public interface IAdicionavel<T> where T : IAdicionavel<T> {
    static abstract T operator +(T a, T b);
}

public struct Moeda : IAdicionavel<Moeda> {
    public decimal Valor;
    public static Moeda operator +(Moeda a, Moeda b) =>
        new Moeda { Valor = a.Valor + b.Valor };
}`}</code></pre>
      <p>
        O <code>where T : IAdicionavel&lt;T&gt;</code> é o <strong>"curiously recurring template pattern" (CRTP)</strong> — o tipo aparece como parâmetro de si mesmo, garantindo que o operador retorne o tipo concreto.
      </p>

      <h2>As interfaces do <code>System.Numerics</code></h2>
      <p>
        O .NET 7+ trouxe um catálogo extenso. As principais para o dia-a-dia:
      </p>
      <table>
        <thead>
          <tr><th>Interface</th><th>O que exige</th></tr>
        </thead>
        <tbody>
          <tr><td><code>INumber&lt;T&gt;</code></td><td>União de quase tudo: aritmética, comparação, parsing. Implementada por todos os tipos numéricos do .NET.</td></tr>
          <tr><td><code>INumberBase&lt;T&gt;</code></td><td>Base mínima — operadores <code>+ - * /</code>, <code>Zero</code>, <code>One</code>.</td></tr>
          <tr><td><code>IAdditionOperators&lt;TSelf,TOther,TResult&gt;</code></td><td>Apenas o operador <code>+</code>.</td></tr>
          <tr><td><code>IComparisonOperators&lt;TSelf,TOther,TResult&gt;</code></td><td><code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code>.</td></tr>
          <tr><td><code>IFloatingPoint&lt;T&gt;</code></td><td>Adicionais para <code>double</code>, <code>float</code>: <code>Sqrt</code>, <code>Pi</code>, etc.</td></tr>
          <tr><td><code>IBinaryInteger&lt;T&gt;</code></td><td>Operações bitwise específicas de inteiros.</td></tr>
        </tbody>
      </table>

      <h2>Exemplo prático: <code>Sum</code> genérico</h2>
      <pre><code>{`using System.Numerics;

public static class MeuMath {
    public static T Soma<T>(IEnumerable<T> valores) where T : INumber<T> {
        T total = T.Zero;   // 'Zero' é membro estático exigido por INumber
        foreach (var v in valores) total += v;
        return total;
    }

    public static T Media<T>(IEnumerable<T> valores) where T : INumber<T> {
        T total = T.Zero;
        int n = 0;
        foreach (var v in valores) { total += v; n++; }
        return total / T.CreateChecked(n);
    }
}

int s1 = MeuMath.Soma(new[] { 1, 2, 3 });             // 6
double s2 = MeuMath.Soma(new[] { 1.5, 2.5, 3.0 });    // 7.0
decimal s3 = MeuMath.Soma(new decimal[] { 10m, 20m });// 30m
double m = MeuMath.Media(new[] { 10.0, 20.0, 30.0 }); // 20.0`}</code></pre>
      <p>
        Note os elementos novos: <code>T.Zero</code> (chamada estática direta no parâmetro genérico — só possível com <code>static abstract</code>) e <code>T.CreateChecked(n)</code>, que converte um <code>int</code> para o tipo <code>T</code> validando overflow.
      </p>

      <AlertBox type="info" title="Performance é nativa">
        O JIT especializa o método para cada tipo concreto, gerando código tão rápido quanto se você tivesse escrito uma versão dedicada. Não há reflexão nem boxing — é "monomorfização" típica de generics em C#.
      </AlertBox>

      <h2>Conversões genéricas: <code>CreateChecked</code> e amigos</h2>
      <p>
        Quando você precisa converter de um tipo numérico genérico para outro, use os métodos estáticos da interface. Existem três variantes para cada destino:
      </p>
      <pre><code>{`// CreateChecked: lança OverflowException se não couber
int i1 = int.CreateChecked(300L);          // 300

// CreateSaturating: trunca ao valor máximo/mínimo
int i2 = int.CreateSaturating(long.MaxValue);  // int.MaxValue

// CreateTruncating: descarta bits que sobram (tipo cast em C-style)
byte b = byte.CreateTruncating(257);            // 1 (257 % 256)`}</code></pre>

      <h2>Restrições mais finas que <code>INumber</code></h2>
      <p>
        Se seu método precisa só de uma operação (digamos, somar e multiplicar), use a interface mais específica. Isso permite que mais tipos sirvam — inclusive os que você criar:
      </p>
      <pre><code>{`public static T Triplo<T>(T x) where T : IAdditionOperators<T, T, T> {
    return x + x + x;
}

// Para operações que exijam apenas comparações:
public static bool MaiorQue<T>(T a, T b) where T : IComparisonOperators<T, T, bool> {
    return a > b;
}`}</code></pre>

      <h2>Implementando seu próprio tipo numérico</h2>
      <p>
        Você pode criar tipos compatíveis com Generic Math implementando as interfaces relevantes. Útil para domínios como dinheiro, vetores, matrizes:
      </p>
      <pre><code>{`public readonly struct Vetor2 :
    IAdditionOperators<Vetor2, Vetor2, Vetor2>,
    IMultiplyOperators<Vetor2, double, Vetor2>
{
    public double X { get; }
    public double Y { get; }
    public Vetor2(double x, double y) { X = x; Y = y; }

    public static Vetor2 operator +(Vetor2 a, Vetor2 b) => new(a.X + b.X, a.Y + b.Y);
    public static Vetor2 operator *(Vetor2 v, double k)  => new(v.X * k, v.Y * k);
}

// Agora Triplo<Vetor2> compila!
var v = MeuMath.Soma(new[] { new Vetor2(1, 0), new Vetor2(0, 1) });`}</code></pre>

      <AlertBox type="warning" title="Requer .NET 7 ou superior">
        Generic Math depende de <code>static abstract</code> em interfaces, recurso introduzido no C# 11 + .NET 7 (2022). Em projetos anteriores, você não terá <code>INumber&lt;T&gt;</code> nem conseguirá declarar membros estáticos abstratos. Atualize o TFM (<code>net8.0</code> ou superior) e o <code>LangVersion</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>using System.Numerics;</code>:</strong> as interfaces de Generic Math vivem nesse namespace.</li>
        <li><strong>Usar <code>T.Zero</code> sem <code>where T : INumber&lt;T&gt;</code>:</strong> a chamada estática só está disponível depois da restrição.</li>
        <li><strong>Esquecer o CRTP:</strong> ao definir suas próprias interfaces estáticas, declare <code>where T : IMinha&lt;T&gt;</code> para o operador devolver o tipo concreto.</li>
        <li><strong>Usar <code>Convert.ToInt32(t)</code> em código genérico:</strong> prefira <code>int.CreateChecked(t)</code>, que respeita a interface.</li>
        <li><strong>Confundir overflow:</strong> escolha entre <code>CreateChecked</code> (lança), <code>CreateSaturating</code> (clamp) e <code>CreateTruncating</code> (rolagem) conforme sua intenção.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Generic Math (.NET 7+) permite escrever aritmética genuinamente genérica.</li>
        <li>Possível graças a <code>static abstract</code> em interfaces (C# 11).</li>
        <li><code>INumber&lt;T&gt;</code> cobre todos os tipos numéricos do framework.</li>
        <li>Use <code>T.Zero</code>, <code>T.One</code>, <code>T.CreateChecked(...)</code> para operar genericamente.</li>
        <li>Implemente as interfaces relevantes para tornar seus tipos compatíveis.</li>
      </ul>
    </PageContainer>
  );
}
