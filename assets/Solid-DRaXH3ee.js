import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(o,{title:"Princípios SOLID com exemplos em C#",subtitle:"Cinco regras que separam código que cresce do código que vira pesadelo.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsxs("p",{children:["SOLID é um acrônimo cunhado por Robert C. Martin que reúne cinco princípios de design orientado a objetos. Não são leis — são ",e.jsx("em",{children:"diretrizes"}),' que ajudam o seu código a aceitar mudanças sem quebrar tudo. Pense neles como regras de boa engenharia civil: você pode construir uma casa ignorando, mas no primeiro terremoto (mudança de requisito) ela cai. Vamos ver cada um com um exemplo "ruim" e a versão "boa".']}),e.jsx("h2",{children:"S — Single Responsibility (Responsabilidade Única)"}),e.jsxs("p",{children:['"Uma classe deve ter ',e.jsx("strong",{children:"um, e apenas um, motivo para mudar"}),'." Se o departamento financeiro pede uma alteração e você tem que mexer numa classe que também envia e-mails, você violou esse princípio.']}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM: a classe faz três coisas
public class Pedido
{
    public void Salvar() { /* SQL no banco */ }
    public void EnviarEmailConfirmacao() { /* SMTP */ }
    public decimal CalcularTotalComImposto() { /* regra fiscal */ }
}

// BOM: cada responsabilidade em sua classe
public class Pedido { public decimal Subtotal { get; set; } }
public class CalculadoraImposto { public decimal Calcular(Pedido p) => p.Subtotal * 1.10m; }
public class PedidoRepositorio { public void Salvar(Pedido p) { /* ... */ } }
public class NotificadorEmail { public Task EnviarAsync(Pedido p) => /* ... */ Task.CompletedTask; }`})}),e.jsx("p",{children:"Agora a regra fiscal pode mudar sem tocar em e-mail; o servidor SMTP pode trocar sem tocar no SQL. Cada classe tem um único motivo para evoluir."}),e.jsx("h2",{children:"O — Open/Closed (Aberto/Fechado)"}),e.jsxs("p",{children:['"Entidades devem ser ',e.jsx("strong",{children:"abertas para extensão, fechadas para modificação"}),'." Você consegue adicionar comportamento novo sem editar o código existente — usando herança, interfaces ou composição.']}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM: cada novo tipo de pagamento exige editar este if
public decimal CalcularTaxa(string tipo, decimal valor) {
    if (tipo == "credito") return valor * 0.03m;
    if (tipo == "debito")  return valor * 0.01m;
    if (tipo == "pix")     return 0;
    throw new Exception("Tipo desconhecido");
}

// BOM: cada forma é uma classe que implementa a mesma interface
public interface IFormaPagamento { decimal Taxa(decimal valor); }
public class Credito : IFormaPagamento { public decimal Taxa(decimal v) => v * 0.03m; }
public class Debito  : IFormaPagamento { public decimal Taxa(decimal v) => v * 0.01m; }
public class Pix     : IFormaPagamento { public decimal Taxa(decimal v) => 0; }

// Usuário do código permanece intacto:
decimal Cobrar(IFormaPagamento fp, decimal v) => v + fp.Taxa(v);`})}),e.jsxs(a,{type:"info",title:"Polimorfismo é a chave",children:["Sempre que você ver uma cadeia de ",e.jsx("code",{children:"if/else"})," ou ",e.jsx("code",{children:"switch"}),' sobre o "tipo" de algo, há uma boa chance de poder substituir por polimorfismo (interfaces ou classes derivadas). Isso é o coração do princípio Aberto/Fechado.']}),e.jsx("h2",{children:"L — Liskov Substitution (Substituição de Liskov)"}),e.jsxs("p",{children:['"Uma classe derivada deve poder ',e.jsx("strong",{children:"substituir a classe base sem quebrar o programa"}),'." Se ',e.jsx("code",{children:"Quadrado"})," herda de ",e.jsx("code",{children:"Retangulo"})," mas se comporta diferente quando você muda ",e.jsx("code",{children:"Largura"}),", você violou Liskov — qualquer código que esperava um Retângulo pode falhar."]}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM
public class Retangulo
{
    public virtual int Largura  { get; set; }
    public virtual int Altura   { get; set; }
    public int Area => Largura * Altura;
}
public class Quadrado : Retangulo
{
    public override int Largura { set { base.Largura = base.Altura = value; } }
    public override int Altura  { set { base.Largura = base.Altura = value; } }
}
// Função que recebe Retangulo:
void Esticar(Retangulo r) { r.Largura = 10; r.Altura = 5; Debug.Assert(r.Area == 50); }
Esticar(new Quadrado()); // assert quebra: Area == 25!

// BOM: não force a herança quando a relação não é "é-um" perfeita
public abstract class Forma { public abstract int Area(); }
public class Retangulo : Forma { public int Largura; public int Altura; public override int Area() => Largura * Altura; }
public class Quadrado  : Forma { public int Lado;     public override int Area() => Lado * Lado; }`})}),e.jsx("h2",{children:"I — Interface Segregation (Segregação de Interfaces)"}),e.jsxs("p",{children:['"Nenhum cliente deve ser ',e.jsx("strong",{children:"forçado a depender de métodos que não usa"}),'." Interfaces "gordas" obrigam implementações a lançar ',e.jsx("code",{children:"NotImplementedException"})," ou deixar métodos vazios — sinal claro de que precisam ser quebradas."]}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM: nem toda impressora escaneia, mas todas precisam implementar
public interface IMultifuncional {
    void Imprimir(string doc);
    void Escanear();
    void EnviarFax();
}
public class ImpressoraSimples : IMultifuncional {
    public void Imprimir(string doc) { /* ok */ }
    public void Escanear()  => throw new NotSupportedException();
    public void EnviarFax() => throw new NotSupportedException();
}

// BOM: interfaces pequenas, combinadas por composição
public interface IImpressora { void Imprimir(string doc); }
public interface IScanner    { void Escanear(); }
public interface IFax        { void EnviarFax(); }

public class ImpressoraSimples  : IImpressora { public void Imprimir(string d) {} }
public class Multifuncional     : IImpressora, IScanner, IFax { /* ... */ }`})}),e.jsx("h2",{children:"D — Dependency Inversion (Inversão de Dependência)"}),e.jsxs("p",{children:['"Módulos de alto nível não devem depender de módulos de baixo nível. ',e.jsx("strong",{children:"Ambos devem depender de abstrações."}),'" Em vez do seu serviço criar diretamente um ',e.jsx("code",{children:"SqlConnection"}),", ele recebe uma ",e.jsx("code",{children:"IConexao"}),". Isso permite testes (passe um mock) e troca (passe outra implementação)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM: o serviço cria a dependência concreta
public class ServicoPedido
{
    private readonly SqlPedidoRepositorio _repo = new SqlPedidoRepositorio();
    public void Salvar(Pedido p) => _repo.Salvar(p);
}

// BOM: depende de abstração e recebe via construtor
public interface IPedidoRepositorio { void Salvar(Pedido p); }

public class ServicoPedido
{
    private readonly IPedidoRepositorio _repo;
    public ServicoPedido(IPedidoRepositorio repo) => _repo = repo; // injeção de dependência
    public void Salvar(Pedido p) => _repo.Salvar(p);
}

// Em produção:
services.AddScoped<IPedidoRepositorio, SqlPedidoRepositorio>();
// Em testes:
var fake = new Mock<IPedidoRepositorio>();
var sut = new ServicoPedido(fake.Object);`})}),e.jsxs(a,{type:"warning",title:"SOLID não é dogma",children:["Aplicar SOLID custa código extra (mais classes, mais interfaces). Em scripts curtos, isso é peso morto. Use SOLID quando o código ",e.jsx("em",{children:"vai mudar muito"})," ou ",e.jsx("em",{children:"vai ser testado em isolamento"}),". Para um script de migração rodado uma vez, prosa direta basta."]}),e.jsx("h2",{children:"Como saber se já estou aplicando bem?"}),e.jsxs("p",{children:["Alguns sinais práticos: 1) você consegue trocar o banco por um ",e.jsx("em",{children:"in-memory"}),' nos testes sem reescrever o serviço; 2) adicionar um novo tipo de pagamento, formato de exportação ou provedor de e-mail toca apenas um arquivo novo, sem modificar os existentes; 3) suas classes cabem na tela sem rolagem; 4) os nomes descrevem precisamente uma única responsabilidade — se você precisa usar "e" para descrever o que a classe faz, ela faz demais.']}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Quebrar uma classe em 15 outras só por ortodoxia"})," — mais arquivos não significa melhor design."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Criar interfaces com uma única implementação"}),' "para o caso de precisar" — adicione quando precisar.']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir herança com reuso"}),' — herde apenas quando "B é-um A" for verdadeiro em qualquer contexto (Liskov).']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Injetar tudo, inclusive ",e.jsx("code",{children:"DateTime.Now"})]})," — sim, faça isso (use ",e.jsx("code",{children:"TimeProvider"})," no .NET 8+) só quando o teste realmente precisar."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"S"})," — Uma classe, um motivo de mudança."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"O"})," — Estenda comportamento sem editar o existente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"L"})," — Subclasses devem honrar o contrato da base."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"I"})," — Interfaces pequenas e específicas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"D"})," — Dependa de abstrações, não de detalhes concretos."]})]})]})}export{s as default};
