import{j as e}from"./index-CzLAthD5.js";import{P as s,A as o}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(s,{title:"Condicionais: if, else, switch e switch expression",subtitle:"Como o programa toma decisões: comparar valores e escolher caminhos.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:['Programar é, em grande parte, dizer ao computador: "se isso acontecer, faça aquilo; senão, faça outra coisa". Esses pontos de bifurcação no fluxo do programa são chamados ',e.jsx("strong",{children:"condicionais"}),". C# oferece duas grandes ferramentas: o clássico ",e.jsx("code",{children:"if/else"}),", presente em quase toda linguagem, e o ",e.jsx("code",{children:"switch"}),", especializado em comparar um mesmo valor contra várias possibilidades — modernizado nos últimos anos com ",e.jsx("em",{children:"switch expressions"})," e ",e.jsx("em",{children:"pattern matching"}),". Saber escolher entre eles deixa o código mais legível e correto."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"if"}),", ",e.jsx("code",{children:"else if"})," e ",e.jsx("code",{children:"else"})]}),e.jsxs("p",{children:["A forma básica testa uma ",e.jsx("strong",{children:"expressão booleana"})," (algo que avalia para ",e.jsx("code",{children:"true"})," ou ",e.jsx("code",{children:"false"}),") e executa o bloco se for verdadeira. ",e.jsx("code",{children:"else"})," executa se for falsa; ",e.jsx("code",{children:"else if"})," testa outra condição quando a anterior falhou."]}),e.jsx("pre",{children:e.jsx("code",{children:`int idade = 17;

if (idade >= 18) {
    Console.WriteLine("Maior de idade");
} else if (idade >= 12) {
    Console.WriteLine("Adolescente");
} else {
    Console.WriteLine("Criança");
}`})}),e.jsxs("p",{children:["As chaves ",e.jsx("code",{children:"{ }"})," são opcionais quando o corpo tem só uma instrução, mas ",e.jsx("strong",{children:"sempre escreva-as"}),'. Sem chaves, adicionar uma segunda linha por engano vira bug silencioso (a famosa "armadilha do ',e.jsx("code",{children:"goto fail"}),'" da Apple foi exatamente isso).']}),e.jsxs(o,{type:"warning",title:"Sempre use chaves",children:[e.jsx("code",{children:"if (x > 0) Faz();"})," funciona, mas é uma cilada. Mantenha o hábito de sempre abrir e fechar chaves — seu eu do futuro agradece."]}),e.jsx("h2",{children:"Combinando condições"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"&&"})," (E lógico) e ",e.jsx("code",{children:"||"})," (OU lógico) para juntar várias condições. Lembre-se do ",e.jsx("em",{children:"curto-circuito"}),": se o primeiro lado de ",e.jsx("code",{children:"&&"})," já é ",e.jsx("code",{children:"false"}),", o segundo nem é avaliado."]}),e.jsx("pre",{children:e.jsx("code",{children:`if (idade >= 18 && temCnh) {
    Console.WriteLine("Pode dirigir");
}

if (status == "ATIVO" || status == "PENDENTE") {
    Console.WriteLine("Conta utilizável");
}

// Curto-circuito evita NullReferenceException:
if (cliente != null && cliente.Idade >= 18) { … }`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"switch"})," clássico"]}),e.jsxs("p",{children:["Quando uma única variável é comparada contra ",e.jsx("strong",{children:"vários valores fixos"}),", ",e.jsx("code",{children:"switch"})," deixa o código mais limpo. Cada ",e.jsx("code",{children:"case"})," trata um valor; ",e.jsx("code",{children:"default"}),' trata "qualquer outro".']}),e.jsx("pre",{children:e.jsx("code",{children:`int dia = 3;
string nome;

switch (dia) {
    case 1: nome = "Domingo"; break;
    case 2: nome = "Segunda"; break;
    case 3: nome = "Terça";   break;
    case 4: nome = "Quarta";  break;
    case 5: nome = "Quinta";  break;
    case 6: nome = "Sexta";   break;
    case 7: nome = "Sábado";  break;
    default: nome = "Inválido"; break;
}

// Múltiplos cases para o mesmo bloco:
switch (dia) {
    case 1:
    case 7:
        Console.WriteLine("Fim de semana");
        break;
    default:
        Console.WriteLine("Dia útil");
        break;
}`})}),e.jsxs("p",{children:["Em C#, ",e.jsx("code",{children:"break"})," é obrigatório no fim de cada ",e.jsx("code",{children:"case"})," (ou ",e.jsx("code",{children:"return"}),", ",e.jsx("code",{children:"throw"}),", ",e.jsx("code",{children:"goto case"}),"). Diferente do C/C++/Java, ",e.jsx("strong",{children:"fall-through"})," implícito (cair de um case para o próximo) é proibido — o compilador acusa erro."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"switch"})," expression (forma moderna)"]}),e.jsxs("p",{children:["Desde o C# 8, existe uma forma compacta que ",e.jsx("em",{children:"devolve um valor"}),". Usa a sintaxe ",e.jsx("code",{children:"=>"}),' (chamada "arrow") e o caractere ',e.jsx("code",{children:"_"}),' para "qualquer outro caso".']}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = dia switch {
    1 => "Domingo",
    2 => "Segunda",
    3 => "Terça",
    4 => "Quarta",
    5 => "Quinta",
    6 => "Sexta",
    7 => "Sábado",
    _ => "Inválido"
};`})}),e.jsxs("p",{children:["O switch expression é ",e.jsx("strong",{children:"uma expressão"})," — produz um valor que você atribui a algo. O switch tradicional é ",e.jsx("strong",{children:"uma instrução"})," — apenas executa código. Quando o objetivo é mapear entrada para saída, prefira a forma expression: ela é mais curta e o compilador exige que todos os casos sejam cobertos."]}),e.jsxs("h2",{children:["Pattern matching e ",e.jsx("code",{children:"when"})]}),e.jsxs("p",{children:["Cada ",e.jsx("code",{children:"case"})," não precisa ser um valor exato; pode ser um ",e.jsx("strong",{children:"padrão"}),": tipo, intervalo, propriedade. A cláusula ",e.jsx("code",{children:"when"})," adiciona uma condição extra."]}),e.jsx("pre",{children:e.jsx("code",{children:`object obj = 42;

string descricao = obj switch {
    int n when n < 0      => "Negativo",
    int 0                 => "Zero",
    int n when n < 10     => "Pequeno",
    int n                 => $"Inteiro: {n}",
    string s              => $"Texto de {s.Length} chars",
    null                  => "Nada",
    _                     => "Desconhecido"
};

// Pattern matching com propriedades:
record Ponto(int X, int Y);

string quadrante = ponto switch {
    { X: > 0, Y: > 0 } => "1º quadrante",
    { X: < 0, Y: > 0 } => "2º quadrante",
    { X: < 0, Y: < 0 } => "3º quadrante",
    { X: > 0, Y: < 0 } => "4º quadrante",
    _                  => "Sobre um eixo"
};`})}),e.jsxs(o,{type:"info",title:"Padrões aceitos",children:["Em switch moderno, você pode combinar: tipo (",e.jsx("code",{children:"int n"}),"), constantes (",e.jsx("code",{children:"42"}),"), relacionais (",e.jsx("code",{children:">= 18"}),"), lógicos (",e.jsx("code",{children:"> 0 and < 100"}),", ",e.jsx("code",{children:"not null"}),"), propriedades (",e.jsx("code",{children:"{ Idade: > 18 }"}),"), tuplas (",e.jsx("code",{children:"(0, 0)"}),") e mais."]}),e.jsx("h2",{children:"Quando usar cada um"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"if/else if"})," quando as condições são ",e.jsx("em",{children:"diferentes entre si"})," (uma testa idade, outra status, outra horário). Use ",e.jsx("code",{children:"switch"})," quando você compara ",e.jsx("strong",{children:"a mesma variável"})," contra muitos valores. Use ",e.jsx("code",{children:"switch expression"})," quando o objetivo é traduzir entrada para saída."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Bom uso de if (condições heterogêneas):
if (usuario == null) return "Faça login";
if (!usuario.EmailConfirmado) return "Confirme seu e-mail";
if (usuario.Bloqueado) return "Conta bloqueada";

// Bom uso de switch expression (mapeamento):
decimal aliquota = uf switch {
    "SP" or "RJ" => 0.18m,
    "MG"         => 0.18m,
    _            => 0.17m
};`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"break"}),":"]}),' em switch clássico, dá erro de compilação. Não tente "cair" para o próximo case sem usar ',e.jsx("code",{children:"goto case"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não cobrir todos os casos no switch expression:"})," o compilador avisa, e em runtime falta um case lança ",e.jsx("code",{children:"SwitchExpressionException"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Comparar string sem cuidar de case:"})," ",e.jsx("code",{children:'"sp" == "SP"'})," é ",e.jsx("code",{children:"false"}),". Use ",e.jsx("code",{children:"StringComparer.OrdinalIgnoreCase"})," ou normalize com ",e.jsx("code",{children:".ToUpperInvariant()"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Encadear muito if/else:"})," mais de 4 níveis indica que talvez um ",e.jsx("code",{children:"switch"})," ou um polimorfismo seria mais limpo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Comparar ",e.jsx("code",{children:"double"})," com ",e.jsx("code",{children:"=="}),":"]})," use intervalos (",e.jsx("code",{children:"x > 0.99 and x < 1.01"}),") por causa de imprecisão."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"if/else if/else"})," testa condições heterogêneas, sempre com chaves."]}),e.jsxs("li",{children:[e.jsx("code",{children:"&&"})," e ",e.jsx("code",{children:"||"})," combinam condições com curto-circuito."]}),e.jsxs("li",{children:[e.jsx("code",{children:"switch"})," clássico exige ",e.jsx("code",{children:"break"})," em cada case; sem fall-through implícito."]}),e.jsxs("li",{children:["Switch expression devolve um valor e usa ",e.jsx("code",{children:"=>"})," e ",e.jsx("code",{children:"_"}),"."]}),e.jsx("li",{children:"Pattern matching deixa testar tipo, intervalo, propriedades."}),e.jsxs("li",{children:[e.jsx("code",{children:"when"})," adiciona uma condição extra a um padrão."]})]})]})}export{r as default};
