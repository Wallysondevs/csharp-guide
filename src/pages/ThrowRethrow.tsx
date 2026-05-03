import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ThrowRethrow() {
  return (
    <PageContainer
      title="throw e rethrow: preservando o stack trace"
      subtitle="A diferença entre throw; e throw ex; parece um detalhe ortográfico. Na verdade, é a diferença entre debugar em 5 minutos e em 5 horas."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Quando uma exceção é lançada, o runtime guarda dentro dela uma <strong>stack trace</strong>: a lista de métodos pelos quais ela passou até ser capturada. É como o rastro deixado por um detetive — diz exatamente onde o crime começou. Perder esse rastro é o pesadelo de qualquer engenheiro tentando achar um bug em produção. Este capítulo é sobre como <em>jogar</em> exceções (com <code>throw</code>) e como <em>relançar</em> sem destruir o rastro.
      </p>

      <h2>Lançando uma exceção pela primeira vez</h2>
      <p>
        Você lança uma exceção com <code>throw new TipoDaExcecao("mensagem")</code>. A partir desse ponto, a execução do método é abortada e o runtime começa a procurar um <code>catch</code> compatível subindo a pilha de chamadas.
      </p>
      <pre><code>{`public decimal Dividir(decimal a, decimal b)
{
    if (b == 0)
        throw new ArgumentException("b não pode ser zero", nameof(b));

    return a / b;
}`}</code></pre>
      <p>
        O segundo argumento, <code>nameof(b)</code>, gera a string literal <code>"b"</code> em tempo de compilação. Se você renomear o parâmetro depois, o compilador atualiza junto — algo que uma string solta nunca conseguiria.
      </p>

      <h2><code>throw;</code> vs <code>throw ex;</code> — a armadilha clássica</h2>
      <p>
        Quando você captura uma exceção e quer relançá-la, a forma como você escreve faz diferença <strong>gigantesca</strong>. <code>throw;</code> sozinho preserva o stack trace original. <code>throw ex;</code> reseta — o rastro passa a apontar para o <em>seu</em> catch, perdendo o local original do erro.
      </p>
      <pre><code>{`try
{
    MetodoQueExplode();
}
catch (Exception ex)
{
    Logger.Error(ex);

    throw;       // ✅ stack trace continua apontando para MetodoQueExplode
    // throw ex; // ❌ stack trace agora aponta para esta linha de catch
}`}</code></pre>
      <p>
        O resultado prático: com <code>throw ex;</code>, sua mensagem de erro vira <em>"falhou em CatchHandler.cs linha 42"</em> em vez de <em>"falhou em ProcessadorDePagamentos.cs linha 137"</em>. Imagine fazer triagem de incidente sem saber qual método quebrou.
      </p>

      <AlertBox type="danger" title="Nunca escreva throw ex;">
        Ao relançar a mesma exceção, use <code>throw;</code> — ponto-final. <code>throw ex;</code> só faz sentido se você está jogando uma exceção <em>diferente</em> da que capturou (e mesmo aí, prefira passar a original como <code>innerException</code>).
      </AlertBox>

      <h2>Embrulhando com inner exception</h2>
      <p>
        Às vezes faz sentido capturar uma exceção de baixo nível e relançar uma de mais alto nível, mais semântica para o seu domínio. Para não perder o contexto original, passe-a como <strong>inner exception</strong> no construtor da nova:
      </p>
      <pre><code>{`public Pedido Carregar(int id)
{
    try
    {
        return _repositorio.BuscarPorId(id);
    }
    catch (SqlException ex)
    {
        // erro técnico → erro de domínio
        throw new PedidoIndisponivelException(
            $"Não foi possível carregar pedido {id}",
            innerException: ex);
    }
}`}</code></pre>
      <p>
        Quem capturar <code>PedidoIndisponivelException</code> vê uma mensagem amigável; quem precisa investigar acessa <code>ex.InnerException</code> e descobre que foi um timeout de SQL.
      </p>

      <h2>Anexando dados extras com <code>Exception.Data</code></h2>
      <p>
        Toda exceção tem uma propriedade <code>Data</code> do tipo <code>IDictionary</code>. Você pode anexar informações úteis no caminho até o handler final, sem criar uma exceção customizada:
      </p>
      <pre><code>{`try
{
    ProcessarLinha(linha);
}
catch (FormatException ex)
{
    ex.Data["NumeroDaLinha"] = numero;
    ex.Data["ConteudoBruto"] = linha;
    throw;        // relança preservando stack + dados anexados
}`}</code></pre>
      <p>
        No log final, você imprime <code>ex.Data</code> e ganha contexto sem precisar criar tipos novos para cada situação.
      </p>

      <h2>ExceptionDispatchInfo: relançar de outro contexto</h2>
      <p>
        Em código assíncrono, é comum você querer "guardar" uma exceção e relançá-la mais tarde, mantendo o stack original. O simples <code>throw guardada;</code> reseta o rastro. A solução é <code>ExceptionDispatchInfo</code>:
      </p>
      <pre><code>{`using System.Runtime.ExceptionServices;

ExceptionDispatchInfo? capturada = null;

try
{
    await OperacaoAsync();
}
catch (Exception ex)
{
    // captura mantendo o stack original
    capturada = ExceptionDispatchInfo.Capture(ex);
}

if (capturada is not null)
{
    // ... fazer outras coisas ...

    capturada.Throw();   // stack trace continua apontando para OperacaoAsync
}`}</code></pre>
      <p>
        Esse mecanismo é o mesmo que <code>await</code> usa internamente para desempacotar exceções de uma <code>Task</code> sem perder o rastro original.
      </p>

      <AlertBox type="info" title="Stack trace é precioso">
        Sempre que possível, prefira: (1) <strong>não capturar</strong> se você não sabe tratar; (2) <code>throw;</code> sozinho para relançar; (3) inner exception para envelopar; (4) <code>ExceptionDispatchInfo</code> para casos avançados. Tudo que perde stack trace é dor futura.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>throw ex;</code> em vez de <code>throw;</code>:</strong> apaga o stack trace original. Erro #1 em code reviews.</li>
        <li><strong>Não passar <code>innerException</code>:</strong> ao envelopar uma exceção, sempre inclua a original como segundo argumento.</li>
        <li><strong>Lançar <code>Exception</code> genérica:</strong> impede catches específicos. Use o tipo mais preciso possível.</li>
        <li><strong>Throw sem mensagem:</strong> <code>throw new InvalidOperationException()</code> sozinho deixa quem investiga no escuro.</li>
        <li><strong>Capturar para apenas relançar:</strong> se não vai logar, anotar dados ou converter, deixe a exceção subir naturalmente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>throw new T(...)</code> lança pela primeira vez.</li>
        <li><code>throw;</code> relança preservando o stack trace original.</li>
        <li><code>throw ex;</code> reseta o stack — quase sempre errado.</li>
        <li>Use <code>innerException</code> ao envelopar para não perder a causa raiz.</li>
        <li><code>Exception.Data</code> permite anexar contexto sem criar tipos novos.</li>
        <li><code>ExceptionDispatchInfo</code> guarda exceção para relançar depois sem perder rastro.</li>
      </ul>
    </PageContainer>
  );
}
