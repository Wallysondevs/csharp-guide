import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(i,{title:"Generics: tipos parametrizados sem boxing",subtitle:"A ideia mais poderosa do C# moderno: criar coleções e algoritmos que funcionam para qualquer tipo, mantendo segurança e performance.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:['Imagine que você quer escrever uma função "primeiro elemento de uma lista". Você precisa escrever uma versão para listas de inteiros, outra para listas de strings, outra para listas de clientes? Não. Os ',e.jsx("strong",{children:"generics"}),' (em português, "tipos genéricos") permitem escrever a função ',e.jsx("em",{children:"uma única vez"}),' e usá-la com qualquer tipo, sem perder a verificação de tipos. Pense numa fôrma de bolo: a fôrma é genérica, e o "tipo" do bolo (chocolate, baunilha, cenoura) é o parâmetro que você escolhe na hora de assar.']}),e.jsxs("h2",{children:["O problema antes dos generics: ",e.jsx("code",{children:"ArrayList"})]}),e.jsxs("p",{children:['No C# 1.0 (2002), não existiam generics. Para uma coleção que aceitasse "qualquer coisa", usava-se ',e.jsx("code",{children:"ArrayList"}),", que guardava tudo como ",e.jsx("code",{children:"object"})," — o tipo-pai de todos os tipos no .NET. Isso causava dois problemas graves:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections;

ArrayList lista = new ArrayList();
lista.Add(10);          // int -> object (boxing)
lista.Add("texto");     // string -> object (sem erro!)
lista.Add(3.14);        // double -> object

foreach (object item in lista) {
    int n = (int)item;  // Cast obrigatório, e CRASHA no "texto"!
    Console.WriteLine(n * 2);
}`})}),e.jsxs("p",{children:["Os dois problemas são: ",e.jsx("strong",{children:"(1) sem segurança de tipo"})," — a lista aceita qualquer mistura, e o erro só aparece em runtime; ",e.jsx("strong",{children:"(2) boxing"}),", que é o processo de embrulhar um valor primitivo (como ",e.jsx("code",{children:"int"}),") num objeto na memória. Boxing aloca lixo no heap e degrada performance."]}),e.jsxs(o,{type:"info",title:"O que é boxing?",children:["Tipos como ",e.jsx("code",{children:"int"})," e ",e.jsx("code",{children:"double"})," são ",e.jsx("em",{children:"value types"}),": vivem direto na pilha (stack), são pequenos e rápidos. ",e.jsx("code",{children:"object"})," é ",e.jsx("em",{children:"reference type"}),": vive no heap. Quando você atribui um ",e.jsx("code",{children:"int"})," a uma variável ",e.jsx("code",{children:"object"}),', o runtime cria um "embrulho" no heap. Isso é boxing — o oposto, desembrulhar, é unboxing. Tudo isso custa CPU e gera trabalho para o garbage collector.']}),e.jsxs("h2",{children:["A solução: ",e.jsx("code",{children:"List<T>"})]}),e.jsxs("p",{children:["O C# 2.0 introduziu generics. A coleção genérica ",e.jsx("code",{children:"List<T>"})," recebe um ",e.jsx("strong",{children:"parâmetro de tipo"})," chamado ",e.jsx("code",{children:"T"}),' (de "Type"). Você escolhe qual tipo concreto quando cria a instância:']}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;

// Lista que SÓ aceita int — verificado pelo compilador
List<int> numeros = new List<int>();
numeros.Add(10);
numeros.Add(20);
// numeros.Add("texto");  // ERRO de COMPILAÇÃO: cannot convert string to int

foreach (int n in numeros) {  // Sem cast, sem boxing
    Console.WriteLine(n * 2);
}

// Lista de strings, mesma classe genérica
List<string> nomes = new List<string> { "Ana", "Bruno" };`})}),e.jsxs("p",{children:["Resultados: o compilador ",e.jsx("em",{children:"recusa"})," qualquer coisa que não seja ",e.jsx("code",{children:"int"}),"; não há boxing porque a lista internamente armazena um ",e.jsx("code",{children:"int[]"}),"; não precisa de cast. É como se o compilador ",e.jsx("strong",{children:"especializasse"})," a classe para o tipo escolhido."]}),e.jsx("h2",{children:"Definindo seu próprio tipo genérico"}),e.jsxs("p",{children:["Você pode declarar suas próprias classes e structs genéricos. A sintaxe coloca o parâmetro de tipo entre ",e.jsx("code",{children:"<"})," e ",e.jsx("code",{children:">"})," logo após o nome:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Caixa que guarda um item de qualquer tipo
public class Caixa<T> {
    public T Conteudo { get; set; } = default!;

    public void Mostrar() {
        Console.WriteLine($"A caixa contém: {Conteudo}");
    }
}

// Uso
Caixa<int> caixaDeNumero = new Caixa<int> { Conteudo = 42 };
Caixa<string> caixaDeTexto = new Caixa<string> { Conteudo = "olá" };
caixaDeNumero.Mostrar();   // A caixa contém: 42
caixaDeTexto.Mostrar();    // A caixa contém: olá`})}),e.jsxs("p",{children:["Note: ",e.jsx("code",{children:"T"})," não é uma palavra mágica, é só convenção. Poderia ser ",e.jsx("code",{children:"TItem"}),", ",e.jsx("code",{children:"TValue"}),", ou qualquer nome (a tradição é começar com ",e.jsx("code",{children:"T"})," maiúsculo). Para tipos genéricos com mais de um parâmetro, use nomes descritivos: ",e.jsx("code",{children:"Dictionary<TKey, TValue>"}),"."]}),e.jsx("h2",{children:"Métodos genéricos"}),e.jsx("p",{children:"Não precisa que a classe inteira seja genérica — um único método pode ter seus próprios parâmetros de tipo:"}),e.jsx("pre",{children:e.jsx("code",{children:`public static class Util {
    // Método genérico em classe não-genérica
    public static T PrimeiroOuPadrao<T>(IEnumerable<T> origem) {
        foreach (var item in origem) return item;
        return default!;
    }
}

int n = Util.PrimeiroOuPadrao(new[] { 1, 2, 3 });   // T inferido como int
string s = Util.PrimeiroOuPadrao(new[] { "a", "b" }); // T inferido como string`})}),e.jsxs("p",{children:["Repare que você ",e.jsx("strong",{children:"não precisou escrever"})," ",e.jsx("code",{children:"Util.PrimeiroOuPadrao<int>(...)"}),". O compilador olha para o argumento e ",e.jsx("em",{children:"infere"})," o tipo — isso é a ",e.jsx("strong",{children:"type inference"}),". Você ainda pode ser explícito quando a inferência falha ou para legibilidade."]}),e.jsx("h2",{children:"O tipo só é conhecido em compile-time"}),e.jsxs("p",{children:['Generics não são "verificados em runtime" — todo o trabalho é feito pelo compilador. Quando você escreve ',e.jsx("code",{children:"List<int>"}),", o JIT (compilador just-in-time do runtime) gera código nativo otimizado especificamente para ",e.jsx("code",{children:"int"}),". Para ",e.jsx("em",{children:"reference types"})," (classes), o runtime compartilha uma única implementação. Esse design é o segredo de por que generics em C# são ",e.jsx("strong",{children:"tão rápidos quanto código manual"}),", ao contrário de outras linguagens onde generics têm overhead."]}),e.jsx("pre",{children:e.jsx("code",{children:`// O compilador trata cada combinação como tipo distinto
List<int> a = new();
List<string> b = new();
Console.WriteLine(a.GetType());   // System.Collections.Generic.List\`1[System.Int32]
Console.WriteLine(b.GetType());   // System.Collections.Generic.List\`1[System.String]
// 'List\`1' significa List com 1 parâmetro genérico`})}),e.jsx("h2",{children:"Exemplo prático: par chave-valor"}),e.jsx("pre",{children:e.jsx("code",{children:`public class Par<TChave, TValor> {
    public TChave Chave { get; }
    public TValor Valor { get; }

    public Par(TChave chave, TValor valor) {
        Chave = chave;
        Valor = valor;
    }

    public override string ToString() => $"({Chave}, {Valor})";
}

var p1 = new Par<string, int>("idade", 30);
var p2 = new Par<int, List<string>>(1, new() { "a", "b" });
Console.WriteLine(p1);  // (idade, 30)`})}),e.jsxs(o,{type:"warning",title:"Diamond operator implícito",children:["No C# moderno, ",e.jsx("code",{children:'new Par<string, int>("idade", 30)'})," pode virar ",e.jsx("code",{children:'new("idade", 30)'})," se o tipo da variável for declarado (chamado ",e.jsx("em",{children:"target-typed new"}),"). Use com moderação — explícito ainda é mais legível em código compartilhado."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Achar que ",e.jsx("code",{children:"List<object>"})," resolve tudo:"]})," isso volta ao problema de boxing/cast. Sempre prefira o tipo concreto."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer o parâmetro de tipo:"})," ",e.jsx("code",{children:"List lista = new();"})," dá erro — o C# moderno exige ",e.jsx("code",{children:"List<T>"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir parâmetro de tipo com argumento:"})," em ",e.jsx("code",{children:"List<T>"}),", ",e.jsx("code",{children:"T"})," é parâmetro (na declaração); em ",e.jsx("code",{children:"List<int>"}),", ",e.jsx("code",{children:"int"})," é argumento (no uso)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Forçar inferência onde não dá:"})," se o compilador não consegue inferir, especifique: ",e.jsx("code",{children:"Util.Cria<int>()"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Generics permitem escrever código uma vez para qualquer tipo, com segurança e performance."}),e.jsxs("li",{children:[e.jsx("code",{children:"List<T>"})," substituiu ",e.jsx("code",{children:"ArrayList"})," eliminando boxing e casts."]}),e.jsxs("li",{children:["Parâmetros de tipo (",e.jsx("code",{children:"T"}),") são resolvidos em ",e.jsx("strong",{children:"compile-time"}),"."]}),e.jsx("li",{children:"Você pode criar suas próprias classes genéricas, métodos genéricos, structs genéricos."}),e.jsx("li",{children:"Type inference deixa o compilador deduzir os tipos a partir dos argumentos."})]})]})}export{a as default};
