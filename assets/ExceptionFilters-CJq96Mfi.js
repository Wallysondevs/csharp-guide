import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"Exception filters: catch when (...)",subtitle:"Um truque elegante e pouco conhecido: decidir capturar uma exceção só quando uma condição é verdadeira — sem destruir o stack trace.",difficulty:"intermediario",timeToRead:"10 min",children:[e.jsxs("p",{children:["Desde o C# 6, existe um recurso pequeno mas poderoso: ",e.jsx("strong",{children:"exception filters"}),". Eles permitem que um ",e.jsx("code",{children:"catch"})," aceite uma exceção apenas se uma ",e.jsx("em",{children:"condição booleana"})," for verdadeira. Pense num porteiro de balada que só deixa passar quem está na lista. Se a condição falhar, é como se o ",e.jsx("code",{children:"catch"})," nem existisse — a exceção continua subindo a pilha à procura de outro candidato."]}),e.jsx("h2",{children:"Sintaxe básica"}),e.jsxs("p",{children:["A palavra-chave é ",e.jsx("code",{children:"when"}),", colocada logo depois do tipo na declaração do ",e.jsx("code",{children:"catch"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`try
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
}`})}),e.jsxs("p",{children:["Os dois catches capturam o ",e.jsx("em",{children:"mesmo"})," tipo (",e.jsx("code",{children:"HttpRequestException"}),"), mas reagem a ",e.jsx("em",{children:"cenários diferentes"})," graças ao ",e.jsx("code",{children:"when"}),". Sem filtros, você teria que capturar uma vez e fazer um ",e.jsx("code",{children:"if"})," dentro — perdendo elegância e, como veremos, o stack trace."]}),e.jsxs("h2",{children:["Por que não usar um ",e.jsx("code",{children:"if"})," dentro do catch?"]}),e.jsx("p",{children:"À primeira vista, parece equivalente:"}),e.jsx("pre",{children:e.jsx("code",{children:`// versão antiga, com if interno
catch (HttpRequestException ex)
{
    if (ex.StatusCode == HttpStatusCode.NotFound)
        Console.WriteLine("Recurso não existe");
    else
        throw;   // relança se não for o caso que quero
}`})}),e.jsxs("p",{children:["Mas há uma diferença crucial: quando o ",e.jsx("code",{children:"catch"})," é ",e.jsx("strong",{children:"entrado"}),", o runtime já fez o ",e.jsx("em",{children:"unwind da pilha"})," (desempilhamento das chamadas). Se você relança, o stack trace original pode ser embaralhado e debuggers/profilers já registraram que a exceção foi tratada. Com ",e.jsx("code",{children:"when"}),", a condição é avaliada ",e.jsx("strong",{children:"antes"})," do unwind: se for ",e.jsx("code",{children:"false"}),', a pilha permanece intacta e a exceção continua "voando" naturalmente.']}),e.jsxs(o,{type:"info",title:"Por que isso importa na prática",children:['Em ferramentas como o Visual Studio, "first chance exception" indica que a exceção foi disparada. Com ',e.jsx("code",{children:"when"}),", o handler que falha o filtro ",e.jsx("strong",{children:"não conta"})," como tratamento, então o debugger continua quebrando no ponto original do ",e.jsx("code",{children:"throw"})," como se nada tivesse acontecido."]}),e.jsx("h2",{children:"Caso clássico: logging condicional"}),e.jsxs("p",{children:['Um truque muito usado é "abusar" do filtro como gancho de logging que ',e.jsx("em",{children:"nunca"})," realmente captura a exceção. O método sempre retorna ",e.jsx("code",{children:"false"}),", então a exceção continua subindo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public bool LogarESeguir(Exception ex, string contexto)
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
}`})}),e.jsxs("p",{children:["O efeito: a exceção é logada com stack trace original e contexto adicional, e segue subindo como se nunca tivesse sido tocada. Isso é útil em camadas onde você quer ",e.jsx("em",{children:"observar"})," o erro sem mudar o fluxo."]}),e.jsx("h2",{children:"Filtros mais expressivos"}),e.jsxs("p",{children:["A condição em ",e.jsx("code",{children:"when"})," pode ser qualquer expressão booleana — chamar métodos, comparar propriedades, usar ",e.jsx("code",{children:"is"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`try
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
}`})}),e.jsxs("p",{children:["Repare como combinamos ",e.jsx("code",{children:"when"})," com ",e.jsx("strong",{children:"pattern matching"})," (o ",e.jsx("code",{children:"is SqlException sql"})," e o property pattern ",e.jsx("code",{children:"{ Number: 1205 }"}),"). Você pode até declarar variáveis no padrão e usá-las dentro do bloco do ",e.jsx("code",{children:"catch"}),"."]}),e.jsx("h2",{children:"Tratando erros transitórios com retry"}),e.jsx("p",{children:"Filtros são excelentes para distinguir erros recuperáveis de fatais:"}),e.jsx("pre",{children:e.jsx("code",{children:`async Task<string> BuscarComRetryAsync(string url)
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
}`})}),e.jsxs("p",{children:["Aqui o filtro testa se é um status ",e.jsx("em",{children:"transiente"})," (timeout, indisponível) ",e.jsx("strong",{children:"e"})," se ainda temos tentativas. Se ambas verdadeiras, capturamos e fazemos backoff exponencial. Se for outro erro (404, 401), o catch não acolhe e a exceção sobe."]}),e.jsxs(o,{type:"warning",title:"Não exagere na lógica do filtro",children:["O filtro deve ser barato e sem efeitos colaterais. Chamadas pesadas ou que possam ",e.jsx("em",{children:"elas mesmas"})," lançar exceções dentro do ",e.jsx("code",{children:"when"})," tornam o código difícil de raciocinar. Se a condição é complexa, encapsule em um método pequeno e bem-nomeado."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Filtro com efeito colateral:"})," evite alterar estado dentro de ",e.jsx("code",{children:"when"})," — fica ilegível e confuso."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lançar exceção dentro do filtro:"})," a exceção do filtro é ",e.jsx("em",{children:"silenciosamente engolida"})," e o filtro vira ",e.jsx("code",{children:"false"}),". Isso esconde bugs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar com if dentro do catch:"})," escolha um padrão. Filtros são mais limpos para escolha de catch; ifs internos para lógica adicional após captura."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer que filtros não unwindam a pilha:"}),' ótimo para debug — mas significa que você não pode "limpar" estado parcial antes do filtro decidir.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Comparar string da Message:"})," mensagens variam por idioma. Use ",e.jsx("code",{children:"StatusCode"}),", ",e.jsx("code",{children:"HResult"}),", ou tipo da inner."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"catch (T ex) when (cond)"})," só captura se a condição for verdadeira."]}),e.jsxs("li",{children:["Avaliado ",e.jsx("strong",{children:"antes"})," do unwind da pilha — preserva stack trace e debugging."]}),e.jsxs("li",{children:["Mais limpo que capturar e relançar com ",e.jsx("code",{children:"throw;"}),"."]}),e.jsx("li",{children:"Combina muito bem com pattern matching."}),e.jsxs("li",{children:["Permite trick de logging com função que sempre retorna ",e.jsx("code",{children:"false"}),"."]}),e.jsx("li",{children:"Mantenha o filtro barato e sem side effects."})]})]})}export{i as default};
