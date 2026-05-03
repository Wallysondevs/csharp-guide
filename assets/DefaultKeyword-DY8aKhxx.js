import{j as e}from"./index-CzLAthD5.js";import{P as i,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(i,{title:"A palavra default em generics",subtitle:"Como obter o 'valor neutro' de um tipo qualquer — útil em métodos genéricos, parâmetros opcionais e cláusulas switch.",difficulty:"intermediario",timeToRead:"9 min",children:[e.jsxs("p",{children:["Suponha que você tenha um método genérico ",e.jsx("code",{children:"T Buscar<T>(...)"}),' e queira retornar "nada" quando não achar resultado. Você não pode usar ',e.jsx("code",{children:"null"})," diretamente porque ",e.jsx("code",{children:"T"})," pode ser ",e.jsx("code",{children:"int"})," (e ",e.jsx("code",{children:"int"})," não aceita null). Você não pode usar ",e.jsx("code",{children:"0"})," porque ",e.jsx("code",{children:"T"})," pode ser ",e.jsx("code",{children:"string"}),". A resposta do C# é a palavra-chave ",e.jsx("code",{children:"default"}),': ela devolve o "valor padrão" do tipo, seja qual for. Pense num formulário em branco — cada campo tem um valor inicial conforme seu tipo: número fica 0, texto fica vazio/nulo, caixinha fica desmarcada.']}),e.jsxs("h2",{children:["O que ",e.jsx("code",{children:"default"})," retorna para cada tipo"]}),e.jsxs("p",{children:["A regra é simples: para tipos numéricos, é ",e.jsx("strong",{children:"zero"}),"; para ",e.jsx("code",{children:"bool"}),", é ",e.jsx("code",{children:"false"}),"; para tipos de referência (classes, interfaces, strings, arrays), é ",e.jsx("code",{children:"null"}),"; para structs, é uma instância com todos os campos zerados."]}),e.jsx("pre",{children:e.jsx("code",{children:`Console.WriteLine(default(int));        // 0
Console.WriteLine(default(double));     // 0
Console.WriteLine(default(bool));       // False
Console.WriteLine(default(char));       // '\\0' (caractere nulo)
Console.WriteLine(default(string));     // (null, imprime vazio)
Console.WriteLine(default(DateTime));   // 01/01/0001 00:00:00
Console.WriteLine(default(List<int>));  // (null)

// Para um struct seu:
public struct Ponto { public int X; public int Y; }
Ponto p = default(Ponto);   // (X=0, Y=0)`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"default(T)"})," vs ",e.jsx("code",{children:"default"})," literal"]}),e.jsxs("p",{children:["Existem duas formas. A clássica ",e.jsx("code",{children:"default(T)"})," exige você dizer o tipo entre parênteses. A nova (C# 7.1+) ",e.jsx("code",{children:"default"}),' sem parênteses é "target-typed" — o compilador deduz o tipo a partir do contexto:']}),e.jsx("pre",{children:e.jsx("code",{children:`int n = default(int);       // forma clássica
int n2 = default;           // forma nova: tipo deduzido pelo lado esquerdo

string s = default;         // tipo deduzido como string -> null

// Em retorno de método:
public string ObterNome() => default;   // null (string)
public int Contar() => default;          // 0 (int)

// Em chamada de método (tipo do parâmetro deduzido):
void Salvar(DateTime quando) { /* ... */ }
Salvar(default);            // equivale a Salvar(DateTime.MinValue)`})}),e.jsxs("p",{children:["Use a forma curta sempre que o tipo for óbvio pelo contexto — fica mais legível. Use ",e.jsx("code",{children:"default(T)"})," quando precisar deixar o tipo explícito (em expressões ambíguas, por exemplo)."]}),e.jsxs(o,{type:"info",title:"Initialização automática de campos",children:["Campos de classe e elementos de array já são inicializados com ",e.jsx("code",{children:"default"})," automaticamente, sem você escrever nada. Por isso ",e.jsx("code",{children:"new int[3]"})," dá ",e.jsx("code",{children:"[0, 0, 0]"})," e ",e.jsx("code",{children:"new string[3]"})," dá ",e.jsx("code",{children:"[null, null, null]"}),"."]}),e.jsx("h2",{children:"O uso clássico: em métodos genéricos"}),e.jsxs("p",{children:["Esse é o motivo de ",e.jsx("code",{children:"default"})," existir. Em código genérico, você não sabe se ",e.jsx("code",{children:"T"})," é tipo de valor ou referência:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static T PrimeiroOuPadrao<T>(IEnumerable<T> origem) {
    foreach (T item in origem) return item;
    return default!;   // ! suprime warning de nullable em reference types
}

int n = PrimeiroOuPadrao(new[] { 10, 20 });            // 10
int vazio = PrimeiroOuPadrao(Array.Empty<int>());      // 0
string? s = PrimeiroOuPadrao(Array.Empty<string>());   // null`})}),e.jsxs("p",{children:["Sem ",e.jsx("code",{children:"default"}),', você teria que escrever uma versão para cada tipo possível. Ele é a "ponte" que permite código genuinamente genérico.']}),e.jsx("h2",{children:"Em parâmetros opcionais"}),e.jsxs("p",{children:["Parâmetros opcionais exigem um valor constante de compilação. ",e.jsx("code",{children:"default"}),' serve perfeitamente como "marcador" de "não foi passado":']}),e.jsx("pre",{children:e.jsx("code",{children:`public void Configurar(
    string nome,
    int timeout = default,           // 0
    DateTime expiracao = default,     // DateTime.MinValue
    CancellationToken ct = default    // CancellationToken.None
) {
    if (timeout == default) timeout = 30;       // valor real default
    if (expiracao == default) expiracao = DateTime.UtcNow.AddHours(1);
    // ...
}`})}),e.jsxs("p",{children:["O exemplo de ",e.jsx("code",{children:"CancellationToken.None == default"})," é especialmente comum em APIs assíncronas — o ",e.jsx("code",{children:"default"}),' equivale ao token "nunca cancela".']}),e.jsxs("h2",{children:["Em ",e.jsx("code",{children:"switch"})," e pattern matching"]}),e.jsxs("p",{children:["Cuidado: nessa posição, ",e.jsx("code",{children:"default"}),' é uma palavra-chave da linguagem com outro significado — significa "se nenhum caso anterior bateu, caia aqui":']}),e.jsx("pre",{children:e.jsx("code",{children:`int codigo = 5;

string mensagem = codigo switch {
    1 => "criado",
    2 => "atualizado",
    3 => "removido",
    _ => "desconhecido"   // padrão recomendado: descarte com _
    // 'default' funcionaria aqui também, mas '_' é o idiomático em switch expressions
};

// Em switch statement clássico:
switch (codigo) {
    case 1: break;
    case 2: break;
    default: Console.WriteLine("outro"); break;
}`})}),e.jsx("p",{children:'Os dois usos não conflitam: o compilador sabe pelo contexto se você quer "valor padrão de um tipo" ou "ramo padrão de um switch".'}),e.jsxs("h2",{children:["Comparando com ",e.jsx("code",{children:"default"})]}),e.jsxs("p",{children:["Comparar com ",e.jsx("code",{children:"default"}),' é útil para checar "ainda não foi atribuído" — mas atenção a tipos onde a comparação não é trivial:']}),e.jsx("pre",{children:e.jsx("code",{children:`public static bool TemValor<T>(T item) {
    return !EqualityComparer<T>.Default.Equals(item, default);
}

Console.WriteLine(TemValor(0));     // False (0 é o default de int)
Console.WriteLine(TemValor(42));    // True
Console.WriteLine(TemValor(""));    // True (string vazia != null)
Console.WriteLine(TemValor((string?)null)); // False`})}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"EqualityComparer<T>.Default.Equals(...)"})," em vez de ",e.jsx("code",{children:"=="})," dentro de código genérico, porque ",e.jsx("code",{children:"=="})," não está disponível para todo ",e.jsx("code",{children:"T"})," (apenas para tipos com operador definido)."]}),e.jsxs(o,{type:"warning",title:"default não é o mesmo que 'unset'",children:['Se o "valor padrão" for um valor ',e.jsx("em",{children:"válido"})," do seu domínio, ",e.jsx("code",{children:"default"}),' não distingue "não passei" de "passei zero". Para esses casos, use ',e.jsx("code",{children:"Nullable<T>"})," (",e.jsx("code",{children:"int?"}),") e cheque ",e.jsx("code",{children:"HasValue"}),", ou crie um sentinel claro."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"default"})," de struct com null:"]})," ",e.jsx("code",{children:"default(DateTime)"})," NÃO é null — é ",e.jsx("code",{children:"01/01/0001"}),'. Datas "vazias" precisam ser ',e.jsx("code",{children:"DateTime?"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar inicialização customizada:"}),' structs não têm como sobrescrever o "valor padrão". Toda criação por ',e.jsx("code",{children:"default"})," ou via array dá os campos zerados, ignorando construtores e inicializadores."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Comparar com ",e.jsx("code",{children:"=="})," em código genérico:"]})," use ",e.jsx("code",{children:"EqualityComparer<T>.Default"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:"!"})," de null-forgiving:"]})," em projetos com nullable habilitado, ",e.jsx("code",{children:"return default;"})," em método que devolve ",e.jsx("code",{children:"T"})," pode acusar warning. Use ",e.jsx("code",{children:"default!"})," ou anote a assinatura como ",e.jsx("code",{children:"T?"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"default"})," devolve o valor neutro do tipo: ",e.jsx("code",{children:"0"}),", ",e.jsx("code",{children:"false"}),", ",e.jsx("code",{children:"null"}),", struct zerado."]}),e.jsxs("li",{children:["Forma ",e.jsx("code",{children:"default(T)"})," explícita ou ",e.jsx("code",{children:"default"})," target-typed."]}),e.jsxs("li",{children:["Indispensável em métodos genéricos onde ",e.jsx("code",{children:"T"})," é desconhecido."]}),e.jsxs("li",{children:["Comum em parâmetros opcionais (",e.jsx("code",{children:"CancellationToken ct = default"}),")."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"EqualityComparer<T>.Default.Equals"})," ao comparar genericamente."]})]})]})}export{s as default};
