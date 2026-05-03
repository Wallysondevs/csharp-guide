import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ExpressionTrees() {
  return (
    <PageContainer
      title="Expression trees: código como dado"
      subtitle="O que parece uma lambda comum pode, em segredo, virar uma árvore que descreve o próprio código — e ser traduzida para SQL, JavaScript ou qualquer outra linguagem."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Quando você escreve <code>x =&gt; x.Idade &gt; 18</code> em C#, normalmente isso vira um <strong>delegate</strong> — uma função executável. Mas existe uma forma especial em que essa mesma sintaxe vira uma <strong>árvore de objetos</strong> que descreve a estrutura do código sem executá-lo. Pense numa receita de bolo: você pode <em>fazer</em> o bolo (executar) ou <em>fotografar</em> a receita e mandá-la a outra cozinha que talvez nem use forno. Essa "fotografia da lógica" é a <strong>expression tree</strong>, e ela é o que faz o Entity Framework transformar LINQ em SQL.
      </p>

      <h2>Func vs Expression: a diferença sutil</h2>
      <p>
        A mesma lambda compila como uma coisa ou outra dependendo do tipo declarado:
      </p>
      <pre><code>{`using System.Linq.Expressions;

// Versão 1 — delegate executável
Func<int, bool> maiorDeIdade = idade => idade >= 18;
Console.WriteLine(maiorDeIdade(20));   // True

// Versão 2 — árvore de expressão (não executa, descreve)
Expression<Func<int, bool>> arvore = idade => idade >= 18;
Console.WriteLine(arvore);             // idade => (idade >= 18)
Console.WriteLine(arvore.Body);        // (idade >= 18)
Console.WriteLine(arvore.Body.NodeType); // GreaterThanOrEqual`}</code></pre>
      <p>
        O compilador olha para o lado esquerdo: se for <code>Func&lt;...&gt;</code>, gera código executável; se for <code>Expression&lt;Func&lt;...&gt;&gt;</code>, gera código que <em>constrói</em> uma árvore. A sintaxe é idêntica; o significado é radicalmente diferente.
      </p>

      <h2>A anatomia de uma árvore</h2>
      <p>
        Toda árvore é composta de nós (<code>Expression</code>), cada um com um <code>NodeType</code> que descreve sua natureza. Para a expressão <code>idade =&gt; idade &gt;= 18</code>, a árvore tem:
      </p>
      <pre><code>{`LambdaExpression
├── Parameters: [ParameterExpression "idade" : int]
└── Body: BinaryExpression (NodeType = GreaterThanOrEqual)
         ├── Left:  ParameterExpression "idade"
         └── Right: ConstantExpression 18`}</code></pre>
      <p>
        Cada parte é um <em>objeto</em> em memória que você pode inspecionar, modificar ou traduzir. É essa estrutura que o EF Core percorre para gerar <code>WHERE idade &gt;= 18</code> em SQL.
      </p>

      <h2>Construindo uma árvore manualmente</h2>
      <p>
        Você não precisa do compilador. A classe estática <code>Expression</code> tem fábricas para todos os nós:
      </p>
      <pre><code>{`// Construir manualmente: idade => idade >= 18
ParameterExpression idadeParam = Expression.Parameter(typeof(int), "idade");
ConstantExpression dezoito = Expression.Constant(18);
BinaryExpression corpo = Expression.GreaterThanOrEqual(idadeParam, dezoito);

Expression<Func<int, bool>> arvore =
    Expression.Lambda<Func<int, bool>>(corpo, idadeParam);

// Compilar (vira um delegate executável)
Func<int, bool> fn = arvore.Compile();
Console.WriteLine(fn(25));   // True
Console.WriteLine(fn(10));   // False`}</code></pre>
      <p>
        Quando útil? Em motores de regras configuráveis: o usuário cria filtros pela UI ("idade &gt; 18 AND cidade = 'SP'"), você monta a árvore e a compila num delegate cacheado. Performance de código nativo, flexibilidade de configuração.
      </p>

      <AlertBox type="info" title="Compile uma vez, use sempre">
        <code>Compile()</code> faz <strong>JIT</strong> — gera IL e a compila para código nativo. Não é barato (~ms). Sempre cacheie o delegate compilado em um <code>Dictionary</code> para reuso.
      </AlertBox>

      <h2>Como o EF Core traduz LINQ em SQL</h2>
      <p>
        Quando você escreve uma query no EF Core, está, sem perceber, criando expression trees:
      </p>
      <pre><code>{`var maioresDeIdade = await db.Usuarios
    .Where(u => u.Idade >= 18 && u.Ativo)
    .Select(u => new { u.Nome, u.Email })
    .ToListAsync();`}</code></pre>
      <p>
        O <code>Where</code> em <code>IQueryable&lt;T&gt;</code> recebe <code>Expression&lt;Func&lt;T, bool&gt;&gt;</code>, não <code>Func&lt;T, bool&gt;</code>. O EF então percorre essa árvore com um <em>visitor</em> e a transforma em:
      </p>
      <pre><code>{`SELECT u.Nome, u.Email
FROM Usuarios u
WHERE u.Idade >= 18 AND u.Ativo = 1`}</code></pre>
      <p>
        Se a expressão tivesse um método que o EF não soubesse traduzir (ex: <code>u =&gt; MeuMetodoCustom(u.Nome)</code>), ele jogaria <code>InvalidOperationException</code> — não há SQL equivalente para o seu método. Esse é o famoso erro "could not be translated".
      </p>

      <h2>ExpressionVisitor: navegando árvores</h2>
      <p>
        Para trabalhar com árvores complexas, use a classe abstrata <code>ExpressionVisitor</code>: você sobrescreve apenas os métodos para os tipos de nó que te interessam. Exemplo: substituir todas as constantes inteiras por seu dobro:
      </p>
      <pre><code>{`public class DobraConstantes : ExpressionVisitor
{
    protected override Expression VisitConstant(ConstantExpression node)
    {
        if (node.Value is int n)
            return Expression.Constant(n * 2);
        return base.VisitConstant(node);
    }
}

Expression<Func<int, bool>> original = x => x > 10;
var dobrada = (Expression<Func<int, bool>>)
    new DobraConstantes().Visit(original);

Console.WriteLine(dobrada);          // x => (x > 20)
Console.WriteLine(dobrada.Compile()(15));  // False (15 não é > 20)`}</code></pre>
      <p>
        É exatamente assim que o EF Core, AutoMapper e bibliotecas de specifications operam: percorrendo, transformando e recompondo árvores.
      </p>

      <h2>Caso prático: filtros dinâmicos compostos</h2>
      <p>
        Imagine uma tela de busca com 10 filtros opcionais. Em vez de escrever <code>if</code> aninhados, você compõe uma árvore conforme o usuário preenche:
      </p>
      <pre><code>{`public static Expression<Func<Produto, bool>> Combinar(
    Expression<Func<Produto, bool>> a,
    Expression<Func<Produto, bool>> b)
{
    var param = Expression.Parameter(typeof(Produto), "p");
    var corpoA = new SubstituirParam(a.Parameters[0], param).Visit(a.Body);
    var corpoB = new SubstituirParam(b.Parameters[0], param).Visit(b.Body);
    var and = Expression.AndAlso(corpoA!, corpoB!);
    return Expression.Lambda<Func<Produto, bool>>(and, param);
}

class SubstituirParam(ParameterExpression de, ParameterExpression para)
    : ExpressionVisitor
{
    protected override Expression VisitParameter(ParameterExpression node)
        => node == de ? para : base.VisitParameter(node);
}

// uso:
Expression<Func<Produto, bool>> filtro = p => p.Ativo;
if (precoMin is decimal min)
    filtro = Combinar(filtro, p => p.Preco >= min);
if (categoria is string cat)
    filtro = Combinar(filtro, p => p.Categoria == cat);

var resultado = await db.Produtos.Where(filtro).ToListAsync();`}</code></pre>
      <p>
        O EF Core recebe <em>uma única expressão</em> bem formada e gera o WHERE adequado, sem você concatenar strings de SQL (e sem riscos de injeção).
      </p>

      <AlertBox type="warning" title="Limitações importantes">
        Expression trees em C# só suportam <strong>expressões</strong>, não <em>statements</em>. Lambdas com chaves <code>{`{ ... }`}</code>, <code>if</code>/<code>for</code> tradicionais, <code>async</code>, etc, não podem ser convertidos em <code>Expression&lt;...&gt;</code>. Para isso existe <code>Expression.Block</code>, mas a coisa fica verbosa.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>Func</code> com <code>Expression&lt;Func&gt;</code>:</strong> só o segundo permite tradução — passar <code>Func</code> para um <code>IQueryable.Where</code> faz LINQ-to-Objects, trazendo TODOS os dados para a memória.</li>
        <li><strong>Chamar <code>Compile()</code> dentro de loop quente:</strong> JIT custa caro. Cache o delegate.</li>
        <li><strong>Usar métodos que o provider não traduz:</strong> EF não conhece <code>MinhaFuncaoCustom</code>. Saia da árvore e pré-compute, ou marque como <code>AsEnumerable()</code> antes.</li>
        <li><strong>Tentar lambdas com bloco em <code>Expression&lt;...&gt;</code>:</strong> não compila. Limite-se a expressões.</li>
        <li><strong>Modificar nós existentes:</strong> são imutáveis. Você sempre <em>cria</em> novos nós com <code>Expression.X(...)</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Func&lt;T,R&gt;</code> = código executável; <code>Expression&lt;Func&lt;T,R&gt;&gt;</code> = árvore que descreve o código.</li>
        <li>Cada nó é um objeto (<code>BinaryExpression</code>, <code>ConstantExpression</code> etc.) com um <code>NodeType</code>.</li>
        <li>Pode ser construída manualmente com fábricas <code>Expression.X(...)</code>.</li>
        <li><code>Compile()</code> faz JIT e devolve um delegate nativo — cacheie.</li>
        <li>EF Core, LINQ-to-SQL e similares percorrem a árvore para gerar SQL.</li>
        <li><code>ExpressionVisitor</code> é a forma idiomática de transformar árvores.</li>
        <li>Limitação: só expressões, não statements (sem <code>if</code>, <code>for</code>, <code>async</code>).</li>
      </ul>
    </PageContainer>
  );
}
