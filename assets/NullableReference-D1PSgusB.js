import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(r,{title:"Nullable reference types: o C# que avisa antes do crash",subtitle:"Aprenda a deixar o compilador caçar NullReferenceException por você, sem precisar mudar como pensa em código.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["A exceção ",e.jsx("code",{children:"NullReferenceException"}),' é tão famosa que seu inventor, Tony Hoare, a chamou de "o erro de um bilhão de dólares". Ela acontece quando você tenta usar uma variável de referência (uma ',e.jsx("em",{children:"class"}),", um ",e.jsx("em",{children:"delegate"}),", um ",e.jsx("em",{children:"array"}),") que vale ",e.jsx("code",{children:"null"})," — como tentar abrir uma porta de um endereço que não existe. Desde o C# 8, o compilador ganhou uma arma poderosa contra esse problema: os ",e.jsx("strong",{children:"nullable reference types"}),". A ideia: você diz explicitamente quais variáveis ",e.jsx("em",{children:"podem"})," ser null, e o compilador avisa toda vez que você arrisca usar uma sem checar."]}),e.jsx("h2",{children:"Ligando o recurso"}),e.jsxs("p",{children:["Em projetos modernos (.NET 6+), o template já vem com o recurso ligado por padrão no ",e.jsx("code",{children:".csproj"}),": ",e.jsx("code",{children:"<Nullable>enable</Nullable>"}),". Em projetos antigos ou para ativar/desativar arquivo a arquivo, use as diretivas do compilador:"]}),e.jsx("pre",{children:e.jsx("code",{children:`#nullable enable    // ativa análise neste arquivo
#nullable disable   // desativa
#nullable restore   // volta ao padrão do projeto

#nullable enable
string nome = null;     // AVISO: cannot convert null to non-nullable
string? talvezNome = null;  // OK — '?' diz "pode ser null"
#nullable restore`})}),e.jsxs("p",{children:["A grande mudança de mentalidade: antes, ",e.jsx("code",{children:"string"})," aceitava silenciosamente ",e.jsx("code",{children:"null"}),". Com nullable refs ligado, ",e.jsx("code",{children:"string"})," significa ",e.jsx("strong",{children:'"nunca null"'})," e ",e.jsx("code",{children:"string?"})," significa ",e.jsx("strong",{children:'"pode ser null"'}),". O compilador trata isso como contrato."]}),e.jsx("h2",{children:"Análise de fluxo: o compilador é esperto"}),e.jsxs("p",{children:["O compilador não exige que você use ",e.jsx("code",{children:"!"})," (null-forgiving) toda hora — ele acompanha o ",e.jsx("em",{children:"fluxo"})," do código e entende quando uma variável ",e.jsx("em",{children:"já foi verificada"}),". Esse processo é chamado de ",e.jsx("strong",{children:"flow analysis"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`void Imprimir(string? texto) {
    // texto pode ser null aqui
    Console.WriteLine(texto.Length);  // AVISO: dereference of possibly null

    if (texto is null) return;
    // a partir daqui, o compilador SABE que texto não é null
    Console.WriteLine(texto.Length);  // OK!
}

void Outro(string? s) {
    if (string.IsNullOrEmpty(s)) return;
    Console.WriteLine(s.Length);   // OK — IsNullOrEmpty está marcado para o compilador
}`})}),e.jsxs("p",{children:["O segundo exemplo só funciona porque ",e.jsx("code",{children:"string.IsNullOrEmpty"})," tem atributos especiais (",e.jsx("code",{children:"[NotNullWhen(false)]"}),") que ensinam ao compilador o que o método garante."]}),e.jsxs("h2",{children:["O operador ",e.jsx("code",{children:"!"})," — null-forgiving"]}),e.jsxs("p",{children:["Às vezes você sabe coisas que o compilador não consegue deduzir (porque vieram de uma chamada externa, de um teste, de um cache que você acabou de preencher). Para esses casos existe o ",e.jsx("strong",{children:"null-forgiving operator"})," ",e.jsx("code",{children:"!"}),'. Ele diz "confie em mim, isso não é null" — sem nenhuma verificação em tempo de execução.']}),e.jsx("pre",{children:e.jsx("code",{children:`string? VemDoBanco() => "valor";

string s = VemDoBanco()!;     // promete: não é null
Console.WriteLine(s.Length);

// CUIDADO: se mentir, NullReferenceException volta
string? n = null;
string ruim = n!;             // compila!
Console.WriteLine(ruim.Length); // BOOM em runtime`})}),e.jsxs(o,{type:"warning",title:"Use o ! com parcimônia",children:["Cada ",e.jsx("code",{children:"!"}),' no código é uma "promessa não verificada". Se aparecerem dezenas, você essencialmente desligou o recurso. Prefira reorganizar o código para que o compilador ',e.jsx("em",{children:"prove"})," a não-nulidade — ou use atributos como ",e.jsx("code",{children:"[MemberNotNull]"}),", ",e.jsx("code",{children:"[NotNull]"})," e ",e.jsx("code",{children:"[NotNullWhen]"}),"."]}),e.jsx("h2",{children:"Atributos avançados: ensinando o compilador"}),e.jsxs("p",{children:['A análise tem alguns "buracos" que você preenche com atributos do namespace ',e.jsx("code",{children:"System.Diagnostics.CodeAnalysis"}),". Os mais úteis no dia a dia:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Diagnostics.CodeAnalysis;

class Cache<T> where T : class {
    private T? _valor;

    // Garante: depois de chamar isto, _valor NÃO é null
    [MemberNotNull(nameof(_valor))]
    public void Inicializar(T v) => _valor = v;

    // Quando devolver true, 'item' é não-nulo no chamador
    public bool Tentar([NotNullWhen(true)] out T? item) {
        item = _valor;
        return _valor is not null;
    }
}

// Aceita null mas pode devolver não-null
public string Garantir([AllowNull] string? entrada) =>
    entrada ?? "padrão";`})}),e.jsx("p",{children:"Esses atributos não mudam o comportamento em runtime — eles só aumentam a precisão da análise. Use-os em bibliotecas e código-base grande para diminuir avisos falsos."}),e.jsx("h2",{children:"Warnings vs erros"}),e.jsxs("p",{children:["Tudo isso aparece como ",e.jsx("strong",{children:"warnings"}),", não como erros. Em um time disciplinado, vale ligar ",e.jsx("code",{children:"<TreatWarningsAsErrors>true</TreatWarningsAsErrors>"})," no ",e.jsx("code",{children:".csproj"})," ou pelo menos os warnings nullable específicos (CS8600, CS8602, CS8603...). Assim, código que arrisca null nem chega ao build."]}),e.jsx("pre",{children:e.jsx("code",{children:`<!-- Trecho do .csproj -->
<PropertyGroup>
  <Nullable>enable</Nullable>
  <WarningsAsErrors>nullable</WarningsAsErrors>
</PropertyGroup>`})}),e.jsx("h2",{children:"Padrões comuns no dia a dia"}),e.jsxs("p",{children:["Nullable refs combinam muito bem com ",e.jsx("em",{children:"pattern matching"}),", com o operador ",e.jsx("code",{children:"??"})," (coalescência nula) e com ",e.jsx("code",{children:"?."})," (acesso seguro). Veja como a leitura fica natural:"]}),e.jsx("pre",{children:e.jsx("code",{children:`Cliente? c = Buscar(id);

// 1) Default seguro
string nome = c?.Nome ?? "(sem cadastro)";

// 2) Padrão de checagem positiva
if (c is { Email: { } email }) {
    EnviarConfirmacao(email);  // 'email' é string (não-nulo)
}

// 3) Throw helper para argumentos
ArgumentNullException.ThrowIfNull(c);
Console.WriteLine(c.Nome);  // sem aviso, pois 'ThrowIfNull' marca 'c' como não-nulo`})}),e.jsx(o,{type:"info",title:"Não muda nada em runtime",children:"Nullable reference types existem só em tempo de compilação. O tipo de runtime é o mesmo — não há boxing, sobrecarga, ou metadata extra. É puro contrato analisado pelo compilador."}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Inicializar campo não-nulo no construtor por engano:"})," warning CS8618. Inicialize na declaração, no construtor, ou marque como ",e.jsx("code",{children:"required"}),"/nullable."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"!"}),' para "calar o compilador":']})," esconde bug. Reorganize ou checke."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Passar ",e.jsx("code",{children:"null"})," para método de biblioteca antiga:"]})," a biblioteca pode aceitar mas seu próprio código não compila — use ",e.jsx("code",{children:"?"})," no parâmetro local ou ",e.jsx("code",{children:"[AllowNull]"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de propagar ",e.jsx("code",{children:"?"})," em DTOs vindos de JSON:"]})," em desserialização, propriedades podem chegar nulas mesmo se você não permitir. Marque corretamente ou valide."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar arquivos com e sem nullable:"})," warnings inconsistentes. Padronize no ",e.jsx("code",{children:".csproj"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Nullable reference types fazem o compilador alertar sobre acessos a possíveis nulls."}),e.jsxs("li",{children:["Ative com ",e.jsx("code",{children:"<Nullable>enable</Nullable>"})," no projeto ou ",e.jsx("code",{children:"#nullable enable"})," no arquivo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"string"})," = nunca null; ",e.jsx("code",{children:"string?"})," = pode ser null."]}),e.jsx("li",{children:"O compilador faz análise de fluxo: depois de checar, a variável é considerada não-nula."}),e.jsxs("li",{children:[e.jsx("code",{children:"!"})," suprime o aviso, mas é uma promessa não verificada — use com cuidado."]}),e.jsxs("li",{children:["Atributos como ",e.jsx("code",{children:"[NotNullWhen]"}),", ",e.jsx("code",{children:"[MemberNotNull]"})," e ",e.jsx("code",{children:"[AllowNull]"})," ensinam o compilador."]}),e.jsxs("li",{children:["Combine com ",e.jsx("code",{children:"??"}),", ",e.jsx("code",{children:"?."})," e pattern matching para código curto e seguro."]})]})]})}export{n as default};
