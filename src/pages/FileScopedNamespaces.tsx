import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FileScopedNamespaces() {
  return (
    <PageContainer
      title="File-scoped namespaces: menos indentação, mais clareza"
      subtitle="A sintaxe enxuta de namespace introduzida no C# 10 que economiza um nível de indentação em todos os seus arquivos."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <p>
        Antes do C# 10, todo arquivo C# tinha um "imposto de indentação": o conteúdo da classe ficava recuado <strong>duas vezes</strong> — uma pelo namespace, outra pela classe. Em arquivos grandes, isso desperdiçava largura visual e empurrava o código para a direita. O C# 10 introduziu os <strong>file-scoped namespaces</strong>, uma forma muito mais elegante de declarar o namespace do arquivo. Pense neles como uma "etiqueta" colada na primeira página do documento, em vez de um envelope embrulhando tudo.
      </p>

      <h2>O problema: namespaces tradicionais com chaves</h2>
      <p>
        Antes, você precisava abrir um bloco com <code>{`{`}</code> depois do nome do namespace e fechar com <code>{`}`}</code> no fim do arquivo. Tudo o que estivesse dentro pertencia àquele namespace. Mas, como classes também usam chaves, seu código real começava com pelo menos <strong>8 espaços</strong> de indentação.
      </p>
      <pre><code>{`// Estilo antigo (C# 1.0 até hoje, ainda válido)
using System;

namespace MinhaEmpresa.MeuApp
{
    public class Pessoa
    {
        public string Nome { get; set; } = "";

        public void Saudar()
        {
            // 12 espaços de indentação até aqui!
            Console.WriteLine($"Olá, {Nome}");
        }
    }
}`}</code></pre>
      <p>
        Note como o <code>Console.WriteLine</code> está bem distante da margem esquerda. Em monitores estreitos ou comparações lado a lado (diff), isso atrapalha a leitura.
      </p>

      <h2>A solução: file-scoped namespace (C# 10)</h2>
      <p>
        A nova sintaxe é simples: troque as chaves por um <strong>ponto-e-vírgula</strong> e remova um nível de indentação de todo o resto do arquivo. O namespace passa a valer "do ponto onde foi declarado até o fim do arquivo" — daí o nome <em>file-scoped</em> (escopo de arquivo).
      </p>
      <pre><code>{`// Estilo moderno (C# 10+)
using System;

namespace MinhaEmpresa.MeuApp;

public class Pessoa
{
    public string Nome { get; set; } = "";

    public void Saudar()
    {
        // Agora só 8 espaços
        Console.WriteLine($"Olá, {Nome}");
    }
}`}</code></pre>
      <p>
        Semanticamente, os dois exemplos produzem <strong>exatamente o mesmo IL</strong> (Intermediate Language — a linguagem intermediária para a qual o C# é compilado). Não há diferença em performance, debug ou compatibilidade binária. É puro açúcar sintático visual.
      </p>

      <AlertBox type="info" title="Compilador, IL e binário">
        Quando você compila C#, o resultado é um arquivo <code>.dll</code> contendo IL. Tanto a forma com chaves quanto a com <code>;</code> geram IL idêntico — porque o conceito de "namespace" é metadata aplicada a cada tipo, não algo executável.
      </AlertBox>

      <h2>Regra de ouro: um namespace por arquivo</h2>
      <p>
        File-scoped namespaces impõem uma restrição sensata: você só pode ter <strong>um único</strong> namespace por arquivo, e ele precisa ser declarado <em>antes</em> de qualquer tipo. Se você precisar de dois namespaces no mesmo arquivo (raríssimo e geralmente um cheiro de código), terá que voltar à sintaxe com chaves.
      </p>
      <pre><code>{`// ERRADO: não pode misturar
namespace A;

public class X { }

namespace B;          // erro CS8954
public class Y { }`}</code></pre>
      <p>
        Na prática, <strong>essa restrição é uma boa coisa</strong>: o padrão "um arquivo = um tipo público = um namespace" facilita navegação, refatoração e leitura. Se você sente vontade de declarar dois namespaces, provavelmente quer dois arquivos.
      </p>

      <h2>Migrando do estilo antigo para o novo</h2>
      <p>
        Migrar é mecânico: o IDE faz por você. No Visual Studio ou Rider, a quick fix "Convert to file-scoped namespace" aparece no <code>Ctrl+.</code>. Para projetos inteiros, configure no <code>.editorconfig</code> e rode <code>dotnet format</code>:
      </p>
      <pre><code>{`# .editorconfig na raiz do repo
[*.cs]
csharp_style_namespace_declarations = file_scoped:warning`}</code></pre>
      <p>
        Depois rode no terminal:
      </p>
      <pre><code>{`dotnet format style --severity info`}</code></pre>
      <p>
        Isso percorre todos os arquivos <code>.cs</code> e converte para a forma nova, respeitando seu estilo de chaves e espaços.
      </p>

      <AlertBox type="warning" title="Suporte mínimo">
        File-scoped namespaces precisam do compilador C# 10 ou mais novo. Funcionam em qualquer TFM (target framework) suportado por esse compilador, então mesmo projetos <code>net6.0</code> ou anteriores podem usá-los desde que tenham <code>&lt;LangVersion&gt;10&lt;/LangVersion&gt;</code> ou superior no <code>.csproj</code>.
      </AlertBox>

      <h2>Quando NÃO usar</h2>
      <p>
        Há raríssimos casos onde o estilo com chaves é necessário ou útil:
      </p>
      <ul>
        <li><strong>Arquivos com namespaces aninhados intencionais</strong> (<code>namespace Outer.Inner</code> declarado de dois jeitos para fins de documentação ou geração de código).</li>
        <li><strong>Gerador de código</strong> (source generators) cuspindo múltiplos namespaces em um único arquivo gerado.</li>
        <li><strong>Projetos legados com guidelines de estilo</strong> que exigem o formato antigo — siga o estilo do time, não brigue.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>;</code>:</strong> escrever <code>namespace X</code> sem ponto-e-vírgula nem chaves dá erro de sintaxe imediato.</li>
        <li><strong>Misturar com chaves no mesmo arquivo:</strong> não compila. Escolha um estilo só.</li>
        <li><strong>Declarar tipos antes do namespace:</strong> a declaração de namespace tem que vir <em>antes</em> de qualquer <code>class</code>, <code>struct</code> ou similar (depois dos <code>using</code>).</li>
        <li><strong>Indentação não atualizada:</strong> ao migrar, lembre-se de remover o nível extra de espaços em cada classe — alguns IDEs fazem isso automaticamente, outros não.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>File-scoped namespace usa <code>namespace X;</code> em vez de <code>namespace X {`{ ... }`}</code>.</li>
        <li>Disponível desde C# 10 (2021), gera IL idêntico à forma antiga.</li>
        <li>Economiza um nível de indentação em todo o arquivo.</li>
        <li>Restrito a <strong>um namespace por arquivo</strong> — uma boa convenção, não uma limitação.</li>
        <li>Migre projetos antigos com <code>.editorconfig</code> + <code>dotnet format</code>.</li>
      </ul>
    </PageContainer>
  );
}
