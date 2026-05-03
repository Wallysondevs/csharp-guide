import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"Comentários e documentação XML",subtitle:"De // simples ao /// que vira IntelliSense, site de docs e arquivo .xml para distribuir com sua biblioteca.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsxs("p",{children:["Código sem comentários é como receita de bolo sem instruções: a lista de ingredientes está lá, mas boa sorte montando o resultado. C# oferece três formas de comentar: o tradicional ",e.jsx("code",{children:"//"}),", o multi-linha ",e.jsx("code",{children:"/* */"})," e a estrela do show — o ",e.jsx("code",{children:"///"})," de ",e.jsx("strong",{children:"documentação XML"}),", que vira ",e.jsx("em",{children:"IntelliSense"})," automático no editor e arquivos de documentação navegáveis. Saber usar bem cada um faz seu código respeitar o leitor (que muitas vezes é você daqui a seis meses)."]}),e.jsx("h2",{children:"Comentários simples"}),e.jsxs("p",{children:["Servem para anotar ",e.jsx("strong",{children:"como"})," ou ",e.jsx("strong",{children:"por que"})," uma linha existe. O compilador os ignora completamente; eles desaparecem após a compilação."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Comentário de uma linha — vai até o fim da linha

/* Comentário de múltiplas linhas:
   pode ocupar quantas linhas você quiser
   e termina aqui */

int x = 10; // Comentário no fim da linha (após código)

/*
 * Estilo "javadoc" antigo, ainda usado às vezes
 * para destacar visualmente
 */`})}),e.jsxs(a,{type:"info",title:"Comente o PORQUÊ, não o O QUÊ",children:["Comentário ruim: ",e.jsx("code",{children:"// incrementa i"})," seguido de ",e.jsx("code",{children:"i++;"}),". Comentário bom: ",e.jsx("code",{children:"// retry exponencial: 1s, 2s, 4s para dar fôlego ao serviço"}),". Bom código se documenta sozinho; comentários explicam intenção e contexto."]}),e.jsxs("h2",{children:["Documentação XML com ",e.jsx("code",{children:"///"})]}),e.jsxs("p",{children:["Três barras ",e.jsx("code",{children:"///"})," seguidas iniciam um comentário ",e.jsx("strong",{children:"de documentação"}),". O conteúdo segue uma sintaxe XML específica que o editor entende e usa para mostrar dicas (IntelliSense) e que pode ser exportada para HTML, Markdown ou PDF."]}),e.jsx("pre",{children:e.jsx("code",{children:`/// <summary>
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
}`})}),e.jsxs("p",{children:["Quando outro programador (ou você mesmo) digitar ",e.jsx("code",{children:"CalcularMedia("})," em outro arquivo, o editor mostrará automaticamente o resumo, os parâmetros e o tipo de retorno em um popup. Isso transforma seu código em uma ",e.jsx("em",{children:"biblioteca autodocumentada"}),"."]}),e.jsx("h2",{children:"As tags mais usadas"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Tag"}),e.jsx("th",{children:"Para quê"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"<summary>"})}),e.jsx("td",{children:"Descrição curta (1-2 frases)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"<remarks>"})}),e.jsx("td",{children:"Detalhes longos, considerações de uso"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'<param name="x">'})}),e.jsx("td",{children:"Descreve cada parâmetro"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"<returns>"})}),e.jsx("td",{children:"O que o método devolve"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'<exception cref="T">'})}),e.jsx("td",{children:"Exceções que podem ser lançadas"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"<example>"})}),e.jsxs("td",{children:["Exemplo de uso (geralmente com ",e.jsx("code",{children:"<code>"}),")"]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'<see cref="T"/>'})}),e.jsx("td",{children:"Link para outro tipo/membro"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'<seealso cref="T"/>'})}),e.jsx("td",{children:'"Veja também" no rodapé'})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'<typeparam name="T">'})}),e.jsx("td",{children:"Documenta um parâmetro genérico"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"<inheritdoc/>"})}),e.jsx("td",{children:"Herda doc do membro sobrescrito"})]})]})]}),e.jsx("h2",{children:"Exemplo completo de classe documentada"}),e.jsx("pre",{children:e.jsx("code",{children:`namespace MeuApp.Banking;

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
}`})}),e.jsx("h2",{children:"Gerando o arquivo .xml"}),e.jsxs("p",{children:["Por padrão, comentários ",e.jsx("code",{children:"///"})," só aparecem como IntelliSense ",e.jsx("em",{children:"dentro"})," do projeto. Para que outras pessoas (consumidores da sua biblioteca) também os vejam, você precisa ",e.jsx("strong",{children:"gerar o arquivo XML"}),". Adicione no ",e.jsx("code",{children:".csproj"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`<PropertyGroup>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);CS1591</NoWarn>
</PropertyGroup>`})}),e.jsxs("p",{children:["Após o build, surge um ",e.jsx("code",{children:"MinhaLib.xml"})," ao lado do ",e.jsx("code",{children:"MinhaLib.dll"}),". Ferramentas como ",e.jsx("strong",{children:"DocFX"}),", ",e.jsx("strong",{children:"Sandcastle"})," e ",e.jsx("strong",{children:"Doxygen"})," consomem esse XML para gerar sites de documentação. O NuGet também o empacota automaticamente quando você publica."]}),e.jsxs(a,{type:"warning",title:"Aviso CS1591",children:["Com ",e.jsx("code",{children:"GenerateDocumentationFile=true"}),", qualquer membro ",e.jsx("em",{children:"público"})," sem ",e.jsx("code",{children:"///"}),' gera warning CS1591 ("Missing XML comment for publicly visible type"). Suprima com ',e.jsx("code",{children:"<NoWarn>CS1591</NoWarn>"})," ou — melhor — documente tudo."]}),e.jsx("h2",{children:"Tags úteis dentro de comentários"}),e.jsx("pre",{children:e.jsx("code",{children:`/// <summary>
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
public void Fazer() { }`})}),e.jsxs("p",{children:[e.jsx("code",{children:"<c>"})," formata texto monoespaçado inline. ",e.jsx("code",{children:"<code>"})," formata bloco. ",e.jsx("code",{children:"<para>"})," separa parágrafos. ",e.jsx("code",{children:'<see cref="..."/>'})," vira link clicável no IntelliSense."]}),e.jsxs("h2",{children:["O atributo ",e.jsx("code",{children:"cref"})]}),e.jsxs("p",{children:[e.jsx("code",{children:"cref"})," aceita o nome de qualquer tipo ou membro acessível: ",e.jsx("code",{children:'cref="String"'}),", ",e.jsx("code",{children:'cref="ContaBancaria.Sacar(decimal)"'}),", ",e.jsx("code",{children:'cref="System.IO.File.ReadAllText(string)"'}),". O compilador ",e.jsx("strong",{children:"valida"})," esses references — se você renomear o método e esquecer da doc, ele te avisa. Excelente para evitar documentação desatualizada."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Comentários gigantes copiando assinatura do método:"})," redundância. O resumo deve agregar ",e.jsx("em",{children:"contexto"}),", não repetir o óbvio."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"<param>"}),":"]})," a IDE só mostra dicas de parâmetros se eles estiverem documentados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"XML mal-formado:"})," uma ",e.jsx("code",{children:"<"})," não escapada quebra o build com mensagem confusa. Use ",e.jsx("code",{children:"&lt;"})," em prosa."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"///"})," e ",e.jsx("code",{children:"//"})," no mesmo bloco:"]})," só linhas ",e.jsx("em",{children:"contínuas"})," com ",e.jsx("code",{children:"///"})," formam um único comentário XML."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Documentar membros privados:"})," não vale a pena — só ",e.jsx("code",{children:"public"}),"/",e.jsx("code",{children:"protected"})," aparecem no IntelliSense de fora."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"//"})," e ",e.jsx("code",{children:"/* */"})," para anotações livres."]}),e.jsxs("li",{children:[e.jsx("code",{children:"///"})," para documentação XML que vira IntelliSense automático."]}),e.jsxs("li",{children:["Tags principais: ",e.jsx("code",{children:"summary"}),", ",e.jsx("code",{children:"param"}),", ",e.jsx("code",{children:"returns"}),", ",e.jsx("code",{children:"exception"}),", ",e.jsx("code",{children:"example"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"GenerateDocumentationFile"})," no .csproj cria o ",e.jsx("code",{children:".xml"})," distribuível."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:'<see cref="..."/>'})," para links validados pelo compilador."]}),e.jsxs("li",{children:["Documente o ",e.jsx("em",{children:"porquê"}),"; o ",e.jsx("em",{children:"o quê"})," deve estar no nome do método."]})]})]})}export{i as default};
