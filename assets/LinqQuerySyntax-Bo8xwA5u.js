import{j as e}from"./index-CzLAthD5.js";import{P as s,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"Query syntax vs Method syntax em LINQ",subtitle:"As duas formas de escrever LINQ — quando uma é mais clara que a outra e por que ambas existem.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:['LINQ tem duas "caras". A primeira parece ',e.jsx("strong",{children:"SQL"})," escrito ao contrário (",e.jsx("code",{children:"from x in lista where ... select ..."}),") e se chama ",e.jsx("strong",{children:"query syntax"}),". A segunda parece chamada de método encadeada (",e.jsx("code",{children:"lista.Where(...).Select(...)"}),") e se chama ",e.jsx("strong",{children:"method syntax"}),". Por baixo dos panos, as duas viram exatamente o mesmo código compilado — query syntax é apenas ",e.jsx("em",{children:"açúcar sintático"})," (uma forma mais bonita de escrever a mesma coisa). Saber as duas e escolher a mais legível para cada caso é marca de quem domina LINQ."]}),e.jsx("h2",{children:"O mesmo exemplo nos dois estilos"}),e.jsxs("p",{children:["Vamos começar com uma comparação direta. As duas queries abaixo fazem ",e.jsx("strong",{children:"exatamente"})," a mesma coisa — filtrar pessoas maiores de idade e devolver seus nomes em maiúsculas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`record Pessoa(string Nome, int Idade);

var pessoas = new[] {
    new Pessoa("Ana",   17),
    new Pessoa("João",  25),
    new Pessoa("Maria", 30)
};

// Query syntax — parecida com SQL invertido
var query = from p in pessoas
            where p.Idade >= 18
            select p.Nome.ToUpper();

// Method syntax — chamada encadeada
var metodo = pessoas
    .Where(p => p.Idade >= 18)
    .Select(p => p.Nome.ToUpper());`})}),e.jsx("h2",{children:"A anatomia da query syntax"}),e.jsxs("p",{children:["Toda query começa com ",e.jsx("code",{children:"from X in Coleção"})," (declara a variável de iteração) e termina com ",e.jsx("code",{children:"select"})," ou ",e.jsx("code",{children:"group ... by"}),". Entre eles podem entrar quantos ",e.jsx("code",{children:"where"}),", ",e.jsx("code",{children:"orderby"}),", ",e.jsx("code",{children:"join"})," e outros ",e.jsx("code",{children:"from"})," você quiser."]}),e.jsx("pre",{children:e.jsx("code",{children:`var resultado = from p in pessoas        // origem
                where p.Idade >= 18      // filtro
                orderby p.Nome           // ordenação
                select new {             // projeção
                    p.Nome,
                    Categoria = p.Idade >= 60 ? "Sênior" : "Adulto"
                };`})}),e.jsxs("p",{children:["Note: a ordem é ",e.jsx("code",{children:"from → where → orderby → select"}),". Em SQL, ",e.jsx("code",{children:"SELECT"})," vem primeiro; em LINQ, vem por último — porque você só sabe o que projetar ",e.jsx("em",{children:"depois"})," de filtrar."]}),e.jsx("h2",{children:"let: variáveis intermediárias dentro da query"}),e.jsxs("p",{children:["Uma das vantagens reais da query syntax é o ",e.jsx("code",{children:"let"}),", que cria uma variável ",e.jsx("em",{children:"derivada"})," dentro da query, evitando recalcular a mesma expressão várias vezes. Em method syntax, o equivalente seria fazer um ",e.jsx("code",{children:"Select"})," intermediário com tipo anônimo — bem mais verboso."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Query syntax com let:
var query = from arq in arquivos
            let tamMb = arq.Tamanho / 1024.0 / 1024.0
            where tamMb > 5
            orderby tamMb descending
            select new { arq.Nome, MB = tamMb };

// Equivalente em method syntax (sem let):
var metodo = arquivos
    .Select(arq => new { arq, tamMb = arq.Tamanho / 1024.0 / 1024.0 })
    .Where(x => x.tamMb > 5)
    .OrderByDescending(x => x.tamMb)
    .Select(x => new { x.arq.Nome, MB = x.tamMb });`})}),e.jsxs(r,{type:"info",title:"Use let para legibilidade",children:["Sempre que uma expressão se repete duas ou mais vezes na query, extraia para um ",e.jsx("code",{children:"let"}),". Além de mais rápido (calcula uma vez só), fica muito mais fácil de ler."]}),e.jsx("h2",{children:"into: continuação de query"}),e.jsxs("p",{children:["A palavra ",e.jsx("code",{children:"into"}),' permite "começar de novo" a query a partir de um resultado intermediário (group, join). Sem ela, você teria que quebrar em duas variáveis. Veja um agrupamento por idade:']}),e.jsx("pre",{children:e.jsx("code",{children:`var query = from p in pessoas
            group p by p.Idade / 10 * 10 into faixa
            // a partir daqui, "faixa" é cada grupo
            orderby faixa.Key
            select new {
                Decada  = faixa.Key,
                Nomes   = faixa.Select(x => x.Nome).ToList()
            };

// Saída de exemplo:
// { Decada = 10, Nomes = [Ana] }
// { Decada = 20, Nomes = [João] }
// { Decada = 30, Nomes = [Maria] }`})}),e.jsx("h2",{children:"O que SÓ existe em method syntax"}),e.jsxs("p",{children:["Várias operações ",e.jsx("strong",{children:"não têm equivalente"})," em query syntax: ",e.jsx("code",{children:"Count"}),", ",e.jsx("code",{children:"Sum"}),", ",e.jsx("code",{children:"First"}),", ",e.jsx("code",{children:"Distinct"}),", ",e.jsx("code",{children:"Skip"}),", ",e.jsx("code",{children:"Take"}),", ",e.jsx("code",{children:"Aggregate"}),"... Quando precisa delas, você é obrigado a misturar os dois estilos — colocando a query entre parênteses e chamando o método."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Mistura — totalmente válida e comum:
int qtdAdultos = (from p in pessoas
                  where p.Idade >= 18
                  select p).Count();

// Ou só method:
int qtdAdultos2 = pessoas.Count(p => p.Idade >= 18);

// O segundo é mais idiomático para casos simples.`})}),e.jsx("h2",{children:"Quando usar cada um?"}),e.jsx("p",{children:"Não há regra absoluta, mas a comunidade C# tende a:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Usar ",e.jsx("strong",{children:"query syntax"})," quando há ",e.jsx("code",{children:"join"}),", ",e.jsx("code",{children:"group by"}),", ou várias variáveis temporárias com ",e.jsx("code",{children:"let"}),". Fica mais legível."]}),e.jsxs("li",{children:["Usar ",e.jsx("strong",{children:"method syntax"})," em queries simples (filtrar, projetar) e quando precisa de operadores que só existem como método (",e.jsx("code",{children:"Distinct"}),", ",e.jsx("code",{children:"Count"}),", ",e.jsx("code",{children:"FirstOrDefault"}),"...)."]}),e.jsx("li",{children:"Não misturar dentro de uma mesma expressão sem necessidade — escolha um estilo e mantenha."})]}),e.jsx("h2",{children:"O compilador faz a tradução"}),e.jsx("p",{children:"Esta query syntax:"}),e.jsx("pre",{children:e.jsx("code",{children:"from p in pessoas where p.Idade > 18 select p.Nome"})}),e.jsx("p",{children:"é literalmente reescrita pelo compilador para:"}),e.jsx("pre",{children:e.jsx("code",{children:"pessoas.Where(p => p.Idade > 18).Select(p => p.Nome)"})}),e.jsxs("p",{children:["O compilador procura por métodos chamados ",e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Select"}),", ",e.jsx("code",{children:"Join"}),", ",e.jsx("code",{children:"GroupBy"}),", ",e.jsx("code",{children:"OrderBy"})," e ",e.jsx("code",{children:"SelectMany"})," sobre o tipo da coleção. Por isso LINQ funciona tanto sobre ",e.jsx("code",{children:"IEnumerable"})," (memória) quanto sobre ",e.jsx("code",{children:"IQueryable"}),' (banco): qualquer tipo que ofereça esses métodos com a assinatura correta vira "queryable" automaticamente.']}),e.jsxs(r,{type:"warning",title:"Sempre termine em select ou group",children:["Esquecer o ",e.jsx("code",{children:"select"})," dá erro: ",e.jsx("em",{children:'"Query body must end with a select clause or a group clause"'}),". Mesmo quando você só quer o objeto inteiro, escreva ",e.jsx("code",{children:"select p"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esperar que ",e.jsx("code",{children:"select"})," venha primeiro"]})," como em SQL — em LINQ ele vem por último."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"=="})," em ",e.jsx("code",{children:"join"})]}),", em vez do obrigatório ",e.jsx("code",{children:"equals"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer parênteses ao misturar estilos"}),": ",e.jsx("code",{children:"(from ... select x).Count()"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Renomear variável de iteração no meio da query"})," sem usar ",e.jsx("code",{children:"into"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Query syntax e method syntax são equivalentes — açúcar sintático."}),e.jsxs("li",{children:["Query syntax brilha em joins, groups e queries com várias variáveis (",e.jsx("code",{children:"let"}),")."]}),e.jsxs("li",{children:["Method syntax é única opção para vários operadores (",e.jsx("code",{children:"Count"}),", ",e.jsx("code",{children:"First"}),"...)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"let"})," cria variáveis intermediárias dentro da query."]}),e.jsxs("li",{children:[e.jsx("code",{children:"into"})," permite continuar a query a partir de um ",e.jsx("code",{children:"group"})," ou ",e.jsx("code",{children:"join"}),"."]}),e.jsx("li",{children:"O compilador traduz query syntax para chamadas de método antes de compilar."})]})]})}export{i as default};
