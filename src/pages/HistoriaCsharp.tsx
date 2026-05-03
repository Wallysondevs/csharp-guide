import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HistoriaCsharp() {
  return (
    <PageContainer
      title="A História do C# e do .NET"
      subtitle="De uma resposta da Microsoft ao Java em 2000 à plataforma multiplataforma e open source que é hoje."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Para entender por que o C# tem o jeito que tem, é útil voltar no tempo. Toda linguagem de programação carrega cicatrizes e medalhas das batalhas que travou. O C# nasceu por volta de 1999, dentro da Microsoft, num momento em que a empresa precisava urgentemente de uma resposta moderna ao <strong>Java</strong>, que estava dominando o mercado corporativo. Pense em uma grande montadora vendo a concorrente lançar um carro elétrico revolucionário e correndo para fazer o seu — só que mais rápido, mais bonito e mais integrado ao ecossistema dela. Foi mais ou menos esse o cenário.
      </p>

      <h2>Por que a Microsoft criou o C#?</h2>
      <p>
        No fim dos anos 90, a Microsoft tentou abraçar o Java criando uma versão própria chamada <strong>J++</strong>. O problema é que ela adicionou extensões proprietárias para integrar com o Windows, e a Sun Microsystems (dona do Java) processou e venceu. A Microsoft ficou sem poder evoluir o J++. A solução foi audaciosa: criar uma <em>linguagem nova</em>, livre de amarras legais, mas com a mesma proposta — orientada a objetos, com gerenciamento automático de memória, segura e portável dentro do mundo Windows.
      </p>
      <p>
        O projeto se chamou inicialmente <strong>"Cool"</strong> (C-like Object Oriented Language). Quando virou produto, ganhou o nome <code>C#</code> — o "#" vem da notação musical (sustenido = nota meio tom acima), sugerindo que era "C++ elevado". A liderança técnica foi entregue a <strong>Anders Hejlsberg</strong>, o mesmo dinamarquês que havia criado o lendário <strong>Turbo Pascal</strong> e o <strong>Delphi</strong> na Borland. Não é coincidência que C# tenha herdado várias ideias elegantes do Delphi, como propriedades, eventos e atributos.
      </p>
      <pre><code>{`// C# 1.0 (2002): clássico, verboso, herdado do Java
using System;
class Programa {
    static void Main(string[] args) {
        Console.WriteLine("Olá, mundo!");
    }
}`}</code></pre>

      <AlertBox type="info" title="Curiosidade sobre o nome">
        Em fontes que não suportam o caractere musical "♯", a Microsoft adotou o caractere <code>#</code> do teclado. Tecnicamente, o nome correto se lê "C-sharp" (lê-se "ci-charp"), nunca "C-cerquilha".
      </AlertBox>

      <h2>O .NET Framework: a primeira encarnação (2002)</h2>
      <p>
        C# nunca foi pensado para rodar sozinho. Ele veio embutido em um pacote maior chamado <strong>.NET Framework 1.0</strong>, lançado em fevereiro de 2002. O .NET Framework é a <em>plataforma</em> que executa o código — fornece o coletor de lixo (que libera memória automaticamente), as bibliotecas básicas (textos, datas, arquivos, rede) e o runtime que transforma o código em algo que o processador entende. Pense no C# como o motor e no .NET como o chassi, suspensão e rodas: nenhum dos dois funciona sem o outro.
      </p>
      <p>
        O .NET Framework, porém, tinha um problema sério: <strong>só rodava em Windows</strong>. Por anos, isso foi um limitador enorme. Empresas que queriam C# em servidores Linux ficavam de fora — a menos que usassem o <strong>Mono</strong>, uma reimplementação livre criada por Miguel de Icaza em 2004.
      </p>

      <h2>Evolução versão a versão</h2>
      <p>
        Cada nova versão do C# trouxe ideias que mudaram o jeito de programar. A tabela abaixo resume os marcos. Não decore — apenas saiba que features modernas como <code>async/await</code>, <code>records</code> e <code>top-level statements</code> não existem no C# 1.0.
      </p>
      <table>
        <thead>
          <tr><th>Versão</th><th>Ano</th><th>Destaques</th></tr>
        </thead>
        <tbody>
          <tr><td>C# 1.0</td><td>2002</td><td>Lançamento. Sintaxe básica.</td></tr>
          <tr><td>C# 2.0</td><td>2005</td><td>Generics, métodos anônimos, nullable types.</td></tr>
          <tr><td>C# 3.0</td><td>2007</td><td>LINQ, var, lambdas, propriedades automáticas.</td></tr>
          <tr><td>C# 4.0</td><td>2010</td><td>dynamic, parâmetros nomeados.</td></tr>
          <tr><td>C# 5.0</td><td>2012</td><td><code>async</code>/<code>await</code>.</td></tr>
          <tr><td>C# 6.0</td><td>2015</td><td>Interpolação de strings, expression-bodied members.</td></tr>
          <tr><td>C# 7</td><td>2017</td><td>Tuplas, pattern matching, locals por ref.</td></tr>
          <tr><td>C# 8</td><td>2019</td><td>Nullable reference types, async streams.</td></tr>
          <tr><td>C# 9</td><td>2020</td><td>Records, top-level statements.</td></tr>
          <tr><td>C# 10</td><td>2021</td><td>File-scoped namespaces, global using.</td></tr>
          <tr><td>C# 11</td><td>2022</td><td>Raw strings, required members, generic math.</td></tr>
          <tr><td>C# 12</td><td>2023</td><td>Primary constructors, collection expressions.</td></tr>
          <tr><td>C# 13</td><td>2024</td><td><code>params</code> em coleções, <code>field</code> keyword.</td></tr>
        </tbody>
      </table>

      <h2>A virada: .NET Core e o open source (2016)</h2>
      <p>
        Em 2014 a Microsoft anunciou algo impensável uma década antes: estava abrindo o código-fonte do .NET. Em 2016 nasceu o <strong>.NET Core 1.0</strong>, uma reescrita modular, multiplataforma (Windows, Linux, macOS) e de licença MIT. Era praticamente uma nova plataforma rodando ao lado do velho .NET Framework. Pela primeira vez, um desenvolvedor podia criar um app C# em um Mac, rodá-lo em um servidor Linux e nunca tocar em uma máquina Windows.
      </p>
      <pre><code>{`# Em 2016, isto era novidade absoluta:
$ dotnet new console -n MeuApp
$ cd MeuApp
$ dotnet run
# Funcionava em Linux, macOS e Windows.`}</code></pre>

      <h2>.NET 5 e a unificação (2020)</h2>
      <p>
        Por anos, conviveram dois mundos paralelos: o <em>.NET Framework</em> (Windows-only, legado) e o <em>.NET Core</em> (multiplataforma, moderno). Confundia todo mundo. Em novembro de 2020, a Microsoft lançou o <strong>.NET 5</strong> — note que pulou o "Core" e o número 4, justamente para deixar claro: <em>existe apenas um .NET agora</em>. A partir daí, uma versão nova sai todo mês de novembro:
      </p>
      <ul>
        <li><strong>.NET 6 (LTS, 2021)</strong>: estabilidade de longo prazo, top-level statements maduros.</li>
        <li><strong>.NET 7 (2022)</strong>: performance, generic math.</li>
        <li><strong>.NET 8 (LTS, 2023)</strong>: Native AOT, melhorias enormes em performance.</li>
        <li><strong>.NET 9 (2024)</strong>: refinamentos e novas APIs.</li>
      </ul>
      <p>
        Versões marcadas como <strong>LTS</strong> (Long-Term Support) recebem atualizações de segurança por 3 anos. As "STS" (Standard-Term Support) por apenas 18 meses. Para projetos sérios, sempre prefira LTS.
      </p>

      <AlertBox type="warning" title=".NET Framework ainda existe">
        O <strong>.NET Framework 4.8</strong> continua sendo mantido (apenas correções de bug) e roda em milhões de máquinas Windows. Mas <em>não recebe novas features</em> e não deve ser usado para projetos novos. Se você herdar um sistema legado em .NET Framework, considere migrar para .NET 8+ quando possível.
      </AlertBox>

      <h2>Por que isso importa para você?</h2>
      <p>
        Saber a história ajuda você a entender por que existem termos como "Core", por que tutoriais antigos têm <code>class Program</code> com <code>Main</code> e tutoriais novos não, e por que o ecossistema NuGet (gerenciador de pacotes) tem bibliotecas marcadas como "compatíveis com .NET Standard 2.0" — é vocabulário herdado dessa transição.
      </p>

      <h2>Erros comuns de quem está começando</h2>
      <ul>
        <li><strong>Confundir .NET Framework com .NET moderno:</strong> ao buscar tutoriais, prefira material posterior a 2021. Tudo antes pode estar desatualizado.</li>
        <li><strong>Achar que C# só roda em Windows:</strong> isso é verdade desde 2016. C# moderno é multiplataforma.</li>
        <li><strong>Misturar versões da linguagem com versões da plataforma:</strong> C# 12 ≠ .NET 8, embora andem juntos. C# é a sintaxe, .NET é a plataforma.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>C# foi criado por Anders Hejlsberg na Microsoft, lançado em 2002 com o .NET Framework 1.0.</li>
        <li>Inspirações: Java (sintaxe), Delphi (propriedades, eventos), C++ (semântica).</li>
        <li>Em 2016 surgiu o .NET Core, multiplataforma e open source.</li>
        <li>Em 2020 o .NET 5 unificou as plataformas — hoje é só ".NET".</li>
        <li>Versões novas saem a cada novembro; pares são LTS (3 anos de suporte).</li>
        <li>C# 13 / .NET 9 é a versão mais recente em 2024.</li>
      </ul>
    </PageContainer>
  );
}
