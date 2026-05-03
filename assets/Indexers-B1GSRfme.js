import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(s,{title:"Indexers: acessando objetos como arrays",subtitle:"Aprenda a permitir que seus objetos sejam acessados com colchetes — útil em coleções customizadas, matrizes, dicionários e muito mais.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Em C#, você está acostumado a escrever ",e.jsx("code",{children:"nomes[3]"})," ou ",e.jsx("code",{children:'dicionario["chave"]'}),". Esses colchetes não são privilégio de array nem de ",e.jsx("code",{children:"Dictionary"}),": qualquer classe sua pode oferecer essa sintaxe definindo um ",e.jsx("strong",{children:"indexer"}),' (em português, "indexador"). É como instalar uma maçaneta lateral no seu objeto: a porta da frente continua sendo o construtor, mas agora há um atalho para entrar e pegar coisas direto. Indexers existem para deixar APIs naturais — você lê ',e.jsx("code",{children:"tabuleiro[2,3]"})," em vez de ",e.jsx("code",{children:"tabuleiro.ObterCelula(2,3)"}),"."]}),e.jsxs("h2",{children:["O básico: ",e.jsx("code",{children:"this[int i]"})]}),e.jsxs("p",{children:["Um indexer é declarado quase como uma propriedade, mas usando a palavra-chave ",e.jsx("code",{children:"this"})," seguida de colchetes com os parâmetros. Pode ter ",e.jsx("code",{children:"get"}),", ",e.jsx("code",{children:"set"})," ou ambos."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class ListaSegura {
    private readonly string[] _itens;

    public ListaSegura(int tamanho) => _itens = new string[tamanho];

    public string this[int i] {
        get {
            if (i < 0 || i >= _itens.Length) return "(vazio)";
            return _itens[i] ?? "(vazio)";
        }
        set {
            if (i < 0 || i >= _itens.Length) return;   // ignora silenciosamente
            _itens[i] = value;
        }
    }
}

var l = new ListaSegura(3);
l[0] = "Ana";
l[1] = "Bia";
Console.WriteLine(l[0]);    // Ana
Console.WriteLine(l[99]);   // (vazio) — sem exceção`})}),e.jsxs("p",{children:["Repare em ",e.jsx("code",{children:"value"}),": dentro do ",e.jsx("code",{children:"set"}),", ele representa o valor que está sendo atribuído (mesma palavra-chave de propriedades). E note como o indexer adiciona ",e.jsx("em",{children:"comportamento"})," — não é apenas um array exposto, é um array ",e.jsx("em",{children:"com regras"}),"."]}),e.jsx("h2",{children:"Indexers com mais de um parâmetro"}),e.jsx("p",{children:"Você pode declarar quantos parâmetros quiser, de tipos diferentes. É exatamente assim que matrizes de duas dimensões funcionam, e como você implementa estruturas como tabuleiros de jogo, planilhas ou tabelas."}),e.jsx("pre",{children:e.jsx("code",{children:`public class Matriz {
    private readonly double[,] _data;
    public int Linhas  { get; }
    public int Colunas { get; }

    public Matriz(int linhas, int cols) {
        Linhas = linhas; Colunas = cols;
        _data = new double[linhas, cols];
    }

    // Indexer com DOIS argumentos
    public double this[int linha, int coluna] {
        get => _data[linha, coluna];
        set => _data[linha, coluna] = value;
    }
}

var m = new Matriz(3, 3);
m[0, 0] = 1; m[1, 1] = 1; m[2, 2] = 1;
Console.WriteLine(m[1, 1]);   // 1`})}),e.jsxs(o,{type:"info",title:"Indexers podem ser sobrecarregados",children:["Igual a métodos, você pode declarar várias versões de ",e.jsx("code",{children:"this[...]"})," com tipos ou quantidades diferentes. Por exemplo, ",e.jsx("code",{children:"this[int]"})," e ",e.jsx("code",{children:"this[string]"})," coexistem na mesma classe."]}),e.jsxs("h2",{children:["Chaves não-inteiras: o caso ",e.jsx("code",{children:"IDictionary"})]}),e.jsxs("p",{children:["Dicionários são o exemplo clássico de indexer com chave de qualquer tipo. Quando você escreve ",e.jsx("code",{children:'dict["nome"]'}),", está chamando ",e.jsx("code",{children:"this[string]"})," da implementação. Você pode fazer o mesmo na sua classe:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Configuracao {
    private readonly Dictionary<string, string> _valores = new();

    public string this[string chave] {
        get => _valores.TryGetValue(chave, out var v) ? v : "";
        set => _valores[chave] = value;
    }
}

var cfg = new Configuracao();
cfg["host"] = "localhost";
cfg["porta"] = "5432";
Console.WriteLine(cfg["host"]);     // localhost
Console.WriteLine(cfg["nada"]);     // ""  (em vez de exceção)`})}),e.jsx("p",{children:'Esse padrão "chave string -> valor com fallback amigável" aparece em ConfigurationManager, IConfiguration, Cache e centenas de APIs do .NET. Ao implementar o seu próprio, você ganha encaixe perfeito com código já existente.'}),e.jsxs("h2",{children:["Indexers com ",e.jsx("code",{children:"Range"})," e ",e.jsx("code",{children:"Index"})]}),e.jsxs("p",{children:["Desde o C# 8, há tipos especiais ",e.jsx("code",{children:"Index"})," (uma posição que pode ser contada do fim com ",e.jsx("code",{children:"^1"}),") e ",e.jsx("code",{children:"Range"})," (uma fatia ",e.jsx("code",{children:"1..3"}),"). Coleções podem implementar indexers que aceitam esses tipos para suportar a sintaxe moderna de slicing."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Lista<T> {
    private readonly List<T> _itens = new();
    public int Count => _itens.Count;
    public void Add(T x) => _itens.Add(x);

    public T this[Index i] => _itens[i.GetOffset(_itens.Count)];

    public IList<T> this[Range r] {
        get {
            var (offset, length) = r.GetOffsetAndLength(_itens.Count);
            return _itens.GetRange(offset, length);
        }
    }
}

var l = new Lista<string>();
l.Add("a"); l.Add("b"); l.Add("c"); l.Add("d");

Console.WriteLine(l[^1]);             // d  (último)
foreach (var x in l[1..3]) Console.Write(x + " "); // b c`})}),e.jsxs("p",{children:[e.jsx("code",{children:"^1"}),' significa "primeiro do fim", ',e.jsx("code",{children:"^2"}),' "segundo do fim". ',e.jsx("code",{children:"1..3"}),' significa "do índice 1 inclusive até 3 exclusive". Esses operadores se traduzem em chamadas ao indexer apropriado.']}),e.jsxs(o,{type:"warning",title:"Indexer não é método",children:["Indexers não podem ser ",e.jsx("code",{children:"static"}),", não podem ser referenciados como ",e.jsx("em",{children:"delegate"}),', e não podem ter o mesmo nome — porque o "nome" deles é o conjunto ',e.jsx("code",{children:"this"})," + parâmetros. Se você precisa de algo nomeado, prefira um método."]}),e.jsx("h2",{children:"Indexers em interfaces"}),e.jsx("p",{children:"Você pode declarar indexers em interfaces como contrato. Quem implementa precisa fornecer o indexer — exatamente como faria com uma propriedade."}),e.jsx("pre",{children:e.jsx("code",{children:`public interface ITradutor {
    string this[string termo] { get; }
}

public class TradutorIngles : ITradutor {
    private readonly Dictionary<string, string> _dic = new() {
        ["hello"] = "olá",
        ["world"] = "mundo"
    };
    public string this[string termo] =>
        _dic.TryGetValue(termo.ToLowerInvariant(), out var v) ? v : termo;
}

ITradutor t = new TradutorIngles();
Console.WriteLine(t["hello"]);   // olá`})}),e.jsx("h2",{children:"Boas práticas e regras de bom gosto"}),e.jsx("p",{children:"Indexers tornam APIs concisas, mas usados sem critério deixam o código misterioso. Algumas heurísticas práticas:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:['Use indexer quando o conceito do tipo for "uma coleção de algo" ou "um mapeamento de chave para valor". Para qualquer outra coisa, prefira método nomeado (',e.jsx("code",{children:"cliente.Pedido(2)"})," é mais claro que ",e.jsx("code",{children:"cliente[2]"}),")."]}),e.jsx("li",{children:"Mantenha o custo previsível: idealmente O(1) ou O(log n). Indexer caro engana quem usa."}),e.jsxs("li",{children:['Nunca lance exceção em indexer só de leitura por um valor "não encontrado" se houver fallback razoável — a sintaxe ',e.jsx("code",{children:"x[k]"})," é tão simples que parece infalível."]}),e.jsxs("li",{children:["Documente as exceções que pode lançar (",e.jsx("code",{children:"IndexOutOfRangeException"}),", ",e.jsx("code",{children:"KeyNotFoundException"}),")."]}),e.jsxs("li",{children:["Se o indexer é só leitura, declare apenas ",e.jsx("code",{children:"get"})," — assim a coleção fica visivelmente imutável de fora."]})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir indexer com método chamado ",e.jsx("code",{children:"Item"}),":"]})," sob o capô o compilador gera um ",e.jsx("code",{children:"get_Item"}),"/",e.jsx("code",{children:"set_Item"}),"; em reflexão, é por aí que você acessa."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de validar limites:"})," sem ",e.jsx("code",{children:"if (i >= _itens.Length)"}),", sua aplicação ganha ",e.jsx("code",{children:"IndexOutOfRangeException"})," em produção."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Indexer com side-effect:"})," ler um valor não deveria modificar nada. Quem lê ",e.jsx("code",{children:"x[k]"})," não espera estado mudando."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"this[int]"})," quando o tipo não é coleção:"]})," torna o código confuso. Prefira método nomeado."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não suportar ",e.jsx("code",{children:"Index"}),"/",e.jsx("code",{children:"Range"})," em coleção própria:"]})," usuários da .NET 8 esperam essa sintaxe."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Indexer permite usar colchetes em objetos: ",e.jsx("code",{children:"obj[i]"}),"."]}),e.jsxs("li",{children:["Sintaxe: ",e.jsxs("code",{children:["public T this[Tipo arg] ","{ get; set; }"]}),"."]}),e.jsxs("li",{children:["Pode ter múltiplos parâmetros (",e.jsx("code",{children:"this[int x, int y]"}),") e ser sobrecarregado."]}),e.jsxs("li",{children:["Aceita ",e.jsx("code",{children:"Index"})," (",e.jsx("code",{children:"^1"}),") e ",e.jsx("code",{children:"Range"})," (",e.jsx("code",{children:"1..3"}),") para slicing moderno."]}),e.jsx("li",{children:"Pode ser declarado em interfaces como contrato."}),e.jsx("li",{children:"Use só quando o tipo é semanticamente uma coleção/mapeamento."})]})]})}export{a as default};
