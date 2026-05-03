import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(i,{title:"Loops: for, while, do-while, foreach",subtitle:"Como repetir blocos de código sem reescrevê-los, escolhendo a forma certa para cada situação.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Computadores são incansáveis: enquanto humanos se cansam de repetir uma tarefa duas ou três vezes, eles fazem milhões de iterações sem reclamar. Os ",e.jsx("strong",{children:"loops"})," (também chamados ",e.jsx("em",{children:"laços"}),') são as instruções que dizem "repita este bloco enquanto valer alguma condição" ou "para cada item desta coleção, faça isto". C# oferece quatro variações principais — ',e.jsx("code",{children:"for"}),", ",e.jsx("code",{children:"while"}),", ",e.jsx("code",{children:"do-while"})," e ",e.jsx("code",{children:"foreach"})," — e dominar quando usar cada uma deixa o código mais legível e menos propenso a bugs."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"for"}),": quando você sabe quantas voltas dar"]}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"for"})," clássico tem três partes na cabeça, separadas por ",e.jsx("code",{children:";"}),": a ",e.jsx("em",{children:"inicialização"})," (executada uma vez no começo), a ",e.jsx("em",{children:"condição"})," (testada antes de cada volta), e o ",e.jsx("em",{children:"incremento"})," (executado depois de cada volta). Use-o quando o número de iterações é conhecido ou quando você precisa do índice."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Imprime os números de 1 a 10
for (int i = 1; i <= 10; i++) {
    Console.WriteLine(i);
}

// Iterar de 2 em 2:
for (int i = 0; i < 100; i += 2) { … }

// Iterar para trás:
for (int i = 10; i >= 1; i--) {
    Console.WriteLine(i);
}`})}),e.jsxs("p",{children:["A variável ",e.jsx("code",{children:"i"})," só existe dentro do bloco do ",e.jsx("code",{children:"for"})," — fora dele, o compilador acusa erro. Isso evita poluir o restante do método com variáveis temporárias."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"while"}),": enquanto a condição for verdadeira"]}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"while"})," quando o número de voltas ",e.jsx("strong",{children:"não"})," é conhecido de antemão e depende de algum estado que muda dentro do laço (entrada do usuário, leitura de um arquivo, valor recebido de uma API)."]}),e.jsx("pre",{children:e.jsx("code",{children:`int tentativas = 0;
string? senha;

do {
    Console.Write("Digite a senha: ");
    senha = Console.ReadLine();
    tentativas++;
} while (senha != "1234" && tentativas < 3);

// Versão com while normal — note que precisaria inicializar antes:
string? linha = Console.ReadLine();
while (!string.IsNullOrEmpty(linha)) {
    Console.WriteLine($"Você digitou: {linha}");
    linha = Console.ReadLine();
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"do-while"}),": pelo menos uma vez"]}),e.jsxs("p",{children:["Idêntico ao ",e.jsx("code",{children:"while"}),", mas a condição é testada ",e.jsx("strong",{children:"depois"})," do bloco. Garante que o corpo execute pelo menos uma vez. Útil para menus que sempre devem aparecer ao menos uma vez."]}),e.jsx("pre",{children:e.jsx("code",{children:`int opcao;

do {
    Console.WriteLine("1) Listar");
    Console.WriteLine("2) Adicionar");
    Console.WriteLine("0) Sair");
    Console.Write("Escolha: ");
    int.TryParse(Console.ReadLine(), out opcao);

    switch (opcao) {
        case 1: Listar(); break;
        case 2: Adicionar(); break;
    }
} while (opcao != 0);`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"foreach"}),": iterar coleções"]}),e.jsx("p",{children:'Esta é a forma idiomática para percorrer arrays, listas, dicionários, strings e qualquer outra coleção. O compilador esconde a "mecânica" do índice — você só lida com os elementos.'}),e.jsx("pre",{children:e.jsx("code",{children:`int[] numeros = { 10, 20, 30, 40 };

foreach (int n in numeros) {
    Console.WriteLine(n);
}

string nome = "Ana";
foreach (char c in nome) {
    Console.WriteLine(c);
}

var capitais = new Dictionary<string, string> {
    ["BR"] = "Brasília",
    ["AR"] = "Buenos Aires"
};
foreach (var (sigla, capital) in capitais) {
    Console.WriteLine($"{sigla} → {capital}");
}`})}),e.jsxs(o,{type:"warning",title:"Não modifique a coleção dentro do foreach",children:["Adicionar ou remover itens de uma ",e.jsx("code",{children:"List<T>"})," dentro de um ",e.jsx("code",{children:"foreach"})," sobre ela mesma lança ",e.jsx("code",{children:"InvalidOperationException"}),". Use um ",e.jsx("code",{children:"for"})," reverso ou colete os índices a remover em outra lista."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"break"}),", ",e.jsx("code",{children:"continue"})," e ",e.jsx("code",{children:"goto"})]}),e.jsx("p",{children:"Dentro de qualquer loop você pode controlar o fluxo:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"break"})," sai imediatamente do loop atual."]}),e.jsxs("li",{children:[e.jsx("code",{children:"continue"})," pula o resto desta iteração e vai direto para a próxima."]}),e.jsxs("li",{children:[e.jsx("code",{children:"goto"})," existe, mas raramente é justificado — exceto para sair de loops aninhados (situação rara e que melhor seria refatorada)."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// break ao encontrar
foreach (var item in lista) {
    if (item == alvo) {
        Console.WriteLine("Achei!");
        break;
    }
}

// continue para pular ímpares
for (int i = 1; i <= 10; i++) {
    if (i % 2 != 0) continue;
    Console.WriteLine(i); // só pares
}

// goto para sair de loops aninhados (use com parcimônia)
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (i * j > 50) goto fim;
    }
}
fim:
Console.WriteLine("Saí dos dois loops");`})}),e.jsx("h2",{children:"Loop infinito controlado"}),e.jsxs("p",{children:['Às vezes você precisa de um laço que roda "para sempre" até que algum evento o interrompa — um servidor que aceita conexões, um daemon que consome fila, um menu interativo. Use ',e.jsx("code",{children:"while (true)"})," com ",e.jsx("code",{children:"break"})," para sair."]}),e.jsx("pre",{children:e.jsx("code",{children:`while (true) {
    Console.Write("Comando (sair para terminar): ");
    string? cmd = Console.ReadLine();
    if (cmd == "sair") break;
    Executar(cmd);
}`})}),e.jsxs(o,{type:"info",title:"Como escolher o loop certo",children:[e.jsx("strong",{children:"for"})," quando você sabe o número de voltas.",e.jsx("br",{}),e.jsx("strong",{children:"while"})," quando depende de uma condição externa.",e.jsx("br",{}),e.jsx("strong",{children:"do-while"})," quando precisa rodar pelo menos uma vez.",e.jsx("br",{}),e.jsx("strong",{children:"foreach"})," quando está iterando uma coleção."]}),e.jsx("h2",{children:"Aninhamento e desempenho"}),e.jsx("p",{children:'Um loop dentro de outro multiplica o trabalho. Imprimir uma matriz 10x10 faz 100 iterações; uma 1000x1000 faz um milhão. Sempre se pergunte: "qual é a ordem de grandeza?"'}),e.jsx("pre",{children:e.jsx("code",{children:`// Matriz multiplicada por escalar
int[,] matriz = new int[3, 3];

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        matriz[i, j] = (i + 1) * (j + 1);
    }
}

// Mostrar
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        Console.Write($"{matriz[i, j]}\\t");
    }
    Console.WriteLine();
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Loop infinito acidental:"})," esquecer de incrementar ",e.jsx("code",{children:"i"}),", ou condição que nunca fica falsa. Pressione Ctrl+C para abortar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Off-by-one:"})," ",e.jsx("code",{children:"i <= length"})," em vez de ",e.jsx("code",{children:"i < length"})," acessa um índice inexistente. Para arrays, regra: índices vão de 0 a ",e.jsx("code",{children:"Length - 1"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Modificar coleção em ",e.jsx("code",{children:"foreach"}),":"]})," lança exceção. Itere por cópia ou use ",e.jsx("code",{children:"for"})," reverso."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Variável de loop capturada por closure (em delegates):"})," em versões antigas do C#, todas as iterações compartilhavam a mesma variável. Nas modernas, ",e.jsx("code",{children:"foreach"})," declara nova variável a cada iteração — em ",e.jsx("code",{children:"for"}),", declare a cópia local explicitamente."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"for"})," tem inicialização, condição e incremento na cabeça."]}),e.jsxs("li",{children:[e.jsx("code",{children:"while"})," testa antes; ",e.jsx("code",{children:"do-while"})," testa depois (executa ao menos uma vez)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"foreach"})," é a forma idiomática para iterar coleções."]}),e.jsxs("li",{children:[e.jsx("code",{children:"break"})," sai do loop; ",e.jsx("code",{children:"continue"})," pula para a próxima iteração."]}),e.jsx("li",{children:"Cuidado com loops infinitos e índices fora do array."}),e.jsxs("li",{children:["Não modifique a coleção dentro de um ",e.jsx("code",{children:"foreach"})," sobre ela mesma."]})]})]})}export{s as default};
