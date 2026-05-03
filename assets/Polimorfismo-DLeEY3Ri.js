import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(a,{title:"Polimorfismo: um nome, vários comportamentos",subtitle:"Aprenda a chamar o mesmo método e ter comportamentos diferentes dependendo do tipo real do objeto.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:['Imagine que você grita "fala!" para um grupo de animais: o cachorro late, o gato mia, a vaca muge. Você fez ',e.jsx("em",{children:"uma única solicitação"}),", mas cada um respondeu à sua maneira. Em programação, isso se chama ",e.jsx("strong",{children:"polimorfismo"}),' — do grego "muitas formas". Em C#, polimorfismo permite que você trate objetos diferentes de forma uniforme através de uma classe-base comum, e o sistema escolha automaticamente, em tempo de execução, qual implementação chamar. É um dos pilares mais poderosos da POO.']}),e.jsxs("h2",{children:["O básico: ",e.jsx("code",{children:"virtual"})," + ",e.jsx("code",{children:"override"})]}),e.jsxs("p",{children:["Para que polimorfismo funcione, a classe pai precisa ",e.jsx("em",{children:"permitir"})," que filhas substituam um método. Isso é feito com ",e.jsx("code",{children:"virtual"})," na pai e ",e.jsx("code",{children:"override"})," na filha — termos que vimos no capítulo anterior. Vamos ver isso em ação:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Animal
{
    public string Nome { get; init; } = "";

    // virtual: filhas podem dar sua própria versão
    public virtual void EmitirSom()
    {
        Console.WriteLine($"{Nome} emite um som genérico.");
    }
}

public class Cachorro : Animal
{
    public override void EmitirSom() => Console.WriteLine($"{Nome}: Au au!");
}

public class Gato : Animal
{
    public override void EmitirSom() => Console.WriteLine($"{Nome}: Miau!");
}`})}),e.jsx("h2",{children:"Polimorfismo em runtime: o pulo do gato"}),e.jsxs("p",{children:['A mágica acontece quando você guarda objetos de várias filhas em uma variável (ou coleção) do tipo da pai. Mesmo que a variável "ache" que tem um ',e.jsx("code",{children:"Animal"}),", na hora de chamar ",e.jsx("code",{children:"EmitirSom()"}),", o C# verifica em runtime qual é o tipo ",e.jsx("em",{children:"real"})," do objeto e chama a versão certa. Isso se chama ",e.jsx("strong",{children:"despacho dinâmico"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`Animal[] zoo = new Animal[]
{
    new Cachorro { Nome = "Rex" },
    new Gato     { Nome = "Mia" },
    new Cachorro { Nome = "Bob" }
};

foreach (var bicho in zoo)
{
    bicho.EmitirSom();
    // Rex: Au au!
    // Mia: Miau!
    // Bob: Au au!
}`})}),e.jsxs("p",{children:["Note como o ",e.jsx("code",{children:"foreach"})," não precisa saber se o bicho é cachorro ou gato. Esse desacoplamento é ouro: amanhã você adiciona uma classe ",e.jsx("code",{children:"Vaca"})," que herda de ",e.jsx("code",{children:"Animal"}),", e o loop continua funcionando sem mudar uma linha."]}),e.jsxs(o,{type:"info",title:"Por que isso é tão importante?",children:["Polimorfismo é a base do princípio ",e.jsx("strong",{children:"Open/Closed"}),": seu código fica aberto para extensão (novas classes) e fechado para modificação (não precisa mexer no código existente). Isso reduz drasticamente os bugs ao crescer o sistema."]}),e.jsxs("h2",{children:["Hiding com ",e.jsx("code",{children:"new"}),": o quase-polimorfismo"]}),e.jsxs("p",{children:["Existe uma alternativa ao ",e.jsx("code",{children:"override"}),": a palavra ",e.jsx("code",{children:"new"})," em métodos. Ela ",e.jsx("strong",{children:"oculta"})," (não substitui!) o método da pai. A diferença é sutil, mas crítica:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Veiculo
{
    public virtual void Mover() => Console.WriteLine("Veículo se movendo.");
}

public class Carro : Veiculo
{
    // 'new' oculta, NÃO sobrescreve
    public new void Mover() => Console.WriteLine("Carro andando na estrada.");
}

Veiculo v = new Carro();
v.Mover(); // "Veículo se movendo." - chama a versão da pai!

Carro c = new Carro();
c.Mover(); // "Carro andando na estrada." - chama a versão do filho`})}),e.jsxs("p",{children:["Veja: com ",e.jsx("code",{children:"new"}),", qual versão é chamada depende do ",e.jsx("em",{children:"tipo da variável"}),", não do tipo real do objeto. Quase sempre ",e.jsx("code",{children:"override"})," é o que você quer. Use ",e.jsx("code",{children:"new"}),' só em casos raríssimos (geralmente quando você não pode editar a pai e precisa "esconder" um método de mesmo nome).']}),e.jsxs(o,{type:"warning",title:"O compilador avisa",children:["Se você criar um método com mesmo nome de um método virtual da pai sem usar ",e.jsx("code",{children:"override"})," nem ",e.jsx("code",{children:"new"}),", o compilador gera um aviso. Sempre seja explícito: ou substitua (",e.jsx("code",{children:"override"}),") ou oculte (",e.jsx("code",{children:"new"}),") intencionalmente."]}),e.jsx("h2",{children:"Casting: convertendo entre tipos da hierarquia"}),e.jsxs("p",{children:["Quando você tem um ",e.jsx("code",{children:"Animal"})," mas sabe que ele é, na verdade, um ",e.jsx("code",{children:"Cachorro"})," com método específico de cachorro (digamos, ",e.jsx("code",{children:"BalancarRabo()"}),"), precisa fazer um ",e.jsx("em",{children:"cast"})," — uma conversão explícita. Existem três formas seguras:"]}),e.jsx("pre",{children:e.jsx("code",{children:`Animal a = new Cachorro { Nome = "Rex" };

// 1) Cast direto: lança InvalidCastException se errar
Cachorro c1 = (Cachorro)a;
c1.EmitirSom();

// 2) 'as': devolve null se não der certo (sem exceção)
Cachorro? c2 = a as Cachorro;
if (c2 != null) c2.EmitirSom();

// 3) 'is' com pattern matching (a forma moderna preferida)
if (a is Cachorro c3)
{
    c3.EmitirSom(); // só entra aqui se realmente for Cachorro
}`})}),e.jsx("h2",{children:"Polimorfismo na prática: processador de pagamentos"}),e.jsxs("p",{children:["Um exemplo realista: você tem várias formas de pagamento (cartão, boleto, Pix). Em vez de um ",e.jsx("code",{children:"switch"})," gigante, você usa polimorfismo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pagamento
{
    public decimal Valor { get; init; }
    public virtual void Processar() => Console.WriteLine($"Processando {Valor:C}");
}

public class PagamentoCartao : Pagamento
{
    public override void Processar()
        => Console.WriteLine($"Cobrando {Valor:C} no cartão...");
}

public class PagamentoPix : Pagamento
{
    public override void Processar()
        => Console.WriteLine($"Gerando QR Code Pix de {Valor:C}...");
}

public class PagamentoBoleto : Pagamento
{
    public override void Processar()
        => Console.WriteLine($"Emitindo boleto de {Valor:C} (3 dias úteis).");
}

// Uso uniforme
Pagamento[] pendentes =
{
    new PagamentoCartao { Valor = 199.90m },
    new PagamentoPix    { Valor = 50m },
    new PagamentoBoleto { Valor = 1000m }
};

foreach (var p in pendentes) p.Processar();`})}),e.jsxs("p",{children:["Adicionar um novo método de pagamento é só criar mais uma filha de ",e.jsx("code",{children:"Pagamento"}),". O loop não muda. Esse é o poder real do polimorfismo no dia a dia."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"virtual"})," na pai"]}),": a filha não consegue usar ",e.jsx("code",{children:"override"}),"; o compilador acusa erro pedindo a palavra ",e.jsx("code",{children:"new"})," ou avisando que o método não é overridable."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"new"})," com ",e.jsx("code",{children:"override"})]}),": ",e.jsx("code",{children:"new"})," oculta (despacho estático); ",e.jsx("code",{children:"override"})," substitui (despacho dinâmico). Quase sempre você quer ",e.jsx("code",{children:"override"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Cast inseguro com ",e.jsx("code",{children:"(Tipo)x"})]}),": explode com ",e.jsx("code",{children:"InvalidCastException"}),". Use ",e.jsx("code",{children:"is"})," ou ",e.jsx("code",{children:"as"})," para checar primeiro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Hierarquia rasa demais"}),": às vezes uma ",e.jsx("code",{children:"interface"})," resolve melhor que herdar de uma classe — usaremos isso no capítulo de interfaces."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:'Polimorfismo = "um nome, várias implementações" escolhidas em runtime.'}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"virtual"})," + ",e.jsx("code",{children:"override"})," para permitir e fornecer substituição."]}),e.jsx("li",{children:"Você pode tratar uma coleção heterogênea pela classe-base."}),e.jsxs("li",{children:[e.jsx("code",{children:"new"})," em métodos oculta, não substitui — quase sempre evite."]}),e.jsxs("li",{children:["Para converter entre tipos use ",e.jsx("code",{children:"is Tipo x"})," (preferido), ",e.jsx("code",{children:"as"})," ou cast direto."]}),e.jsx("li",{children:"Polimorfismo é a base para código aberto a extensão e fechado a modificação."})]})]})}export{s as default};
