import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(i,{title:"Criando suas próprias exceções",subtitle:"As exceções da BCL cobrem o genérico. Quando seu domínio tem regras próprias, você cria as suas — e isso é um ato de design, não de cerimônia.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["A ",e.jsx("strong",{children:"BCL"})," (Base Class Library, a biblioteca padrão do .NET) já oferece dezenas de tipos de exceção: ",e.jsx("code",{children:"ArgumentException"}),", ",e.jsx("code",{children:"InvalidOperationException"}),", ",e.jsx("code",{children:"FileNotFoundException"}),". Mas seu sistema tem regras de negócio que o .NET nunca ouviu falar — saldo insuficiente, pedido fora de prazo, cupom expirado. Quando essas regras quebram, faz sentido lançar uma exceção que ",e.jsx("em",{children:"diz isso na cara"}),", em vez de reaproveitar uma genérica. Pense nelas como placas de sinalização específicas do seu prédio: existem placas universais, mas algumas só fazem sentido no seu contexto."]}),e.jsxs("h2",{children:["Herde de ",e.jsx("code",{children:"Exception"})," diretamente"]}),e.jsxs("p",{children:["A regra atual da Microsoft é: herde direto de ",e.jsx("code",{children:"System.Exception"}),". Por anos, recomendaram ",e.jsx("code",{children:"ApplicationException"})," como base, mas essa orientação foi ",e.jsx("strong",{children:"oficialmente abandonada"})," — ",e.jsx("code",{children:"ApplicationException"})," não traz nenhum benefício real e só adiciona um nível inútil de hierarquia."]}),e.jsx("pre",{children:e.jsx("code",{children:`// ✅ moderno
public class SaldoInsuficienteException : Exception { }

// ❌ obsoleto desde o .NET Framework 2.0
public class SaldoInsuficienteException : ApplicationException { }`})}),e.jsx("h2",{children:"Os quatro construtores padrão"}),e.jsx("p",{children:"Por convenção, toda exceção customizada implementa quatro construtores. Eles cobrem todos os cenários: erro sem dados, com mensagem, com mensagem + causa, e o construtor de serialização (legado)."}),e.jsx("pre",{children:e.jsx("code",{children:`using System;

public class SaldoInsuficienteException : Exception
{
    // 1) construtor sem argumentos
    public SaldoInsuficienteException() { }

    // 2) só mensagem
    public SaldoInsuficienteException(string message)
        : base(message) { }

    // 3) mensagem + exceção interna (a causa raiz)
    public SaldoInsuficienteException(string message, Exception inner)
        : base(message, inner) { }
}`})}),e.jsxs("p",{children:["Note que cada construtor delega para o construtor correspondente da classe base com ",e.jsx("code",{children:": base(...)"}),". É a base ",e.jsx("code",{children:"Exception"})," que já guarda ",e.jsx("code",{children:"Message"}),", ",e.jsx("code",{children:"InnerException"}),", ",e.jsx("code",{children:"StackTrace"})," e tudo mais — você não precisa reescrever nada disso."]}),e.jsxs(o,{type:"info",title:"E o quarto construtor de serialização?",children:["Antigamente recomendava-se um quarto construtor para suportar ",e.jsx("em",{children:"binary serialization"})," com ",e.jsx("code",{children:"[Serializable]"})," — mecanismo agora marcado como ",e.jsx("strong",{children:"obsoleto"})," no .NET 8+ por motivos de segurança. Em projetos modernos, pode omitir."]}),e.jsx("h2",{children:"Adicionando dados próprios à exceção"}),e.jsx("p",{children:"O grande valor de uma exceção customizada é carregar contexto estruturado — não só uma mensagem. Adicione propriedades para que quem captura possa tratar com inteligência."}),e.jsx("pre",{children:e.jsx("code",{children:`public class SaldoInsuficienteException : Exception
{
    public decimal SaldoAtual { get; }
    public decimal ValorTentado { get; }
    public string Conta { get; }

    public SaldoInsuficienteException(
        string conta,
        decimal saldoAtual,
        decimal valorTentado)
        : base($"Conta {conta}: saldo R$ {saldoAtual} insuficiente para R$ {valorTentado}")
    {
        Conta = conta;
        SaldoAtual = saldoAtual;
        ValorTentado = valorTentado;
    }
}

// uso:
throw new SaldoInsuficienteException("12345-6", 100m, 250m);

// captura inteligente:
catch (SaldoInsuficienteException ex)
{
    var falta = ex.ValorTentado - ex.SaldoAtual;
    Logger.Warn($"Falta R$ {falta} na conta {ex.Conta}");
}`})}),e.jsx("h2",{children:"Códigos de erro estruturados"}),e.jsxs("p",{children:["Em sistemas de microsserviços ou APIs, é útil ter um ",e.jsx("code",{children:"ErrorCode"})," estável que o front-end ou o cliente HTTP pode reconhecer. Adicione como propriedade:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract class DominioException : Exception
{
    public abstract string ErrorCode { get; }
    protected DominioException(string mensagem, Exception? inner = null)
        : base(mensagem, inner) { }
}

public class CupomExpiradoException : DominioException
{
    public override string ErrorCode => "CUPOM_EXPIRADO";
    public string CupomCodigo { get; }
    public DateTime ExpirouEm { get; }

    public CupomExpiradoException(string codigo, DateTime expirouEm)
        : base($"Cupom {codigo} expirou em {expirouEm:d}")
    {
        CupomCodigo = codigo;
        ExpirouEm = expirouEm;
    }
}`})}),e.jsxs("p",{children:["Com uma base abstrata ",e.jsx("code",{children:"DominioException"}),", fica fácil escrever um middleware HTTP que captura todas e devolve um JSON padronizado ",e.jsx("code",{children:'{ "errorCode": "...", "message": "..." }'}),"."]}),e.jsxs("h2",{children:["Convenção de nomes: termina com ",e.jsx("code",{children:"-Exception"})]}),e.jsxs("p",{children:["O nome de toda exceção customizada deve terminar com o sufixo ",e.jsx("strong",{children:e.jsx("code",{children:"Exception"})}),". Não é uma regra do compilador, mas é seguida em ",e.jsx("em",{children:"todo"})," o ecossistema .NET. Quem lê seu código sabe imediatamente que ",e.jsx("code",{children:"EmailJaCadastradoException"})," é uma exceção, sem precisar inspecionar o tipo base."]}),e.jsx("pre",{children:e.jsx("code",{children:`// ✅ ótimos nomes
public class UsuarioNaoEncontradoException : Exception { }
public class TentativasExcedidasException : Exception { }
public class FormatoDeArquivoInvalidoException : Exception { }

// ❌ confusos
public class UsuarioErro : Exception { }      // não parece exceção
public class FailedLogin : Exception { }      // sem sufixo
public class EX_Login : Exception { }         // notação húngara, ruim`})}),e.jsxs(o,{type:"warning",title:"Não exagere",children:["Criar uma exceção customizada por método é overkill. Use-as quando: (1) o caller pode ",e.jsx("em",{children:"reagir"}),' diferente; (2) carregam dados úteis; (3) representam um conceito de domínio claro. Para "argumento inválido", ',e.jsx("code",{children:"ArgumentException"})," da BCL já basta."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Herdar de ",e.jsx("code",{children:"ApplicationException"}),":"]})," orientação obsoleta, herde de ",e.jsx("code",{children:"Exception"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o sufixo ",e.jsx("code",{children:"Exception"}),":"]})," quebra convenção e confunde quem lê."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não passar ",e.jsx("code",{children:"InnerException"}),":"]})," ao envelopar, sempre repasse a causa original."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Criar exceções para fluxo normal:"}),' "usuário fechou o modal" não é exceção, é evento.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Adicionar lógica complexa no construtor:"})," mantenha a exceção simples — só dados."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Marcar com ",e.jsx("code",{children:"[Serializable]"}),":"]})," o mecanismo está obsoleto no .NET moderno."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Herde de ",e.jsx("code",{children:"Exception"})," diretamente, nunca de ",e.jsx("code",{children:"ApplicationException"}),"."]}),e.jsx("li",{children:"Implemente os três construtores convencionais (vazio, mensagem, mensagem+inner)."}),e.jsx("li",{children:"Adicione propriedades para carregar contexto estruturado."}),e.jsxs("li",{children:["Use uma base abstrata + ",e.jsx("code",{children:"ErrorCode"})," em sistemas distribuídos."]}),e.jsxs("li",{children:["Termine sempre o nome com ",e.jsx("code",{children:"Exception"}),"."]}),e.jsx("li",{children:"Crie exceções quando representam conceito de domínio, não para tudo."})]})]})}export{n as default};
