import{j as e}from"./index-CzLAthD5.js";import{P as s,A as a}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(s,{title:"Classes static, partial e nested",subtitle:"Três variações de classe que resolvem problemas específicos: agrupar utilitários, dividir código em arquivos e encapsular tipos auxiliares.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Nem toda classe precisa virar um objeto que você instancia, e nem todo arquivo precisa conter uma classe inteira. Em C#, três modificadores ampliam o conceito tradicional de classe para resolver problemas práticos do dia a dia: ",e.jsx("strong",{children:e.jsx("code",{children:"static"})})," (caixa de utilitários sem instância), ",e.jsx("strong",{children:e.jsx("code",{children:"partial"})})," (mesma classe espalhada em vários arquivos) e ",e.jsx("strong",{children:"nested"})," (uma classe dentro da outra). Conhecer cada uma evita criar workarounds estranhos quando uma simples palavrinha resolve."]}),e.jsx("h2",{children:"Static class: a caixa de ferramentas"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"classe estática"})," é uma classe que ",e.jsx("em",{children:"nunca"}),' é instanciada. Ela existe só para agrupar funções e dados relacionados que não dependem de "estado de objeto". O exemplo clássico é ',e.jsx("code",{children:"Math"})," do .NET: você nunca escreve ",e.jsx("code",{children:"new Math()"}),"; chama direto ",e.jsx("code",{children:"Math.Sqrt(9)"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`public static class CalculadoraIR
{
    // Constantes que pertencem à classe, não a instâncias
    public const decimal Faixa1 = 2259.20m;
    public const decimal Faixa2 = 2826.65m;

    // Método utilitário sem dependência de estado
    public static decimal CalcularImposto(decimal salario)
    {
        if (salario <= Faixa1) return 0m;
        if (salario <= Faixa2) return (salario - Faixa1) * 0.075m;
        return (salario - Faixa1) * 0.15m;
    }
}

// Uso direto, sem 'new'
decimal ir = CalculadoraIR.CalcularImposto(3000m);`})}),e.jsxs("p",{children:["Regras: toda classe ",e.jsx("code",{children:"static"})," só pode conter membros ",e.jsx("code",{children:"static"}),"; o compilador impede que você crie campos de instância ou construtores normais. Não pode ser herdada nem usada como tipo de variável."]}),e.jsxs(a,{type:"info",title:"static using",children:["Você pode importar todos os membros estáticos de uma classe com ",e.jsx("code",{children:"using static System.Math;"})," e depois chamar ",e.jsx("code",{children:"Sqrt(9)"})," sem o prefixo. Útil em código matemático, mas use com moderação para não confundir o leitor."]}),e.jsx("h2",{children:"Partial class: a mesma classe em vários arquivos"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"classe parcial"})," é uma classe cuja definição está dividida em dois ou mais arquivos. O compilador junta as partes na hora de compilar, como se tivesse sido escrita inteira em um arquivo só. Foi criada para suportar geradores de código (",e.jsx("em",{children:"code generators"}),'): a ferramenta gera um arquivo, você escreve o complemento em outro, sem nenhum dos dois "passar por cima" do outro.']}),e.jsx("pre",{children:e.jsx("code",{children:`// Arquivo: Pessoa.cs (escrito por você)
public partial class Pessoa
{
    public string Nome { get; init; } = "";

    public void Apresentar()
        => Console.WriteLine($"Olá, sou {Nome}.");
}

// Arquivo: Pessoa.Generated.cs (gerado por uma ferramenta)
public partial class Pessoa
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public string Resumo() => $"#{Id} - {Nome}";
}`})}),e.jsxs("p",{children:["Os dois arquivos compõem uma única classe ",e.jsx("code",{children:"Pessoa"})," com quatro membros. Use ",e.jsx("code",{children:"partial"})," quando faz sentido separar visualmente código manual de código gerado, ou quando uma classe muito grande beneficia de divisão por responsabilidade (mas, em geral, classes muito grandes pedem refatoração, não divisão)."]}),e.jsx("h2",{children:"Partial methods: assinatura sem corpo obrigatório"}),e.jsxs("p",{children:["Em conjunto com ",e.jsx("code",{children:"partial"}),", você pode declarar ",e.jsx("strong",{children:"métodos parciais"}),': a assinatura aparece em uma parte; o corpo é opcional na outra. Se ninguém implementa, o compilador remove a chamada inteira — útil para "ganchos" de extensão sem custo.']}),e.jsx("pre",{children:e.jsx("code",{children:`public partial class Pessoa
{
    partial void OnNomeAlterado(string novoNome);

    public void RenomearPara(string novoNome)
    {
        Nome = novoNome;
        OnNomeAlterado(novoNome); // some se ninguém implementar
    }
}

// Em outro arquivo, opcionalmente:
public partial class Pessoa
{
    partial void OnNomeAlterado(string novoNome)
        => Console.WriteLine($"Renomeado para {novoNome}");
}`})}),e.jsx("h2",{children:"Nested class: classe dentro de classe"}),e.jsxs("p",{children:["Uma ",e.jsx("strong",{children:"classe aninhada"})," é declarada dentro de outra. Ela serve para encapsular um tipo auxiliar que só faz sentido no contexto da classe externa. Cada instância da nested é totalmente independente do enclosing — não há acoplamento mágico de dados."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class CarrinhoCompras
{
    private readonly List<Item> itens = new();

    // Nested class: faz sentido somente dentro de CarrinhoCompras
    public class Item
    {
        public string Produto { get; init; } = "";
        public decimal Preco { get; init; }
        public int Quantidade { get; init; }
    }

    public void Adicionar(Item i) => itens.Add(i);
    public decimal Total => itens.Sum(i => i.Preco * i.Quantidade);
}

// Uso de fora: o nome qualificado é Externa.Interna
var c = new CarrinhoCompras();
c.Adicionar(new CarrinhoCompras.Item
{
    Produto = "Café",
    Preco = 25.50m,
    Quantidade = 2
});`})}),e.jsxs("p",{children:['Vantagens: o tipo auxiliar não polui o namespace global; quem lê o código de fora vê imediatamente a relação ("Item pertence a Carrinho"); pode acessar membros ',e.jsx("code",{children:"private"})," da classe externa quando útil."]}),e.jsx(a,{type:"warning",title:"Nested ≠ inner class do Java",children:'Em Java, "inner class" mantém referência implícita ao objeto externo. Em C#, uma classe aninhada NÃO mantém essa referência: ela é como uma classe normal, só com nome qualificado. Para acessar a instância externa, você precisa passar uma referência explícita.'}),e.jsx("h2",{children:"Casos de uso típicos"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"static class"}),": utilitários (",e.jsx("code",{children:"Math"}),", ",e.jsx("code",{children:"String"}),", ",e.jsx("code",{children:"File"}),"), métodos de extensão (capítulo próprio), constantes globais agrupadas, fábricas que não precisam de estado."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"partial class"}),": tipos gerados por ferramentas (Entity Framework, designers WinForms/WPF, Source Generators), separar a UI da lógica em arquivos diferentes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"nested class"}),": tipos auxiliares pertinentes só ao escopo da externa (",e.jsx("em",{children:"builder"})," interno, nó de árvore, item de coleção customizada, enumerador específico)."]})]}),e.jsx("h2",{children:"Combinação útil: nested + private + record"}),e.jsxs("p",{children:["Um padrão moderno: classe nested marcada como ",e.jsx("code",{children:"private"}),", usada como detalhe de implementação invisível por fora. Frequentemente combinada com ",e.jsx("code",{children:"record"})," para virar um DTO interno."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class CacheUsuarios
{
    // Detalhe interno: ninguém de fora vê esta classe
    private record Entrada(string Nome, DateTime ExpiraEm);

    private readonly Dictionary<int, Entrada> mapa = new();

    public void Adicionar(int id, string nome)
        => mapa[id] = new Entrada(nome, DateTime.UtcNow.AddMinutes(10));

    public string? Buscar(int id)
        => mapa.TryGetValue(id, out var e) && e.ExpiraEm > DateTime.UtcNow
            ? e.Nome
            : null;
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar instanciar uma ",e.jsx("code",{children:"static class"})]}),': o compilador bloqueia. Static é "namespace de funções", não "objeto".']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"partial"})," em uma das partes"]}),": se um arquivo declara ",e.jsx("code",{children:"partial class X"})," e outro só ",e.jsx("code",{children:"class X"}),", o compilador acusa duplicidade."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Achar que nested vê o estado da externa automaticamente"}),": precisa passar a referência (",e.jsx("code",{children:"this"}),") explicitamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Usar partial só para "diminuir" um arquivo'}),": se a classe está grande demais, talvez ela tenha responsabilidades demais — refatore em vez de só dividir."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"static class"}),": nunca instanciada; só membros estáticos; ótima para utilitários."]}),e.jsxs("li",{children:[e.jsx("code",{children:"partial class"}),": definição espalhada em vários arquivos; o compilador junta tudo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"partial method"}),": declarado num arquivo, opcionalmente implementado em outro."]}),e.jsx("li",{children:"Nested class: declarada dentro de outra; encapsula tipos auxiliares relacionados."}),e.jsx("li",{children:"Combinações como nested + private + record dão tipos internos elegantes."})]})]})}export{r as default};
