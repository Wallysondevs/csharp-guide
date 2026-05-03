import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Pattern matching: switch poderoso e is melhorado",subtitle:"Aprenda a usar os padrões modernos do C# para escrever menos if/else e expressar intenção com clareza.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Pattern matching"}),' ("casamento de padrões") é o nome bonito para uma ideia simples: em vez de perguntar "qual o tipo desse objeto? agora extrai esse campo, agora compara com aquele valor" em três linhas, você descreve o ',e.jsx("em",{children:"formato"}),' do que está procurando em uma única expressão e o compilador faz o resto. É como passar do "vou olhar a placa, depois a cor, depois o modelo" para "me dá o carro vermelho com placa começando em ABC". Esse capítulo cobre os principais padrões disponíveis no C# moderno.']}),e.jsxs("h2",{children:["Type pattern: ",e.jsx("code",{children:"is"})," com declaração"]}),e.jsxs("p",{children:["O operador ",e.jsx("code",{children:"is"}),' antigamente só respondia "sim" ou "não" sobre um tipo. Hoje ele também ',e.jsx("strong",{children:"declara uma variável"})," tipada se a verificação passa — eliminando o cast manual."]}),e.jsx("pre",{children:e.jsx("code",{children:`object x = "Alô";

// Forma antiga, verbosa
if (x is string)
{
    string s = (string)x;          // cast manual, redundante
    Console.WriteLine(s.Length);
}

// Forma moderna: declara 's' já tipada como string
if (x is string s)
{
    Console.WriteLine(s.Length);   // s só existe se a checagem passou
}`})}),e.jsxs("p",{children:["A variável ",e.jsx("code",{children:"s"})," só fica disponível dentro do escopo onde o teste é verdadeiro. O compilador é esperto: se você inverter com ",e.jsx("code",{children:"!"})," ou ",e.jsx("code",{children:"else"}),", ela aparece no ramo correto."]}),e.jsx("h2",{children:"Property pattern: testar campos do objeto"}),e.jsxs("p",{children:["Para verificar tipo ",e.jsx("em",{children:"e"})," propriedades em uma única expressão, use ",e.jsx("code",{children:"{ Prop: valor }"}),". Isso evita aquela pirâmide de ",e.jsx("code",{children:"if"}),"s aninhados."]}),e.jsx("pre",{children:e.jsx("code",{children:`record Pedido(string Cliente, decimal Total, string Status);

Pedido p = new("Ana", 250m, "pago");

// Casa se p NÃO é null E Status == "pago" E Total > 100
if (p is { Status: "pago", Total: > 100 })
{
    Console.WriteLine("Liberar envio");
}

// Property pattern aninhado: o Cliente também é um objeto
record Endereco(string Cidade, string Uf);
record Compra(string Cliente, Endereco Entrega);

Compra c = new("Bia", new Endereco("Rio", "RJ"));
if (c is { Entrega.Uf: "RJ" })   // C# 10+: acesso encadeado
{
    Console.WriteLine("Entrega no RJ");
}`})}),e.jsxs(o,{type:"info",title:"Por que isso é seguro",children:["O property pattern ",e.jsx("em",{children:"nunca"})," dispara ",e.jsx("code",{children:"NullReferenceException"}),". Se qualquer parte do caminho for ",e.jsx("code",{children:"null"}),", o padrão simplesmente não casa — sem exceção, sem tratamento manual."]}),e.jsx("h2",{children:"Switch expression: o switch que devolve valor"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"switch"})," tradicional é uma ",e.jsx("em",{children:"instrução"})," (faz algo). A ",e.jsx("strong",{children:"switch expression"})," é uma ",e.jsx("em",{children:"expressão"})," (devolve um valor). Sintaxe enxuta com ",e.jsx("code",{children:"=>"})," e vírgulas."]}),e.jsx("pre",{children:e.jsx("code",{children:`string Classificar(int nota) => nota switch
{
    >= 90 => "A",          // relational pattern
    >= 80 => "B",
    >= 70 => "C",
    >= 60 => "D",
    < 0   => throw new ArgumentException("nota negativa"),
    _     => "F"            // _ é o "padrão default"
};

Console.WriteLine(Classificar(85)); // "B"`})}),e.jsxs("p",{children:["Os símbolos ",e.jsx("code",{children:">="}),", ",e.jsx("code",{children:">"}),", ",e.jsx("code",{children:"<"}),", ",e.jsx("code",{children:"<="})," nesse contexto são ",e.jsx("strong",{children:"relational patterns"}),". Eles testam o valor sem precisar repetir a variável."]}),e.jsx("h2",{children:"Tuple pattern: combinando dois ou mais valores"}),e.jsxs("p",{children:["Quando a decisão depende de ",e.jsx("em",{children:"mais de uma"})," variável, agrupe em uma tupla literal e descreva combinações."]}),e.jsx("pre",{children:e.jsx("code",{children:`string Resultado(bool autenticado, bool admin) =>
    (autenticado, admin) switch
    {
        (false, _)    => "Faça login",       // _ = qualquer valor
        (true, false) => "Acesso comum",
        (true, true)  => "Painel admin"
    };

Console.WriteLine(Resultado(true, true));   // "Painel admin"`})}),e.jsxs("h2",{children:["Logical patterns: ",e.jsx("code",{children:"and"}),", ",e.jsx("code",{children:"or"}),", ",e.jsx("code",{children:"not"})]}),e.jsx("p",{children:"Combine padrões com palavras-chave em inglês. São muito mais legíveis do que operadores booleanos misturados com testes."}),e.jsx("pre",{children:e.jsx("code",{children:`bool EhMaiusculaAscii(char c) => c is >= 'A' and <= 'Z';

bool EhVogal(char c) => c is 'a' or 'e' or 'i' or 'o' or 'u';

bool EhBranco(char c) => c is not (>= '!' and <= '~');

string Faixa(int idade) => idade switch
{
    < 0          => throw new ArgumentException(),
    < 13         => "criança",
    >= 13 and < 18 => "adolescente",
    >= 18 and < 60 => "adulto",
    _            => "idoso"
};`})}),e.jsx("h2",{children:"List pattern: examinar elementos de uma coleção"}),e.jsxs("p",{children:["Disponível desde o C# 11. Permite descrever a ",e.jsx("strong",{children:"forma"}),' de um array ou lista: tamanho, primeiro elemento, último, "qualquer coisa no meio".']}),e.jsx("pre",{children:e.jsx("code",{children:`int[] dados = { 1, 2, 3 };

// Casa exatamente com [1, 2, 3]
bool a = dados is [1, 2, 3];                   // true

// _ ignora um elemento; .. ignora vários
bool b = dados is [1, _, 3];                   // true (do meio tanto faz)
bool c = dados is [1, ..];                     // true (começa com 1)
bool d = dados is [.., 3];                     // true (termina em 3)

// Capturando partes:
if (dados is [var primeiro, .., var ultimo])
{
    Console.WriteLine($"De {primeiro} a {ultimo}");
}

// Combinando com property pattern:
string[] nomes = { "Ana" };
bool soUm = nomes is [{ Length: > 0 }];        // único elemento não vazio`})}),e.jsxs(o,{type:"warning",title:"Ordem importa",children:["Em uma ",e.jsx("code",{children:"switch expression"}),", os padrões são avaliados de cima para baixo. Coloque os ",e.jsx("strong",{children:"mais específicos primeiro"}),": se você puser ",e.jsx("code",{children:'_ => "padrão"'})," antes de ",e.jsx("code",{children:'0 => "zero"'}),", o caso zero nunca casa, e o compilador avisa com warning."]}),e.jsx("h2",{children:"Exemplo combinando tudo"}),e.jsx("pre",{children:e.jsx("code",{children:`abstract record Forma;
record Circulo(double Raio) : Forma;
record Retangulo(double Largura, double Altura) : Forma;
record Triangulo(double Base, double Altura) : Forma;

double Area(Forma f) => f switch
{
    Circulo { Raio: > 0 } c              => Math.PI * c.Raio * c.Raio,
    Retangulo { Largura: > 0, Altura: > 0 } r => r.Largura * r.Altura,
    Triangulo (var b, var h) when b > 0 && h > 0 => b * h / 2,
    null                                 => throw new ArgumentNullException(nameof(f)),
    _                                    => throw new ArgumentException("Forma inválida")
};`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Padrão inalcançável"}),": o compilador avisa que um ",e.jsx("code",{children:"case"})," nunca casa — geralmente porque um padrão anterior já capturava tudo. Reordene."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Switch não exaustivo"}),": warning ",e.jsx("em",{children:"CS8509"}),". Adicione um ",e.jsx("code",{children:"_ => ..."})," ou trate todos os tipos possíveis."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"="})," com ",e.jsx("code",{children:"=>"})]})," em switch expression: o resultado de cada arm usa ",e.jsx("code",{children:"=>"})," e os arms são separados por vírgula, não ponto-e-vírgula."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer que ",e.jsx("code",{children:"and"}),"/",e.jsx("code",{children:"or"})," aqui são padrões, não booleanos"]}),": ",e.jsx("code",{children:"x is > 0 and < 10"})," ≠ ",e.jsx("code",{children:"x > 0 && x < 10"})," em escopo (apesar do mesmo efeito)."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"is T nome"})," testa tipo e já declara variável tipada."]}),e.jsxs("li",{children:["Property pattern ",e.jsx("code",{children:"{ Prop: valor }"})," casa por estrutura, ignora ",e.jsx("code",{children:"null"})," com segurança."]}),e.jsxs("li",{children:["Switch expression devolve valor com sintaxe ",e.jsx("code",{children:"x => resultado"}),"."]}),e.jsxs("li",{children:["Tuple pattern combina múltiplas variáveis: ",e.jsx("code",{children:"(a, b) switch"}),"."]}),e.jsxs("li",{children:["Relational (",e.jsx("code",{children:">"}),", ",e.jsx("code",{children:"<="}),") e logical (",e.jsx("code",{children:"and"}),", ",e.jsx("code",{children:"or"}),", ",e.jsx("code",{children:"not"}),") são primeira classe."]}),e.jsxs("li",{children:["List pattern ",e.jsx("code",{children:"[1, .., var ultimo]"})," descreve forma de coleções."]})]})]})}export{i as default};
