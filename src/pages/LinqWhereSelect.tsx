import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LinqWhereSelect() {
  return (
    <PageContainer
      title={"Where, Select e companhia"}
      subtitle={"Os filtros e projeções básicas que aparecem em quase toda query."}
      difficulty={"intermediario"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`var produtos = new[] {
    new { Nome = "Café",  Preco = 25m, Estoque = 100 },
    new { Nome = "Chá",   Preco = 18m, Estoque = 0   },
    new { Nome = "Pão",   Preco = 8m,  Estoque = 50  },
};

// filtrar
var disponiveis = produtos.Where(p => p.Estoque > 0);

// projetar
var nomes = produtos.Select(p => p.Nome);
var resumo = produtos.Select(p => new { p.Nome, Total = p.Preco * p.Estoque });

// índice na seleção
var indexados = produtos.Select((p, i) => $"{i}: {p.Nome}");

// SelectMany — flatten
string[] palavras = { "ola mundo", "linq aqui" };
var todas = palavras.SelectMany(s => s.Split(' '));`}
      />
    </PageContainer>
  );
}
