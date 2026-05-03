import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ClassesAbstract() {
  return (
    <PageContainer
      title="Classes abstratas: contratos parcialmente implementados"
      subtitle="Aprenda a definir uma classe que serve apenas como modelo, obrigando filhas a implementar partes essenciais."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine um manual de "como ser uma forma geométrica": toda forma deve saber calcular sua área. Mas o cálculo da área de um círculo é diferente do cálculo de um quadrado — não dá para o manual fornecer a fórmula universal. Por outro lado, todas as formas concordam em ter um nome, uma cor, um método para imprimir suas informações. Uma <strong>classe abstrata</strong> é exatamente esse manual: parte está pronta, parte é exigida das filhas. Ela funciona como um meio-termo entre uma classe concreta (totalmente pronta) e uma interface (puramente um contrato).
      </p>

      <h2>O que é uma classe <code>abstract</code>?</h2>
      <p>
        Uma classe marcada com <code>abstract</code> tem duas características-chave:
      </p>
      <ul>
        <li>Você <strong>não pode instanciá-la</strong> diretamente com <code>new</code>. Faz sentido — não existe "uma forma genérica", só formas específicas.</li>
        <li>Ela pode (e geralmente deve) declarar <strong>métodos abstratos</strong>: declarações sem corpo que <em>obrigam</em> as filhas a implementar.</li>
      </ul>
      <pre><code>{`public abstract class Forma
{
    public string Cor { get; init; } = "Preto";

    // Método abstrato: sem corpo, termina com ;
    // Toda filha É OBRIGADA a fornecer uma implementação
    public abstract double CalcularArea();

    // Método concreto: já tem comportamento padrão e é herdado normalmente
    public void Descrever()
    {
        Console.WriteLine($"Forma {Cor} com área {CalcularArea():F2}.");
    }
}`}</code></pre>
      <p>
        Note como <code>CalcularArea</code> não tem corpo (nem chaves <code>{`{ }`}</code>) — apenas a assinatura terminada em ponto-e-vírgula. Isso é a marca de um método abstrato.
      </p>

      <h2>Exemplo prático: Círculo e Quadrado</h2>
      <p>
        Vamos criar duas filhas concretas de <code>Forma</code>. Cada uma <strong>deve</strong> implementar <code>CalcularArea</code>, mas herda <code>Cor</code> e <code>Descrever</code> de graça.
      </p>
      <pre><code>{`public class Circulo : Forma
{
    public double Raio { get; init; }

    // 'override' obrigatório para implementar o abstract
    public override double CalcularArea() => Math.PI * Raio * Raio;
}

public class Quadrado : Forma
{
    public double Lado { get; init; }

    public override double CalcularArea() => Lado * Lado;
}

Forma[] formas =
{
    new Circulo  { Cor = "Vermelho", Raio = 3 },
    new Quadrado { Cor = "Azul",     Lado = 4 }
};

foreach (var f in formas) f.Descrever();
// Forma Vermelho com área 28,27.
// Forma Azul com área 16,00.`}</code></pre>

      <h2>Por que não posso instanciar?</h2>
      <p>
        Tentar fazer <code>new Forma()</code> dá erro de compilação. A justificativa é semântica: se <code>CalcularArea</code> não tem implementação, qual área seria devolvida? Nenhuma resposta seria correta. Forçar a impossibilidade de instanciar protege seu programa de chamar métodos vazios.
      </p>
      <pre><code>{`// var f = new Forma();
// ERRO CS0144: Cannot create an instance of the abstract type 'Forma'`}</code></pre>

      <AlertBox type="info" title="Pode ter construtor sim"
      >
        Uma classe abstrata pode (e frequentemente tem) construtores. Eles não criam instâncias diretas dela, mas são chamados pelas filhas via <code>: base(...)</code> para inicializar campos comuns.
      </AlertBox>

      <h2>Métodos concretos junto de abstratos</h2>
      <p>
        O grande poder de uma classe abstrata, comparado a uma interface tradicional, é poder oferecer <strong>código pronto</strong> ao lado das obrigações. Filhas reaproveitam o código pronto e só preenchem o que é específico.
      </p>
      <pre><code>{`public abstract class Notificador
{
    public string Destinatario { get; init; } = "";

    // Concreto: estratégia comum para todas as filhas
    public void Enviar(string mensagem)
    {
        Console.WriteLine($"[{DateTime.Now:T}] Enviando para {Destinatario}...");
        EnviarConteudo(mensagem); // delega o "como" para a filha
        Console.WriteLine("Enviado.");
    }

    // Abstrato: cada filha decide o canal específico
    protected abstract void EnviarConteudo(string mensagem);
}

public class NotificadorEmail : Notificador
{
    protected override void EnviarConteudo(string m)
        => Console.WriteLine($"Email body: {m}");
}

public class NotificadorSms : Notificador
{
    protected override void EnviarConteudo(string m)
        => Console.WriteLine($"SMS: {m[..Math.Min(160, m.Length)]}");
}`}</code></pre>
      <p>
        Esse padrão se chama <strong>Template Method</strong>: a pai define o "esqueleto" (o que fazer), e as filhas preenchem as etapas específicas (o como).
      </p>

      <h2>Propriedades abstratas</h2>
      <p>
        Não só métodos podem ser abstratos. Propriedades também — declarando os acessadores sem corpo. Filhas implementam normalmente.
      </p>
      <pre><code>{`public abstract class Funcionario
{
    public string Nome { get; init; } = "";

    // Propriedade abstrata: cada cargo tem seu cálculo de salário
    public abstract decimal Salario { get; }
}

public class Vendedor : Funcionario
{
    public decimal Comissao { get; init; }
    public override decimal Salario => 2000m + Comissao;
}

public class Gerente : Funcionario
{
    public override decimal Salario => 8000m;
}`}</code></pre>

      <AlertBox type="warning" title="Abstract vs interface"
      >
        Use <strong>classe abstrata</strong> quando há código a compartilhar e a relação é "é-um". Use <strong>interface</strong> quando você só quer definir um contrato, sem implementação compartilhada (ou quando uma classe precisa "ser" várias coisas — herança múltipla de interfaces). Veremos interfaces no próximo capítulo.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar <code>new ClasseAbstrata()</code></strong>: o compilador bloqueia. Você precisa criar uma filha concreta primeiro.</li>
        <li><strong>Esquecer de implementar todos os <code>abstract</code></strong>: a filha vira automaticamente abstrata também (herda a obrigação) e o compilador exige que você marque ela como <code>abstract</code> ou implemente os métodos.</li>
        <li><strong>Marcar tudo como <code>abstract</code>: se a sua classe não tem nada implementado, talvez você quisesse uma <em>interface</em>, não uma classe abstrata.</strong></li>
        <li><strong>Esquecer <code>override</code> ao implementar</strong>: o compilador acusa erro pedindo a palavra-chave.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Classe <code>abstract</code> não pode ser instanciada com <code>new</code>.</li>
        <li>Métodos <code>abstract</code> não têm corpo e obrigam filhas a implementar.</li>
        <li>Pode misturar membros abstratos com membros concretos (já implementados).</li>
        <li>Filhas usam <code>override</code> para satisfazer o contrato abstrato.</li>
        <li>Padrão Template Method: pai abstrata define o esqueleto, filhas preenchem detalhes.</li>
        <li>Use abstrata quando há código pra reaproveitar; use interface quando só quer contrato.</li>
      </ul>
    </PageContainer>
  );
}
