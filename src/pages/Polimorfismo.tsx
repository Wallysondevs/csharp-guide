import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Polimorfismo() {
  return (
    <PageContainer
      title="Polimorfismo: um nome, vários comportamentos"
      subtitle="Aprenda a chamar o mesmo método e ter comportamentos diferentes dependendo do tipo real do objeto."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine que você grita "fala!" para um grupo de animais: o cachorro late, o gato mia, a vaca muge. Você fez <em>uma única solicitação</em>, mas cada um respondeu à sua maneira. Em programação, isso se chama <strong>polimorfismo</strong> — do grego "muitas formas". Em C#, polimorfismo permite que você trate objetos diferentes de forma uniforme através de uma classe-base comum, e o sistema escolha automaticamente, em tempo de execução, qual implementação chamar. É um dos pilares mais poderosos da POO.
      </p>

      <h2>O básico: <code>virtual</code> + <code>override</code></h2>
      <p>
        Para que polimorfismo funcione, a classe pai precisa <em>permitir</em> que filhas substituam um método. Isso é feito com <code>virtual</code> na pai e <code>override</code> na filha — termos que vimos no capítulo anterior. Vamos ver isso em ação:
      </p>
      <pre><code>{`public class Animal
{
    public string Nome { get; init; } = "";

    // virtual: filhas podem dar sua própria versão
    public virtual void EmitirSom()
    {
        Console.WriteLine($"{Nome} emite um som genérico.");
    }
}

public class Cachorro : Animal
{
    public override void EmitirSom() => Console.WriteLine($"{Nome}: Au au!");
}

public class Gato : Animal
{
    public override void EmitirSom() => Console.WriteLine($"{Nome}: Miau!");
}`}</code></pre>

      <h2>Polimorfismo em runtime: o pulo do gato</h2>
      <p>
        A mágica acontece quando você guarda objetos de várias filhas em uma variável (ou coleção) do tipo da pai. Mesmo que a variável "ache" que tem um <code>Animal</code>, na hora de chamar <code>EmitirSom()</code>, o C# verifica em runtime qual é o tipo <em>real</em> do objeto e chama a versão certa. Isso se chama <strong>despacho dinâmico</strong>.
      </p>
      <pre><code>{`Animal[] zoo = new Animal[]
{
    new Cachorro { Nome = "Rex" },
    new Gato     { Nome = "Mia" },
    new Cachorro { Nome = "Bob" }
};

foreach (var bicho in zoo)
{
    bicho.EmitirSom();
    // Rex: Au au!
    // Mia: Miau!
    // Bob: Au au!
}`}</code></pre>
      <p>
        Note como o <code>foreach</code> não precisa saber se o bicho é cachorro ou gato. Esse desacoplamento é ouro: amanhã você adiciona uma classe <code>Vaca</code> que herda de <code>Animal</code>, e o loop continua funcionando sem mudar uma linha.
      </p>

      <AlertBox type="info" title="Por que isso é tão importante?"
      >
        Polimorfismo é a base do princípio <strong>Open/Closed</strong>: seu código fica aberto para extensão (novas classes) e fechado para modificação (não precisa mexer no código existente). Isso reduz drasticamente os bugs ao crescer o sistema.
      </AlertBox>

      <h2>Hiding com <code>new</code>: o quase-polimorfismo</h2>
      <p>
        Existe uma alternativa ao <code>override</code>: a palavra <code>new</code> em métodos. Ela <strong>oculta</strong> (não substitui!) o método da pai. A diferença é sutil, mas crítica:
      </p>
      <pre><code>{`public class Veiculo
{
    public virtual void Mover() => Console.WriteLine("Veículo se movendo.");
}

public class Carro : Veiculo
{
    // 'new' oculta, NÃO sobrescreve
    public new void Mover() => Console.WriteLine("Carro andando na estrada.");
}

Veiculo v = new Carro();
v.Mover(); // "Veículo se movendo." - chama a versão da pai!

Carro c = new Carro();
c.Mover(); // "Carro andando na estrada." - chama a versão do filho`}</code></pre>
      <p>
        Veja: com <code>new</code>, qual versão é chamada depende do <em>tipo da variável</em>, não do tipo real do objeto. Quase sempre <code>override</code> é o que você quer. Use <code>new</code> só em casos raríssimos (geralmente quando você não pode editar a pai e precisa "esconder" um método de mesmo nome).
      </p>

      <AlertBox type="warning" title="O compilador avisa"
      >
        Se você criar um método com mesmo nome de um método virtual da pai sem usar <code>override</code> nem <code>new</code>, o compilador gera um aviso. Sempre seja explícito: ou substitua (<code>override</code>) ou oculte (<code>new</code>) intencionalmente.
      </AlertBox>

      <h2>Casting: convertendo entre tipos da hierarquia</h2>
      <p>
        Quando você tem um <code>Animal</code> mas sabe que ele é, na verdade, um <code>Cachorro</code> com método específico de cachorro (digamos, <code>BalancarRabo()</code>), precisa fazer um <em>cast</em> — uma conversão explícita. Existem três formas seguras:
      </p>
      <pre><code>{`Animal a = new Cachorro { Nome = "Rex" };

// 1) Cast direto: lança InvalidCastException se errar
Cachorro c1 = (Cachorro)a;
c1.EmitirSom();

// 2) 'as': devolve null se não der certo (sem exceção)
Cachorro? c2 = a as Cachorro;
if (c2 != null) c2.EmitirSom();

// 3) 'is' com pattern matching (a forma moderna preferida)
if (a is Cachorro c3)
{
    c3.EmitirSom(); // só entra aqui se realmente for Cachorro
}`}</code></pre>

      <h2>Polimorfismo na prática: processador de pagamentos</h2>
      <p>
        Um exemplo realista: você tem várias formas de pagamento (cartão, boleto, Pix). Em vez de um <code>switch</code> gigante, você usa polimorfismo:
      </p>
      <pre><code>{`public class Pagamento
{
    public decimal Valor { get; init; }
    public virtual void Processar() => Console.WriteLine($"Processando {Valor:C}");
}

public class PagamentoCartao : Pagamento
{
    public override void Processar()
        => Console.WriteLine($"Cobrando {Valor:C} no cartão...");
}

public class PagamentoPix : Pagamento
{
    public override void Processar()
        => Console.WriteLine($"Gerando QR Code Pix de {Valor:C}...");
}

public class PagamentoBoleto : Pagamento
{
    public override void Processar()
        => Console.WriteLine($"Emitindo boleto de {Valor:C} (3 dias úteis).");
}

// Uso uniforme
Pagamento[] pendentes =
{
    new PagamentoCartao { Valor = 199.90m },
    new PagamentoPix    { Valor = 50m },
    new PagamentoBoleto { Valor = 1000m }
};

foreach (var p in pendentes) p.Processar();`}</code></pre>
      <p>
        Adicionar um novo método de pagamento é só criar mais uma filha de <code>Pagamento</code>. O loop não muda. Esse é o poder real do polimorfismo no dia a dia.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>virtual</code> na pai</strong>: a filha não consegue usar <code>override</code>; o compilador acusa erro pedindo a palavra <code>new</code> ou avisando que o método não é overridable.</li>
        <li><strong>Confundir <code>new</code> com <code>override</code></strong>: <code>new</code> oculta (despacho estático); <code>override</code> substitui (despacho dinâmico). Quase sempre você quer <code>override</code>.</li>
        <li><strong>Cast inseguro com <code>(Tipo)x</code></strong>: explode com <code>InvalidCastException</code>. Use <code>is</code> ou <code>as</code> para checar primeiro.</li>
        <li><strong>Hierarquia rasa demais</strong>: às vezes uma <code>interface</code> resolve melhor que herdar de uma classe — usaremos isso no capítulo de interfaces.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Polimorfismo = "um nome, várias implementações" escolhidas em runtime.</li>
        <li>Use <code>virtual</code> + <code>override</code> para permitir e fornecer substituição.</li>
        <li>Você pode tratar uma coleção heterogênea pela classe-base.</li>
        <li><code>new</code> em métodos oculta, não substitui — quase sempre evite.</li>
        <li>Para converter entre tipos use <code>is Tipo x</code> (preferido), <code>as</code> ou cast direto.</li>
        <li>Polimorfismo é a base para código aberto a extensão e fechado a modificação.</li>
      </ul>
    </PageContainer>
  );
}
