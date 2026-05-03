import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(i,{title:"Imutabilidade: por que e como tornar tipos imutáveis",subtitle:"Aprenda a criar objetos que, depois de prontos, jamais mudam — e veja como isso reduz bugs, simplifica testes e libera multithread.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Um objeto ",e.jsx("strong",{children:"imutável"})," é aquele cujo estado interno não pode ser alterado depois que ele é criado. Pense em uma carteira de identidade: você recebe pronta, com todos os dados gravados; se algum dado mudar, gera-se uma nova carteira. É o oposto de um caderno de rascunho, onde você risca, sobrescreve e cola por cima. Em C#, abraçar a imutabilidade tem três consequências profundas: menos bugs (ninguém muda nada por baixo), facilidade em código paralelo (não há corrida por escrita) e raciocínio mais simples (o que entrou em uma variável é o que está lá)."]}),e.jsxs("h2",{children:["Campos ",e.jsx("code",{children:"readonly"}),": o nível mais antigo"]}),e.jsxs("p",{children:["O modificador ",e.jsx("code",{children:"readonly"})," em um campo significa que ele só pode ser atribuído na declaração ou no construtor. Depois disso, qualquer tentativa de atribuição é erro de compilação."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Cep {
    public readonly string Valor;          // só atribuído no construtor
    public readonly DateTime CriadoEm = DateTime.UtcNow;

    public Cep(string valor) {
        Valor = valor;                     // OK
    }

    public void Reset() {
        // Valor = "00000-000";   // ERRO: campo readonly
    }
}`})}),e.jsxs("p",{children:[e.jsx("code",{children:"readonly"})," só protege a ",e.jsx("em",{children:"referência"}),", não o conteúdo apontado. Um ",e.jsx("code",{children:"readonly List<int>"})," ainda pode ter elementos adicionados — você só não pode trocar a lista por outra. Para imutabilidade real de coleções, veja ",e.jsx("code",{children:"ImmutableList<T>"})," mais adiante."]}),e.jsxs("h2",{children:["Propriedades ",e.jsx("code",{children:"init-only"}),": imutabilidade moderna"]}),e.jsxs("p",{children:["Desde o C# 9, propriedades podem usar ",e.jsx("code",{children:"init"})," no lugar de ",e.jsx("code",{children:"set"}),". A semântica: pode ser atribuída em construtor, em ",e.jsx("em",{children:"object initializer"})," e em expressão ",e.jsx("code",{children:"with"}),"; depois, é só leitura. É o melhor de dois mundos — você obtém imutabilidade sem perder a sintaxe declarativa de inicialização."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Pessoa {
    public string Nome { get; init; } = "";
    public int    Idade { get; init; }
}

var p = new Pessoa { Nome = "Ana", Idade = 30 };  // OK
// p.Nome = "Bia";   // ERRO: init-only fora de inicializador`})}),e.jsxs(o,{type:"info",title:"init não é só sintaxe",children:["Sob o capô, o compilador gera um setter especial chamado ",e.jsx("code",{children:"init_set"})," marcado com um modificador (",e.jsx("code",{children:"modreq"}),") que só pode ser invocado em contextos de inicialização. É verificado pelo compilador, mas o membro está lá."]}),e.jsx("h2",{children:"Records: imutabilidade pronta para uso"}),e.jsxs("p",{children:["Um ",e.jsx("code",{children:"record"})," é uma classe especial otimizada para representar dados imutáveis. Por padrão, suas propriedades posicionais já vêm como ",e.jsx("code",{children:"init"}),"; ",e.jsx("code",{children:"Equals"}),", ",e.jsx("code",{children:"GetHashCode"}),", ",e.jsx("code",{children:"ToString"})," e ",e.jsx("code",{children:"Deconstruct"})," são gerados automaticamente; e existe a expressão ",e.jsx("code",{children:"with"}),' para "criar uma cópia mudando alguns campos".']}),e.jsx("pre",{children:e.jsx("code",{children:`public record Endereco(string Rua, string Cidade, string Cep);

var e1 = new Endereco("Rua A", "São Paulo", "01000-000");
var e2 = e1 with { Cidade = "Campinas" };   // CÓPIA com 1 campo trocado

Console.WriteLine(e1);    // Endereco { Rua = Rua A, Cidade = São Paulo, ... }
Console.WriteLine(e2);    // Endereco { Rua = Rua A, Cidade = Campinas, ... }
Console.WriteLine(e1 == e2);  // False — comparado por valor

var e3 = e1 with { };
Console.WriteLine(e1 == e3);  // True — mesmo conteúdo`})}),e.jsxs("p",{children:["A expressão ",e.jsx("code",{children:"with"})," não muda ",e.jsx("code",{children:"e1"}),': ela cria um novo objeto. Esse padrão "copy-and-modify" é o coração da imutabilidade prática. Ele é eficiente porque o compilador faz uma cópia de bits e ajusta só os campos pedidos.']}),e.jsx("h2",{children:"Coleções imutáveis"}),e.jsxs("p",{children:["Sua classe pode ter todos os campos ",e.jsx("code",{children:"readonly"}),", mas se um deles for ",e.jsx("code",{children:"List<T>"}),", você ainda tem mutabilidade interna. A solução é o namespace ",e.jsx("code",{children:"System.Collections.Immutable"}),", que oferece versões verdadeiramente imutáveis: cada operação devolve uma nova coleção, e a antiga continua intacta."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Immutable;

ImmutableList<int> nums = ImmutableList.Create(1, 2, 3);
ImmutableList<int> outros = nums.Add(4);   // NOVA lista; nums fica intacta

Console.WriteLine(string.Join(",", nums));     // 1,2,3
Console.WriteLine(string.Join(",", outros));   // 1,2,3,4

// Para construção em massa, há o builder eficiente:
var b = ImmutableArray.CreateBuilder<int>();
for (int i = 0; i < 1000; i++) b.Add(i);
ImmutableArray<int> finalArr = b.ToImmutable();`})}),e.jsx("p",{children:"Internamente, essas coleções usam estruturas de dados persistentes (árvores balanceadas) que compartilham nodos entre versões — então adicionar um item a uma lista de mil elementos não copia mil elementos, mas sim O(log n) nodos."}),e.jsx("h2",{children:"Vantagens práticas da imutabilidade"}),e.jsx("p",{children:"Por que se preocupar com tudo isso?"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Thread-safety grátis:"})," objetos que não mudam não precisam de ",e.jsx("code",{children:"lock"}),". Várias threads podem ler simultaneamente sem qualquer cuidado."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cache seguro:"})," você pode armazenar a referência sem medo de que alguém modifique o objeto e quebre seu cache."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Igualdade estável:"})," hash code e equalidade dependem só dos valores iniciais — perfeitos como chave em ",e.jsx("code",{children:"Dictionary"}),"/",e.jsx("code",{children:"HashSet"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Auditoria/histórico:"})," com cópias ",e.jsx("code",{children:"with"}),", você guarda versões anteriores facilmente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Menos bugs distantes:"})," o método A passa o objeto a B; quando A vai usá-lo de novo, ele tem certeza que está como antes."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Antes: classe mutável — você nunca sabe quem mexeu
class CarrinhoMut { public List<string> Itens = new(); }
var c = new CarrinhoMut();
c.Itens.Add("Livro");
Processar(c);              // Processar pode adicionar/remover. Surpresa!

// Depois: record imutável — não há como mexer
public record Carrinho(ImmutableList<string> Itens) {
    public Carrinho Adicionar(string item) =>
        this with { Itens = Itens.Add(item) };
}
var c1 = new Carrinho(ImmutableList<string>.Empty);
var c2 = c1.Adicionar("Livro");
// c1 continua vazio, c2 tem "Livro"`})}),e.jsx(o,{type:"success",title:"Imutável por padrão, mutável por exceção",children:"Uma boa heurística moderna: comece todo modelo de domínio como imutável (record com init). Só transforme em mutável quando perfis de performance comprovarem que a alocação extra é problema. Quase nunca é."}),e.jsx("h2",{children:"Imutabilidade não é tudo"}),e.jsxs("p",{children:["Há cenários em que mutabilidade é necessária: builders (",e.jsx("code",{children:"StringBuilder"}),"), buffers de I/O, estados de UI, contadores em loops quentes. Não force imutabilidade onde ela não cabe — use os tipos certos para cada problema. O que importa é tornar a mutabilidade ",e.jsx("em",{children:"local"})," e ",e.jsx("em",{children:"controlada"}),": por exemplo, um builder mutável que ao final produz um objeto imutável."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Achar que ",e.jsx("code",{children:"readonly"})," torna o conteúdo imutável:"]})," não. Só impede trocar a referência. Use coleções imutáveis para o conteúdo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de usar ",e.jsx("code",{children:"with"})," e mutar via reflexão/JSON:"]})," serializadores podem contornar ",e.jsx("code",{children:"init"}),". Não conte com imutabilidade contra atacantes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cópias profundas caras:"})," ",e.jsx("code",{children:"with"})," faz cópia rasa. Se há sub-objetos mutáveis, eles continuam compartilhados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'Records mutáveis "secretos":'})," definir ",e.jsxs("code",{children:["public T Prop ","{ get; set; }"]})," dentro de um record te devolve mutabilidade. Mantenha ",e.jsx("code",{children:"init"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Performance ingênua:"})," em loops gigantes, ImmutableList causa alocações; nessas situações use builder e converta no fim."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Imutabilidade = estado fixo após construção."}),e.jsxs("li",{children:[e.jsx("code",{children:"readonly"})," protege a referência do campo; ",e.jsx("code",{children:"init"})," protege a propriedade."]}),e.jsxs("li",{children:[e.jsx("code",{children:"record"})," oferece imutabilidade + igualdade + ",e.jsx("code",{children:"with"})," + ",e.jsx("code",{children:"Deconstruct"})," embutidos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"System.Collections.Immutable"})," dá coleções verdadeiramente imutáveis e eficientes."]}),e.jsx("li",{children:"Vantagens: thread-safety, cache seguro, igualdade estável, código previsível."}),e.jsx("li",{children:"Use mutabilidade só quando provadamente necessário."})]})]})}export{r as default};
