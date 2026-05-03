import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(o,{title:"Dictionary<K,V>: lookup O(1) por chave",subtitle:"A coleção de pares chave-valor mais usada em C# — entenda como ela funciona, como usar e quando ela é mágica.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine uma agenda telefônica: você procura pelo nome (a ",e.jsx("strong",{children:"chave"}),") e obtém o número (o ",e.jsx("strong",{children:"valor"}),") instantaneamente, sem ler a lista inteira. É exatamente isso que um ",e.jsx("strong",{children:"Dictionary<TKey, TValue>"})," faz em C#: guarda pares chave→valor e te devolve o valor em ",e.jsx("em",{children:"tempo constante"}),' (O(1)), mesmo com milhões de itens. Esse "milagre" se baseia em uma técnica chamada ',e.jsx("em",{children:"hashing"}),", e neste capítulo você vai entender como usar e por que funciona."]}),e.jsx("h2",{children:"Criando e adicionando"}),e.jsxs("p",{children:["O Dictionary é um ",e.jsx("em",{children:"tipo genérico"})," — você escolhe o tipo da chave e do valor. Chaves não podem repetir; valores podem."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;

// Dicionário com chave string e valor int (idades)
var idades = new Dictionary<string, int>();
idades.Add("Ana", 28);
idades.Add("Bruno", 35);

// Forma curta, com inicializador
var capitais = new Dictionary<string, string>
{
    ["Brasil"] = "Brasília",
    ["França"] = "Paris",
    ["Japão"] = "Tóquio"
};

Console.WriteLine(capitais["Japão"]); // Tóquio`})}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"indexer"})," ",e.jsx("code",{children:"[]"})," é a forma mais comum de ler e escrever. Atribuir cria ou sobrescreve. ",e.jsx("code",{children:"Add"}),", em contraste, lança exceção se a chave já existe — útil quando você quer garantir unicidade."]}),e.jsx("h2",{children:"TryGetValue: a forma segura de ler"}),e.jsxs("p",{children:["Acessar uma chave inexistente pelo indexer dispara ",e.jsx("code",{children:"KeyNotFoundException"}),". Para evitar isso, o método idiomático é ",e.jsx("code",{children:"TryGetValue"}),": ele devolve ",e.jsx("code",{children:"true"}),"/",e.jsx("code",{children:"false"})," e entrega o valor por ",e.jsx("code",{children:"out"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`if (capitais.TryGetValue("Brasil", out string? capital))
{
    Console.WriteLine($"Capital: {capital}");
}
else
{
    Console.WriteLine("País não cadastrado.");
}

// Versus o jeito perigoso:
// var x = capitais["Marte"]; // BOOM: KeyNotFoundException`})}),e.jsxs(a,{type:"success",title:"Idiomático: prefira TryGetValue",children:["Em código de produção, ",e.jsx("code",{children:"TryGetValue"})," é quase sempre melhor que ",e.jsx("code",{children:"ContainsKey"})," seguido por indexer — porque o último faz ",e.jsx("em",{children:"duas"})," buscas no hash; ",e.jsx("code",{children:"TryGetValue"})," faz só uma."]}),e.jsx("h2",{children:"ContainsKey, Remove e iteração"}),e.jsxs("p",{children:[e.jsx("code",{children:"ContainsKey"})," verifica existência. ",e.jsx("code",{children:"Remove"})," exclui (devolve bool). Para iterar, use ",e.jsx("code",{children:"foreach"})," sobre ",e.jsx("code",{children:"KeyValuePair<K,V>"})," — ou prefira a sintaxe moderna com ",e.jsx("em",{children:"tuple deconstruction"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var estoque = new Dictionary<string, int>
{
    ["Maçã"] = 100, ["Banana"] = 50, ["Uva"] = 200
};

// Iteração tradicional
foreach (KeyValuePair<string, int> par in estoque)
    Console.WriteLine($"{par.Key}: {par.Value}");

// Iteração moderna (C# 7+) com deconstrução
foreach (var (fruta, qtd) in estoque)
    Console.WriteLine($"{fruta}: {qtd}");

// Apenas chaves ou apenas valores
foreach (var nome in estoque.Keys) { /* ... */ }
foreach (var qtd in estoque.Values) { /* ... */ }`})}),e.jsx("h2",{children:"Por que é O(1)? O papel do GetHashCode"}),e.jsxs("p",{children:["Quando você adiciona uma chave, o Dictionary chama ",e.jsx("code",{children:"chave.GetHashCode()"})," para gerar um número (o ",e.jsx("em",{children:"hash"}),') e usa esse número para escolher um "balde" (bucket) do array interno. Buscar é a mesma coisa: hashea de novo, vai direto ao balde. Como o cálculo do hash não depende do tamanho da coleção, a busca é O(1) ',e.jsx("em",{children:"amortizado"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Para chaves do tipo string, int, etc., o GetHashCode já vem pronto.
// Mas se você usar uma classe sua como chave, precisa sobrescrever:

public class Cpf
{
    public string Numero { get; }
    public Cpf(string n) => Numero = n;

    // OBRIGATÓRIO sobrescrever ambos quando usar como chave
    public override bool Equals(object? obj) =>
        obj is Cpf c && c.Numero == Numero;

    public override int GetHashCode() => Numero.GetHashCode();
}

var ficha = new Dictionary<Cpf, string>();
ficha[new Cpf("123")] = "Ana";
Console.WriteLine(ficha[new Cpf("123")]); // "Ana"`})}),e.jsxs(a,{type:"warning",title:"Sem GetHashCode bem feito, vira O(n)",children:['Se duas chaves "iguais" geram hashes ',e.jsx("em",{children:"diferentes"}),", o Dictionary não as encontra. Pior: se todas as chaves caem no mesmo balde (hash igual), a busca degrada para O(n). Sempre implemente ",e.jsx("code",{children:"Equals"})," e ",e.jsx("code",{children:"GetHashCode"})," juntos — ou prefira ",e.jsx("strong",{children:"records"}),", que fazem isso automaticamente."]}),e.jsx("h2",{children:"Records como chaves: o jeito moderno"}),e.jsxs("p",{children:["Desde C# 9, ",e.jsx("strong",{children:"records"})," implementam ",e.jsx("code",{children:"Equals"})," e ",e.jsx("code",{children:"GetHashCode"})," automaticamente baseados nas propriedades. São perfeitos para chaves compostas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public record Coordenada(int X, int Y);

var mapa = new Dictionary<Coordenada, string>();
mapa[new Coordenada(0, 0)] = "Origem";
mapa[new Coordenada(1, 2)] = "Tesouro";

// Funciona! Records têm igualdade por valor.
Console.WriteLine(mapa[new Coordenada(1, 2)]); // Tesouro`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Acessar chave inexistente com ",e.jsx("code",{children:"[]"})]}),": lança ",e.jsx("code",{children:"KeyNotFoundException"}),". Use ",e.jsx("code",{children:"TryGetValue"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Add em chave duplicada"}),": lança ",e.jsx("code",{children:"ArgumentException"}),". Use indexer (",e.jsx("code",{children:"dict[k] = v"}),") se quiser sobrescrever."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Modificar dicionário durante ",e.jsx("code",{children:"foreach"})]}),": causa ",e.jsx("code",{children:"InvalidOperationException"}),". Itere sobre uma cópia (",e.jsx("code",{children:"dict.Keys.ToList()"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar classe mutável como chave"}),': se você muda a propriedade depois de inserir, o hash muda e o item fica "perdido" no balde antigo.']})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Dictionary<K,V> guarda pares chave→valor com lookup O(1)."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"TryGetValue"})," em vez de ",e.jsx("code",{children:"ContainsKey"})," + indexer."]}),e.jsxs("li",{children:["Indexer ",e.jsx("code",{children:"dict[k] = v"})," cria ou atualiza; ",e.jsx("code",{children:"Add"})," falha em duplicata."]}),e.jsxs("li",{children:["Chaves customizadas exigem ",e.jsx("code",{children:"Equals"})," + ",e.jsx("code",{children:"GetHashCode"})," — ou use records."]}),e.jsx("li",{children:"Não modifique o dicionário durante uma iteração."})]})]})}export{s as default};
