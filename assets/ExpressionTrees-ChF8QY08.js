import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(r,{title:"Expression trees: código como dado",subtitle:"O que parece uma lambda comum pode, em segredo, virar uma árvore que descreve o próprio código — e ser traduzida para SQL, JavaScript ou qualquer outra linguagem.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs("p",{children:["Quando você escreve ",e.jsx("code",{children:"x => x.Idade > 18"})," em C#, normalmente isso vira um ",e.jsx("strong",{children:"delegate"})," — uma função executável. Mas existe uma forma especial em que essa mesma sintaxe vira uma ",e.jsx("strong",{children:"árvore de objetos"})," que descreve a estrutura do código sem executá-lo. Pense numa receita de bolo: você pode ",e.jsx("em",{children:"fazer"})," o bolo (executar) ou ",e.jsx("em",{children:"fotografar"}),' a receita e mandá-la a outra cozinha que talvez nem use forno. Essa "fotografia da lógica" é a ',e.jsx("strong",{children:"expression tree"}),", e ela é o que faz o Entity Framework transformar LINQ em SQL."]}),e.jsx("h2",{children:"Func vs Expression: a diferença sutil"}),e.jsx("p",{children:"A mesma lambda compila como uma coisa ou outra dependendo do tipo declarado:"}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Linq.Expressions;

// Versão 1 — delegate executável
Func<int, bool> maiorDeIdade = idade => idade >= 18;
Console.WriteLine(maiorDeIdade(20));   // True

// Versão 2 — árvore de expressão (não executa, descreve)
Expression<Func<int, bool>> arvore = idade => idade >= 18;
Console.WriteLine(arvore);             // idade => (idade >= 18)
Console.WriteLine(arvore.Body);        // (idade >= 18)
Console.WriteLine(arvore.Body.NodeType); // GreaterThanOrEqual`})}),e.jsxs("p",{children:["O compilador olha para o lado esquerdo: se for ",e.jsx("code",{children:"Func<...>"}),", gera código executável; se for ",e.jsx("code",{children:"Expression<Func<...>>"}),", gera código que ",e.jsx("em",{children:"constrói"})," uma árvore. A sintaxe é idêntica; o significado é radicalmente diferente."]}),e.jsx("h2",{children:"A anatomia de uma árvore"}),e.jsxs("p",{children:["Toda árvore é composta de nós (",e.jsx("code",{children:"Expression"}),"), cada um com um ",e.jsx("code",{children:"NodeType"})," que descreve sua natureza. Para a expressão ",e.jsx("code",{children:"idade => idade >= 18"}),", a árvore tem:"]}),e.jsx("pre",{children:e.jsx("code",{children:`LambdaExpression
├── Parameters: [ParameterExpression "idade" : int]
└── Body: BinaryExpression (NodeType = GreaterThanOrEqual)
         ├── Left:  ParameterExpression "idade"
         └── Right: ConstantExpression 18`})}),e.jsxs("p",{children:["Cada parte é um ",e.jsx("em",{children:"objeto"})," em memória que você pode inspecionar, modificar ou traduzir. É essa estrutura que o EF Core percorre para gerar ",e.jsx("code",{children:"WHERE idade >= 18"})," em SQL."]}),e.jsx("h2",{children:"Construindo uma árvore manualmente"}),e.jsxs("p",{children:["Você não precisa do compilador. A classe estática ",e.jsx("code",{children:"Expression"})," tem fábricas para todos os nós:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Construir manualmente: idade => idade >= 18
ParameterExpression idadeParam = Expression.Parameter(typeof(int), "idade");
ConstantExpression dezoito = Expression.Constant(18);
BinaryExpression corpo = Expression.GreaterThanOrEqual(idadeParam, dezoito);

Expression<Func<int, bool>> arvore =
    Expression.Lambda<Func<int, bool>>(corpo, idadeParam);

// Compilar (vira um delegate executável)
Func<int, bool> fn = arvore.Compile();
Console.WriteLine(fn(25));   // True
Console.WriteLine(fn(10));   // False`})}),e.jsx("p",{children:`Quando útil? Em motores de regras configuráveis: o usuário cria filtros pela UI ("idade > 18 AND cidade = 'SP'"), você monta a árvore e a compila num delegate cacheado. Performance de código nativo, flexibilidade de configuração.`}),e.jsxs(o,{type:"info",title:"Compile uma vez, use sempre",children:[e.jsx("code",{children:"Compile()"})," faz ",e.jsx("strong",{children:"JIT"})," — gera IL e a compila para código nativo. Não é barato (~ms). Sempre cacheie o delegate compilado em um ",e.jsx("code",{children:"Dictionary"})," para reuso."]}),e.jsx("h2",{children:"Como o EF Core traduz LINQ em SQL"}),e.jsx("p",{children:"Quando você escreve uma query no EF Core, está, sem perceber, criando expression trees:"}),e.jsx("pre",{children:e.jsx("code",{children:`var maioresDeIdade = await db.Usuarios
    .Where(u => u.Idade >= 18 && u.Ativo)
    .Select(u => new { u.Nome, u.Email })
    .ToListAsync();`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"Where"})," em ",e.jsx("code",{children:"IQueryable<T>"})," recebe ",e.jsx("code",{children:"Expression<Func<T, bool>>"}),", não ",e.jsx("code",{children:"Func<T, bool>"}),". O EF então percorre essa árvore com um ",e.jsx("em",{children:"visitor"})," e a transforma em:"]}),e.jsx("pre",{children:e.jsx("code",{children:`SELECT u.Nome, u.Email
FROM Usuarios u
WHERE u.Idade >= 18 AND u.Ativo = 1`})}),e.jsxs("p",{children:["Se a expressão tivesse um método que o EF não soubesse traduzir (ex: ",e.jsx("code",{children:"u => MeuMetodoCustom(u.Nome)"}),"), ele jogaria ",e.jsx("code",{children:"InvalidOperationException"}),' — não há SQL equivalente para o seu método. Esse é o famoso erro "could not be translated".']}),e.jsx("h2",{children:"ExpressionVisitor: navegando árvores"}),e.jsxs("p",{children:["Para trabalhar com árvores complexas, use a classe abstrata ",e.jsx("code",{children:"ExpressionVisitor"}),": você sobrescreve apenas os métodos para os tipos de nó que te interessam. Exemplo: substituir todas as constantes inteiras por seu dobro:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class DobraConstantes : ExpressionVisitor
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
Console.WriteLine(dobrada.Compile()(15));  // False (15 não é > 20)`})}),e.jsx("p",{children:"É exatamente assim que o EF Core, AutoMapper e bibliotecas de specifications operam: percorrendo, transformando e recompondo árvores."}),e.jsx("h2",{children:"Caso prático: filtros dinâmicos compostos"}),e.jsxs("p",{children:["Imagine uma tela de busca com 10 filtros opcionais. Em vez de escrever ",e.jsx("code",{children:"if"})," aninhados, você compõe uma árvore conforme o usuário preenche:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static Expression<Func<Produto, bool>> Combinar(
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

var resultado = await db.Produtos.Where(filtro).ToListAsync();`})}),e.jsxs("p",{children:["O EF Core recebe ",e.jsx("em",{children:"uma única expressão"})," bem formada e gera o WHERE adequado, sem você concatenar strings de SQL (e sem riscos de injeção)."]}),e.jsxs(o,{type:"warning",title:"Limitações importantes",children:["Expression trees em C# só suportam ",e.jsx("strong",{children:"expressões"}),", não ",e.jsx("em",{children:"statements"}),". Lambdas com chaves ",e.jsx("code",{children:"{ ... }"}),", ",e.jsx("code",{children:"if"}),"/",e.jsx("code",{children:"for"})," tradicionais, ",e.jsx("code",{children:"async"}),", etc, não podem ser convertidos em ",e.jsx("code",{children:"Expression<...>"}),". Para isso existe ",e.jsx("code",{children:"Expression.Block"}),", mas a coisa fica verbosa."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"Func"})," com ",e.jsx("code",{children:"Expression<Func>"}),":"]})," só o segundo permite tradução — passar ",e.jsx("code",{children:"Func"})," para um ",e.jsx("code",{children:"IQueryable.Where"})," faz LINQ-to-Objects, trazendo TODOS os dados para a memória."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Chamar ",e.jsx("code",{children:"Compile()"})," dentro de loop quente:"]})," JIT custa caro. Cache o delegate."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar métodos que o provider não traduz:"})," EF não conhece ",e.jsx("code",{children:"MinhaFuncaoCustom"}),". Saia da árvore e pré-compute, ou marque como ",e.jsx("code",{children:"AsEnumerable()"})," antes."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar lambdas com bloco em ",e.jsx("code",{children:"Expression<...>"}),":"]})," não compila. Limite-se a expressões."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar nós existentes:"})," são imutáveis. Você sempre ",e.jsx("em",{children:"cria"})," novos nós com ",e.jsx("code",{children:"Expression.X(...)"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Func<T,R>"})," = código executável; ",e.jsx("code",{children:"Expression<Func<T,R>>"})," = árvore que descreve o código."]}),e.jsxs("li",{children:["Cada nó é um objeto (",e.jsx("code",{children:"BinaryExpression"}),", ",e.jsx("code",{children:"ConstantExpression"})," etc.) com um ",e.jsx("code",{children:"NodeType"}),"."]}),e.jsxs("li",{children:["Pode ser construída manualmente com fábricas ",e.jsx("code",{children:"Expression.X(...)"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Compile()"})," faz JIT e devolve um delegate nativo — cacheie."]}),e.jsx("li",{children:"EF Core, LINQ-to-SQL e similares percorrem a árvore para gerar SQL."}),e.jsxs("li",{children:[e.jsx("code",{children:"ExpressionVisitor"})," é a forma idiomática de transformar árvores."]}),e.jsxs("li",{children:["Limitação: só expressões, não statements (sem ",e.jsx("code",{children:"if"}),", ",e.jsx("code",{children:"for"}),", ",e.jsx("code",{children:"async"}),")."]})]})]})}export{a as default};
