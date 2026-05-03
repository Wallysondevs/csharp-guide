import{j as e}from"./index-CzLAthD5.js";import{P as r,A as i}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Modificadores init e required: imutabilidade moderna",subtitle:"Aprenda como o C# 9 e 11 trouxeram uma maneira mais elegante de garantir objetos completos e imutáveis sem construtores gigantes.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs("p",{children:["Antes do C# 9, se você quisesse criar um objeto imutável (que não muda depois de pronto), tinha duas opções: escrever um construtor com 5, 8, 12 parâmetros e ficar lembrando a ordem, ou aceitar propriedades com ",e.jsx("code",{children:"set"})," e rezar para ninguém modificar depois. Os modificadores ",e.jsx("strong",{children:"init"})," (C# 9) e ",e.jsx("strong",{children:"required"})," (C# 11) foram criados para juntar o melhor dos dois mundos: a sintaxe declarativa dos ",e.jsx("em",{children:"object initializers"})," com a segurança dos construtores. Pense no ",e.jsx("code",{children:"init"})," como uma porta que só fecha por dentro, e no ",e.jsx("code",{children:"required"})," como uma porta que ",e.jsx("em",{children:"exige"})," que você passe por ela."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"init"}),": o setter que só funciona durante a criação"]}),e.jsxs("p",{children:["Trocar ",e.jsx("code",{children:"set"})," por ",e.jsx("code",{children:"init"})," em uma propriedade muda uma única regra: a atribuição só vale durante a inicialização do objeto (no construtor, no ",e.jsx("em",{children:"initializer"}),", ou em uma expressão ",e.jsx("code",{children:"with"})," de record). Depois disso, qualquer tentativa vira erro de compilação."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Usuario {
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
// u.Nome = "Bia";   // ERRO CS8852: init-only fora de inicializador`})}),e.jsxs("p",{children:["Repare que você pode misturar ",e.jsx("code",{children:"init"})," com construtores sem conflito: o construtor inicializa o que precisar, e o ",e.jsx("em",{children:"initializer"})," completa o resto. Isso permite expor APIs muito legíveis sem perder imutabilidade."]}),e.jsxs(i,{type:"info",title:"Por que não chamamos de readonly?",children:["Existe ",e.jsx("code",{children:"readonly"})," para campos, mas não havia equivalente para propriedades configuráveis em ",e.jsx("em",{children:"initializer"}),". ",e.jsx("code",{children:"init"})," preencheu exatamente esse espaço — e foi pré-requisito técnico para que ",e.jsx("code",{children:"record"})," funcionasse com ",e.jsx("code",{children:"with"}),"."]}),e.jsxs("h2",{children:["O problema que ",e.jsx("code",{children:"required"})," resolve"]}),e.jsxs("p",{children:["Com ",e.jsx("code",{children:"init"}),", o objeto é imutável depois da criação. Mas, e ",e.jsx("em",{children:"na"})," criação? Nada impede que alguém esqueça uma propriedade essencial:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var u = new Usuario { Email = "x@y.com" };
// Compila! Mas Nome ficou "" (string vazia). Bug silencioso.`})}),e.jsxs("p",{children:["Antes do C# 11, a única solução era construtor obrigatório com todos os parâmetros. ",e.jsx("code",{children:"required"})," resolve sem essa cerimônia: ele marca a propriedade como ",e.jsx("strong",{children:"obrigatória no inicializador"}),", e o compilador acusa erro se você esquecer."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Usuario {
    public required string Nome  { get; init; }
    public required string Email { get; init; }
    public DateTime CriadoEm { get; init; } = DateTime.UtcNow;
}

var ok = new Usuario { Nome = "Ana", Email = "a@x" };  // OK

// var ruim = new Usuario { Email = "a@x" };
// ERRO CS9035: required member 'Nome' must be set`})}),e.jsxs("h2",{children:["Combinando ",e.jsx("code",{children:"required"})," + ",e.jsx("code",{children:"init"}),": o melhor padrão hoje"]}),e.jsxs("p",{children:["A combinação de ",e.jsx("code",{children:"required"})," com ",e.jsx("code",{children:"init"})," oferece o que muita gente buscava há anos: objetos imutáveis, com construção declarativa e validação compile-time, ",e.jsx("strong",{children:"sem precisar declarar construtor"}),". É especialmente útil em DTOs, modelos de configuração e records."]}),e.jsx("pre",{children:e.jsx("code",{children:`public record ConfiguracaoSmtp {
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
var cfgTeste = cfg with { Host = "smtp.localhost", Ssl = false };`})}),e.jsxs("h2",{children:["Construtores e ",e.jsx("code",{children:"SetsRequiredMembers"})]}),e.jsxs("p",{children:["Se você ",e.jsx("em",{children:"quer"})," oferecer um construtor que cubra tudo, ainda pode. O atributo ",e.jsx("code",{children:"[SetsRequiredMembers]"}),' diz ao compilador "este construtor já garante todos os membros required, então não exija que o chamador os repita".']}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Diagnostics.CodeAnalysis;

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
var p2 = new Pessoa("Bia", 25);   // não precisa do { Nome = ..., Idade = ... }`})}),e.jsxs(i,{type:"warning",title:"Cuidado com herança",children:["Se uma classe derivada não chama um construtor com ",e.jsx("code",{children:"[SetsRequiredMembers]"})," da base, ela ",e.jsx("em",{children:"continua"})," obrigando o initializer a preencher os campos required herdados. Documente bem suas classes base."]}),e.jsx("h2",{children:"Por que isso bate construtores tradicionais"}),e.jsx("p",{children:"Compare a versão antiga com a nova:"}),e.jsx("pre",{children:e.jsx("code",{children:`// ANTES: construtor com 5 parâmetros — ordem importa, sem nomes na chamada
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
};`})}),e.jsxs("p",{children:["Não há perda de segurança, e a leitura fica muito melhor — especialmente em modelos com muitas propriedades. Adicionar uma nova propriedade required ",e.jsx("strong",{children:"quebra"})," o build de quem ainda não a preencheu — exatamente o que você quer ao evoluir um esquema."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar usar ",e.jsx("code",{children:"required"})," em campo:"]})," só vale para propriedades. Para campos, declare-os ",e.jsx("code",{children:"init"})," via auto-property."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer que ",e.jsx("code",{children:"required"})," é validado em compile-time, não runtime:"]})," reflection (e desserializadores) podem criar objetos sem preencher. Use atributos extras ou lógica de validação se for crítico."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Construtor sem ",e.jsx("code",{children:"[SetsRequiredMembers]"}),":"]})," o chamador é obrigado a repetir todas as required no initializer, mesmo que o construtor já as receba."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"set"})," e ",e.jsx("code",{children:"init"})," sem critério:"]})," mantenha ",e.jsx("code",{children:"init"})," para imutabilidade real; só use ",e.jsx("code",{children:"set"})," quando precisar mesmo mudar valor depois."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Targets antigos:"})," ",e.jsx("code",{children:"required"})," exige .NET 7+ (target framework com suporte). Em projetos antigos, é necessário ",e.jsx("em",{children:"polyfill"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"init"})," permite atribuição apenas durante a inicialização do objeto."]}),e.jsxs("li",{children:[e.jsx("code",{children:"required"})," obriga o uso a definir o membro no inicializador (ou via construtor marcado)."]}),e.jsx("li",{children:"Juntos, evitam construtores enormes mantendo imutabilidade e validação."}),e.jsxs("li",{children:[e.jsx("code",{children:"[SetsRequiredMembers]"})," alivia o requisito quando o construtor já garante os campos."]}),e.jsx("li",{children:"Excelentes para DTOs, configurações, records e modelos de domínio."}),e.jsx("li",{children:"Quebra controlada: adicionar uma required quebra builds antigos — bom para evolução de schema."})]})]})}export{s as default};
