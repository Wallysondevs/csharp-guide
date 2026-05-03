import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InitOnlyRequired() {
  return (
    <PageContainer
      title="Modificadores init e required: imutabilidade moderna"
      subtitle="Aprenda como o C# 9 e 11 trouxeram uma maneira mais elegante de garantir objetos completos e imutáveis sem construtores gigantes."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Antes do C# 9, se você quisesse criar um objeto imutável (que não muda depois de pronto), tinha duas opções: escrever um construtor com 5, 8, 12 parâmetros e ficar lembrando a ordem, ou aceitar propriedades com <code>set</code> e rezar para ninguém modificar depois. Os modificadores <strong>init</strong> (C# 9) e <strong>required</strong> (C# 11) foram criados para juntar o melhor dos dois mundos: a sintaxe declarativa dos <em>object initializers</em> com a segurança dos construtores. Pense no <code>init</code> como uma porta que só fecha por dentro, e no <code>required</code> como uma porta que <em>exige</em> que você passe por ela.
      </p>

      <h2><code>init</code>: o setter que só funciona durante a criação</h2>
      <p>
        Trocar <code>set</code> por <code>init</code> em uma propriedade muda uma única regra: a atribuição só vale durante a inicialização do objeto (no construtor, no <em>initializer</em>, ou em uma expressão <code>with</code> de record). Depois disso, qualquer tentativa vira erro de compilação.
      </p>
      <pre><code>{`public class Usuario {
    public string Nome   { get; init; } = "";
    public string Email  { get; init; } = "";
    public DateTime CriadoEm { get; init; } = DateTime.UtcNow;
}

// Inicializador funciona normalmente
var u = new Usuario {
    Nome = "Ana",
    Email = "ana@x.com"
};

// Mas isso aqui já não:
// u.Nome = "Bia";   // ERRO CS8852: init-only fora de inicializador`}</code></pre>
      <p>
        Repare que você pode misturar <code>init</code> com construtores sem conflito: o construtor inicializa o que precisar, e o <em>initializer</em> completa o resto. Isso permite expor APIs muito legíveis sem perder imutabilidade.
      </p>

      <AlertBox type="info" title="Por que não chamamos de readonly?">
        Existe <code>readonly</code> para campos, mas não havia equivalente para propriedades configuráveis em <em>initializer</em>. <code>init</code> preencheu exatamente esse espaço — e foi pré-requisito técnico para que <code>record</code> funcionasse com <code>with</code>.
      </AlertBox>

      <h2>O problema que <code>required</code> resolve</h2>
      <p>
        Com <code>init</code>, o objeto é imutável depois da criação. Mas, e <em>na</em> criação? Nada impede que alguém esqueça uma propriedade essencial:
      </p>
      <pre><code>{`var u = new Usuario { Email = "x@y.com" };
// Compila! Mas Nome ficou "" (string vazia). Bug silencioso.`}</code></pre>
      <p>
        Antes do C# 11, a única solução era construtor obrigatório com todos os parâmetros. <code>required</code> resolve sem essa cerimônia: ele marca a propriedade como <strong>obrigatória no inicializador</strong>, e o compilador acusa erro se você esquecer.
      </p>
      <pre><code>{`public class Usuario {
    public required string Nome  { get; init; }
    public required string Email { get; init; }
    public DateTime CriadoEm { get; init; } = DateTime.UtcNow;
}

var ok = new Usuario { Nome = "Ana", Email = "a@x" };  // OK

// var ruim = new Usuario { Email = "a@x" };
// ERRO CS9035: required member 'Nome' must be set`}</code></pre>

      <h2>Combinando <code>required</code> + <code>init</code>: o melhor padrão hoje</h2>
      <p>
        A combinação de <code>required</code> com <code>init</code> oferece o que muita gente buscava há anos: objetos imutáveis, com construção declarativa e validação compile-time, <strong>sem precisar declarar construtor</strong>. É especialmente útil em DTOs, modelos de configuração e records.
      </p>
      <pre><code>{`public record ConfiguracaoSmtp {
    public required string Host { get; init; }
    public required string Usuario { get; init; }
    public required string Senha { get; init; }
    public int Porta { get; init; } = 587;
    public bool Ssl  { get; init; } = true;
}

var cfg = new ConfiguracaoSmtp {
    Host = "smtp.gmail.com",
    Usuario = "ana@gmail.com",
    Senha = Environment.GetEnvironmentVariable("SMTP_PASS")!
    // Porta e Ssl ganham defaults; Host/Usuario/Senha são obrigatórios.
};

// Cópia com modificação imutável:
var cfgTeste = cfg with { Host = "smtp.localhost", Ssl = false };`}</code></pre>

      <h2>Construtores e <code>SetsRequiredMembers</code></h2>
      <p>
        Se você <em>quer</em> oferecer um construtor que cubra tudo, ainda pode. O atributo <code>[SetsRequiredMembers]</code> diz ao compilador "este construtor já garante todos os membros required, então não exija que o chamador os repita".
      </p>
      <pre><code>{`using System.Diagnostics.CodeAnalysis;

public class Pessoa {
    public required string Nome { get; init; }
    public required int    Idade { get; init; }

    public Pessoa() { }     // construtor padrão exige initializer

    [SetsRequiredMembers]
    public Pessoa(string nome, int idade) {
        Nome = nome;
        Idade = idade;
    }
}

// As duas formas funcionam:
var p1 = new Pessoa { Nome = "Ana", Idade = 30 };
var p2 = new Pessoa("Bia", 25);   // não precisa do { Nome = ..., Idade = ... }`}</code></pre>

      <AlertBox type="warning" title="Cuidado com herança">
        Se uma classe derivada não chama um construtor com <code>[SetsRequiredMembers]</code> da base, ela <em>continua</em> obrigando o initializer a preencher os campos required herdados. Documente bem suas classes base.
      </AlertBox>

      <h2>Por que isso bate construtores tradicionais</h2>
      <p>
        Compare a versão antiga com a nova:
      </p>
      <pre><code>{`// ANTES: construtor com 5 parâmetros — ordem importa, sem nomes na chamada
public class Pedido {
    public Pedido(int id, string cliente, DateTime data, decimal valor, bool pago) {
        Id = id; Cliente = cliente; Data = data; Valor = valor; Pago = pago;
    }
    public int Id { get; }
    public string Cliente { get; }
    public DateTime Data { get; }
    public decimal Valor { get; }
    public bool Pago { get; }
}
var p = new Pedido(1, "Ana", DateTime.Today, 199.90m, false);

// DEPOIS: declaração concisa, chamada autoexplicativa
public class Pedido {
    public required int Id { get; init; }
    public required string Cliente { get; init; }
    public required DateTime Data { get; init; }
    public required decimal Valor { get; init; }
    public bool Pago { get; init; }
}
var p2 = new Pedido {
    Id = 1, Cliente = "Ana", Data = DateTime.Today, Valor = 199.90m
};`}</code></pre>
      <p>
        Não há perda de segurança, e a leitura fica muito melhor — especialmente em modelos com muitas propriedades. Adicionar uma nova propriedade required <strong>quebra</strong> o build de quem ainda não a preencheu — exatamente o que você quer ao evoluir um esquema.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar usar <code>required</code> em campo:</strong> só vale para propriedades. Para campos, declare-os <code>init</code> via auto-property.</li>
        <li><strong>Esquecer que <code>required</code> é validado em compile-time, não runtime:</strong> reflection (e desserializadores) podem criar objetos sem preencher. Use atributos extras ou lógica de validação se for crítico.</li>
        <li><strong>Construtor sem <code>[SetsRequiredMembers]</code>:</strong> o chamador é obrigado a repetir todas as required no initializer, mesmo que o construtor já as receba.</li>
        <li><strong>Misturar <code>set</code> e <code>init</code> sem critério:</strong> mantenha <code>init</code> para imutabilidade real; só use <code>set</code> quando precisar mesmo mudar valor depois.</li>
        <li><strong>Targets antigos:</strong> <code>required</code> exige .NET 7+ (target framework com suporte). Em projetos antigos, é necessário <em>polyfill</em>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>init</code> permite atribuição apenas durante a inicialização do objeto.</li>
        <li><code>required</code> obriga o uso a definir o membro no inicializador (ou via construtor marcado).</li>
        <li>Juntos, evitam construtores enormes mantendo imutabilidade e validação.</li>
        <li><code>[SetsRequiredMembers]</code> alivia o requisito quando o construtor já garante os campos.</li>
        <li>Excelentes para DTOs, configurações, records e modelos de domínio.</li>
        <li>Quebra controlada: adicionar uma required quebra builds antigos — bom para evolução de schema.</li>
      </ul>
    </PageContainer>
  );
}
