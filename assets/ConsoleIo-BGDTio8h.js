import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Lendo e escrevendo no console",subtitle:"A porta de entrada e saída mais simples do C#: como interagir com o usuário pelo terminal.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs("p",{children:["Antes de aprender a construir interfaces gráficas, sites ou APIs, todo programador precisa dominar a forma mais antiga e direta de comunicação com o usuário: o ",e.jsx("strong",{children:"console"})," (também chamado de terminal ou prompt). Em C#, a classe ",e.jsx("code",{children:"System.Console"}),' oferece tudo que você precisa: imprimir mensagens, ler texto digitado, capturar uma tecla, formatar números. Pense no console como o "primeiro cliente" do seu programa — se você consegue se comunicar com ele, conseguirá depois trocar para qualquer interface mais sofisticada.']}),e.jsxs("h2",{children:["Escrevendo: ",e.jsx("code",{children:"Write"})," vs ",e.jsx("code",{children:"WriteLine"})]}),e.jsxs("p",{children:["Há dois métodos básicos. ",e.jsx("code",{children:"Console.Write"})," imprime exatamente o que você passou, sem adicionar nada. ",e.jsx("code",{children:"Console.WriteLine"})," faz o mesmo, mas acrescenta uma ",e.jsx("strong",{children:"quebra de linha"})," no final, levando o cursor para a linha seguinte."]}),e.jsx("pre",{children:e.jsx("code",{children:`using System;

Console.Write("Olá ");
Console.Write("mundo");
Console.WriteLine("!");
// Saída em uma única linha: Olá mundo!

Console.WriteLine("Linha 1");
Console.WriteLine("Linha 2");
// Cada uma em sua linha`})}),e.jsxs("p",{children:["Você pode passar para esses métodos ",e.jsx("em",{children:"qualquer tipo"}),": número, bool, data, objeto. O .NET chama automaticamente o método ",e.jsx("code",{children:"ToString()"})," do valor para converter em texto."]}),e.jsx("pre",{children:e.jsx("code",{children:`Console.WriteLine(42);          // "42"
Console.WriteLine(3.14);        // "3,14" em pt-BR, "3.14" em en-US
Console.WriteLine(true);        // "True"
Console.WriteLine(DateTime.Now); // depende da cultura`})}),e.jsxs("h2",{children:["Formatação: ",e.jsx("code",{children:"{0}"})," e interpolação ",e.jsx("code",{children:'$"..."'})]}),e.jsxs("p",{children:["Para misturar texto fixo com valores variáveis, há duas formas. A antiga usa marcadores numerados ",e.jsx("code",{children:"{0}"}),", ",e.jsx("code",{children:"{1}"}),"... A moderna (preferida) usa ",e.jsx("strong",{children:"strings interpoladas"})," com prefixo ",e.jsx("code",{children:"$"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`string nome = "Ana";
int idade = 30;

// Forma antiga (ainda válida)
Console.WriteLine("Olá, {0}! Você tem {1} anos.", nome, idade);

// Forma moderna (preferida)
Console.WriteLine($"Olá, {nome}! Você tem {idade} anos.");

// Formatos dentro da chave:
double preco = 19.9;
Console.WriteLine($"Preço: {preco:F2}");           // "Preço: 19,90"
Console.WriteLine($"Hoje: {DateTime.Now:dd/MM/yyyy}");
Console.WriteLine($"Hex: {255:X}");                // "FF"
Console.WriteLine($"Padding: '{nome,10}'");        // alinha à direita em 10`})}),e.jsxs(o,{type:"info",title:"Especificadores comuns",children:[e.jsx("code",{children:"F2"})," = ponto flutuante 2 casas; ",e.jsx("code",{children:"N"})," = com separador de milhar; ",e.jsx("code",{children:"P"})," = porcentagem; ",e.jsx("code",{children:"C"})," = moeda; ",e.jsx("code",{children:"X"})," = hexadecimal; ",e.jsx("code",{children:"D"})," ou ",e.jsx("code",{children:"D5"})," = inteiro com largura mínima."]}),e.jsxs("h2",{children:["Lendo: ",e.jsx("code",{children:"ReadLine"})," e ",e.jsx("code",{children:"ReadKey"})]}),e.jsxs("p",{children:[e.jsx("code",{children:"Console.ReadLine"})," espera o usuário digitar e pressionar ",e.jsx("strong",{children:"Enter"}),", devolvendo tudo digitado como ",e.jsx("code",{children:"string"})," (ou ",e.jsx("code",{children:"null"})," se a entrada acabou — útil quando o input vem de um arquivo redirecionado). ",e.jsx("code",{children:"Console.ReadKey"})," captura uma ",e.jsx("strong",{children:"única tecla"}),", sem precisar de Enter."]}),e.jsx("pre",{children:e.jsx("code",{children:`Console.Write("Como você se chama? ");
string? nome = Console.ReadLine();
Console.WriteLine($"Prazer, {nome}!");

Console.WriteLine("Pressione qualquer tecla para sair...");
ConsoleKeyInfo tecla = Console.ReadKey(intercept: true);
Console.WriteLine($"Você apertou: {tecla.Key}");`})}),e.jsxs("p",{children:["O parâmetro ",e.jsx("code",{children:"intercept: true"})," em ",e.jsx("code",{children:"ReadKey"})," evita que a tecla apareça na tela. Útil para senhas ou menus."]}),e.jsxs("h2",{children:["Validando entrada com ",e.jsx("code",{children:"TryParse"})]}),e.jsxs("p",{children:[e.jsx("code",{children:"ReadLine"})," sempre devolve texto. Para números, datas ou bools, você precisa converter — e o usuário pode digitar bobagem. A regra de ouro: ",e.jsx("strong",{children:"nunca"})," use ",e.jsx("code",{children:"int.Parse"})," em entrada de usuário; sempre use ",e.jsx("code",{children:"TryParse"}),", que devolve ",e.jsx("code",{children:"false"})," em vez de explodir."]}),e.jsx("pre",{children:e.jsx("code",{children:`Console.Write("Digite sua idade: ");
string? entrada = Console.ReadLine();

if (int.TryParse(entrada, out int idade)) {
    if (idade < 0 || idade > 130) {
        Console.WriteLine("Idade fora do intervalo aceitável.");
    } else {
        Console.WriteLine($"Você tem {idade} anos.");
    }
} else {
    Console.WriteLine("Isso não parece um número.");
}`})}),e.jsx("h2",{children:"Um programa interativo completo"}),e.jsx("p",{children:"Vamos juntar tudo num pequeno utilitário: ele pede dois números, um operador, e mostra o resultado. Note como a validação acontece em camadas e como a interpolação deixa as mensagens claras."}),e.jsx("pre",{children:e.jsx("code",{children:`using System;

Console.WriteLine("=== Calculadora simples ===");

double LerNumero(string rotulo) {
    while (true) {
        Console.Write($"{rotulo}: ");
        string? linha = Console.ReadLine();
        if (double.TryParse(linha, out double valor)) return valor;
        Console.WriteLine("Número inválido, tente de novo.");
    }
}

double a = LerNumero("Primeiro número");
double b = LerNumero("Segundo número");

Console.Write("Operação (+ - * /): ");
string? op = Console.ReadLine();

double resultado = op switch {
    "+" => a + b,
    "-" => a - b,
    "*" => a * b,
    "/" when b != 0 => a / b,
    "/" => double.NaN,
    _   => double.NaN
};

Console.WriteLine($"Resultado: {a} {op} {b} = {resultado:F2}");`})}),e.jsxs(o,{type:"warning",title:"ReadLine pode retornar null",children:["Quando o input chega de um pipe ou arquivo e termina, ",e.jsx("code",{children:"ReadLine"})," retorna ",e.jsx("code",{children:"null"}),". Em projetos com ",e.jsx("em",{children:"nullable reference types"}),", sempre cheque com ",e.jsx("code",{children:"?"})," ou ",e.jsx("code",{children:"??"})," antes de usar a string."]}),e.jsx("h2",{children:"Cores, cursor e limpar a tela"}),e.jsx("p",{children:"O console também permite controle visual básico. Útil para destacar mensagens de erro ou desenhar interfaces simples."}),e.jsx("pre",{children:e.jsx("code",{children:`Console.ForegroundColor = ConsoleColor.Red;
Console.WriteLine("Erro grave!");
Console.ResetColor();

Console.BackgroundColor = ConsoleColor.Yellow;
Console.WriteLine("Atenção");
Console.ResetColor();

Console.Clear();                       // limpa tudo
Console.SetCursorPosition(10, 5);      // coluna 10, linha 5
Console.WriteLine("Posicionado!");`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"Write"})," e ",e.jsx("code",{children:"WriteLine"})," sem prestar atenção:"]})," a saída fica grudada na próxima linha. Quando em dúvida, use ",e.jsx("code",{children:"WriteLine"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"int.Parse"})," em entrada de usuário:"]})," qualquer letra digitada gera ",e.jsx("code",{children:"FormatException"}),". Use ",e.jsx("code",{children:"TryParse"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não checar ",e.jsx("code",{children:"null"})," de ",e.jsx("code",{children:"ReadLine"}),":"]})," em scripts redirecionados, o programa quebra."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"Console.ResetColor"}),":"]})," as cores ficam aplicadas até o programa terminar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir cultura nas conversões:"}),' em pt-BR, "1.5" não é um ',e.jsx("code",{children:"double"}),' válido — só "1,5" funciona com cultura local.']})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Console.Write"})," imprime sem quebra; ",e.jsx("code",{children:"WriteLine"})," imprime com quebra."]}),e.jsxs("li",{children:["Use interpolação ",e.jsx("code",{children:'$"{x}"'})," em vez de concatenar com ",e.jsx("code",{children:"+"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ReadLine"})," lê uma linha; ",e.jsx("code",{children:"ReadKey"})," lê uma tecla."]}),e.jsxs("li",{children:["Para números, use sempre ",e.jsx("code",{children:"int.TryParse"}),"/",e.jsx("code",{children:"double.TryParse"})," em vez de ",e.jsx("code",{children:"Parse"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Console.ForegroundColor"})," e ",e.jsx("code",{children:"Clear"})," ajudam a melhorar a aparência."]}),e.jsxs("li",{children:["Trate sempre o caso de entrada inválida ou ",e.jsx("code",{children:"null"}),"."]})]})]})}export{s as default};
