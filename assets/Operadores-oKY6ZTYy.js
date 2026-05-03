import{j as e}from"./index-CzLAthD5.js";import{P as s,A as i}from"./AlertBox-CWJo3ar5.js";function d(){return e.jsxs(s,{title:"Operadores aritméticos, lógicos e de comparação",subtitle:"Os símbolos que combinam valores: contas, decisões, bits e os operadores modernos para lidar com null.",difficulty:"iniciante",timeToRead:"14 min",children:[e.jsxs("p",{children:['Operadores são os "verbos" da linguagem. Eles pegam um ou dois valores (chamados ',e.jsx("em",{children:"operandos"}),") e produzem um novo. Saber quais existem, em que ordem o C# os avalia e quais armadilhas escondem é essencial: muitos bugs nascem de uma simples falta de parênteses ou de uma confusão entre ",e.jsx("code",{children:"="})," e ",e.jsx("code",{children:"=="}),". Este capítulo cobre os principais grupos: aritméticos, comparativos, lógicos, bitwise (de bits), o ternário e os operadores modernos para lidar com ",e.jsx("code",{children:"null"}),"."]}),e.jsxs("h2",{children:["Aritméticos: ",e.jsx("code",{children:"+ - * / %"})]}),e.jsxs("p",{children:["São as quatro operações da escola, mais o resto da divisão (",e.jsx("code",{children:"%"}),", chamado ",e.jsx("em",{children:"módulo"}),"). A divisão tem um detalhe traiçoeiro: entre dois inteiros, ela ",e.jsx("strong",{children:"descarta"})," a parte fracionária."]}),e.jsx("pre",{children:e.jsx("code",{children:`int soma = 7 + 3;        // 10
int sub  = 7 - 3;        // 4
int mult = 7 * 3;        // 21
int div  = 7 / 3;        // 2  (não é 2.333!)
int mod  = 7 % 3;        // 1  (resto)

double divReal = 7.0 / 3; // 2.3333... — pelo menos um operando é double

// Incremento e decremento
int x = 5;
x++;            // pós-incremento, x vira 6
++x;            // pré-incremento, x vira 7
int y = x++;    // y recebe 7, depois x vira 8
int z = ++x;    // x vira 9, depois z recebe 9`})}),e.jsx("h2",{children:"Precedência e associatividade"}),e.jsxs("p",{children:["Expressões longas seguem a ordem matemática: ",e.jsx("code",{children:"* / %"})," antes de ",e.jsx("code",{children:"+ -"}),'. Em caso de empate, a avaliação é da esquerda para a direita. Use parênteses sempre que duvidar — eles tornam o código legível e impedem que o compilador "interprete diferente do que você quis".']}),e.jsx("pre",{children:e.jsx("code",{children:`int r1 = 2 + 3 * 4;        // 14, não 20
int r2 = (2 + 3) * 4;      // 20
int r3 = 10 - 2 - 3;       // 5  (esquerda para direita)
int r4 = 2 + 3 * 4 - 5;    // 9`})}),e.jsxs("h2",{children:["Comparação: ",e.jsx("code",{children:"== != < > <= >="})]}),e.jsxs("p",{children:["Devolvem sempre um ",e.jsx("code",{children:"bool"}),". O detalhe importante: ",e.jsx("strong",{children:"iguais"})," são dois sinais (",e.jsx("code",{children:"=="}),"); um único ",e.jsx("code",{children:"="})," é atribuição. Esse é o erro #1 de quem vem de matemática."]}),e.jsx("pre",{children:e.jsx("code",{children:`int idade = 18;
bool maior = idade >= 18;          // true
bool diferente = idade != 21;      // true

// Erro CLÁSSICO em outras linguagens (C aceita, C# bloqueia):
// if (idade = 18) { … }   // ERRO de compilação em C#
if (idade == 18) {                  // OK
    Console.WriteLine("Maioridade!");
}`})}),e.jsxs("h2",{children:["Lógicos: ",e.jsx("code",{children:"&&"}),", ",e.jsx("code",{children:"||"}),", ",e.jsx("code",{children:"!"})]}),e.jsxs("p",{children:["Combinam booleanos. ",e.jsx("code",{children:"&&"}),' é "E" (ambos verdadeiros), ',e.jsx("code",{children:"||"}),' é "OU" (pelo menos um), ',e.jsx("code",{children:"!"})," inverte. O importante: ambos fazem ",e.jsx("strong",{children:"curto-circuito"}),". Se o primeiro operando já decide o resultado, o segundo nem é avaliado."]}),e.jsx("pre",{children:e.jsx("code",{children:`bool maior = idade >= 18;
bool brasileiro = pais == "BR";
if (maior && brasileiro) { … }

// Curto-circuito: se 'pessoa' for null, NÃO chama .Idade,
// evitando NullReferenceException
if (pessoa != null && pessoa.Idade >= 18) { … }

// ! inverte
if (!ativo) { … }`})}),e.jsxs(i,{type:"info",title:"& e | sem curto-circuito",children:["Existem também ",e.jsx("code",{children:"&"})," e ",e.jsx("code",{children:"|"})," (um sinal só), que avaliam ",e.jsx("strong",{children:"sempre"})," os dois lados. Use raramente — só quando o segundo operando tem um efeito colateral importante."]}),e.jsx("h2",{children:"Bitwise: manipulando bits"}),e.jsxs("p",{children:["Para manipular números bit a bit (útil em flags, criptografia, gráficos): ",e.jsx("code",{children:"&"})," AND, ",e.jsx("code",{children:"|"})," OR, ",e.jsx("code",{children:"^"})," XOR, ",e.jsx("code",{children:"~"})," NOT, ",e.jsx("code",{children:"<<"})," shift à esquerda, ",e.jsx("code",{children:">>"})," shift à direita."]}),e.jsx("pre",{children:e.jsx("code",{children:`int a = 0b_1100;     // 12
int b = 0b_1010;     // 10
int and = a & b;     // 0b_1000 = 8
int or  = a | b;     // 0b_1110 = 14
int xor = a ^ b;     // 0b_0110 = 6
int not = ~a;        // inverte todos os bits
int sl  = 1 << 3;    // 1000 = 8 (multiplicar por 2 três vezes)
int sr  = 16 >> 2;   // 4

// Uso prático: enum com [Flags]
[Flags]
enum Permissao { Ler = 1, Escrever = 2, Executar = 4 }
var p = Permissao.Ler | Permissao.Escrever;
bool podeLer = (p & Permissao.Ler) != 0;`})}),e.jsxs("h2",{children:["Ternário ",e.jsx("code",{children:"?:"})]}),e.jsxs("p",{children:['Uma forma compacta de "if-else que devolve um valor": ',e.jsx("code",{children:"condicao ? seVerdadeiro : seFalso"}),". Ótimo para atribuições simples; abuse e o código fica ilegível."]}),e.jsx("pre",{children:e.jsx("code",{children:`string mensagem = idade >= 18 ? "Adulto" : "Menor";

// Encadear é possível, mas duvidoso:
string faixa = idade < 12 ? "criança"
             : idade < 18 ? "adolescente"
             : idade < 60 ? "adulto"
             : "idoso";`})}),e.jsxs("h2",{children:["Operadores de null: ",e.jsx("code",{children:"??"}),", ",e.jsx("code",{children:"??="}),", ",e.jsx("code",{children:"?."})]}),e.jsxs("p",{children:["Esses são ",e.jsx("em",{children:"os"})," operadores que diferenciam código C# moderno do estilo antigo. Eles ajudam a lidar com ",e.jsx("code",{children:"null"})," de forma elegante e segura."]}),e.jsx("pre",{children:e.jsx("code",{children:`string? nome = ObterNome();           // pode ser null

// ??  (null-coalescing): valor padrão se for null
string exibir = nome ?? "Anônimo";

// ??= : atribui só se a variável estiver null
nome ??= "Visitante";

// ?.  (null-conditional): chama membro só se não for null
int? tamanho = nome?.Length;          // null se nome for null

// Encadear:
int? tamPais = pessoa?.Endereco?.Pais?.Length;`})}),e.jsxs(i,{type:"warning",title:"Pegadinha do ?? com bool?",children:[e.jsx("code",{children:"bool? x = null; if (x ?? false) …"})," é a forma idiomática para tratar nullable bool. Não escreva ",e.jsx("code",{children:"if (x == true)"})," sem entender que ",e.jsx("code",{children:"null == true"})," é ",e.jsx("code",{children:"false"})," em C# (e isso é o que você quer, normalmente)."]}),e.jsx("h2",{children:"Atribuição composta"}),e.jsx("p",{children:'Para encurtar "x = x + algo": existem versões compostas para todos os operadores aritméticos e bitwise.'}),e.jsx("pre",{children:e.jsx("code",{children:`int x = 10;
x += 5;     // x = x + 5
x -= 2;     // x = x - 2
x *= 3;     // x = x * 3
x /= 4;     // x = x / 4
x %= 2;     // x = x % 2
x <<= 1;    // shift à esquerda`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"="})," com ",e.jsx("code",{children:"=="}),":"]})," em C# o compilador pega isso quando o tipo é não-booleano, mas com ",e.jsx("code",{children:"bool"})," escapa."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer parênteses:"})," ",e.jsx("code",{children:"a && b || c"})," não é o que parece — ",e.jsx("code",{children:"&&"})," tem precedência sobre ",e.jsx("code",{children:"||"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Divisão inteira inesperada:"})," ",e.jsx("code",{children:"1 / 2"})," é ",e.jsx("code",{children:"0"}),"; escreva ",e.jsx("code",{children:"1.0 / 2"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"&"})," em vez de ",e.jsx("code",{children:"&&"}),":"]})," perde o curto-circuito e pode causar ",e.jsx("code",{children:"NullReferenceException"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Aritméticos seguem precedência matemática; use parênteses para clareza."}),e.jsx("li",{children:"Divisão entre inteiros descarta a parte fracionária."}),e.jsxs("li",{children:["Lógicos ",e.jsx("code",{children:"&&"})," e ",e.jsx("code",{children:"||"})," fazem curto-circuito; ",e.jsx("code",{children:"&"})," e ",e.jsx("code",{children:"|"})," não."]}),e.jsxs("li",{children:["Comparação usa ",e.jsx("code",{children:"=="})," (dois sinais!), não ",e.jsx("code",{children:"="}),"."]}),e.jsx("li",{children:"Operadores bitwise tratam números como sequências de bits — úteis em flags."}),e.jsxs("li",{children:[e.jsx("code",{children:"??"}),", ",e.jsx("code",{children:"??="})," e ",e.jsx("code",{children:"?."})," simplificam o tratamento de ",e.jsx("code",{children:"null"}),"."]})]})]})}export{d as default};
