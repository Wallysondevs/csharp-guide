import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Herança: reaproveitando comportamento",subtitle:"Aprenda a derivar uma classe a partir de outra para reaproveitar campos, métodos e comportamentos — sem repetir código.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:['Na biologia, um cachorro é um mamífero, e mamífero é um animal. Tudo que vale para "animal" (respira, se alimenta) automaticamente vale para "cachorro", e o cachorro adiciona seus próprios comportamentos (latir, abanar o rabo). Em código, ',e.jsx("strong",{children:"herança"})," é exatamente esse mecanismo: uma classe filha herda automaticamente os membros da classe pai e pode acrescentar ou modificar comportamentos. Isso evita repetir código e cria hierarquias naturais — desde que você as use com bom senso."]}),e.jsx("h2",{children:"Sintaxe básica: dois pontos e o nome do pai"}),e.jsxs("p",{children:["Para fazer uma classe herdar de outra, basta usar ",e.jsx("code",{children:":"})," seguido do nome da classe pai (chamada também de ",e.jsx("em",{children:"base"})," ou ",e.jsx("em",{children:"superclasse"}),"). A classe filha (também chamada de ",e.jsx("em",{children:"derivada"})," ou ",e.jsx("em",{children:"subclasse"}),") automaticamente ganha tudo que é ",e.jsx("code",{children:"public"})," ou ",e.jsx("code",{children:"protected"})," da pai."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Animal
{
    public string Nome { get; set; } = "";

    public void Respirar()
    {
        Console.WriteLine($"{Nome} está respirando.");
    }
}

// Cachorro herda Nome e Respirar() automaticamente
public class Cachorro : Animal
{
    public void Latir()
    {
        Console.WriteLine($"{Nome}: Au au!");
    }
}

var rex = new Cachorro { Nome = "Rex" };
rex.Respirar(); // Rex está respirando.
rex.Latir();    // Rex: Au au!`})}),e.jsx("h2",{children:"Single inheritance: só um pai"}),e.jsxs("p",{children:["Diferente de algumas linguagens (como C++), C# permite herdar de ",e.jsx("strong",{children:"uma única classe"})," de cada vez. Não existe ",e.jsx("code",{children:"class Filha : Pai1, Pai2"}),'. A motivação é evitar o famoso "problema do diamante", quando dois pais têm um método com o mesmo nome e o filho não sabe qual usar. Para combinar comportamentos de várias fontes, C# oferece ',e.jsx("strong",{children:"interfaces"})," (vistas adiante)."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"base(...)"}),": passando argumentos para o construtor da pai"]}),e.jsxs("p",{children:["Se a pai tem um construtor com parâmetros, a filha precisa indicar como chamá-lo, usando ",e.jsx("code",{children:": base(...)"})," no cabeçalho do seu próprio construtor."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Veiculo
{
    public string Placa { get; }

    public Veiculo(string placa)
    {
        Placa = placa;
    }
}

public class Moto : Veiculo
{
    public int Cilindradas { get; }

    public Moto(string placa, int cilindradas) : base(placa)
    {
        Cilindradas = cilindradas;
    }
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"virtual"})," e ",e.jsx("code",{children:"override"}),": deixando a filha personalizar"]}),e.jsxs("p",{children:["Por padrão, métodos em C# ",e.jsx("strong",{children:"não podem"})," ser sobrescritos por filhas. Para permitir, marque o método na pai como ",e.jsx("code",{children:"virtual"}),". Então a filha usa ",e.jsx("code",{children:"override"})," para fornecer sua própria versão. ",e.jsx("code",{children:"virtual"}),' significa "este método pode ser substituído"; ',e.jsx("code",{children:"override"}),' significa "estou substituindo".']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Animal
{
    public virtual void EmitirSom()
    {
        Console.WriteLine("Som genérico de animal.");
    }
}

public class Gato : Animal
{
    public override void EmitirSom()
    {
        Console.WriteLine("Miau!");
    }
}

public class Vaca : Animal
{
    public override void EmitirSom()
    {
        Console.WriteLine("Muuuu!");
    }
}

Animal a = new Gato();
a.EmitirSom(); // Miau! (a versão da filha é executada)`})}),e.jsxs("p",{children:["Esse é o coração do ",e.jsx("strong",{children:"polimorfismo"}),": a variável ",e.jsx("code",{children:"a"})," tem tipo ",e.jsx("code",{children:"Animal"}),", mas guarda um ",e.jsx("code",{children:"Gato"}),"; o C# chama, em tempo de execução, a versão correta. Veremos isso a fundo no próximo capítulo."]}),e.jsxs(a,{type:"info",title:"base.Metodo() para complementar",children:["Dentro do ",e.jsx("code",{children:"override"}),", você pode chamar ",e.jsx("code",{children:"base.EmitirSom()"})," para executar a versão da pai antes ou depois da sua nova lógica. Útil para aumentar comportamento, não substituir totalmente."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"sealed override"}),": filha que bloqueia netas"]}),e.jsxs("p",{children:["Se uma classe sobrescreve um método e quer impedir que outra classe descendente também sobrescreva, use ",e.jsx("code",{children:"sealed override"}),'. É a forma de "fechar" a cadeia naquele método específico.']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Cachorro : Animal
{
    public sealed override void EmitirSom()
    {
        Console.WriteLine("Au au!");
    }
}

public class Bulldog : Cachorro
{
    // public override void EmitirSom() { } // ERRO: foi selado
}`})}),e.jsx("h2",{children:"Campos protegidos: acesso para a família"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"protected"}),' para membros que a pai expõe apenas para suas filhas (não para o mundo externo). Essa é a forma "amigável" de compartilhar estado interno em uma hierarquia.']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Conta
{
    protected decimal saldo;

    public void Depositar(decimal valor) => saldo += valor;
}

public class ContaPoupanca : Conta
{
    public void Render(decimal taxa)
    {
        // OK: 'saldo' é protected, então a filha enxerga
        saldo += saldo * taxa;
    }
}`})}),e.jsx("h2",{children:"Relação IS-A: o teste para usar herança"}),e.jsxs("p",{children:['A pergunta de ouro antes de criar uma herança: "X ',e.jsx("em",{children:"é um"}),' Y?". Cachorro ',e.jsx("em",{children:"é um"})," Animal? Sim → herança faz sentido. Carro ",e.jsx("em",{children:"é um"})," Motor? Não, carro ",e.jsx("em",{children:"tem um"})," motor → use ",e.jsx("strong",{children:"composição"}),' (uma propriedade do tipo Motor dentro de Carro). Confundir "é um" com "tem um" é a fonte número 1 de hierarquias bizarras.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Composição (preferível): Carro TEM UM motor
public class Motor
{
    public int Cilindradas { get; init; }
    public void Ligar() => Console.WriteLine("Vrum!");
}

public class Carro
{
    private readonly Motor motor;
    public Carro(Motor m) { motor = m; }
    public void Ligar() => motor.Ligar();
}`})}),e.jsxs(a,{type:"warning",title:"Quando NÃO usar herança",children:['Se a única motivação é "reaproveitar três métodos", prefira composição (incluir um objeto auxiliar) ou interfaces. Hierarquias profundas (mais de 2-3 níveis) tendem a virar pesadelo de manutenção. A regra é: ',e.jsx("em",{children:"composição em vez de herança"}),", sempre que houver dúvida."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:": base(...)"})," quando a pai tem construtor com parâmetros"]}),": o compilador acusa erro pedindo o construtor da pai."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar ",e.jsx("code",{children:"override"})," sem ",e.jsx("code",{children:"virtual"})," na pai"]}),': o método não é "abrível" — você só consegue ocultar com ',e.jsx("code",{children:"new"})," (assunto do próximo capítulo)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Herdar só para reaproveitar código"}),": gera acoplamento desnecessário. Use composição."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tornar um campo ",e.jsx("code",{children:"public"})," na pai e contar com isso na filha"]}),": a filha já enxerga membros ",e.jsx("code",{children:"protected"}),", sem precisar de ",e.jsx("code",{children:"public"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["A sintaxe ",e.jsx("code",{children:"class Filha : Pai"})," faz a Filha herdar membros públicos e protegidos."]}),e.jsx("li",{children:"C# permite herança simples — apenas uma classe pai."}),e.jsxs("li",{children:[e.jsx("code",{children:": base(arg)"})," passa argumentos ao construtor da pai."]}),e.jsxs("li",{children:[e.jsx("code",{children:"virtual"})," + ",e.jsx("code",{children:"override"})," permitem que a filha personalize um método."]}),e.jsxs("li",{children:[e.jsx("code",{children:"sealed override"})," impede netas de sobrescrever de novo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"protected"}),' compartilha membros com a "família" sem expor ao mundo.']}),e.jsx("li",{children:"Use o teste IS-A; se não bater, prefira composição."})]})]})}export{s as default};
