import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ExceptionFilters() {
  return (
    <PageContainer
      title="Exception filters: catch when (...)"
      subtitle="Um truque elegante e pouco conhecido: decidir capturar uma exceção só quando uma condição é verdadeira — sem destruir o stack trace."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Desde o C# 6, existe um recurso pequeno mas poderoso: <strong>exception filters</strong>. Eles permitem que um <code>catch</code> aceite uma exceção apenas se uma <em>condição booleana</em> for verdadeira. Pense num porteiro de balada que só deixa passar quem está na lista. Se a condição falhar, é como se o <code>catch</code> nem existisse — a exceção continua subindo a pilha à procura de outro candidato.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        A palavra-chave é <code>when</code>, colocada logo depois do tipo na declaração do <code>catch</code>:
      </p>
      <pre><code>{`try
{
    await http.GetStringAsync("https://api.exemplo.com");
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    Console.WriteLine("Recurso não existe — ignorando");
}
catch (HttpRequestException ex) when (ex.StatusCode >= HttpStatusCode.InternalServerError)
{
    Console.WriteLine("Erro do servidor — vou tentar de novo depois");
}`}</code></pre>
      <p>
        Os dois catches capturam o <em>mesmo</em> tipo (<code>HttpRequestException</code>), mas reagem a <em>cenários diferentes</em> graças ao <code>when</code>. Sem filtros, você teria que capturar uma vez e fazer um <code>if</code> dentro — perdendo elegância e, como veremos, o stack trace.
      </p>

      <h2>Por que não usar um <code>if</code> dentro do catch?</h2>
      <p>
        À primeira vista, parece equivalente:
      </p>
      <pre><code>{`// versão antiga, com if interno
catch (HttpRequestException ex)
{
    if (ex.StatusCode == HttpStatusCode.NotFound)
        Console.WriteLine("Recurso não existe");
    else
        throw;   // relança se não for o caso que quero
}`}</code></pre>
      <p>
        Mas há uma diferença crucial: quando o <code>catch</code> é <strong>entrado</strong>, o runtime já fez o <em>unwind da pilha</em> (desempilhamento das chamadas). Se você relança, o stack trace original pode ser embaralhado e debuggers/profilers já registraram que a exceção foi tratada. Com <code>when</code>, a condição é avaliada <strong>antes</strong> do unwind: se for <code>false</code>, a pilha permanece intacta e a exceção continua "voando" naturalmente.
      </p>

      <AlertBox type="info" title="Por que isso importa na prática">
        Em ferramentas como o Visual Studio, "first chance exception" indica que a exceção foi disparada. Com <code>when</code>, o handler que falha o filtro <strong>não conta</strong> como tratamento, então o debugger continua quebrando no ponto original do <code>throw</code> como se nada tivesse acontecido.
      </AlertBox>

      <h2>Caso clássico: logging condicional</h2>
      <p>
        Um truque muito usado é "abusar" do filtro como gancho de logging que <em>nunca</em> realmente captura a exceção. O método sempre retorna <code>false</code>, então a exceção continua subindo:
      </p>
      <pre><code>{`public bool LogarESeguir(Exception ex, string contexto)
{
    Logger.Error(ex, "Falha em {Contexto}", contexto);
    return false;   // sempre falso → catch não captura
}

try
{
    ProcessarPagamento();
}
catch (Exception ex) when (LogarESeguir(ex, "ProcessarPagamento"))
{
    // nunca entra aqui — só serve para satisfazer a sintaxe
}`}</code></pre>
      <p>
        O efeito: a exceção é logada com stack trace original e contexto adicional, e segue subindo como se nunca tivesse sido tocada. Isso é útil em camadas onde você quer <em>observar</em> o erro sem mudar o fluxo.
      </p>

      <h2>Filtros mais expressivos</h2>
      <p>
        A condição em <code>when</code> pode ser qualquer expressão booleana — chamar métodos, comparar propriedades, usar <code>is</code>:
      </p>
      <pre><code>{`try
{
    Salvar(usuario);
}
catch (DbUpdateException ex)
    when (ex.InnerException is SqlException sql && sql.Number == 2627)
{
    // 2627 = violação de unique key
    throw new EmailJaCadastradoException(usuario.Email, ex);
}
catch (DbUpdateException ex)
    when (ex.InnerException is SqlException { Number: 1205 })
{
    // 1205 = deadlock — vamos tentar de novo
    await Task.Delay(100);
    Salvar(usuario);
}`}</code></pre>
      <p>
        Repare como combinamos <code>when</code> com <strong>pattern matching</strong> (o <code>is SqlException sql</code> e o property pattern <code>{`{ Number: 1205 }`}</code>). Você pode até declarar variáveis no padrão e usá-las dentro do bloco do <code>catch</code>.
      </p>

      <h2>Tratando erros transitórios com retry</h2>
      <p>
        Filtros são excelentes para distinguir erros recuperáveis de fatais:
      </p>
      <pre><code>{`async Task<string> BuscarComRetryAsync(string url)
{
    int tentativa = 0;
    while (true)
    {
        try
        {
            return await http.GetStringAsync(url);
        }
        catch (HttpRequestException ex)
            when (ex.StatusCode is HttpStatusCode.RequestTimeout
                                  or HttpStatusCode.ServiceUnavailable
                                  or HttpStatusCode.GatewayTimeout
                  && ++tentativa < 3)
        {
            await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, tentativa)));
        }
    }
}`}</code></pre>
      <p>
        Aqui o filtro testa se é um status <em>transiente</em> (timeout, indisponível) <strong>e</strong> se ainda temos tentativas. Se ambas verdadeiras, capturamos e fazemos backoff exponencial. Se for outro erro (404, 401), o catch não acolhe e a exceção sobe.
      </p>

      <AlertBox type="warning" title="Não exagere na lógica do filtro">
        O filtro deve ser barato e sem efeitos colaterais. Chamadas pesadas ou que possam <em>elas mesmas</em> lançar exceções dentro do <code>when</code> tornam o código difícil de raciocinar. Se a condição é complexa, encapsule em um método pequeno e bem-nomeado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Filtro com efeito colateral:</strong> evite alterar estado dentro de <code>when</code> — fica ilegível e confuso.</li>
        <li><strong>Lançar exceção dentro do filtro:</strong> a exceção do filtro é <em>silenciosamente engolida</em> e o filtro vira <code>false</code>. Isso esconde bugs.</li>
        <li><strong>Misturar com if dentro do catch:</strong> escolha um padrão. Filtros são mais limpos para escolha de catch; ifs internos para lógica adicional após captura.</li>
        <li><strong>Esquecer que filtros não unwindam a pilha:</strong> ótimo para debug — mas significa que você não pode "limpar" estado parcial antes do filtro decidir.</li>
        <li><strong>Comparar string da Message:</strong> mensagens variam por idioma. Use <code>StatusCode</code>, <code>HResult</code>, ou tipo da inner.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>catch (T ex) when (cond)</code> só captura se a condição for verdadeira.</li>
        <li>Avaliado <strong>antes</strong> do unwind da pilha — preserva stack trace e debugging.</li>
        <li>Mais limpo que capturar e relançar com <code>throw;</code>.</li>
        <li>Combina muito bem com pattern matching.</li>
        <li>Permite trick de logging com função que sempre retorna <code>false</code>.</li>
        <li>Mantenha o filtro barato e sem side effects.</li>
      </ul>
    </PageContainer>
  );
}
