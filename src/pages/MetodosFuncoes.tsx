import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MetodosFuncoes() {
  return (
    <PageContainer
      title="Métodos: parâmetros, retorno e overloading"
      subtitle="Como organizar código em blocos reutilizáveis com nome, entradas e saídas."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine cozinhar lasanha toda vez que alguém da família pede — escrever a receita inteira do zero, comprando os ingredientes, lavando os pratos. Insuportável, certo? O melhor é ter <em>uma única receita escrita</em> que qualquer um possa "executar". Em programação, essa receita reutilizável é chamada de <strong>método</strong> (ou função). Você dá um nome a um pedaço de código, declara que <em>entradas</em> ele aceita (parâmetros) e que <em>saída</em> devolve (retorno). Depois, em vez de copiar e colar, você apenas <strong>chama</strong> o método. Este capítulo mostra como criar, chamar, sobrecarregar e modernizar métodos em C#.
      </p>

      <h2>A anatomia de um método</h2>
      <p>
        Um método em C# tem cinco partes na sua assinatura: <em>modificadores</em> (como <code>public</code>, <code>static</code>), <em>tipo de retorno</em>, <em>nome</em>, <em>parâmetros</em> entre parênteses, e <em>corpo</em> entre chaves.
      </p>
      <pre><code>{`// public  static  int   Somar (int a, int b) { ... }
//  ↑         ↑     ↑      ↑        ↑              ↑
//  modif.  modif. retorno nome    parâmetros    corpo

public static int Somar(int a, int b) {
    int resultado = a + b;
    return resultado;
}

// Chamando
int total = Somar(3, 4);   // total == 7`}</code></pre>
      <p>
        <code>static</code> indica que o método pertence à classe inteira, não a uma instância (objeto criado com <code>new</code>). Para nossos primeiros programas, todos os métodos serão <code>static</code>.
      </p>

      <h2>Sem retorno: <code>void</code></h2>
      <p>
        Quando o método não devolve nada (apenas executa um efeito, como imprimir), use <code>void</code>. Você pode usar <code>return;</code> sem valor para sair antes do fim.
      </p>
      <pre><code>{`static void Saudar(string nome) {
    if (string.IsNullOrEmpty(nome)) {
        Console.WriteLine("Nome vazio, abortando.");
        return; // sai cedo
    }
    Console.WriteLine($"Olá, {nome}!");
}`}</code></pre>

      <h2>Parâmetros e argumentos</h2>
      <p>
        <strong>Parâmetro</strong> é o nome dentro da definição do método. <strong>Argumento</strong> é o valor passado quando você chama. A diferença é importante na hora de ler erros do compilador.
      </p>
      <pre><code>{`static double CalcularImc(double peso, double altura) {
    //                       ^^^^^^^^^^^^^^^^^^^^^^^^
    //                       Parâmetros (assinatura)
    return peso / (altura * altura);
}

double imc = CalcularImc(70, 1.75);
//                       ^^^ ^^^^
//                       Argumentos (chamada)`}</code></pre>

      <h2>Argumentos nomeados e parâmetros opcionais</h2>
      <p>
        C# permite passar argumentos por nome e definir valores padrão para parâmetros — o que aumenta a legibilidade e evita explosão de sobrecargas.
      </p>
      <pre><code>{`static void EnviarEmail(string para, string assunto = "Sem assunto",
                        bool urgente = false) {
    // ...
}

// Todas estas chamadas são válidas:
EnviarEmail("ana@x.com");
EnviarEmail("ana@x.com", "Olá");
EnviarEmail("ana@x.com", "Olá", true);

// Argumentos nomeados — pode até trocar a ordem:
EnviarEmail(para: "ana@x.com", urgente: true);
EnviarEmail(assunto: "Aviso", para: "ana@x.com");`}</code></pre>
      <p>
        Argumentos nomeados são especialmente úteis quando o método tem muitos booleanos: <code>EnviarEmail("a", "b", true, false, true)</code> é ilegível; com nomes, vira óbvio.
      </p>

      <AlertBox type="info" title="Defaults aparecem na assinatura do chamador">
        Valores padrão são "embutidos" no código que chama, não no método. Mudar o default em uma biblioteca exige recompilar quem usa. Para valores que mudam, prefira sobrecargas explícitas.
      </AlertBox>

      <h2>Sobrecarga (overloading)</h2>
      <p>
        Você pode declarar <strong>vários métodos com o mesmo nome</strong>, desde que tenham listas de parâmetros diferentes (em quantidade ou tipo). O compilador escolhe a versão certa baseado nos argumentos.
      </p>
      <pre><code>{`static int Somar(int a, int b) => a + b;
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
Somar(1, 2, 3, 4, 5);     // chama a de params`}</code></pre>
      <p>
        Atenção: o <strong>tipo de retorno sozinho não conta</strong> para sobrecarga. Não dá para ter <code>int Foo()</code> e <code>string Foo()</code>.
      </p>

      <h2>Métodos expression-bodied</h2>
      <p>
        Quando o corpo é uma única expressão, use a sintaxe curta com <code>=&gt;</code>. Mais legível em métodos triviais.
      </p>
      <pre><code>{`// Forma tradicional
static int Quadrado(int x) {
    return x * x;
}

// Expression-bodied — mais limpo
static int Quadrado(int x) => x * x;

// Funciona com void também
static void Saudar(string nome) => Console.WriteLine($"Olá, {nome}!");`}</code></pre>

      <h2>Funções locais (local functions)</h2>
      <p>
        Quando você precisa de uma "ajudante" que só existe dentro de outro método, declare-a <strong>dentro</strong> dele. Ela enxerga as variáveis locais do método pai e não polui a classe.
      </p>
      <pre><code>{`static double Estatistica(double[] valores) {
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
}`}</code></pre>

      <AlertBox type="warning" title="Métodos longos cheiram mal">
        Se um método passa de 30-40 linhas, considere quebrá-lo em vários menores. Cada método deve fazer <em>uma coisa</em> e ter um nome que descreve essa coisa. Isso é o coração do código limpo.
      </AlertBox>

      <h2>Top-level statements (C# 9+)</h2>
      <p>
        Em projetos novos, o template gera apenas <code>Console.WriteLine("Hello, World!");</code> — sem <code>class</code> nem <code>Main</code>. Isso é açúcar sintático: o compilador cria a classe e o <code>Main</code> automaticamente. Você ainda pode declarar métodos abaixo do código top-level — eles viram funções locais do <code>Main</code> implícito.
      </p>
      <pre><code>{`// Program.cs (template moderno)
Console.Write("Seu nome: ");
string? nome = Console.ReadLine();
Saudar(nome);

void Saudar(string? n) => Console.WriteLine($"Olá, {n ?? "amigo"}!");`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>return</code>:</strong> em método não-<code>void</code>, todos os caminhos precisam retornar. O compilador acusa "not all code paths return".</li>
        <li><strong>Tentar sobrecarga só por retorno:</strong> não é permitido; mude algum parâmetro.</li>
        <li><strong>Confundir parâmetro com variável local:</strong> tudo que está entre <code>(</code> e <code>)</code> na assinatura é parâmetro; o resto, dentro do corpo, é local.</li>
        <li><strong>Modificar parâmetros de tipo valor esperando refletir fora:</strong> precisa <code>ref</code> (próximo capítulo).</li>
        <li><strong>Excesso de parâmetros:</strong> mais de 4-5 parâmetros sugere agrupar em uma classe ou record.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Método agrupa código com nome, parâmetros e retorno.</li>
        <li>Use <code>void</code> quando não há retorno; <code>return;</code> sai cedo.</li>
        <li>Argumentos nomeados melhoram legibilidade; defaults reduzem sobrecargas.</li>
        <li>Overloading: vários métodos com mesmo nome, assinaturas diferentes.</li>
        <li>Expression-bodied (<code>=&gt;</code>) deixa métodos triviais mais curtos.</li>
        <li>Funções locais isolam ajudantes dentro do método pai.</li>
      </ul>
    </PageContainer>
  );
}
