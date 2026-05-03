import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"Métodos: parâmetros, retorno e overloading",subtitle:"Como organizar código em blocos reutilizáveis com nome, entradas e saídas.",difficulty:"iniciante",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine cozinhar lasanha toda vez que alguém da família pede — escrever a receita inteira do zero, comprando os ingredientes, lavando os pratos. Insuportável, certo? O melhor é ter ",e.jsx("em",{children:"uma única receita escrita"}),' que qualquer um possa "executar". Em programação, essa receita reutilizável é chamada de ',e.jsx("strong",{children:"método"})," (ou função). Você dá um nome a um pedaço de código, declara que ",e.jsx("em",{children:"entradas"})," ele aceita (parâmetros) e que ",e.jsx("em",{children:"saída"})," devolve (retorno). Depois, em vez de copiar e colar, você apenas ",e.jsx("strong",{children:"chama"})," o método. Este capítulo mostra como criar, chamar, sobrecarregar e modernizar métodos em C#."]}),e.jsx("h2",{children:"A anatomia de um método"}),e.jsxs("p",{children:["Um método em C# tem cinco partes na sua assinatura: ",e.jsx("em",{children:"modificadores"})," (como ",e.jsx("code",{children:"public"}),", ",e.jsx("code",{children:"static"}),"), ",e.jsx("em",{children:"tipo de retorno"}),", ",e.jsx("em",{children:"nome"}),", ",e.jsx("em",{children:"parâmetros"})," entre parênteses, e ",e.jsx("em",{children:"corpo"})," entre chaves."]}),e.jsx("pre",{children:e.jsx("code",{children:`// public  static  int   Somar (int a, int b) { ... }
//  ↑         ↑     ↑      ↑        ↑              ↑
//  modif.  modif. retorno nome    parâmetros    corpo

public static int Somar(int a, int b) {
    int resultado = a + b;
    return resultado;
}

// Chamando
int total = Somar(3, 4);   // total == 7`})}),e.jsxs("p",{children:[e.jsx("code",{children:"static"})," indica que o método pertence à classe inteira, não a uma instância (objeto criado com ",e.jsx("code",{children:"new"}),"). Para nossos primeiros programas, todos os métodos serão ",e.jsx("code",{children:"static"}),"."]}),e.jsxs("h2",{children:["Sem retorno: ",e.jsx("code",{children:"void"})]}),e.jsxs("p",{children:["Quando o método não devolve nada (apenas executa um efeito, como imprimir), use ",e.jsx("code",{children:"void"}),". Você pode usar ",e.jsx("code",{children:"return;"})," sem valor para sair antes do fim."]}),e.jsx("pre",{children:e.jsx("code",{children:`static void Saudar(string nome) {
    if (string.IsNullOrEmpty(nome)) {
        Console.WriteLine("Nome vazio, abortando.");
        return; // sai cedo
    }
    Console.WriteLine($"Olá, {nome}!");
}`})}),e.jsx("h2",{children:"Parâmetros e argumentos"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Parâmetro"})," é o nome dentro da definição do método. ",e.jsx("strong",{children:"Argumento"})," é o valor passado quando você chama. A diferença é importante na hora de ler erros do compilador."]}),e.jsx("pre",{children:e.jsx("code",{children:`static double CalcularImc(double peso, double altura) {
    //                       ^^^^^^^^^^^^^^^^^^^^^^^^
    //                       Parâmetros (assinatura)
    return peso / (altura * altura);
}

double imc = CalcularImc(70, 1.75);
//                       ^^^ ^^^^
//                       Argumentos (chamada)`})}),e.jsx("h2",{children:"Argumentos nomeados e parâmetros opcionais"}),e.jsx("p",{children:"C# permite passar argumentos por nome e definir valores padrão para parâmetros — o que aumenta a legibilidade e evita explosão de sobrecargas."}),e.jsx("pre",{children:e.jsx("code",{children:`static void EnviarEmail(string para, string assunto = "Sem assunto",
                        bool urgente = false) {
    // ...
}

// Todas estas chamadas são válidas:
EnviarEmail("ana@x.com");
EnviarEmail("ana@x.com", "Olá");
EnviarEmail("ana@x.com", "Olá", true);

// Argumentos nomeados — pode até trocar a ordem:
EnviarEmail(para: "ana@x.com", urgente: true);
EnviarEmail(assunto: "Aviso", para: "ana@x.com");`})}),e.jsxs("p",{children:["Argumentos nomeados são especialmente úteis quando o método tem muitos booleanos: ",e.jsx("code",{children:'EnviarEmail("a", "b", true, false, true)'})," é ilegível; com nomes, vira óbvio."]}),e.jsx(o,{type:"info",title:"Defaults aparecem na assinatura do chamador",children:'Valores padrão são "embutidos" no código que chama, não no método. Mudar o default em uma biblioteca exige recompilar quem usa. Para valores que mudam, prefira sobrecargas explícitas.'}),e.jsx("h2",{children:"Sobrecarga (overloading)"}),e.jsxs("p",{children:["Você pode declarar ",e.jsx("strong",{children:"vários métodos com o mesmo nome"}),", desde que tenham listas de parâmetros diferentes (em quantidade ou tipo). O compilador escolhe a versão certa baseado nos argumentos."]}),e.jsx("pre",{children:e.jsx("code",{children:`static int Somar(int a, int b) => a + b;
static double Somar(double a, double b) => a + b;
static int Somar(int a, int b, int c) => a + b + c;
static int Somar(params int[] valores) {
    int s = 0;
    foreach (int v in valores) s += v;
    return s;
}

Somar(2, 3);              // chama a primeira
Somar(2.5, 3.5);          // chama a de double
Somar(1, 2, 3);           // chama a de três
Somar(1, 2, 3, 4, 5);     // chama a de params`})}),e.jsxs("p",{children:["Atenção: o ",e.jsx("strong",{children:"tipo de retorno sozinho não conta"})," para sobrecarga. Não dá para ter ",e.jsx("code",{children:"int Foo()"})," e ",e.jsx("code",{children:"string Foo()"}),"."]}),e.jsx("h2",{children:"Métodos expression-bodied"}),e.jsxs("p",{children:["Quando o corpo é uma única expressão, use a sintaxe curta com ",e.jsx("code",{children:"=>"}),". Mais legível em métodos triviais."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Forma tradicional
static int Quadrado(int x) {
    return x * x;
}

// Expression-bodied — mais limpo
static int Quadrado(int x) => x * x;

// Funciona com void também
static void Saudar(string nome) => Console.WriteLine($"Olá, {nome}!");`})}),e.jsx("h2",{children:"Funções locais (local functions)"}),e.jsxs("p",{children:['Quando você precisa de uma "ajudante" que só existe dentro de outro método, declare-a ',e.jsx("strong",{children:"dentro"})," dele. Ela enxerga as variáveis locais do método pai e não polui a classe."]}),e.jsx("pre",{children:e.jsx("code",{children:`static double Estatistica(double[] valores) {
    double Media() {
        double s = 0;
        foreach (var v in valores) s += v;  // usa o array do método pai
        return s / valores.Length;
    }

    double Variancia(double m) {
        double s = 0;
        foreach (var v in valores) s += (v - m) * (v - m);
        return s / valores.Length;
    }

    double m = Media();
    return Variancia(m);
}`})}),e.jsxs(o,{type:"warning",title:"Métodos longos cheiram mal",children:["Se um método passa de 30-40 linhas, considere quebrá-lo em vários menores. Cada método deve fazer ",e.jsx("em",{children:"uma coisa"})," e ter um nome que descreve essa coisa. Isso é o coração do código limpo."]}),e.jsx("h2",{children:"Top-level statements (C# 9+)"}),e.jsxs("p",{children:["Em projetos novos, o template gera apenas ",e.jsx("code",{children:'Console.WriteLine("Hello, World!");'})," — sem ",e.jsx("code",{children:"class"})," nem ",e.jsx("code",{children:"Main"}),". Isso é açúcar sintático: o compilador cria a classe e o ",e.jsx("code",{children:"Main"})," automaticamente. Você ainda pode declarar métodos abaixo do código top-level — eles viram funções locais do ",e.jsx("code",{children:"Main"})," implícito."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs (template moderno)
Console.Write("Seu nome: ");
string? nome = Console.ReadLine();
Saudar(nome);

void Saudar(string? n) => Console.WriteLine($"Olá, {n ?? "amigo"}!");`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"return"}),":"]})," em método não-",e.jsx("code",{children:"void"}),', todos os caminhos precisam retornar. O compilador acusa "not all code paths return".']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar sobrecarga só por retorno:"})," não é permitido; mude algum parâmetro."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir parâmetro com variável local:"})," tudo que está entre ",e.jsx("code",{children:"("})," e ",e.jsx("code",{children:")"})," na assinatura é parâmetro; o resto, dentro do corpo, é local."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar parâmetros de tipo valor esperando refletir fora:"})," precisa ",e.jsx("code",{children:"ref"})," (próximo capítulo)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Excesso de parâmetros:"})," mais de 4-5 parâmetros sugere agrupar em uma classe ou record."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Método agrupa código com nome, parâmetros e retorno."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"void"})," quando não há retorno; ",e.jsx("code",{children:"return;"})," sai cedo."]}),e.jsx("li",{children:"Argumentos nomeados melhoram legibilidade; defaults reduzem sobrecargas."}),e.jsx("li",{children:"Overloading: vários métodos com mesmo nome, assinaturas diferentes."}),e.jsxs("li",{children:["Expression-bodied (",e.jsx("code",{children:"=>"}),") deixa métodos triviais mais curtos."]}),e.jsx("li",{children:"Funções locais isolam ajudantes dentro do método pai."})]})]})}export{i as default};
