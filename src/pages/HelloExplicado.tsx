import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HelloExplicado() {
  return (
    <PageContainer
      title="O “Olá, Mundo!” Explicado Linha por Linha"
      subtitle="Antes de avançar, vamos dissecar o programa mais simples possível em C# para entender o que cada palavra faz — sem mistérios."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Quando você instala o .NET e roda <code>dotnet new console</code>, o template gera um programa de uma linha só. Isso é ótimo para começar a programar rápido, mas é péssimo para <em>aprender</em> — porque várias coisas importantes acontecem nos bastidores. Neste capítulo, vamos voltar à <strong>versão tradicional</strong>, com toda a "cerimônia" visível, e explicar o significado de cada palavra. Pense nisso como abrir o capô de um carro antes de aprender a dirigir.
      </p>

      <h2>O programa completo</h2>
      <p>
        Este é o famoso "Olá, Mundo!" em sua forma mais explícita. Vamos olhar o todo, depois decompor:
      </p>
      <pre><code>{`using System;

namespace MeuPrimeiroApp
{
    class Programa
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Olá, mundo!");
        }
    }
}`}</code></pre>
      <p>
        Esse arquivo tem 11 linhas e cabe em qualquer editor. Mas dentro dele estão <strong>cinco conceitos fundamentais</strong> de C#: <em>diretiva using</em>, <em>namespace</em>, <em>classe</em>, <em>método</em> e <em>chamada de método</em>. Vamos por partes.
      </p>

      <h2>Linha 1: <code>using System;</code></h2>
      <p>
        A palavra-chave <code>using</code> é uma <strong>diretiva</strong>: uma instrução para o compilador (o programa que transforma seu código em algo executável). Ela diz: "neste arquivo, eu vou querer usar coisas que vivem dentro do <em>namespace</em> chamado <code>System</code> sem precisar repetir o nome dele toda hora."
      </p>
      <p>
        Um <strong>namespace</strong> é só uma pasta lógica para organizar código. <code>System</code> é o namespace mais básico do .NET — dentro dele estão <code>Console</code>, <code>String</code>, <code>Math</code>, <code>DateTime</code> e centenas de outros tipos. Sem o <code>using System;</code>, você teria que escrever <code>System.Console.WriteLine(...)</code> sempre. Com ele, basta <code>Console.WriteLine(...)</code>.
      </p>

      <AlertBox type="info" title="O ponto-e-vírgula">
        Em C#, quase toda instrução termina com <code>;</code>. É o equivalente ao ponto final de uma frase: ele diz "acabou aqui". Esquecer o <code>;</code> é o erro #1 de quem está começando.
      </AlertBox>

      <h2>Linhas 3 e 4: o <code>namespace</code> e o <code>{`{`}</code></h2>
      <p>
        Aqui você está <em>declarando</em> seu próprio namespace, chamado <code>MeuPrimeiroApp</code>. Tudo o que estiver entre as chaves <code>{`{`}</code> e <code>{`}`}</code> que se seguem pertence a esse namespace. Isso evita conflitos: se você criar uma classe <code>Cliente</code> e outra biblioteca também tiver uma <code>Cliente</code>, os namespaces diferentes (<code>MeuApp.Cliente</code> vs <code>OutraLib.Cliente</code>) impedem ambiguidade.
      </p>

      <h2>Linhas 5 e 6: <code>class Programa</code></h2>
      <p>
        Em C#, <strong>todo código executável vive dentro de uma classe</strong>. Uma classe, por enquanto, é só uma "caixa" que agrupa funções e dados relacionados. <code>Programa</code> é o nome que escolhemos — poderia ser qualquer outro (<code>App</code>, <code>Entrada</code>, <code>BatataFrita</code>). Por convenção, nomes de classe usam <strong>PascalCase</strong> (cada palavra começa com maiúscula).
      </p>
      <pre><code>{`// Convenção de nomes em C#:
class MinhaClasse        // PascalCase para classes
void MeuMetodo()         // PascalCase para métodos
int minhaVariavel        // camelCase para variáveis locais
const int MAX_TAMANHO    // SCREAMING_SNAKE_CASE só em casos raros`}</code></pre>

      <h2>Linha 7: <code>static void Main(string[] args)</code></h2>
      <p>
        Esta é a <strong>linha mais densa</strong> do programa. Vamos quebrar palavra por palavra:
      </p>
      <ul>
        <li><code>static</code>: significa que o método pertence à <em>classe</em> em si, não a uma instância dela. Para o ponto de entrada do programa, isso é obrigatório — porque quando seu programa começa, ainda não existe nenhum objeto criado.</li>
        <li><code>void</code>: significa "este método não devolve nada" (o oposto de, por exemplo, <code>int</code>, que devolveria um número inteiro).</li>
        <li><code>Main</code>: é um nome <strong>especial</strong>. O .NET procura, quando você roda o programa, por um método chamado exatamente <code>Main</code> e começa a execução por ele. Se você o chamar de <code>main</code> (minúsculo) ou <code>Iniciar</code>, o programa não roda.</li>
        <li><code>(string[] args)</code>: é a <strong>lista de parâmetros</strong>. <code>string[]</code> significa "um array (vetor) de textos". <code>args</code> é o nome dado a esse array. Quando você roda <code>dotnet run -- ola tchau</code>, <code>args</code> chega valendo <code>["ola", "tchau"]</code>.</li>
      </ul>

      <h2>Linha 9: <code>Console.WriteLine(...)</code></h2>
      <p>
        Finalmente, a linha que <em>faz</em> alguma coisa. <code>Console</code> é uma classe (vinda do namespace <code>System</code>) que representa a janela de terminal. <code>WriteLine</code> é um método dela que recebe um texto e o imprime, adicionando uma quebra de linha no final. Existe também <code>Console.Write(...)</code> (sem <code>Line</code>), que imprime sem quebrar a linha.
      </p>
      <pre><code>{`Console.Write("Olá ");
Console.Write("mundo");
Console.WriteLine("!");
// Saída: Olá mundo!`}</code></pre>

      <AlertBox type="warning" title="Sensível a maiúsculas">
        C# é <strong>case-sensitive</strong>. <code>Console</code> com C maiúsculo funciona; <code>console</code> com c minúsculo dá erro de compilação. O mesmo vale para <code>Main</code>, <code>WriteLine</code> e qualquer outro identificador.
      </AlertBox>

      <h2>Como compilar e rodar</h2>
      <p>
        Com esse código salvo em <code>Program.cs</code> dentro de um projeto criado por <code>dotnet new console</code>, basta rodar:
      </p>
      <pre><code>{`# Compila e executa em um único passo (modo desenvolvimento)
dotnet run

# Apenas compila, gerando os arquivos .dll em bin/Debug
dotnet build

# Roda o .dll já compilado
dotnet bin/Debug/net9.0/MeuPrimeiroApp.dll`}</code></pre>
      <p>
        Por baixo dos panos, o compilador <code>csc</code> (parte do <strong>Roslyn</strong>) traduz seu código C# para uma linguagem intermediária chamada <strong>IL</strong> (Intermediate Language), e o runtime do .NET (chamado <strong>CLR</strong>) converte essa IL para instruções nativas do seu processador <em>na hora de executar</em> (JIT — Just-In-Time compilation). Você não precisa entender isso agora, mas é bom saber que <code>dotnet run</code> não é mágica.
      </p>

      <h2>Erros comuns de quem está começando</h2>
      <ul>
        <li><strong>Esquecer <code>;</code></strong> no fim de uma instrução — o compilador reclamará com <em>"; expected"</em>.</li>
        <li><strong>Trocar maiúsculas/minúsculas</strong> em <code>Main</code> — o programa compila mas não roda, porque o .NET não acha o ponto de entrada.</li>
        <li><strong>Esquecer de fechar uma chave</strong> <code>{`}`}</code> — gera uma cascata de erros confusos. Use a indentação para se orientar.</li>
        <li><strong>Salvar o arquivo com extensão errada</strong> (<code>.txt</code> em vez de <code>.cs</code>) — o compilador ignora arquivos sem <code>.cs</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>using</code> importa namespaces para evitar repetição.</li>
        <li><code>namespace</code> organiza código em pastas lógicas.</li>
        <li>Toda instrução executável de C# vive dentro de uma <code>class</code>.</li>
        <li><code>Main</code> é o ponto de entrada do programa — nome obrigatório.</li>
        <li><code>Console.WriteLine</code> imprime no terminal.</li>
        <li>C# é case-sensitive, e instruções terminam com <code>;</code>.</li>
      </ul>
    </PageContainer>
  );
}
