import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(o,{title:"Parâmetros especiais: ref, out, in e params",subtitle:"Quando o método precisa modificar a variável do chamador, devolver vários valores ou aceitar um número variável de argumentos.",difficulty:"iniciante",timeToRead:"14 min",children:[e.jsxs("p",{children:["Por padrão, ao chamar um método, C# passa ",e.jsx("strong",{children:"cópias"})," dos valores. Se você modifica um ",e.jsx("code",{children:"int"})," dentro do método, a variável do chamador permanece intocada — porque o método só recebeu uma cópia. Mas há situações em que isso é exatamente o oposto do que você quer: ",e.jsx("em",{children:"preciso"})," que o método mude minha variável; preciso que ele me devolva ",e.jsx("em",{children:"dois"})," valores; preciso passar uma quantidade arbitrária de argumentos. Para esses casos, C# oferece quatro modificadores de parâmetro: ",e.jsx("code",{children:"ref"}),", ",e.jsx("code",{children:"out"}),", ",e.jsx("code",{children:"in"})," e ",e.jsx("code",{children:"params"}),". Saber quando (e quando ",e.jsx("strong",{children:"não"}),") usá-los é o assunto deste capítulo."]}),e.jsx("h2",{children:"O comportamento padrão: passagem por valor"}),e.jsxs("p",{children:["Antes dos modificadores, vamos firmar o padrão. Para tipos por valor, o método recebe uma cópia. Para tipos por referência, recebe uma cópia da ",e.jsx("em",{children:"referência"})," — então pode modificar o conteúdo do objeto, mas não pode reapontar a variável do chamador."]}),e.jsx("pre",{children:e.jsx("code",{children:`static void Dobrar(int x) {
    x = x * 2;        // só altera a cópia local
}

int n = 5;
Dobrar(n);
Console.WriteLine(n);   // continua 5

static void EsvaziarLista(List<int> lista) {
    lista.Clear();        // modifica o objeto: chamador VÊ
}

static void TrocarLista(List<int> lista) {
    lista = new List<int>(); // só muda a referência LOCAL
}

var l = new List<int> { 1, 2, 3 };
EsvaziarLista(l);
Console.WriteLine(l.Count); // 0 (modificou o conteúdo)
TrocarLista(l);
// l ainda existe, com 0 itens — não foi substituído`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"ref"}),": o método pode ler e escrever na variável do chamador"]}),e.jsxs("p",{children:["Marque o parâmetro com ",e.jsx("code",{children:"ref"})," tanto na definição quanto na chamada. A variável passada precisa estar ",e.jsx("strong",{children:"já inicializada"})," antes da chamada, porque o método pode lê-la."]}),e.jsx("pre",{children:e.jsx("code",{children:`static void Dobrar(ref int x) {
    x = x * 2;
}

int n = 5;
Dobrar(ref n);
Console.WriteLine(n);   // agora é 10

// Trocar dois valores (clássico):
static void Trocar(ref int a, ref int b) {
    int tmp = a;
    a = b;
    b = tmp;
}

int x = 1, y = 2;
Trocar(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");  // x=2, y=1`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"out"}),": o método é obrigado a atribuir antes de retornar"]}),e.jsxs("p",{children:["Igual ao ",e.jsx("code",{children:"ref"}),", mas com duas diferenças: o chamador ",e.jsx("strong",{children:"não"})," precisa inicializar a variável antes, e o método ",e.jsx("strong",{children:"obrigatoriamente"})," precisa atribuir um valor antes de retornar. Use para retornar valores adicionais."]}),e.jsx("pre",{children:e.jsx("code",{children:`static bool DividirSeguro(int dividendo, int divisor, out int resultado) {
    if (divisor == 0) {
        resultado = 0;     // ainda assim PRECISA atribuir
        return false;
    }
    resultado = dividendo / divisor;
    return true;
}

if (DividirSeguro(10, 3, out int r)) {
    Console.WriteLine($"Resultado: {r}");
} else {
    Console.WriteLine("Divisão por zero!");
}

// Padrão MUITO comum no .NET: TryParse
if (int.TryParse("42", out int valor)) {
    Console.WriteLine(valor * 2);
}`})}),e.jsxs(r,{type:"info",title:"out variables inline (C# 7+)",children:["Você pode declarar a variável diretamente na chamada: ",e.jsx("code",{children:"int.TryParse(s, out int n)"}),". O ",e.jsx("code",{children:"n"})," existe no escopo a partir desse ponto. Antes do C# 7, era preciso declarar antes."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"in"}),": passagem por referência somente leitura"]}),e.jsxs("p",{children:[e.jsx("code",{children:"in"})," passa uma referência à variável (evitando cópia, útil para ",e.jsx("em",{children:"structs grandes"}),"), mas ",e.jsx("strong",{children:"impede"}),' que o método a modifique. É uma promessa de "vou ler, mas não vou tocar".']}),e.jsx("pre",{children:e.jsx("code",{children:`public readonly struct GrandeMatriz {
    public readonly double[,] Dados;
    public GrandeMatriz(double[,] d) => Dados = d;
}

static double Soma(in GrandeMatriz m) {
    double s = 0;
    for (int i = 0; i < m.Dados.GetLength(0); i++)
        for (int j = 0; j < m.Dados.GetLength(1); j++)
            s += m.Dados[i, j];
    // m = new GrandeMatriz(...);  // ERRO: in é readonly
    return s;
}`})}),e.jsxs("p",{children:["Para tipos por referência ou structs pequenos, ",e.jsx("code",{children:"in"})," raramente faz diferença — use só quando perfilamento mostrar ganho real."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"params"}),": número variável de argumentos"]}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"params"})," no ",e.jsx("strong",{children:"último"})," parâmetro para aceitar zero, um ou muitos argumentos, que o método recebe como array. ",e.jsx("code",{children:"Console.WriteLine"}),", ",e.jsx("code",{children:"string.Format"})," e ",e.jsx("code",{children:"string.Concat"})," usam isso."]}),e.jsx("pre",{children:e.jsx("code",{children:`static int SomarTodos(params int[] valores) {
    int total = 0;
    foreach (int v in valores) total += v;
    return total;
}

Console.WriteLine(SomarTodos());            // 0
Console.WriteLine(SomarTodos(10));          // 10
Console.WriteLine(SomarTodos(1, 2, 3, 4));  // 10
Console.WriteLine(SomarTodos(new[] { 1, 2 })); // também aceita array

// Misturado com parâmetros normais:
static void Log(string nivel, params object[] partes) {
    Console.Write($"[{nivel}] ");
    foreach (var p in partes) Console.Write(p);
    Console.WriteLine();
}
Log("INFO", "Usuário ", "Ana", " logado às ", DateTime.Now);`})}),e.jsxs("h2",{children:["Retorno por referência: ",e.jsx("code",{children:"ref returns"})]}),e.jsxs("p",{children:["C# moderno permite que um método devolva uma ",e.jsx("em",{children:"referência"})," a uma variável, e que o chamador modifique através dessa referência. Use raramente; é uma otimização para cenários específicos (engines, manipulação de buffers)."]}),e.jsx("pre",{children:e.jsx("code",{children:`static ref int PrimeiroMaiorQue(int[] arr, int alvo) {
    for (int i = 0; i < arr.Length; i++) {
        if (arr[i] > alvo) return ref arr[i];
    }
    throw new InvalidOperationException("Nenhum elemento maior");
}

int[] dados = { 1, 5, 10, 20 };
ref int slot = ref PrimeiroMaiorQue(dados, 7);
slot = 999;        // modifica o array!
Console.WriteLine(dados[2]);  // 999`})}),e.jsxs(r,{type:"warning",title:"Quando NÃO usar ref",children:[e.jsx("strong",{children:"Não"})," use ",e.jsx("code",{children:"ref"})," só por achar que é mais rápido. Para a maioria dos casos, retornar um valor é mais legível e o compilador otimiza muito bem. Use ",e.jsx("code",{children:"ref"}),"/",e.jsx("code",{children:"out"})," só quando: (a) precisa devolver mais de um valor sem criar uma classe; (b) precisa modificar a variável do chamador deliberadamente; (c) está lidando com structs gigantes em código quente. Caso contrário, prefira retornar um ",e.jsx("code",{children:"(bool ok, int valor)"})," tuple ou um ",e.jsx("code",{children:"record"}),"."]}),e.jsxs("h2",{children:["Tuplas: alternativa moderna a ",e.jsx("code",{children:"out"})]}),e.jsxs("p",{children:["Em vez de usar ",e.jsx("code",{children:"out"}),", muitos códigos modernos retornam uma ",e.jsx("strong",{children:"tupla"})," com vários valores nomeados. É mais legível."]}),e.jsx("pre",{children:e.jsx("code",{children:`static (bool sucesso, int valor) DividirTupla(int a, int b) {
    if (b == 0) return (false, 0);
    return (true, a / b);
}

var (ok, r) = DividirTupla(10, 3);
if (ok) Console.WriteLine(r);`})}),e.jsx("h2",{children:"Resumo das diferenças"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Modificador"}),e.jsx("th",{children:"Inicializar antes?"}),e.jsx("th",{children:"Método pode ler?"}),e.jsx("th",{children:"Método pode escrever?"}),e.jsx("th",{children:"Uso"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"(nenhum)"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Sim (cópia)"}),e.jsx("td",{children:"Local apenas"}),e.jsx("td",{children:"Padrão"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"ref"})}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Modificar variável do chamador"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"out"})}),e.jsx("td",{children:"Não"}),e.jsx("td",{children:"Não"}),e.jsx("td",{children:"Obrigatório"}),e.jsx("td",{children:"Devolver valor extra (TryParse)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"in"})}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Não"}),e.jsx("td",{children:"Evitar cópia de struct grande"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"params"})}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"—"}),e.jsx("td",{children:"Número variável de args"})]})]})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"ref"})," ou ",e.jsx("code",{children:"out"})," na chamada:"]})," o compilador exige o modificador também na chamada, não só na assinatura."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não atribuir um ",e.jsx("code",{children:"out"}),":"]}),' o compilador acusa "the out parameter must be assigned before control leaves the method". Atribua mesmo nos caminhos de erro.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar passar ",e.jsx("code",{children:"const"})," ou propriedade como ",e.jsx("code",{children:"ref"}),":"]}),' só variáveis "endereçáveis" funcionam.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"ref"})," com tipo por referência sem entender:"]})," só faz diferença se o método precisa ",e.jsx("em",{children:"reapontar"})," a variável do chamador."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Abusar de ",e.jsx("code",{children:"params"}),":"]})," cada chamada pode alocar um array escondido. Em código quente, ofereça uma sobrecarga sem ",e.jsx("code",{children:"params"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Padrão é passagem por valor (cópia); para tipos referência, copia o ponteiro."}),e.jsxs("li",{children:[e.jsx("code",{children:"ref"}),": passar e poder modificar; precisa inicializar antes."]}),e.jsxs("li",{children:[e.jsx("code",{children:"out"}),": devolver valores extras; método é obrigado a atribuir."]}),e.jsxs("li",{children:[e.jsx("code",{children:"in"}),": passar por referência, somente leitura — útil para structs grandes."]}),e.jsxs("li",{children:[e.jsx("code",{children:"params"}),": aceitar número variável de argumentos como array."]}),e.jsxs("li",{children:["Tuplas e ",e.jsx("code",{children:"record"})," muitas vezes substituem ",e.jsx("code",{children:"ref"}),"/",e.jsx("code",{children:"out"})," com mais clareza."]})]})]})}export{s as default};
