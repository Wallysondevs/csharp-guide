import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Propriedades() {
  return (
    <PageContainer
      title="Propriedades: getters e setters elegantes"
      subtitle="Aprenda a expor dados de uma classe sem abrir mão de validação, segurança e elegância sintática."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine a porta de uma loja: por fora, qualquer cliente pode entrar e sair como se fosse um buraco na parede; por dentro, há fechaduras, sensores e regras (horário de funcionamento, número máximo de pessoas). <strong>Propriedades</strong> em C# são exatamente isso: do lado de quem usa, parecem campos simples (<code>p.Idade = 30</code>); do lado de quem implementa, são pequenos métodos disfarçados que podem validar, calcular ou bloquear o acesso. Esse é o jeito idiomático de C# para juntar simplicidade na chamada com poder na implementação.
      </p>

      <h2>O problema dos campos públicos</h2>
      <p>
        Quando você expõe um <code>public string Nome;</code> diretamente, qualquer parte do programa pode escrever <code>p.Nome = "";</code> ou <code>p.Nome = null;</code> e quebrar suas regras de negócio. Pior: amanhã, se você precisar validar, é tarde — todo mundo já depende do campo. Propriedades resolvem isso desde o dia 1.
      </p>
      <pre><code>{`// RUIM: campo público sem proteção
public class PessoaCampo
{
    public int Idade; // qualquer um pode escrever -1, 999, ou o que quiser
}

// BOM: propriedade que pode ganhar validação no futuro
public class PessoaProp
{
    public int Idade { get; set; }
}`}</code></pre>

      <h2>Auto-properties: a forma mais comum</h2>
      <p>
        A sintaxe <code>{`{ get; set; }`}</code> é uma <strong>auto-property</strong>: o compilador cria, em segredo, um campo escondido para guardar o valor (chamado <em>backing field</em>) e dois mini-métodos (o <code>get</code> que devolve o valor e o <code>set</code> que recebe um novo valor). Você economiza linhas e ganha a possibilidade de evoluir depois.
      </p>
      <pre><code>{`public class Produto
{
    // Auto-property com valor padrão
    public string Nome { get; set; } = "Sem nome";

    // Auto-property somente-leitura externa: só a própria classe pode atribuir
    public decimal Preco { get; private set; }

    public void AplicarDesconto(decimal percentual)
    {
        Preco -= Preco * percentual;
    }
}`}</code></pre>
      <p>
        Note <code>private set;</code>: por fora, ninguém escreve em <code>Preco</code> diretamente; a única forma de mudar é chamar <code>AplicarDesconto</code>. Isso é <strong>encapsulamento</strong> — proteger as regras dentro do objeto.
      </p>

      <h2>Propriedade completa com backing field e validação</h2>
      <p>
        Quando a auto-property não basta — porque você quer validar entrada, normalizar dados ou disparar eventos — escreva a propriedade na forma <em>completa</em>, com um campo escondido feito por você (geralmente nomeado começando com <code>_</code>) e o corpo do <code>set</code> escrito explicitamente.
      </p>
      <pre><code>{`public class Conta
{
    private decimal _saldo; // backing field manual

    public decimal Saldo
    {
        get => _saldo; // expression-bodied: jeito curto de escrever { return _saldo; }
        set
        {
            if (value < 0)
                throw new ArgumentOutOfRangeException(nameof(value), "Saldo não pode ser negativo.");
            _saldo = value;
        }
    }
}

var c = new Conta();
c.Saldo = 100;     // OK
c.Saldo = -50;     // Lança exceção: regra protegida pelo set`}</code></pre>
      <p>
        A palavra-chave <code>value</code> dentro do <code>set</code> é o valor que está sendo atribuído. <code>nameof(value)</code> devolve a string <code>"value"</code> sem você ter que digitá-la — útil porque, se renomear, o compilador atualiza.
      </p>

      <h2>Init-only: imutabilidade após a construção</h2>
      <p>
        Desde C# 9, você pode trocar <code>set</code> por <code>init</code>. Isso significa: "pode escrever apenas durante a criação do objeto; depois, vira somente-leitura". É perfeito para objetos que devem ser imutáveis — como configurações ou DTOs.
      </p>
      <pre><code>{`public class Configuracao
{
    public string Host { get; init; } = "localhost";
    public int Porta { get; init; } = 8080;
}

var cfg = new Configuracao { Host = "api.exemplo.com", Porta = 443 };
// cfg.Porta = 80; // ERRO de compilação: não pode escrever após init.`}</code></pre>

      <AlertBox type="info" title="Por que init é melhor que set quando não vai mudar">
        <code>init</code> documenta sua intenção (esse valor é congelado depois da construção), evita bugs e permite usar <em>object initializer</em> sem precisar criar um construtor com mil parâmetros.
      </AlertBox>

      <h2>Computed properties (calculadas)</h2>
      <p>
        Nem toda propriedade precisa guardar um valor. Algumas calculam na hora, baseadas em outras propriedades. Use a forma <strong>expression-bodied</strong> para deixar o código compacto:
      </p>
      <pre><code>{`public class Retangulo
{
    public double Largura { get; init; }
    public double Altura { get; init; }

    // Propriedade calculada: não tem set, é derivada de outras
    public double Area => Largura * Altura;
    public double Perimetro => 2 * (Largura + Altura);
}

var r = new Retangulo { Largura = 5, Altura = 3 };
Console.WriteLine(r.Area);      // 15
Console.WriteLine(r.Perimetro); // 16`}</code></pre>
      <p>
        <code>Area</code> e <code>Perimetro</code> não têm backing field. Cada vez que alguém lê, o cálculo roda de novo. Isso é ótimo para evitar dados duplicados e inconsistentes.
      </p>

      <h2>Readonly property (sem set algum)</h2>
      <p>
        Se a propriedade só faz sentido em leitura — como um identificador único atribuído na construção — declare apenas o <code>get</code> (a forma curta também serve). O valor é definido no construtor e jamais muda.
      </p>
      <pre><code>{`public class Pedido
{
    public Guid Id { get; } = Guid.NewGuid(); // só get; valor congela na criação
    public DateTime CriadoEm { get; } = DateTime.UtcNow;
}`}</code></pre>

      <AlertBox type="warning" title="Validação fora do setter">
        Se a regra de validação depender de várias propriedades juntas (ex.: data de fim &gt; data de início), o setter de uma só não é o lugar ideal. Considere validar no construtor ou em um método <code>Validar()</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>= ""</code> em <code>string</code> properties</strong>: deixa o valor padrão como <code>null</code>, e em projetos com <em>nullable reference types</em> ativado o compilador reclama.</li>
        <li><strong>Confundir <code>=&gt;</code> de expression-bodied com setter de campo</strong>: <code>public int X =&gt; 10;</code> é uma propriedade calculada constante, não atribuição.</li>
        <li><strong>Usar <code>set</code> público em propriedade que nunca deveria mudar</strong>: prefira <code>init</code> ou <code>private set</code>.</li>
        <li><strong>Lançar exceções "silenciosas" no setter</strong>: documente a exceção esperada (<code>ArgumentException</code>, <code>ArgumentOutOfRangeException</code>) para quem usa entender.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Propriedades parecem campos por fora, mas são métodos por dentro.</li>
        <li><code>{`{ get; set; }`}</code> = auto-property; o compilador cria o campo escondido.</li>
        <li><code>{`{ get; init; }`}</code> = só pode atribuir na criação (imutável depois).</li>
        <li><code>{`{ get; private set; }`}</code> = só a própria classe altera.</li>
        <li>Propriedade completa permite validar com <code>value</code> dentro do <code>set</code>.</li>
        <li>Use <code>=&gt;</code> para propriedades calculadas curtas.</li>
      </ul>
    </PageContainer>
  );
}
