import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function d(){return e.jsxs(r,{title:"Propriedades: getters e setters elegantes",subtitle:"Aprenda a expor dados de uma classe sem abrir mão de validação, segurança e elegância sintática.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine a porta de uma loja: por fora, qualquer cliente pode entrar e sair como se fosse um buraco na parede; por dentro, há fechaduras, sensores e regras (horário de funcionamento, número máximo de pessoas). ",e.jsx("strong",{children:"Propriedades"})," em C# são exatamente isso: do lado de quem usa, parecem campos simples (",e.jsx("code",{children:"p.Idade = 30"}),"); do lado de quem implementa, são pequenos métodos disfarçados que podem validar, calcular ou bloquear o acesso. Esse é o jeito idiomático de C# para juntar simplicidade na chamada com poder na implementação."]}),e.jsx("h2",{children:"O problema dos campos públicos"}),e.jsxs("p",{children:["Quando você expõe um ",e.jsx("code",{children:"public string Nome;"})," diretamente, qualquer parte do programa pode escrever ",e.jsx("code",{children:'p.Nome = "";'})," ou ",e.jsx("code",{children:"p.Nome = null;"})," e quebrar suas regras de negócio. Pior: amanhã, se você precisar validar, é tarde — todo mundo já depende do campo. Propriedades resolvem isso desde o dia 1."]}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM: campo público sem proteção
public class PessoaCampo
{
    public int Idade; // qualquer um pode escrever -1, 999, ou o que quiser
}

// BOM: propriedade que pode ganhar validação no futuro
public class PessoaProp
{
    public int Idade { get; set; }
}`})}),e.jsx("h2",{children:"Auto-properties: a forma mais comum"}),e.jsxs("p",{children:["A sintaxe ",e.jsx("code",{children:"{ get; set; }"})," é uma ",e.jsx("strong",{children:"auto-property"}),": o compilador cria, em segredo, um campo escondido para guardar o valor (chamado ",e.jsx("em",{children:"backing field"}),") e dois mini-métodos (o ",e.jsx("code",{children:"get"})," que devolve o valor e o ",e.jsx("code",{children:"set"})," que recebe um novo valor). Você economiza linhas e ganha a possibilidade de evoluir depois."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Produto
{
    // Auto-property com valor padrão
    public string Nome { get; set; } = "Sem nome";

    // Auto-property somente-leitura externa: só a própria classe pode atribuir
    public decimal Preco { get; private set; }

    public void AplicarDesconto(decimal percentual)
    {
        Preco -= Preco * percentual;
    }
}`})}),e.jsxs("p",{children:["Note ",e.jsx("code",{children:"private set;"}),": por fora, ninguém escreve em ",e.jsx("code",{children:"Preco"})," diretamente; a única forma de mudar é chamar ",e.jsx("code",{children:"AplicarDesconto"}),". Isso é ",e.jsx("strong",{children:"encapsulamento"})," — proteger as regras dentro do objeto."]}),e.jsx("h2",{children:"Propriedade completa com backing field e validação"}),e.jsxs("p",{children:["Quando a auto-property não basta — porque você quer validar entrada, normalizar dados ou disparar eventos — escreva a propriedade na forma ",e.jsx("em",{children:"completa"}),", com um campo escondido feito por você (geralmente nomeado começando com ",e.jsx("code",{children:"_"}),") e o corpo do ",e.jsx("code",{children:"set"})," escrito explicitamente."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Conta
{
    private decimal _saldo; // backing field manual

    public decimal Saldo
    {
        get => _saldo; // expression-bodied: jeito curto de escrever { return _saldo; }
        set
        {
            if (value < 0)
                throw new ArgumentOutOfRangeException(nameof(value), "Saldo não pode ser negativo.");
            _saldo = value;
        }
    }
}

var c = new Conta();
c.Saldo = 100;     // OK
c.Saldo = -50;     // Lança exceção: regra protegida pelo set`})}),e.jsxs("p",{children:["A palavra-chave ",e.jsx("code",{children:"value"})," dentro do ",e.jsx("code",{children:"set"})," é o valor que está sendo atribuído. ",e.jsx("code",{children:"nameof(value)"})," devolve a string ",e.jsx("code",{children:'"value"'})," sem você ter que digitá-la — útil porque, se renomear, o compilador atualiza."]}),e.jsx("h2",{children:"Init-only: imutabilidade após a construção"}),e.jsxs("p",{children:["Desde C# 9, você pode trocar ",e.jsx("code",{children:"set"})," por ",e.jsx("code",{children:"init"}),'. Isso significa: "pode escrever apenas durante a criação do objeto; depois, vira somente-leitura". É perfeito para objetos que devem ser imutáveis — como configurações ou DTOs.']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Configuracao
{
    public string Host { get; init; } = "localhost";
    public int Porta { get; init; } = 8080;
}

var cfg = new Configuracao { Host = "api.exemplo.com", Porta = 443 };
// cfg.Porta = 80; // ERRO de compilação: não pode escrever após init.`})}),e.jsxs(o,{type:"info",title:"Por que init é melhor que set quando não vai mudar",children:[e.jsx("code",{children:"init"})," documenta sua intenção (esse valor é congelado depois da construção), evita bugs e permite usar ",e.jsx("em",{children:"object initializer"})," sem precisar criar um construtor com mil parâmetros."]}),e.jsx("h2",{children:"Computed properties (calculadas)"}),e.jsxs("p",{children:["Nem toda propriedade precisa guardar um valor. Algumas calculam na hora, baseadas em outras propriedades. Use a forma ",e.jsx("strong",{children:"expression-bodied"})," para deixar o código compacto:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Retangulo
{
    public double Largura { get; init; }
    public double Altura { get; init; }

    // Propriedade calculada: não tem set, é derivada de outras
    public double Area => Largura * Altura;
    public double Perimetro => 2 * (Largura + Altura);
}

var r = new Retangulo { Largura = 5, Altura = 3 };
Console.WriteLine(r.Area);      // 15
Console.WriteLine(r.Perimetro); // 16`})}),e.jsxs("p",{children:[e.jsx("code",{children:"Area"})," e ",e.jsx("code",{children:"Perimetro"})," não têm backing field. Cada vez que alguém lê, o cálculo roda de novo. Isso é ótimo para evitar dados duplicados e inconsistentes."]}),e.jsx("h2",{children:"Readonly property (sem set algum)"}),e.jsxs("p",{children:["Se a propriedade só faz sentido em leitura — como um identificador único atribuído na construção — declare apenas o ",e.jsx("code",{children:"get"})," (a forma curta também serve). O valor é definido no construtor e jamais muda."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pedido
{
    public Guid Id { get; } = Guid.NewGuid(); // só get; valor congela na criação
    public DateTime CriadoEm { get; } = DateTime.UtcNow;
}`})}),e.jsxs(o,{type:"warning",title:"Validação fora do setter",children:["Se a regra de validação depender de várias propriedades juntas (ex.: data de fim > data de início), o setter de uma só não é o lugar ideal. Considere validar no construtor ou em um método ",e.jsx("code",{children:"Validar()"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:'= ""'})," em ",e.jsx("code",{children:"string"})," properties"]}),": deixa o valor padrão como ",e.jsx("code",{children:"null"}),", e em projetos com ",e.jsx("em",{children:"nullable reference types"})," ativado o compilador reclama."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"=>"})," de expression-bodied com setter de campo"]}),": ",e.jsx("code",{children:"public int X => 10;"})," é uma propriedade calculada constante, não atribuição."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"set"})," público em propriedade que nunca deveria mudar"]}),": prefira ",e.jsx("code",{children:"init"})," ou ",e.jsx("code",{children:"private set"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Lançar exceções "silenciosas" no setter'}),": documente a exceção esperada (",e.jsx("code",{children:"ArgumentException"}),", ",e.jsx("code",{children:"ArgumentOutOfRangeException"}),") para quem usa entender."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Propriedades parecem campos por fora, mas são métodos por dentro."}),e.jsxs("li",{children:[e.jsx("code",{children:"{ get; set; }"})," = auto-property; o compilador cria o campo escondido."]}),e.jsxs("li",{children:[e.jsx("code",{children:"{ get; init; }"})," = só pode atribuir na criação (imutável depois)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"{ get; private set; }"})," = só a própria classe altera."]}),e.jsxs("li",{children:["Propriedade completa permite validar com ",e.jsx("code",{children:"value"})," dentro do ",e.jsx("code",{children:"set"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"=>"})," para propriedades calculadas curtas."]})]})]})}export{d as default};
