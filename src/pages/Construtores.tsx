import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Construtores() {
  return (
    <PageContainer
      title={"Construtores"}
      subtitle={"Construtor padrão, parametrizado, this(), base(), inicializadores e expressão de objeto."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="csharp"
        code={`public class Produto
{
    public string Nome { get; }
    public decimal Preco { get; }
    public int Estoque { get; set; }

    public Produto(string nome, decimal preco)
    {
        Nome = nome;
        Preco = preco;
    }

    // sobrecarga chamando outro construtor
    public Produto(string nome, decimal preco, int estoque)
        : this(nome, preco)
    {
        Estoque = estoque;
    }
}

// inicializador de objeto
var p = new Produto("Café", 25m) { Estoque = 100 };

// target-typed new (C# 9)
Produto outro = new("Chá", 18m);`}
      />

      <h2>Construtor estático</h2>

      <CodeBlock
        language="csharp"
        code={`public class Config
{
    public static readonly string Versao;
    static Config() { Versao = "1.0.0"; }
}`}
      />

      <p>Roda uma única vez, antes do primeiro uso. Útil pra inicializar campos estáticos complexos.</p>
    </PageContainer>
  );
}
