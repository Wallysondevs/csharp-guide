import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ComentariosXmldoc() {
  return (
    <PageContainer
      title="Comentários e documentação XML"
      subtitle="De // simples ao /// que vira IntelliSense, site de docs e arquivo .xml para distribuir com sua biblioteca."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Código sem comentários é como receita de bolo sem instruções: a lista de ingredientes está lá, mas boa sorte montando o resultado. C# oferece três formas de comentar: o tradicional <code>//</code>, o multi-linha <code>/* */</code> e a estrela do show — o <code>///</code> de <strong>documentação XML</strong>, que vira <em>IntelliSense</em> automático no editor e arquivos de documentação navegáveis. Saber usar bem cada um faz seu código respeitar o leitor (que muitas vezes é você daqui a seis meses).
      </p>

      <h2>Comentários simples</h2>
      <p>
        Servem para anotar <strong>como</strong> ou <strong>por que</strong> uma linha existe. O compilador os ignora completamente; eles desaparecem após a compilação.
      </p>
      <pre><code>{`// Comentário de uma linha — vai até o fim da linha

/* Comentário de múltiplas linhas:
   pode ocupar quantas linhas você quiser
   e termina aqui */

int x = 10; // Comentário no fim da linha (após código)

/*
 * Estilo "javadoc" antigo, ainda usado às vezes
 * para destacar visualmente
 */`}</code></pre>

      <AlertBox type="info" title="Comente o PORQUÊ, não o O QUÊ">
        Comentário ruim: <code>// incrementa i</code> seguido de <code>i++;</code>. Comentário bom: <code>// retry exponencial: 1s, 2s, 4s para dar fôlego ao serviço</code>. Bom código se documenta sozinho; comentários explicam intenção e contexto.
      </AlertBox>

      <h2>Documentação XML com <code>///</code></h2>
      <p>
        Três barras <code>///</code> seguidas iniciam um comentário <strong>de documentação</strong>. O conteúdo segue uma sintaxe XML específica que o editor entende e usa para mostrar dicas (IntelliSense) e que pode ser exportada para HTML, Markdown ou PDF.
      </p>
      <pre><code>{`/// <summary>
/// Calcula a média aritmética de uma lista de notas.
/// </summary>
/// <param name="notas">Coleção não vazia com as notas.</param>
/// <returns>Média entre 0 e 10.</returns>
/// <exception cref="ArgumentException">
/// Lançada quando a lista está vazia.
/// </exception>
public static double CalcularMedia(IEnumerable<double> notas)
{
    if (!notas.Any())
        throw new ArgumentException("Lista vazia", nameof(notas));

    return notas.Average();
}`}</code></pre>
      <p>
        Quando outro programador (ou você mesmo) digitar <code>CalcularMedia(</code> em outro arquivo, o editor mostrará automaticamente o resumo, os parâmetros e o tipo de retorno em um popup. Isso transforma seu código em uma <em>biblioteca autodocumentada</em>.
      </p>

      <h2>As tags mais usadas</h2>
      <table>
        <thead><tr><th>Tag</th><th>Para quê</th></tr></thead>
        <tbody>
          <tr><td><code>&lt;summary&gt;</code></td><td>Descrição curta (1-2 frases)</td></tr>
          <tr><td><code>&lt;remarks&gt;</code></td><td>Detalhes longos, considerações de uso</td></tr>
          <tr><td><code>&lt;param name="x"&gt;</code></td><td>Descreve cada parâmetro</td></tr>
          <tr><td><code>&lt;returns&gt;</code></td><td>O que o método devolve</td></tr>
          <tr><td><code>&lt;exception cref="T"&gt;</code></td><td>Exceções que podem ser lançadas</td></tr>
          <tr><td><code>&lt;example&gt;</code></td><td>Exemplo de uso (geralmente com <code>&lt;code&gt;</code>)</td></tr>
          <tr><td><code>&lt;see cref="T"/&gt;</code></td><td>Link para outro tipo/membro</td></tr>
          <tr><td><code>&lt;seealso cref="T"/&gt;</code></td><td>"Veja também" no rodapé</td></tr>
          <tr><td><code>&lt;typeparam name="T"&gt;</code></td><td>Documenta um parâmetro genérico</td></tr>
          <tr><td><code>&lt;inheritdoc/&gt;</code></td><td>Herda doc do membro sobrescrito</td></tr>
        </tbody>
      </table>

      <h2>Exemplo completo de classe documentada</h2>
      <pre><code>{`namespace MeuApp.Banking;

/// <summary>
/// Representa uma conta bancária simples com operações
/// de depósito e saque.
/// </summary>
/// <remarks>
/// Esta classe não é thread-safe. Para uso concorrente,
/// envolva chamadas com lock.
/// </remarks>
/// <example>
/// <code>
/// var conta = new ContaBancaria("Maria", 1000m);
/// conta.Depositar(500m);
/// Console.WriteLine(conta.Saldo); // 1500
/// </code>
/// </example>
public class ContaBancaria
{
    /// <summary>Nome do titular da conta.</summary>
    public string Titular { get; }

    /// <summary>Saldo atual em reais.</summary>
    public decimal Saldo { get; private set; }

    /// <summary>
    /// Cria uma nova conta com saldo inicial.
    /// </summary>
    /// <param name="titular">Nome do dono da conta.</param>
    /// <param name="saldoInicial">Valor inicial (não negativo).</param>
    /// <exception cref="ArgumentException">
    /// Quando <paramref name="saldoInicial"/> é negativo.
    /// </exception>
    public ContaBancaria(string titular, decimal saldoInicial)
    {
        if (saldoInicial < 0)
            throw new ArgumentException("Saldo inicial não pode ser negativo");

        Titular = titular;
        Saldo = saldoInicial;
    }

    /// <summary>Adiciona valor ao saldo.</summary>
    /// <param name="valor">Quantia positiva a depositar.</param>
    /// <seealso cref="Sacar(decimal)"/>
    public void Depositar(decimal valor)
    {
        Saldo += valor;
    }

    /// <summary>Retira valor do saldo, se houver fundos.</summary>
    /// <param name="valor">Quantia a sacar.</param>
    /// <returns><c>true</c> se a operação foi bem-sucedida.</returns>
    public bool Sacar(decimal valor)
    {
        if (valor > Saldo) return false;
        Saldo -= valor;
        return true;
    }
}`}</code></pre>

      <h2>Gerando o arquivo .xml</h2>
      <p>
        Por padrão, comentários <code>///</code> só aparecem como IntelliSense <em>dentro</em> do projeto. Para que outras pessoas (consumidores da sua biblioteca) também os vejam, você precisa <strong>gerar o arquivo XML</strong>. Adicione no <code>.csproj</code>:
      </p>
      <pre><code>{`<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);CS1591</NoWarn>
</PropertyGroup>`}</code></pre>
      <p>
        Após o build, surge um <code>MinhaLib.xml</code> ao lado do <code>MinhaLib.dll</code>. Ferramentas como <strong>DocFX</strong>, <strong>Sandcastle</strong> e <strong>Doxygen</strong> consomem esse XML para gerar sites de documentação. O NuGet também o empacota automaticamente quando você publica.
      </p>

      <AlertBox type="warning" title="Aviso CS1591">
        Com <code>GenerateDocumentationFile=true</code>, qualquer membro <em>público</em> sem <code>///</code> gera warning CS1591 ("Missing XML comment for publicly visible type"). Suprima com <code>&lt;NoWarn&gt;CS1591&lt;/NoWarn&gt;</code> ou — melhor — documente tudo.
      </AlertBox>

      <h2>Tags úteis dentro de comentários</h2>
      <pre><code>{`/// <summary>
/// Faz <c>algo</c> importante.
/// 
/// Use <see cref="OutroMetodo"/> para a versão assíncrona.
/// 
/// <para>
/// Este é um parágrafo separado dentro do summary.
/// </para>
/// 
/// <list type="bullet">
///   <item>Primeiro item</item>
///   <item>Segundo item</item>
/// </list>
/// </summary>
public void Fazer() { }`}</code></pre>
      <p>
        <code>&lt;c&gt;</code> formata texto monoespaçado inline. <code>&lt;code&gt;</code> formata bloco. <code>&lt;para&gt;</code> separa parágrafos. <code>&lt;see cref="..."/&gt;</code> vira link clicável no IntelliSense.
      </p>

      <h2>O atributo <code>cref</code></h2>
      <p>
        <code>cref</code> aceita o nome de qualquer tipo ou membro acessível: <code>cref="String"</code>, <code>cref="ContaBancaria.Sacar(decimal)"</code>, <code>cref="System.IO.File.ReadAllText(string)"</code>. O compilador <strong>valida</strong> esses references — se você renomear o método e esquecer da doc, ele te avisa. Excelente para evitar documentação desatualizada.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Comentários gigantes copiando assinatura do método:</strong> redundância. O resumo deve agregar <em>contexto</em>, não repetir o óbvio.</li>
        <li><strong>Esquecer <code>&lt;param&gt;</code>:</strong> a IDE só mostra dicas de parâmetros se eles estiverem documentados.</li>
        <li><strong>XML mal-formado:</strong> uma <code>&lt;</code> não escapada quebra o build com mensagem confusa. Use <code>&amp;lt;</code> em prosa.</li>
        <li><strong>Misturar <code>///</code> e <code>//</code> no mesmo bloco:</strong> só linhas <em>contínuas</em> com <code>///</code> formam um único comentário XML.</li>
        <li><strong>Documentar membros privados:</strong> não vale a pena — só <code>public</code>/<code>protected</code> aparecem no IntelliSense de fora.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>//</code> e <code>/* */</code> para anotações livres.</li>
        <li><code>///</code> para documentação XML que vira IntelliSense automático.</li>
        <li>Tags principais: <code>summary</code>, <code>param</code>, <code>returns</code>, <code>exception</code>, <code>example</code>.</li>
        <li><code>GenerateDocumentationFile</code> no .csproj cria o <code>.xml</code> distribuível.</li>
        <li>Use <code>&lt;see cref="..."/&gt;</code> para links validados pelo compilador.</li>
        <li>Documente o <em>porquê</em>; o <em>o quê</em> deve estar no nome do método.</li>
      </ul>
    </PageContainer>
  );
}
