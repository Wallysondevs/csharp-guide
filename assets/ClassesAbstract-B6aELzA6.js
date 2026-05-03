import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Classes abstratas: contratos parcialmente implementados",subtitle:"Aprenda a definir uma classe que serve apenas como modelo, obrigando filhas a implementar partes essenciais.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:['Imagine um manual de "como ser uma forma geométrica": toda forma deve saber calcular sua área. Mas o cálculo da área de um círculo é diferente do cálculo de um quadrado — não dá para o manual fornecer a fórmula universal. Por outro lado, todas as formas concordam em ter um nome, uma cor, um método para imprimir suas informações. Uma ',e.jsx("strong",{children:"classe abstrata"})," é exatamente esse manual: parte está pronta, parte é exigida das filhas. Ela funciona como um meio-termo entre uma classe concreta (totalmente pronta) e uma interface (puramente um contrato)."]}),e.jsxs("h2",{children:["O que é uma classe ",e.jsx("code",{children:"abstract"}),"?"]}),e.jsxs("p",{children:["Uma classe marcada com ",e.jsx("code",{children:"abstract"})," tem duas características-chave:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Você ",e.jsx("strong",{children:"não pode instanciá-la"})," diretamente com ",e.jsx("code",{children:"new"}),'. Faz sentido — não existe "uma forma genérica", só formas específicas.']}),e.jsxs("li",{children:["Ela pode (e geralmente deve) declarar ",e.jsx("strong",{children:"métodos abstratos"}),": declarações sem corpo que ",e.jsx("em",{children:"obrigam"})," as filhas a implementar."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract class Forma
{
    public string Cor { get; init; } = "Preto";

    // Método abstrato: sem corpo, termina com ;
    // Toda filha É OBRIGADA a fornecer uma implementação
    public abstract double CalcularArea();

    // Método concreto: já tem comportamento padrão e é herdado normalmente
    public void Descrever()
    {
        Console.WriteLine($"Forma {Cor} com área {CalcularArea():F2}.");
    }
}`})}),e.jsxs("p",{children:["Note como ",e.jsx("code",{children:"CalcularArea"})," não tem corpo (nem chaves ",e.jsx("code",{children:"{ }"}),") — apenas a assinatura terminada em ponto-e-vírgula. Isso é a marca de um método abstrato."]}),e.jsx("h2",{children:"Exemplo prático: Círculo e Quadrado"}),e.jsxs("p",{children:["Vamos criar duas filhas concretas de ",e.jsx("code",{children:"Forma"}),". Cada uma ",e.jsx("strong",{children:"deve"})," implementar ",e.jsx("code",{children:"CalcularArea"}),", mas herda ",e.jsx("code",{children:"Cor"})," e ",e.jsx("code",{children:"Descrever"})," de graça."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Circulo : Forma
{
    public double Raio { get; init; }

    // 'override' obrigatório para implementar o abstract
    public override double CalcularArea() => Math.PI * Raio * Raio;
}

public class Quadrado : Forma
{
    public double Lado { get; init; }

    public override double CalcularArea() => Lado * Lado;
}

Forma[] formas =
{
    new Circulo  { Cor = "Vermelho", Raio = 3 },
    new Quadrado { Cor = "Azul",     Lado = 4 }
};

foreach (var f in formas) f.Descrever();
// Forma Vermelho com área 28,27.
// Forma Azul com área 16,00.`})}),e.jsx("h2",{children:"Por que não posso instanciar?"}),e.jsxs("p",{children:["Tentar fazer ",e.jsx("code",{children:"new Forma()"})," dá erro de compilação. A justificativa é semântica: se ",e.jsx("code",{children:"CalcularArea"})," não tem implementação, qual área seria devolvida? Nenhuma resposta seria correta. Forçar a impossibilidade de instanciar protege seu programa de chamar métodos vazios."]}),e.jsx("pre",{children:e.jsx("code",{children:`// var f = new Forma();
// ERRO CS0144: Cannot create an instance of the abstract type 'Forma'`})}),e.jsxs(a,{type:"info",title:"Pode ter construtor sim",children:["Uma classe abstrata pode (e frequentemente tem) construtores. Eles não criam instâncias diretas dela, mas são chamados pelas filhas via ",e.jsx("code",{children:": base(...)"})," para inicializar campos comuns."]}),e.jsx("h2",{children:"Métodos concretos junto de abstratos"}),e.jsxs("p",{children:["O grande poder de uma classe abstrata, comparado a uma interface tradicional, é poder oferecer ",e.jsx("strong",{children:"código pronto"})," ao lado das obrigações. Filhas reaproveitam o código pronto e só preenchem o que é específico."]}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract class Notificador
{
    public string Destinatario { get; init; } = "";

    // Concreto: estratégia comum para todas as filhas
    public void Enviar(string mensagem)
    {
        Console.WriteLine($"[{DateTime.Now:T}] Enviando para {Destinatario}...");
        EnviarConteudo(mensagem); // delega o "como" para a filha
        Console.WriteLine("Enviado.");
    }

    // Abstrato: cada filha decide o canal específico
    protected abstract void EnviarConteudo(string mensagem);
}

public class NotificadorEmail : Notificador
{
    protected override void EnviarConteudo(string m)
        => Console.WriteLine($"Email body: {m}");
}

public class NotificadorSms : Notificador
{
    protected override void EnviarConteudo(string m)
        => Console.WriteLine($"SMS: {m[..Math.Min(160, m.Length)]}");
}`})}),e.jsxs("p",{children:["Esse padrão se chama ",e.jsx("strong",{children:"Template Method"}),': a pai define o "esqueleto" (o que fazer), e as filhas preenchem as etapas específicas (o como).']}),e.jsx("h2",{children:"Propriedades abstratas"}),e.jsx("p",{children:"Não só métodos podem ser abstratos. Propriedades também — declarando os acessadores sem corpo. Filhas implementam normalmente."}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract class Funcionario
{
    public string Nome { get; init; } = "";

    // Propriedade abstrata: cada cargo tem seu cálculo de salário
    public abstract decimal Salario { get; }
}

public class Vendedor : Funcionario
{
    public decimal Comissao { get; init; }
    public override decimal Salario => 2000m + Comissao;
}

public class Gerente : Funcionario
{
    public override decimal Salario => 8000m;
}`})}),e.jsxs(a,{type:"warning",title:"Abstract vs interface",children:["Use ",e.jsx("strong",{children:"classe abstrata"}),' quando há código a compartilhar e a relação é "é-um". Use ',e.jsx("strong",{children:"interface"}),' quando você só quer definir um contrato, sem implementação compartilhada (ou quando uma classe precisa "ser" várias coisas — herança múltipla de interfaces). Veremos interfaces no próximo capítulo.']}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar ",e.jsx("code",{children:"new ClasseAbstrata()"})]}),": o compilador bloqueia. Você precisa criar uma filha concreta primeiro."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de implementar todos os ",e.jsx("code",{children:"abstract"})]}),": a filha vira automaticamente abstrata também (herda a obrigação) e o compilador exige que você marque ela como ",e.jsx("code",{children:"abstract"})," ou implemente os métodos."]}),e.jsx("li",{children:e.jsxs("strong",{children:["Marcar tudo como ",e.jsx("code",{children:"abstract"}),": se a sua classe não tem nada implementado, talvez você quisesse uma ",e.jsx("em",{children:"interface"}),", não uma classe abstrata."]})}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"override"})," ao implementar"]}),": o compilador acusa erro pedindo a palavra-chave."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Classe ",e.jsx("code",{children:"abstract"})," não pode ser instanciada com ",e.jsx("code",{children:"new"}),"."]}),e.jsxs("li",{children:["Métodos ",e.jsx("code",{children:"abstract"})," não têm corpo e obrigam filhas a implementar."]}),e.jsx("li",{children:"Pode misturar membros abstratos com membros concretos (já implementados)."}),e.jsxs("li",{children:["Filhas usam ",e.jsx("code",{children:"override"})," para satisfazer o contrato abstrato."]}),e.jsx("li",{children:"Padrão Template Method: pai abstrata define o esqueleto, filhas preenchem detalhes."}),e.jsx("li",{children:"Use abstrata quando há código pra reaproveitar; use interface quando só quer contrato."})]})]})}export{i as default};
