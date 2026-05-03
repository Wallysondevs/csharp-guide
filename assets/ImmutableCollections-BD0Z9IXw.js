import{j as e}from"./index-CzLAthD5.js";import{P as i,A as a}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(i,{title:"Coleções imutáveis: ImmutableList e amigos",subtitle:"Coleções que nunca mudam — toda alteração devolve uma nova versão. Por que isso é incrível para concorrência e previsibilidade.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine uma escultura de mármore: uma vez esculpida, ela não muda. Se você quer uma versão diferente, esculpe outra. As ",e.jsx("strong",{children:"coleções imutáveis"})," de C# funcionam assim: nenhum método modifica a coleção existente; em vez disso, devolvem uma ",e.jsx("em",{children:"nova"})," coleção com a alteração aplicada. Isso parece desperdício, mas traz benefícios enormes: ",e.jsx("strong",{children:"thread-safety automática"}),' (sem locks), código mais previsível e a possibilidade de "voltar no tempo" mantendo versões antigas.']}),e.jsx("h2",{children:"Instalando e importando"}),e.jsxs("p",{children:["As coleções imutáveis vivem no namespace ",e.jsx("code",{children:"System.Collections.Immutable"}),". Em projetos modernos (.NET 6+) elas já vêm no SDK; em projetos antigos, você instala via NuGet o pacote ",e.jsx("code",{children:"System.Collections.Immutable"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Immutable;

// Lista vazia (singleton — sempre a mesma instância)
ImmutableList<int> vazia = ImmutableList<int>.Empty;

// Add devolve uma NOVA lista; a original não muda
ImmutableList<int> a = vazia.Add(1);
ImmutableList<int> b = a.Add(2).Add(3);

Console.WriteLine(vazia.Count); // 0  (continua vazia!)
Console.WriteLine(a.Count);     // 1
Console.WriteLine(b.Count);     // 3`})}),e.jsx("h2",{children:"Métodos retornam nova coleção"}),e.jsxs("p",{children:["Toda operação que normalmente mutaria a coleção (",e.jsx("code",{children:"Add"}),", ",e.jsx("code",{children:"Remove"}),", ",e.jsx("code",{children:"Insert"}),", ",e.jsx("code",{children:"SetItem"}),") devolve uma instância nova. Você precisa atribuir o resultado:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var lista = ImmutableList.Create("ana", "bia", "carla");

lista.Add("diana"); // SEM EFEITO — resultado descartado
Console.WriteLine(lista.Count); // 3

// Forma correta: capture o retorno
var maior = lista.Add("diana");
Console.WriteLine(maior.Count); // 4

// Substituir item no índice 0 (Reset/SetItem)
var alterada = maior.SetItem(0, "ANA");`})}),e.jsxs(a,{type:"info",title:"Persistência estrutural",children:["Quando você adiciona um item a uma ",e.jsx("code",{children:"ImmutableList"}),", o C# ",e.jsx("em",{children:"não copia"}),' os outros itens — internamente as duas versões compartilham a maior parte da estrutura (uma árvore balanceada). Por isso "criar uma nova lista" é mais barato do que parece, especialmente para coleções grandes.']}),e.jsx("h2",{children:"O Builder pattern: muitas alterações de uma vez"}),e.jsxs("p",{children:["Se você precisa fazer 1000 alterações em sequência, cada ",e.jsx("code",{children:"Add"})," criando uma nova versão fica caro. A solução é o ",e.jsx("strong",{children:"Builder"}),": um objeto mutável temporário que, ao final, vira uma imutável de uma vez."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Forma ingênua (lenta para muitas alterações)
var lista = ImmutableList<int>.Empty;
for (int i = 0; i < 10_000; i++)
    lista = lista.Add(i);

// Forma idiomática com Builder
var builder = ImmutableList.CreateBuilder<int>();
for (int i = 0; i < 10_000; i++)
    builder.Add(i); // mutação direta, rápido
ImmutableList<int> resultado = builder.ToImmutable();`})}),e.jsxs("p",{children:["O builder se comporta como uma ",e.jsx("code",{children:"List<T>"})," tradicional. Quando você termina, ",e.jsx("code",{children:"ToImmutable()"})," congela a estrutura."]}),e.jsx("h2",{children:"A família imutável"}),e.jsx("p",{children:"Existem versões imutáveis de quase todas as coleções:"}),e.jsx("pre",{children:e.jsx("code",{children:`// Cada uma tem seu equivalente "mutável" mais conhecido
ImmutableList<int> il = ImmutableList.Create(1, 2, 3);
ImmutableArray<int> ia = ImmutableArray.Create(1, 2, 3);
ImmutableHashSet<int> ihs = ImmutableHashSet.Create(1, 2, 2, 3);
ImmutableDictionary<string, int> id = ImmutableDictionary
    .Create<string, int>()
    .Add("ana", 28)
    .Add("bruno", 30);
ImmutableSortedDictionary<string, int> isd = ImmutableSortedDictionary
    .Create<string, int>();
ImmutableQueue<int> iq = ImmutableQueue.Create(1, 2, 3);
ImmutableStack<int> ist = ImmutableStack.Create(1, 2, 3);`})}),e.jsx("h2",{children:"ImmutableArray: o caso especial"}),e.jsxs("p",{children:[e.jsx("code",{children:"ImmutableArray<T>"})," é uma fina capa sobre um array comum. Acesso por índice é tão rápido quanto array normal (sem indireção), mas ",e.jsx("em",{children:"qualquer"})," alteração copia tudo (O(n)). Use-a quando a coleção é montada uma vez e lida muitas vezes."]}),e.jsx("pre",{children:e.jsx("code",{children:`var dias = ImmutableArray.Create("seg", "ter", "qua", "qui", "sex");

Console.WriteLine(dias[2]); // "qua" — acesso ultra-rápido

// Add aqui é caro: cria array novo
var maisUm = dias.Add("sáb");`})}),e.jsx("h2",{children:"Por que isso ajuda em multi-thread?"}),e.jsxs("p",{children:["Em programação concorrente, o grande vilão são as ",e.jsx("em",{children:"condições de corrida"}),": duas threads modificando a mesma coleção e gerando estado corrompido. Como uma imutável ",e.jsx("strong",{children:"nunca"})," muda depois de criada, você pode passá-la para quantas threads quiser sem nenhum lock — é fisicamente impossível alguém alterá-la."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Configuração compartilhada entre threads
public static class Config
{
    public static ImmutableDictionary<string, string> Settings { get; private set; }
        = ImmutableDictionary<string, string>.Empty;

    public static void Update(string chave, string valor)
    {
        // Reatribui a referência atomicamente; a leitura por outras
        // threads ou pega a versão antiga ou a nova, nunca um meio-termo.
        Settings = Settings.SetItem(chave, valor);
    }
}`})}),e.jsxs(a,{type:"success",title:"Imutáveis são amigas dos records",children:["Imutabilidade casa perfeitamente com ",e.jsx("strong",{children:"records"})," e ",e.jsx("strong",{children:"tipos value-like"}),". Programas funcionais inteiros são construídos com structs imutáveis e coleções imutáveis — um estilo cada vez mais valorizado em C# moderno."]}),e.jsx("h2",{children:"Quando NÃO usar imutáveis"}),e.jsxs("p",{children:["Imutáveis têm custo: cada alteração aloca. Em loops quentes que fazem milhares de mutações, prefira a coleção mutável tradicional. Use imutável para ",e.jsx("em",{children:"estados"})," compartilhados, configurações, snapshots, e em domínios onde rastreabilidade da história importa."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Chamar ",e.jsx("code",{children:"Add"})," e ignorar o retorno"]}),": a coleção original não muda. Sempre faça ",e.jsx("code",{children:"x = x.Add(...)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não usar Builder"})," para muitas alterações em sequência — desperdício de alocações."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Achar que ",e.jsx("code",{children:"ImmutableArray"})," nunca aloca"]}),": ela aloca a cada modificação (cópia integral)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar o namespace"}),": esqueceu o ",e.jsx("code",{children:"using System.Collections.Immutable;"})," e o compilador não acha os tipos."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Coleções imutáveis nunca mudam; cada operação devolve nova versão."}),e.jsxs("li",{children:["Vivem em ",e.jsx("code",{children:"System.Collections.Immutable"}),"."]}),e.jsx("li",{children:"Persistência estrutural compartilha dados entre versões — mais leve do que parece."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"Builder"})," para muitas alterações em lote."]}),e.jsx("li",{children:"Thread-safe sem lock — perfeitas para estado compartilhado."})]})]})}export{o as default};
