import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(a,{title:"Execução adiada (deferred) em LINQ",subtitle:"Por que sua query LINQ não roda quando você a escreve — e o que isso significa na prática.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine que você anota uma ",e.jsx("strong",{children:"receita"}),' num papel: "pegar tomate, picar, refogar". Ler a receita não cozinha nada — ela só descreve ',e.jsx("em",{children:"o que fazer"}),". Cozinhar acontece quando você executa os passos. LINQ funciona assim: quando você escreve ",e.jsx("code",{children:"lista.Where(x => x > 10).Select(x => x * 2)"}),", nenhum item é processado. Você criou uma ",e.jsx("strong",{children:"receita"}),'. A execução real só ocorre quando alguém "consome" essa receita iterando sobre ela. Isso se chama ',e.jsx("strong",{children:"execução adiada"})," (deferred execution) e é uma das ideias mais importantes para entender LINQ de verdade."]}),e.jsx("h2",{children:"O experimento que prova tudo"}),e.jsxs("p",{children:["Vamos provar isso com um exemplo simples. Observe quando o ",e.jsx("code",{children:"Console.WriteLine"})," dentro do ",e.jsx("code",{children:"Where"})," é impresso:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var numeros = new List<int> { 1, 2, 3 };

var query = numeros.Where(n => {
    Console.WriteLine($"Filtrando {n}");
    return n > 1;
});

Console.WriteLine("Query criada. Nada foi filtrado ainda.");

foreach (var n in query)
    Console.WriteLine($"Resultado: {n}");

// Saída:
// Query criada. Nada foi filtrado ainda.
// Filtrando 1
// Filtrando 2
// Resultado: 2
// Filtrando 3
// Resultado: 3`})}),e.jsxs("p",{children:['Note dois fatos surpreendentes: (1) "Filtrando" só apareceu ',e.jsx("em",{children:"depois"}),' de "Query criada" — porque o ',e.jsx("code",{children:"Where"})," não rodou na hora; e (2) o filtro é executado ",e.jsx("em",{children:"item a item"}),", intercalado com os ",e.jsx("code",{children:"foreach"}),", não tudo de uma vez."]}),e.jsx("h2",{children:"Repetir o foreach reexecuta a query"}),e.jsxs("p",{children:['Como a query é uma "receita", iterar duas vezes ',e.jsx("strong",{children:"reexecuta tudo"}),". Isso é especialmente perigoso quando há custo (chamada de banco, leitura de arquivo, geração aleatória)."]}),e.jsx("pre",{children:e.jsx("code",{children:`var random = new Random();
var query = Enumerable.Range(1, 3).Select(_ => random.Next(100));

foreach (var n in query) Console.Write($"{n} ");
Console.WriteLine();
foreach (var n in query) Console.Write($"{n} ");

// Saída (exemplo):
// 42 17 88
// 5 91 23      ← valores DIFERENTES!`})}),e.jsxs(r,{type:"warning",title:"Bug clássico",children:['Se você pega resultados diferentes a cada iteração de uma "mesma" query, é quase certeza que você está reexecutando uma query adiada. A solução é ',e.jsx("strong",{children:"materializar"})," com ",e.jsx("code",{children:"ToList()"}),"."]}),e.jsx("h2",{children:"Materializando: ToList, ToArray, ToDictionary, ToHashSet"}),e.jsxs("p",{children:["Os métodos ",e.jsx("code",{children:"To..."})," forçam a execução ",e.jsx("em",{children:"imediata"}),": eles percorrem a receita uma vez e guardam o resultado em uma coleção concreta na memória. A partir daí, iterar é só ler a coleção (sem custo extra)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Adiada — não roda nada:
IEnumerable<int> queryAdiada = numeros.Where(n => n > 10);

// Materializada — roda agora e guarda na memória:
List<int>             lista = queryAdiada.ToList();
int[]                 array = queryAdiada.ToArray();
Dictionary<int, bool> dic   = queryAdiada.ToDictionary(n => n, n => true);
HashSet<int>          conj  = queryAdiada.ToHashSet();`})}),e.jsxs("p",{children:["Outros métodos que ",e.jsx("strong",{children:"também"})," forçam execução: ",e.jsx("code",{children:"Count"}),", ",e.jsx("code",{children:"Sum"}),", ",e.jsx("code",{children:"First"}),", ",e.jsx("code",{children:"Single"}),", ",e.jsx("code",{children:"Any"}),", ",e.jsx("code",{children:"All"}),", ",e.jsx("code",{children:"Aggregate"}),", e o próprio ",e.jsx("code",{children:"foreach"}),". Em geral, qualquer método que ",e.jsx("em",{children:"não"})," devolva outra ",e.jsx("code",{children:"IEnumerable"})," executa imediatamente."]}),e.jsx("h2",{children:"Erros que só aparecem quando você itera"}),e.jsx("p",{children:"Como a query só roda na hora de iterar, exceções (como divisão por zero ou referência nula) só estouram lá — bem longe da linha onde você escreveu a query. Isso confunde muito iniciantes que esperam o erro acontecer onde a query foi declarada."}),e.jsx("pre",{children:e.jsx("code",{children:`int[] dados = { 10, 5, 0, 2 };

// Esta linha NÃO lança nada. Cria só a "receita".
var query = dados.Select(d => 100 / d);

try {
    foreach (var x in query) Console.WriteLine(x);
} catch (DivideByZeroException) {
    Console.WriteLine("Boom — só agora!");
}`})}),e.jsx("h2",{children:"IQueryable: a árvore de expressões"}),e.jsxs("p",{children:["Em coleções na memória (",e.jsx("code",{children:"List"}),", ",e.jsx("code",{children:"Array"}),"), LINQ usa ",e.jsx("code",{children:"IEnumerable"})," e simplesmente armazena os ",e.jsx("em",{children:"delegates"})," (funções) para chamar depois. Mas em ",e.jsx("strong",{children:"EF Core"})," (Entity Framework, o ORM padrão da Microsoft que conversa com banco de dados), o tipo é ",e.jsx("code",{children:"IQueryable<T>"}),", e algo mais sofisticado acontece: cada operação (",e.jsx("code",{children:"Where"}),", ",e.jsx("code",{children:"Select"}),"...) ",e.jsx("em",{children:"constrói uma árvore de expressões"}),' — uma estrutura que descreve "filtrar X tal que Y, projetar para Z".']}),e.jsx("pre",{children:e.jsx("code",{children:`// EF Core — query NÃO executa, só constrói árvore:
IQueryable<Cliente> q = db.Clientes
    .Where(c => c.Cidade == "SP")
    .OrderBy(c => c.Nome);

// Quando você itera, EF traduz a árvore para SQL:
//   SELECT * FROM Clientes WHERE Cidade='SP' ORDER BY Nome
// e só aí dispara a chamada ao banco.
var lista = q.ToList(); // dispara o SELECT`})}),e.jsxs("p",{children:["É por isso que adicionar ",e.jsx("code",{children:".Where()"})," em uma query do EF não puxa nada — só refina a árvore. Quando você finalmente chama ",e.jsx("code",{children:"ToList()"}),", ",e.jsx("code",{children:"First()"}),", ou faz ",e.jsx("code",{children:"foreach"}),", o EF traduz tudo num SQL único, otimizado, e executa."]}),e.jsxs(r,{type:"info",title:"Quando materializar?",children:["Se você vai iterar a coleção ",e.jsx("strong",{children:"uma única vez"}),", deixe adiada. Se vai iterar várias vezes, ou usar em vários lugares, ",e.jsx("code",{children:"ToList()"})," uma vez e reutilize. A regra de ouro: nunca iterar duas vezes uma ",e.jsx("code",{children:"IEnumerable"})," que custa caro."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Iterar a mesma query múltiplas vezes"})," — reexecuta tudo. Use ",e.jsx("code",{children:"ToList()"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Achar que um ",e.jsx("code",{children:"Where"}),' "filtrou" a coleção']})," — não filtrou nada; só descreveu o filtro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Capturar variável em closure"})," dentro do ",e.jsx("code",{children:"Select"})," e mudá-la depois — quando a query rodar, vai usar o valor atualizado, não o antigo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:['Aplicar regras "in-memory" em ',e.jsx("code",{children:"IQueryable"})]})," que o EF não consegue traduzir — vira exceção em runtime."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["LINQ adia execução: ",e.jsx("code",{children:"Where"}),"/",e.jsx("code",{children:"Select"})," só descrevem a operação."]}),e.jsxs("li",{children:["Iterar (",e.jsx("code",{children:"foreach"}),", ",e.jsx("code",{children:"ToList"}),", ",e.jsx("code",{children:"Count"}),"...) ",e.jsx("em",{children:"dispara"})," a execução."]}),e.jsxs("li",{children:["Iterar várias vezes ",e.jsx("strong",{children:"reexecuta"})," a query inteira."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ToList()"}),", ",e.jsx("code",{children:"ToArray()"})," materializam o resultado em memória."]}),e.jsxs("li",{children:["Em ",e.jsx("code",{children:"IQueryable"})," (EF Core), uma ",e.jsx("em",{children:"árvore de expressões"})," é construída e traduzida para SQL na execução."]}),e.jsx("li",{children:"Exceções dentro da query estouram só ao iterar — não ao declarar."})]})]})}export{s as default};
