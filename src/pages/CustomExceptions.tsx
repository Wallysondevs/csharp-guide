import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CustomExceptions() {
  return (
    <PageContainer
      title="Criando suas próprias exceções"
      subtitle="As exceções da BCL cobrem o genérico. Quando seu domínio tem regras próprias, você cria as suas — e isso é um ato de design, não de cerimônia."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        A <strong>BCL</strong> (Base Class Library, a biblioteca padrão do .NET) já oferece dezenas de tipos de exceção: <code>ArgumentException</code>, <code>InvalidOperationException</code>, <code>FileNotFoundException</code>. Mas seu sistema tem regras de negócio que o .NET nunca ouviu falar — saldo insuficiente, pedido fora de prazo, cupom expirado. Quando essas regras quebram, faz sentido lançar uma exceção que <em>diz isso na cara</em>, em vez de reaproveitar uma genérica. Pense nelas como placas de sinalização específicas do seu prédio: existem placas universais, mas algumas só fazem sentido no seu contexto.
      </p>

      <h2>Herde de <code>Exception</code> diretamente</h2>
      <p>
        A regra atual da Microsoft é: herde direto de <code>System.Exception</code>. Por anos, recomendaram <code>ApplicationException</code> como base, mas essa orientação foi <strong>oficialmente abandonada</strong> — <code>ApplicationException</code> não traz nenhum benefício real e só adiciona um nível inútil de hierarquia.
      </p>
      <pre><code>{`// ✅ moderno
public class SaldoInsuficienteException : Exception { }

// ❌ obsoleto desde o .NET Framework 2.0
public class SaldoInsuficienteException : ApplicationException { }`}</code></pre>

      <h2>Os quatro construtores padrão</h2>
      <p>
        Por convenção, toda exceção customizada implementa quatro construtores. Eles cobrem todos os cenários: erro sem dados, com mensagem, com mensagem + causa, e o construtor de serialização (legado).
      </p>
      <pre><code>{`using System;

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
}`}</code></pre>
      <p>
        Note que cada construtor delega para o construtor correspondente da classe base com <code>: base(...)</code>. É a base <code>Exception</code> que já guarda <code>Message</code>, <code>InnerException</code>, <code>StackTrace</code> e tudo mais — você não precisa reescrever nada disso.
      </p>

      <AlertBox type="info" title="E o quarto construtor de serialização?">
        Antigamente recomendava-se um quarto construtor para suportar <em>binary serialization</em> com <code>[Serializable]</code> — mecanismo agora marcado como <strong>obsoleto</strong> no .NET 8+ por motivos de segurança. Em projetos modernos, pode omitir.
      </AlertBox>

      <h2>Adicionando dados próprios à exceção</h2>
      <p>
        O grande valor de uma exceção customizada é carregar contexto estruturado — não só uma mensagem. Adicione propriedades para que quem captura possa tratar com inteligência.
      </p>
      <pre><code>{`public class SaldoInsuficienteException : Exception
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
}`}</code></pre>

      <h2>Códigos de erro estruturados</h2>
      <p>
        Em sistemas de microsserviços ou APIs, é útil ter um <code>ErrorCode</code> estável que o front-end ou o cliente HTTP pode reconhecer. Adicione como propriedade:
      </p>
      <pre><code>{`public abstract class DominioException : Exception
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
}`}</code></pre>
      <p>
        Com uma base abstrata <code>DominioException</code>, fica fácil escrever um middleware HTTP que captura todas e devolve um JSON padronizado <code>{`{ "errorCode": "...", "message": "..." }`}</code>.
      </p>

      <h2>Convenção de nomes: termina com <code>-Exception</code></h2>
      <p>
        O nome de toda exceção customizada deve terminar com o sufixo <strong><code>Exception</code></strong>. Não é uma regra do compilador, mas é seguida em <em>todo</em> o ecossistema .NET. Quem lê seu código sabe imediatamente que <code>EmailJaCadastradoException</code> é uma exceção, sem precisar inspecionar o tipo base.
      </p>
      <pre><code>{`// ✅ ótimos nomes
public class UsuarioNaoEncontradoException : Exception { }
public class TentativasExcedidasException : Exception { }
public class FormatoDeArquivoInvalidoException : Exception { }

// ❌ confusos
public class UsuarioErro : Exception { }      // não parece exceção
public class FailedLogin : Exception { }      // sem sufixo
public class EX_Login : Exception { }         // notação húngara, ruim`}</code></pre>

      <AlertBox type="warning" title="Não exagere">
        Criar uma exceção customizada por método é overkill. Use-as quando: (1) o caller pode <em>reagir</em> diferente; (2) carregam dados úteis; (3) representam um conceito de domínio claro. Para "argumento inválido", <code>ArgumentException</code> da BCL já basta.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Herdar de <code>ApplicationException</code>:</strong> orientação obsoleta, herde de <code>Exception</code>.</li>
        <li><strong>Esquecer o sufixo <code>Exception</code>:</strong> quebra convenção e confunde quem lê.</li>
        <li><strong>Não passar <code>InnerException</code>:</strong> ao envelopar, sempre repasse a causa original.</li>
        <li><strong>Criar exceções para fluxo normal:</strong> "usuário fechou o modal" não é exceção, é evento.</li>
        <li><strong>Adicionar lógica complexa no construtor:</strong> mantenha a exceção simples — só dados.</li>
        <li><strong>Marcar com <code>[Serializable]</code>:</strong> o mecanismo está obsoleto no .NET moderno.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Herde de <code>Exception</code> diretamente, nunca de <code>ApplicationException</code>.</li>
        <li>Implemente os três construtores convencionais (vazio, mensagem, mensagem+inner).</li>
        <li>Adicione propriedades para carregar contexto estruturado.</li>
        <li>Use uma base abstrata + <code>ErrorCode</code> em sistemas distribuídos.</li>
        <li>Termine sempre o nome com <code>Exception</code>.</li>
        <li>Crie exceções quando representam conceito de domínio, não para tudo.</li>
      </ul>
    </PageContainer>
  );
}
