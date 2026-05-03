import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Classes e objetos: a base da POO",subtitle:"Entenda de uma vez o que é uma classe, o que é um objeto e por que eles são o coração de C#.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine a planta arquitetônica de uma casa: ela descreve quantos cômodos existem, onde ficam as portas, qual é o tamanho da cozinha. A planta ",e.jsx("strong",{children:"não é uma casa"})," — é apenas um ",e.jsx("em",{children:"projeto"}),". A partir da mesma planta você pode construir 1, 10 ou 1000 casas, e cada uma será uma casa real, com endereço próprio, cor própria e moradores próprios. Em C#, a ",e.jsx("strong",{children:"classe"})," é a planta, e cada ",e.jsx("strong",{children:"objeto"})," é uma casa construída a partir dela. Esse é o pilar central da ",e.jsx("strong",{children:"Programação Orientada a Objetos"})," (POO)."]}),e.jsx("h2",{children:"O que é uma classe?"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"classe"})," é uma estrutura que agrupa ",e.jsx("em",{children:"dados"})," (chamados de campos ou propriedades) e ",e.jsx("em",{children:"comportamentos"}),' (chamados de métodos) que andam juntos. Em vez de espalhar variáveis soltas pelo programa, você as agrupa em uma "caixa" coerente. Por exemplo, em vez de ter as variáveis ',e.jsx("code",{children:"nomeCarro1"}),", ",e.jsx("code",{children:"velocidadeCarro1"}),", ",e.jsx("code",{children:"nomeCarro2"}),", ",e.jsx("code",{children:"velocidadeCarro2"})," espalhadas, você cria uma classe ",e.jsx("code",{children:"Carro"})," que conhece ",e.jsx("em",{children:"como"})," um carro deve se comportar."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Definição da classe (a "planta")
public class Carro
{
    // Campos: dados que cada carro carrega
    public string Modelo;
    public string Cor;
    public int Velocidade;

    // Método: comportamento que todo carro sabe fazer
    public void Acelerar(int incremento)
    {
        Velocidade += incremento;
        Console.WriteLine($"{Modelo} agora está a {Velocidade} km/h.");
    }
}`})}),e.jsxs("p",{children:["Repare: a classe ",e.jsx("code",{children:"Carro"})," sozinha não faz nada. Ela apenas ",e.jsx("em",{children:"descreve"})," que todo carro tem modelo, cor, velocidade e sabe acelerar. Para usá-la, você precisa ",e.jsx("strong",{children:"instanciar"})," — ou seja, fabricar um carro real a partir dessa planta."]}),e.jsxs("h2",{children:["Criando objetos com ",e.jsx("code",{children:"new"})]}),e.jsxs("p",{children:["A palavra-chave ",e.jsx("code",{children:"new"}),' é o "pedreiro" que constrói uma casa a partir da planta. Ela aloca memória para um novo objeto e devolve uma referência a ele. Você guarda essa referência em uma variável.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Cria dois objetos (instâncias) independentes da mesma classe
Carro fusca = new Carro();
fusca.Modelo = "Fusca 1972";
fusca.Cor = "Azul";
fusca.Velocidade = 0;

Carro ferrari = new Carro();
ferrari.Modelo = "Ferrari F40";
ferrari.Cor = "Vermelha";
ferrari.Velocidade = 0;

fusca.Acelerar(20);     // Fusca 1972 agora está a 20 km/h.
ferrari.Acelerar(150);  // Ferrari F40 agora está a 150 km/h.`})}),e.jsxs("p",{children:["Note como cada objeto tem sua própria velocidade. Acelerar a Ferrari não muda a velocidade do Fusca, porque cada chamada de ",e.jsx("code",{children:"new Carro()"})," reservou um pedaço diferente de memória. Esses pedaços são ",e.jsx("em",{children:"instâncias"}),": cópias vivas da planta."]}),e.jsxs(a,{type:"info",title:"Tipo valor x tipo referência",children:["Classes em C# são ",e.jsx("strong",{children:"tipos por referência"}),": a variável ",e.jsx("code",{children:"fusca"})," não guarda o objeto em si, e sim um ",e.jsx("em",{children:"endereço de memória"})," apontando para ele. Por isso, se você atribuir ",e.jsx("code",{children:"Carro outro = fusca;"}),", ambas as variáveis enxergam o mesmo carro."]}),e.jsx("h2",{children:"Campos vs propriedades"}),e.jsxs("p",{children:["No exemplo acima, usamos ",e.jsx("strong",{children:"campos públicos"})," (",e.jsx("code",{children:"public string Modelo;"}),") para simplicidade. Funciona, mas em código profissional você quase sempre usará ",e.jsx("strong",{children:"propriedades"}),", que parecem campos por fora, mas permitem validar e controlar o acesso por dentro. A versão idiomática moderna usa ",e.jsx("em",{children:"auto-properties"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa
{
    // Auto-properties: o compilador cria o "campo escondido" para você
    public string Nome { get; set; } = "";
    public int Idade { get; set; }

    public void Apresentar()
    {
        Console.WriteLine($"Olá, eu sou {Nome} e tenho {Idade} anos.");
    }
}

var maria = new Pessoa { Nome = "Maria", Idade = 30 };
maria.Apresentar(); // Olá, eu sou Maria e tenho 30 anos.`})}),e.jsxs("p",{children:["A diferença visual é pequena (",e.jsx("code",{children:"{ get; set; }"}),' no fim), mas o ganho é enorme: amanhã você pode adicionar regras como "idade não pode ser negativa" sem mudar uma linha sequer no código que ',e.jsx("em",{children:"usa"})," a classe. Veremos isso a fundo no capítulo de Propriedades."]}),e.jsxs("h2",{children:["Métodos de instância e a palavra ",e.jsx("code",{children:"this"})]}),e.jsxs("p",{children:["Quando você chama ",e.jsx("code",{children:"fusca.Acelerar(20)"}),", dentro do método ",e.jsx("code",{children:"Acelerar"})," a palavra ",e.jsx("code",{children:"this"})," se refere automaticamente ao Fusca. Use ",e.jsx("code",{children:"this"})," quando precisar deixar claro que está mexendo num campo da própria instância — especialmente quando um parâmetro tem o mesmo nome de um campo."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class ContaBancaria
{
    public string Titular { get; set; } = "";
    public decimal Saldo { get; private set; }

    public void Depositar(decimal valor)
    {
        // 'this.Saldo' deixa explícito que estamos atualizando o
        // Saldo desta instância em particular
        this.Saldo += valor;
        Console.WriteLine($"{Titular} depositou {valor:C}. Saldo: {Saldo:C}");
    }
}

var conta = new ContaBancaria { Titular = "João", Saldo = 0 };
conta.Depositar(500m); // João depositou R$ 500,00. Saldo: R$ 500,00`})}),e.jsxs(a,{type:"warning",title:"Cuidado com referências compartilhadas",children:["Como objetos são por referência, passar um objeto para um método pode permitir que o método o modifique. Se você quer evitar isso, considere usar ",e.jsx("code",{children:"record"})," (com semântica de valor) ou expor apenas propriedades de leitura."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:"new"})]}),": declarar ",e.jsx("code",{children:"Carro c;"})," sem instanciar deixa ",e.jsx("code",{children:"c"})," valendo ",e.jsx("code",{children:"null"}),"; usar ",e.jsx("code",{children:"c.Acelerar(...)"})," resulta em ",e.jsx("code",{children:"NullReferenceException"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir classe com objeto"}),": você não chama métodos na classe (",e.jsx("code",{children:"Carro.Acelerar"}),"), você chama no objeto (",e.jsx("code",{children:"fusca.Acelerar"}),"). Métodos chamados na classe diretamente são ",e.jsx("code",{children:"static"}),", assunto futuro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar um objeto pensando que é cópia"}),": ",e.jsx("code",{children:"var b = a;"})," não copia o objeto, copia a referência. Mudanças em ",e.jsx("code",{children:"b"})," afetam ",e.jsx("code",{children:"a"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Classe é a planta; objeto é a casa construída a partir dela."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"new NomeDaClasse()"})," para criar uma instância."]}),e.jsx("li",{children:"Cada instância tem seus próprios dados, independentes das outras."}),e.jsxs("li",{children:["Prefira propriedades (",e.jsx("code",{children:"{ get; set; }"}),") a campos públicos."]}),e.jsxs("li",{children:["Métodos de instância operam sobre o objeto chamado e podem usar ",e.jsx("code",{children:"this"})," para se referir a ele."]}),e.jsxs("li",{children:["Classes são tipos por ",e.jsx("em",{children:"referência"}),': cuidado ao "copiar" variáveis.']})]})]})}export{i as default};
