import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"Tuplas: agrupando valores sem criar uma classe",subtitle:"Aprenda a transportar vários valores juntos de forma leve, com nomes claros e suporte do compilador.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Imagine que sua função precisa devolver duas coisas: o nome do usuário ",e.jsx("em",{children:"e"})," a idade. Antes do C# 7, você teria três opções desconfortáveis: criar uma classe inteirinha só para isso, usar parâmetros ",e.jsx("code",{children:"out"}),", ou retornar um ",e.jsx("code",{children:"object[]"})," e perder qualquer ajuda do compilador. As ",e.jsx("strong",{children:"tuplas"}),' resolveram esse problema de uma vez por todas: você junta vários valores em um pacote leve, com tipos preservados e — opcionalmente — nomes legíveis. Pense nelas como uma "sacola de feira" rápida: você joga os itens dentro e entrega; não vale a pena fabricar uma caixa de presente se a sacola já serve.']}),e.jsx("h2",{children:"A forma mais básica: tupla posicional"}),e.jsxs("p",{children:["A sintaxe ",e.jsx("code",{children:"(int, string)"})," declara um ",e.jsx("strong",{children:"tipo tupla"})," com dois campos. Para criar uma instância, basta colocar valores entre parênteses. Os campos sem nome ficam acessíveis por ",e.jsx("code",{children:"Item1"}),", ",e.jsx("code",{children:"Item2"})," etc."]}),e.jsx("pre",{children:e.jsx("code",{children:`(int, string) pessoa = (30, "Ana");
Console.WriteLine(pessoa.Item1);   // 30
Console.WriteLine(pessoa.Item2);   // Ana

// Inferência também funciona:
var coord = (10.5, 20.0);
Console.WriteLine(coord.Item1 + coord.Item2);`})}),e.jsxs("p",{children:["Funciona, mas ",e.jsx("code",{children:"Item1"})," e ",e.jsx("code",{children:"Item2"}),' são tão genéricos quanto "objeto 1" e "objeto 2". Se a tupla viajar entre arquivos, ninguém vai lembrar o que cada item significa.']}),e.jsx("h2",{children:"Tuplas nomeadas: clareza no contrato"}),e.jsxs("p",{children:["Adicionando nomes, você cria uma ",e.jsx("strong",{children:"named tuple"}),". Os nomes existem para o compilador e para quem lê o código — em tempo de execução, internamente, ainda são ",e.jsx("code",{children:"Item1"}),", ",e.jsx("code",{children:"Item2"}),", mas você praticamente nunca precisa usar isso."]}),e.jsx("pre",{children:e.jsx("code",{children:`(int Idade, string Nome) p = (30, "Ana");
Console.WriteLine(p.Nome);     // Ana
Console.WriteLine(p.Idade);    // 30

// Os nomes podem vir do lado direito também
var p2 = (Idade: 25, Nome: "Bruno");
Console.WriteLine(p2.Nome);    // Bruno`})}),e.jsxs("p",{children:["Sempre que possível, prefira tuplas ",e.jsx("em",{children:"nomeadas"}),". A diferença em legibilidade é gigante e não custa nada em performance."]}),e.jsxs(o,{type:"info",title:"Tupla x ValueTuple",children:["Por trás dos panos, toda tupla do C# moderno é um ",e.jsx("code",{children:"System.ValueTuple<…>"})," (uma struct, ou seja, tipo por valor). A ",e.jsx("code",{children:"System.Tuple<…>"})," antiga (introduzida no .NET Framework 4.0) era uma class — mais lenta e imutável de outra forma. ",e.jsx("strong",{children:"Use sempre a sintaxe moderna"})," com parênteses; ela já gera o ",e.jsx("code",{children:"ValueTuple"})," certinho."]}),e.jsx("h2",{children:"Devolver vários valores de um método"}),e.jsxs("p",{children:["A aplicação mais comum: substituir o velho padrão de ",e.jsx("code",{children:"out"})," por um retorno limpo. Compare:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Antes: parâmetro out, verboso
bool TentarDividir(int a, int b, out int quociente, out int resto) {
    if (b == 0) { quociente = 0; resto = 0; return false; }
    quociente = a / b;
    resto = a % b;
    return true;
}

// Agora: tupla nomeada
(int Quociente, int Resto)? Dividir(int a, int b) {
    if (b == 0) return null;
    return (a / b, a % b);
}

var r = Dividir(17, 5);
if (r is (int q, int rest)) {
    Console.WriteLine($"{q} resto {rest}");   // 3 resto 2
}`})}),e.jsxs("p",{children:["Note como o tipo de retorno ",e.jsx("em",{children:"documenta"})," o que sai do método: alguém lendo a assinatura imediatamente sabe que recebe um quociente e um resto."]}),e.jsx("h2",{children:"Deconstruction: desempacotando em variáveis"}),e.jsxs("p",{children:['Você pode "abrir" uma tupla e jogar cada componente em uma variável independente em uma única linha. Isso se chama ',e.jsx("strong",{children:"deconstrução"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`var pessoa = (Nome: "Carla", Idade: 28);

// Desempacotando
var (nome, idade) = pessoa;
Console.WriteLine($"{nome} tem {idade} anos");

// Tipos explícitos, se você preferir
(string n, int i) = pessoa;

// Descarte com _
var (apenasNome, _) = pessoa;
Console.WriteLine(apenasNome);

// Em foreach com lista de tuplas — fica lindo:
var pontos = new List<(int X, int Y)> { (1, 2), (3, 4), (5, 6) };
foreach (var (x, y) in pontos) {
    Console.WriteLine($"{x},{y}");
}`})}),e.jsxs("p",{children:["O caractere ",e.jsx("code",{children:"_"})," é um ",e.jsx("strong",{children:"discard"}),': significa "não me importo com esse valor, jogue fora". Útil quando você só precisa de parte do retorno.']}),e.jsx("h2",{children:"Comparação e igualdade"}),e.jsxs("p",{children:["Tuplas implementam igualdade ",e.jsx("strong",{children:"por valor"}),": duas tuplas são iguais se cada componente for igual, na mesma ordem. Isso simplifica muito comparações."]}),e.jsx("pre",{children:e.jsx("code",{children:`var a = (1, "ola");
var b = (1, "ola");
var c = (2, "ola");

Console.WriteLine(a == b);   // True
Console.WriteLine(a == c);   // False
Console.WriteLine(a.Equals(b));  // True

// Os nomes são ignorados na comparação:
(int X, int Y) p1 = (3, 4);
(int A, int B) p2 = (3, 4);
Console.WriteLine(p1 == p2);  // True — só posições importam`})}),e.jsx("h2",{children:"Limites e quando NÃO usar"}),e.jsxs("p",{children:["Tuplas são fantásticas para retornos curtos, dados temporários e código interno. Mas evite usá-las como tipo público em APIs grandes ou em modelos de domínio: nesses casos, uma ",e.jsx("code",{children:"record"})," ou classe oferece nome de tipo, validação no construtor, métodos auxiliares e versionamento muito melhores."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Ruim: tupla cruzando muitas camadas, com 5+ campos
public (string, string, DateTime, decimal, bool) ObterPedido(int id) { ... }

// Bom: record explícito
public record Pedido(string Cliente, string Produto, DateTime Data,
                     decimal Valor, bool Pago);
public Pedido ObterPedido(int id) { ... }`})}),e.jsx(o,{type:"warning",title:"Cuidado com nomes em assinaturas públicas",children:"Se você expõe uma tupla nomeada em um método público de uma biblioteca, mudar os nomes depois é uma quebra de compatibilidade — outros projetos podem estar acessando esses nomes. Em APIs públicas duradouras, prefira um tipo nomeado."}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"System.Tuple"})," com tupla moderna:"]})," a antiga é class, imutável de fora, pesada. A moderna é struct, leve. Use sempre parênteses."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer que ",e.jsx("code",{children:"=="})," compara por posição, não por nome:"]})," reordenar componentes muda resultado."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tuplas gigantes:"})," > 4 campos viram poluição visual; promova para ",e.jsx("code",{children:"record"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Deconstrução com tipos errados:"})," ",e.jsx("code",{children:"var (a, b, c) = (1, 2);"})," não compila — quantidades têm que bater."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mutabilidade:"})," ",e.jsx("code",{children:"ValueTuple"})," tem campos mutáveis. ",e.jsx("code",{children:"p.Idade = 50;"})," compila e altera. Para imutabilidade, use ",e.jsx("code",{children:"readonly"})," em quem armazena."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Tuplas agrupam vários valores sem criar uma classe."}),e.jsxs("li",{children:["Prefira a forma ",e.jsx("strong",{children:"nomeada"}),": ",e.jsx("code",{children:"(int Idade, string Nome)"}),"."]}),e.jsxs("li",{children:["Substituem ",e.jsx("code",{children:"out"})," e simplificam retornos múltiplos."]}),e.jsxs("li",{children:["Deconstrução com ",e.jsx("code",{children:"var (a, b) = tupla;"})," e descarte com ",e.jsx("code",{children:"_"}),"."]}),e.jsx("li",{children:"Igualdade por valor — posições importam, nomes não."}),e.jsxs("li",{children:["Para domínio público e modelos duradouros, prefira ",e.jsx("code",{children:"record"}),"."]})]})]})}export{i as default};
