import{j as e}from"./index-CzLAthD5.js";import{P as r,A as s}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Encapsulamento: public, private, protected, internal",subtitle:"Aprenda a controlar quem pode enxergar e modificar cada parte da sua classe — o pilar de código seguro e fácil de manter.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Pense em uma cafeteria: o cliente vê o cardápio e o caixa (interface pública), mas não entra na cozinha (interna), nem mexe no estoque do depósito (privado), nem na sala do gerente (protegida só para funcionários). Cada espaço tem regras de acesso. ",e.jsx("strong",{children:"Encapsulamento"})," é exatamente isso em código: você decide quem pode ver e mexer em cada membro da sua classe. Em C#, esse controle é feito por ",e.jsx("strong",{children:"modificadores de acesso"}),". Usar bem esses modificadores é o que separa um código frágil de um código profissional."]}),e.jsx("h2",{children:"Por que esconder coisas?"}),e.jsxs("p",{children:["Quanto menos código externo enxerga seus detalhes internos, mais liberdade você tem para mudar a implementação sem quebrar quem usa sua classe. Esse é o princípio do ",e.jsx("strong",{children:"menor privilégio"}),': comece tudo o mais restrito possível, e só "abra" quando houver necessidade real. Isso reduz bugs, evita acoplamento e facilita refatoração.']}),e.jsx("h2",{children:"Os quatro modificadores principais"}),e.jsx("p",{children:"C# tem seis modificadores de acesso, mas quatro deles cobrem 95% dos casos. Vamos do mais aberto ao mais fechado:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Conta
{
    // public: qualquer código de qualquer projeto pode usar
    public string Titular { get; init; } = "";

    // internal: visível apenas dentro do mesmo projeto/assembly
    internal int CodigoInterno { get; set; }

    // protected: visível para esta classe e suas filhas (subclasses)
    protected decimal LimiteCredito { get; set; }

    // private: SÓ esta própria classe enxerga (o padrão se você omite)
    private decimal saldo;

    public void Depositar(decimal valor) => saldo += valor;
    public decimal ConsultarSaldo() => saldo;
}`})}),e.jsxs("p",{children:["Note: ",e.jsx("code",{children:"private"})," é o padrão para membros se você não escrever modificador algum (em classes). Para classes de nível superior, o padrão é ",e.jsx("code",{children:"internal"}),"."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"public"}),": a porta da frente"]}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"public"})," só naquilo que outras partes do programa ",e.jsx("em",{children:"precisam"})," chamar. Pense em uma ",e.jsx("em",{children:"API"})," — o conjunto de métodos e propriedades que sua classe oferece. Quanto menor a API pública, menos coisa você se compromete a manter estável."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Uso público em outro arquivo:
var c = new Conta { Titular = "Ana" };
c.Depositar(500m);
Console.WriteLine(c.ConsultarSaldo());`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"private"}),": estritamente íntimo"]}),e.jsxs("p",{children:["Tudo que é detalhe de implementação — como o campo ",e.jsx("code",{children:"saldo"})," ou um método auxiliar — deve ser ",e.jsx("code",{children:"private"}),". Assim, você pode trocar o tipo, renomear ou refatorar sem que ninguém de fora perceba."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Calculadora
{
    public int Somar(int a, int b)
    {
        return Validar(a) + Validar(b); // chama método privado
    }

    private int Validar(int x)
    {
        if (x < 0) throw new ArgumentException("Negativo não suportado.");
        return x;
    }
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"protected"}),": para a família (herança)"]}),e.jsxs("p",{children:[e.jsx("code",{children:"protected"})," torna o membro invisível para o mundo externo, mas visível para classes ",e.jsx("strong",{children:"filhas"}),'. É útil quando você projeta uma classe-base que oferece "ferramentas" só para subclasses usarem.']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Veiculo
{
    protected void RegistrarLog(string evento)
    {
        Console.WriteLine($"[LOG] {DateTime.Now:T} - {evento}");
    }
}

public class Carro : Veiculo
{
    public void Ligar()
    {
        RegistrarLog("Carro ligou"); // OK: filha enxerga protected
    }
}

// Em outro lugar:
// new Carro().RegistrarLog("oi"); // ERRO: protected não é público`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"internal"}),": dentro do projeto"]}),e.jsxs("p",{children:["Um ",e.jsx("em",{children:"assembly"})," é o arquivo ",e.jsx("code",{children:".dll"})," ou ",e.jsx("code",{children:".exe"})," gerado pelo seu projeto. ",e.jsx("code",{children:"internal"}),' diz: "só código que está sendo compilado junto comigo pode ver isto". Útil para tipos que você usa internamente em uma biblioteca, mas que não quer expor para quem instalar o pacote.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Dentro do projeto MeuApp.dll
internal class GeradorDeId
{
    internal static Guid Novo() => Guid.NewGuid();
}

// Outro projeto que referencia MeuApp.dll NÃO consegue chamar GeradorDeId.`})}),e.jsxs(s,{type:"info",title:"InternalsVisibleTo para testes",children:["Em projetos de teste, é comum querer acessar membros ",e.jsx("code",{children:"internal"}),". Você pode liberar usando o atributo ",e.jsx("code",{children:'[assembly: InternalsVisibleTo("MeuApp.Tests")]'})," no projeto principal."]}),e.jsxs("h2",{children:['Os dois "estendidos": ',e.jsx("code",{children:"protected internal"})," e ",e.jsx("code",{children:"private protected"})]}),e.jsx("p",{children:"Esses combinam regras dos dois mundos:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"protected internal"})}),": visível para subclasses ",e.jsx("em",{children:"OU"})," para qualquer código do mesmo assembly. É a união (OU lógico) dos dois."]}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"private protected"})})," (C# 7.2+): visível apenas para subclasses que estão ",e.jsx("em",{children:"dentro do mesmo assembly"}),". É a interseção (E lógico) — mais restritivo que ambos."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Base
{
    protected internal int A; // filhas (mesmo de outro projeto) OU mesmo assembly
    private protected int B;  // SÓ filhas dentro do mesmo assembly
}`})}),e.jsx("h2",{children:"Visibilidade assimétrica em propriedades"}),e.jsxs("p",{children:["Um truque elegante: a propriedade pode ter ",e.jsx("code",{children:"get"})," público e ",e.jsx("code",{children:"set"})," mais restrito. Assim, todo mundo lê, mas só a própria classe (ou subclasses) escreve."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pedido
{
    public decimal Total { get; private set; }       // ler: todos; escrever: só esta classe
    public string Status { get; protected set; } = "Novo"; // escrever: filhas também

    public void Pagar(decimal valor)
    {
        Total += valor;
        Status = "Pago";
    }
}`})}),e.jsxs(s,{type:"warning",title:"Não confunda private com seguro",children:[e.jsx("code",{children:"private"})," protege contra acesso acidental, mas ",e.jsx("em",{children:"não"})," é segurança contra usuários mal-intencionados — via ",e.jsx("strong",{children:"reflexão"})," (uma técnica avançada que veremos depois) é possível ler até campos privados. Para dados sensíveis (senhas, chaves), use criptografia, não só visibilidade."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Marcar tudo como ",e.jsx("code",{children:"public"})]}),": quebra encapsulamento e amarra você a manter cada detalhe estável."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"internal"})," esperando que filhas em outro projeto enxerguem"]}),": não enxergam — para isso, use ",e.jsx("code",{children:"protected"})," ou ",e.jsx("code",{children:"protected internal"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer que ",e.jsx("code",{children:"private"})," é o padrão"]}),": um método sem modificador é privado, não público."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"protected"})," em uma classe ",e.jsx("code",{children:"sealed"})]}),": como ela não pode ter filhas, ",e.jsx("code",{children:"protected"})," equivale a ",e.jsx("code",{children:"private"})," e o compilador avisa."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"public"}),": visível para todo mundo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"internal"}),": visível dentro do mesmo assembly (projeto)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"protected"}),": visível para a própria classe e suas subclasses."]}),e.jsxs("li",{children:[e.jsx("code",{children:"private"}),": visível só dentro da própria classe (padrão)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"protected internal"})," e ",e.jsx("code",{children:"private protected"})," combinam regras."]}),e.jsxs("li",{children:["Use o ",e.jsx("strong",{children:"menor privilégio"})," necessário; abra só quando for preciso."]}),e.jsxs("li",{children:["Propriedades podem ter ",e.jsx("code",{children:"get"})," e ",e.jsx("code",{children:"set"})," com visibilidades diferentes."]})]})]})}export{i as default};
