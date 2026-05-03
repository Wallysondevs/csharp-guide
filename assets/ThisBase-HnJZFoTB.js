import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(s,{title:"As palavras-chave this e base",subtitle:"Duas palavras curtas que resolvem ambiguidade, encadeiam construtores e dão acesso à classe pai. Indispensáveis em POO.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:['Quando você está numa reunião de família e diz "passa o sal", todo mundo entende. Mas se há dois "Joãos" na mesa, você precisa especificar: "João pai, passa o sal". Em programação acontece a mesma coisa: dentro de um método, quando um parâmetro tem o mesmo nome de um campo, ou quando uma classe filha precisa chamar o método "do pai", você precisa de palavras que apontem com clareza para ',e.jsx("em",{children:"quem"})," está falando. Em C#, essas palavras são ",e.jsx("code",{children:"this"})," (a instância atual) e ",e.jsx("code",{children:"base"})," (a classe pai)."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"this"})," para desambiguar"]}),e.jsxs("p",{children:["O uso mais comum: você tem um campo chamado ",e.jsx("code",{children:"nome"})," e um parâmetro do construtor também chamado ",e.jsx("code",{children:"nome"}),'. Quem é quem? Por padrão, o nome local "ganha", e o campo fica esquecido. ',e.jsx("code",{children:"this.nome"}),' diz: "este aqui é o campo da instância".']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa
{
    private string nome;

    public Pessoa(string nome)
    {
        // Sem 'this', você atribuiria o parâmetro a si mesmo (bug silencioso!)
        this.nome = nome;
    }
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"this"})," como referência ao próprio objeto"]}),e.jsxs("p",{children:[e.jsx("code",{children:"this"}),' também pode ser usado como argumento, para passar "eu mesmo" para outro método. Isso aparece, por exemplo, em padrões fluentes ou quando um objeto se registra em um observador.']}),e.jsx("pre",{children:e.jsx("code",{children:`public class Botao
{
    private readonly EventoCentral central;

    public Botao(EventoCentral central)
    {
        this.central = central;
        // Passa o próprio botão para se registrar como inscrito
        central.Registrar(this);
    }
}

public class EventoCentral
{
    private readonly List<Botao> inscritos = new();
    public void Registrar(Botao b) => inscritos.Add(b);
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"this(...)"}),": encadeando construtores"]}),e.jsxs("p",{children:["Quando uma classe tem vários construtores e você quer que um chame o outro, use ",e.jsx("code",{children:": this(...)"})," logo após a assinatura. Isso evita repetir lógica de inicialização."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Cliente
{
    public string Nome { get; }
    public string Email { get; }
    public bool Ativo { get; private set; }

    public Cliente(string nome, string email)
    {
        Nome = nome;
        Email = email;
        Ativo = true;
    }

    // Construtor curto que delega para o completo
    public Cliente(string nome) : this(nome, "sem-email@indefinido")
    {
        // O corpo aqui roda DEPOIS do this(...) terminar
    }
}`})}),e.jsxs(o,{type:"info",title:"Ordem de execução",children:["Quando você escreve ",e.jsx("code",{children:": this(...)"})," ou ",e.jsx("code",{children:": base(...)"}),", esse encadeamento roda ",e.jsx("em",{children:"antes"}),' do corpo do construtor que você está escrevendo. É como dizer "primeiro faça aquilo, depois faça isto".']}),e.jsxs("h2",{children:[e.jsx("code",{children:"base.Metodo()"}),": chamando o método da classe pai"]}),e.jsxs("p",{children:["Quando a classe filha sobrescreve um método da pai com ",e.jsx("code",{children:"override"}),", ela pode querer ",e.jsx("em",{children:"complementar"})," o que o pai faz, não substituir totalmente. ",e.jsx("code",{children:"base.Metodo()"})," chama a versão original."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Animal
{
    public virtual void Apresentar()
    {
        Console.WriteLine("Sou um animal.");
    }
}

public class Cachorro : Animal
{
    public override void Apresentar()
    {
        base.Apresentar(); // mantém o comportamento original
        Console.WriteLine("E mais especificamente, um cachorro.");
    }
}

new Cachorro().Apresentar();
// Sou um animal.
// E mais especificamente, um cachorro.`})}),e.jsxs("h2",{children:[e.jsx("code",{children:": base(...)"})," no construtor da filha"]}),e.jsxs("p",{children:['A classe pai pode exigir parâmetros no seu próprio construtor. A filha precisa "passar adiante" esses dados usando ',e.jsx("code",{children:": base(...)"}),". Sem isso, o compilador acusa erro."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Veiculo
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
}`})}),e.jsxs("h2",{children:["Quando NÃO usar ",e.jsx("code",{children:"this"})]}),e.jsxs("p",{children:["Em código moderno, ",e.jsx("code",{children:"this"})," só é necessário para desambiguar. Escrever ",e.jsx("code",{children:"this."})," em todo lugar é considerado ruído visual — o compilador entende perfeitamente sem ele. Use só quando há choque de nomes ou quando você precisa passar a instância como argumento."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pedido
{
    public decimal Total { get; private set; }

    public void AdicionarItem(decimal valor)
    {
        // Não precisa de this.Total: não há ambiguidade
        Total += valor;
    }
}`})}),e.jsxs(o,{type:"warning",title:"base só funciona com herança",children:[e.jsx("code",{children:"base"})," só faz sentido dentro de uma classe que herda de outra. Em uma classe sem pai explícito (que herda apenas de ",e.jsx("code",{children:"object"}),"), ",e.jsx("code",{children:"base.Metodo()"})," só consegue chamar métodos do próprio ",e.jsx("code",{children:"object"}),", como ",e.jsx("code",{children:"ToString()"})," ou ",e.jsx("code",{children:"GetHashCode()"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"this"})," em construtor"]}),": ",e.jsx("code",{children:"nome = nome;"})," atribui o parâmetro a si mesmo e o campo fica vazio. Sem erro de compilação, com bug silencioso."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"this"})," em método estático"]}),": métodos ",e.jsx("code",{children:"static"})," não pertencem a uma instância, então ",e.jsx("code",{children:"this"})," simplesmente não existe nesse contexto."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar chamar ",e.jsx("code",{children:"base"})," sem o objeto pai esperar"]}),": se a pai não definiu o método como ",e.jsx("code",{children:"virtual"}),", a filha não pode ",e.jsx("code",{children:"override"}),", e ",e.jsx("code",{children:"base.Metodo()"})," só compila se o método realmente existir."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:": base(...)"})," e ",e.jsx("code",{children:"base.Metodo()"})]}),": o primeiro só pode aparecer no cabeçalho do construtor; o segundo é chamada normal dentro do corpo."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"this"}),' = "este objeto aqui" — útil para desambiguar e para passar a instância adiante.']}),e.jsxs("li",{children:[e.jsx("code",{children:"this(...)"})," no cabeçalho de construtor = chama outro construtor da mesma classe."]}),e.jsxs("li",{children:[e.jsx("code",{children:"base.Metodo()"})," = invoca a versão da classe pai."]}),e.jsxs("li",{children:[e.jsx("code",{children:": base(...)"})," no cabeçalho = passa argumentos para o construtor da pai."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"this"})," com moderação: só onde realmente esclarece o código."]})]})]})}export{r as default};
