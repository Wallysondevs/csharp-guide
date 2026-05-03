import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SealedVirtual() {
  return (
    <PageContainer
      title="sealed, virtual, override e abstract na prática"
      subtitle="As quatro palavras que governam herança e polimorfismo em C#. Domine quando combinar cada uma."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine um manual de funcionário: algumas regras são "obrigatórias para todos" (tem que assinar o ponto), outras são "padrão, mas você pode mudar se quiser" (uniforme), outras são "está fechado, ninguém mexe" (segurança da empresa). Em C#, os modificadores <code>virtual</code>, <code>override</code>, <code>abstract</code> e <code>sealed</code> formam exatamente esse vocabulário: cada um diz quem pode (ou não pode) substituir um comportamento na hierarquia. Combiná-los corretamente é a diferença entre uma hierarquia de classes elegante e um pesadelo de manutenção.
      </p>

      <h2>O quarteto, em uma frase cada</h2>
      <ul>
        <li><strong><code>virtual</code></strong>: "permite que filhas substituam".</li>
        <li><strong><code>override</code></strong>: "estou substituindo um método virtual da pai".</li>
        <li><strong><code>abstract</code></strong>: "é obrigatório que filhas substituam (não há corpo)".</li>
        <li><strong><code>sealed</code></strong>: "esta é a última palavra; ninguém mais pode substituir / herdar".</li>
      </ul>

      <h2>Tabela de combinações válidas</h2>
      <p>
        A tabela abaixo resume o que cada combinação significa. Note como elas se complementam:
      </p>
      <table>
        <thead>
          <tr><th>Combinação</th><th>Significado</th></tr>
        </thead>
        <tbody>
          <tr><td><code>virtual</code></td><td>Tem corpo padrão; filhas podem substituir.</td></tr>
          <tr><td><code>abstract</code></td><td>Sem corpo; filhas devem substituir.</td></tr>
          <tr><td><code>override</code></td><td>Substitui virtual/abstract da pai. Por padrão, ainda é virtual para netas.</td></tr>
          <tr><td><code>sealed override</code></td><td>Substitui e impede netas de substituírem de novo.</td></tr>
          <tr><td><code>sealed class</code></td><td>Classe que não pode ter filhas.</td></tr>
          <tr><td><code>abstract class</code></td><td>Classe que não pode ser instanciada diretamente.</td></tr>
        </tbody>
      </table>

      <h2><code>virtual</code> + <code>override</code>: o caso clássico</h2>
      <p>
        A pai oferece um comportamento padrão; a filha pode aceitar como está ou substituir.
      </p>
      <pre><code>{`public class Documento
{
    // virtual: tem corpo, mas filhas podem mudar
    public virtual void Imprimir()
    {
        Console.WriteLine("Imprimindo documento genérico.");
    }
}

public class DocumentoPdf : Documento
{
    public override void Imprimir()
    {
        Console.WriteLine("Renderizando PDF e enviando à impressora.");
    }
}`}</code></pre>

      <h2><code>abstract</code>: forçar a substituição</h2>
      <p>
        Quando o corpo padrão não faz sentido, marque o método como <code>abstract</code>. A classe <em>inteira</em> também precisa ser <code>abstract</code>, e filhas concretas são obrigadas a implementar.
      </p>
      <pre><code>{`public abstract class Forma
{
    public abstract double CalcularArea(); // sem corpo
}

public class Circulo : Forma
{
    public double Raio { get; init; }
    public override double CalcularArea() => Math.PI * Raio * Raio;
}`}</code></pre>

      <h2><code>sealed override</code>: a filha que fecha a porta</h2>
      <p>
        Por padrão, um método <code>override</code> continua sendo "abrível" para netas. Se você quer congelar a partir daqui, use <code>sealed override</code>.
      </p>
      <pre><code>{`public class Animal
{
    public virtual void Comer() => Console.WriteLine("Comendo...");
}

public class Cachorro : Animal
{
    public sealed override void Comer()
        => Console.WriteLine("Cachorro comendo ração.");
}

public class Bulldog : Cachorro
{
    // public override void Comer() { } // ERRO: foi sealed
}`}</code></pre>

      <AlertBox type="info" title="Por que selar?"
      >
        Selar evita surpresas: você garante que o comportamento daquele método jamais será alterado por descendentes. Isso ajuda quem mantém o código (não precisa pensar em sub-tipos esquisitos) e <em>às vezes</em> permite ao JIT do .NET otimizar a chamada.
      </AlertBox>

      <h2><code>sealed class</code>: classe que não pode ser herdada</h2>
      <p>
        Aplicado à classe inteira, <code>sealed</code> diz "esta classe é folha; ninguém pode herdar". Isso é comum em classes de valor finalizadas, como <code>string</code>, ou em classes utilitárias que você quer manter sob controle.
      </p>
      <pre><code>{`public sealed class Cnpj
{
    public string Numero { get; }
    public Cnpj(string numero) { Numero = numero; }
}

// public class CnpjFalso : Cnpj { } // ERRO: Cnpj é sealed`}</code></pre>

      <h2>Performance: o impacto real</h2>
      <p>
        Métodos <code>virtual</code> são despachados via uma "tabela virtual" (vtable), que tem um custo mínimo a cada chamada. Métodos não-virtuais (incluindo <code>sealed override</code> ou aqueles em uma <code>sealed class</code>) podem ser <em>devirtualized</em> pelo JIT — o compilador resolve a chamada em tempo de compilação, e até consegue fazer <em>inlining</em> (colar o corpo do método no chamador). Em código quente (loops apertados), isso pode fazer diferença mensurável.
      </p>
      <pre><code>{`public sealed class CalculadoraRapida
{
    // Como a classe é sealed, o JIT pode otimizar agressivamente
    public int Dobrar(int x) => x * 2;
}`}</code></pre>

      <AlertBox type="warning" title="Não otimize prematuramente"
      >
        Não saia selando todas as classes pensando em performance. Selar é uma <em>decisão de design</em> — diga "esta classe não foi planejada para ser herdada". A otimização vem de brinde quando o design pede; não como objetivo principal.
      </AlertBox>

      <h2>Hierarquia completa, juntando tudo</h2>
      <p>
        Vejamos um exemplo que combina os quatro modificadores:
      </p>
      <pre><code>{`public abstract class Animal
{
    public string Nome { get; init; } = "";

    // Filha DEVE implementar
    public abstract void EmitirSom();

    // Filha PODE substituir
    public virtual void Apresentar()
        => Console.WriteLine($"Sou {Nome}.");
}

public class Gato : Animal
{
    public override void EmitirSom() => Console.WriteLine("Miau!");

    // Bloqueia netas de mexer em Apresentar
    public sealed override void Apresentar()
    {
        base.Apresentar();
        Console.WriteLine("Sou um gato.");
    }
}

public sealed class GatoPersa : Gato
{
    public override void EmitirSom() => Console.WriteLine("Miaaaau (chique)");
    // Não pode override Apresentar porque foi selado em Gato
    // Não pode ter filhas porque a classe é sealed
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>virtual</code> e tentar <code>override</code></strong>: o compilador acusa que o método não é overridable.</li>
        <li><strong>Tentar <code>abstract</code> em classe não-abstrata</strong>: se algum método é abstract, a classe inteira tem que ser abstract.</li>
        <li><strong>Confundir <code>sealed override</code> com <code>sealed class</code></strong>: o primeiro fecha um método; o segundo fecha a classe toda.</li>
        <li><strong>Usar <code>protected</code> em <code>sealed class</code></strong>: o compilador alerta — sem filhas, <code>protected</code> equivale a <code>private</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>virtual</code> permite override; <code>override</code> realiza-o.</li>
        <li><code>abstract</code> obriga override e impede instanciação direta.</li>
        <li><code>sealed override</code> congela um método; <code>sealed class</code> congela a classe.</li>
        <li>O JIT pode otimizar chamadas a métodos não-virtuais (devirtualization, inlining).</li>
        <li>Use cada modificador como uma <em>declaração de intenção de design</em>, não como otimização cega.</li>
      </ul>
    </PageContainer>
  );
}
