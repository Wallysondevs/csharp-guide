import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function c(){return e.jsxs(r,{title:"throw e rethrow: preservando o stack trace",subtitle:"A diferença entre throw; e throw ex; parece um detalhe ortográfico. Na verdade, é a diferença entre debugar em 5 minutos e em 5 horas.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Quando uma exceção é lançada, o runtime guarda dentro dela uma ",e.jsx("strong",{children:"stack trace"}),": a lista de métodos pelos quais ela passou até ser capturada. É como o rastro deixado por um detetive — diz exatamente onde o crime começou. Perder esse rastro é o pesadelo de qualquer engenheiro tentando achar um bug em produção. Este capítulo é sobre como ",e.jsx("em",{children:"jogar"})," exceções (com ",e.jsx("code",{children:"throw"}),") e como ",e.jsx("em",{children:"relançar"})," sem destruir o rastro."]}),e.jsx("h2",{children:"Lançando uma exceção pela primeira vez"}),e.jsxs("p",{children:["Você lança uma exceção com ",e.jsx("code",{children:'throw new TipoDaExcecao("mensagem")'}),". A partir desse ponto, a execução do método é abortada e o runtime começa a procurar um ",e.jsx("code",{children:"catch"})," compatível subindo a pilha de chamadas."]}),e.jsx("pre",{children:e.jsx("code",{children:`public decimal Dividir(decimal a, decimal b)
{
    if (b == 0)
        throw new ArgumentException("b não pode ser zero", nameof(b));

    return a / b;
}`})}),e.jsxs("p",{children:["O segundo argumento, ",e.jsx("code",{children:"nameof(b)"}),", gera a string literal ",e.jsx("code",{children:'"b"'})," em tempo de compilação. Se você renomear o parâmetro depois, o compilador atualiza junto — algo que uma string solta nunca conseguiria."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"throw;"})," vs ",e.jsx("code",{children:"throw ex;"})," — a armadilha clássica"]}),e.jsxs("p",{children:["Quando você captura uma exceção e quer relançá-la, a forma como você escreve faz diferença ",e.jsx("strong",{children:"gigantesca"}),". ",e.jsx("code",{children:"throw;"})," sozinho preserva o stack trace original. ",e.jsx("code",{children:"throw ex;"})," reseta — o rastro passa a apontar para o ",e.jsx("em",{children:"seu"})," catch, perdendo o local original do erro."]}),e.jsx("pre",{children:e.jsx("code",{children:`try
{
    MetodoQueExplode();
}
catch (Exception ex)
{
    Logger.Error(ex);

    throw;       // ✅ stack trace continua apontando para MetodoQueExplode
    // throw ex; // ❌ stack trace agora aponta para esta linha de catch
}`})}),e.jsxs("p",{children:["O resultado prático: com ",e.jsx("code",{children:"throw ex;"}),", sua mensagem de erro vira ",e.jsx("em",{children:'"falhou em CatchHandler.cs linha 42"'})," em vez de ",e.jsx("em",{children:'"falhou em ProcessadorDePagamentos.cs linha 137"'}),". Imagine fazer triagem de incidente sem saber qual método quebrou."]}),e.jsxs(a,{type:"danger",title:"Nunca escreva throw ex;",children:["Ao relançar a mesma exceção, use ",e.jsx("code",{children:"throw;"})," — ponto-final. ",e.jsx("code",{children:"throw ex;"})," só faz sentido se você está jogando uma exceção ",e.jsx("em",{children:"diferente"})," da que capturou (e mesmo aí, prefira passar a original como ",e.jsx("code",{children:"innerException"}),")."]}),e.jsx("h2",{children:"Embrulhando com inner exception"}),e.jsxs("p",{children:["Às vezes faz sentido capturar uma exceção de baixo nível e relançar uma de mais alto nível, mais semântica para o seu domínio. Para não perder o contexto original, passe-a como ",e.jsx("strong",{children:"inner exception"})," no construtor da nova:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public Pedido Carregar(int id)
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
}`})}),e.jsxs("p",{children:["Quem capturar ",e.jsx("code",{children:"PedidoIndisponivelException"})," vê uma mensagem amigável; quem precisa investigar acessa ",e.jsx("code",{children:"ex.InnerException"})," e descobre que foi um timeout de SQL."]}),e.jsxs("h2",{children:["Anexando dados extras com ",e.jsx("code",{children:"Exception.Data"})]}),e.jsxs("p",{children:["Toda exceção tem uma propriedade ",e.jsx("code",{children:"Data"})," do tipo ",e.jsx("code",{children:"IDictionary"}),". Você pode anexar informações úteis no caminho até o handler final, sem criar uma exceção customizada:"]}),e.jsx("pre",{children:e.jsx("code",{children:`try
{
    ProcessarLinha(linha);
}
catch (FormatException ex)
{
    ex.Data["NumeroDaLinha"] = numero;
    ex.Data["ConteudoBruto"] = linha;
    throw;        // relança preservando stack + dados anexados
}`})}),e.jsxs("p",{children:["No log final, você imprime ",e.jsx("code",{children:"ex.Data"})," e ganha contexto sem precisar criar tipos novos para cada situação."]}),e.jsx("h2",{children:"ExceptionDispatchInfo: relançar de outro contexto"}),e.jsxs("p",{children:['Em código assíncrono, é comum você querer "guardar" uma exceção e relançá-la mais tarde, mantendo o stack original. O simples ',e.jsx("code",{children:"throw guardada;"})," reseta o rastro. A solução é ",e.jsx("code",{children:"ExceptionDispatchInfo"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Runtime.ExceptionServices;

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
}`})}),e.jsxs("p",{children:["Esse mecanismo é o mesmo que ",e.jsx("code",{children:"await"})," usa internamente para desempacotar exceções de uma ",e.jsx("code",{children:"Task"})," sem perder o rastro original."]}),e.jsxs(a,{type:"info",title:"Stack trace é precioso",children:["Sempre que possível, prefira: (1) ",e.jsx("strong",{children:"não capturar"})," se você não sabe tratar; (2) ",e.jsx("code",{children:"throw;"})," sozinho para relançar; (3) inner exception para envelopar; (4) ",e.jsx("code",{children:"ExceptionDispatchInfo"})," para casos avançados. Tudo que perde stack trace é dor futura."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:[e.jsx("code",{children:"throw ex;"})," em vez de ",e.jsx("code",{children:"throw;"}),":"]})," apaga o stack trace original. Erro #1 em code reviews."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não passar ",e.jsx("code",{children:"innerException"}),":"]})," ao envelopar uma exceção, sempre inclua a original como segundo argumento."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Lançar ",e.jsx("code",{children:"Exception"})," genérica:"]})," impede catches específicos. Use o tipo mais preciso possível."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Throw sem mensagem:"})," ",e.jsx("code",{children:"throw new InvalidOperationException()"})," sozinho deixa quem investiga no escuro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Capturar para apenas relançar:"})," se não vai logar, anotar dados ou converter, deixe a exceção subir naturalmente."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"throw new T(...)"})," lança pela primeira vez."]}),e.jsxs("li",{children:[e.jsx("code",{children:"throw;"})," relança preservando o stack trace original."]}),e.jsxs("li",{children:[e.jsx("code",{children:"throw ex;"})," reseta o stack — quase sempre errado."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"innerException"})," ao envelopar para não perder a causa raiz."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Exception.Data"})," permite anexar contexto sem criar tipos novos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ExceptionDispatchInfo"})," guarda exceção para relançar depois sem perder rastro."]})]})]})}export{c as default};
