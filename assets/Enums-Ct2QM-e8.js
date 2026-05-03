import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"Enums: conjuntos nomeados de constantes",subtitle:"Aprenda a substituir números mágicos e strings frágeis por nomes legíveis e seguros usando enumerações.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine que você está escrevendo um sistema de agendamento e precisa representar dias da semana. Você poderia usar números: ",e.jsx("code",{children:"1"})," para segunda, ",e.jsx("code",{children:"2"})," para terça, e assim por diante. Mas, quando o leitor encontrar ",e.jsx("code",{children:"if (dia == 3)"}),' três meses depois, ninguém saberá se "3" é quarta-feira, sábado ou o número de cafés do Bob. Os ',e.jsx("strong",{children:"enums"})," (de ",e.jsx("em",{children:"enumeration"}),', "enumeração") resolvem isso: você dá ',e.jsx("em",{children:"nomes"})," a um conjunto fechado de valores constantes, e o compilador passa a entender o que cada nome significa."]}),e.jsx("h2",{children:"Declarando seu primeiro enum"}),e.jsxs("p",{children:["Um enum é declarado fora de classes (geralmente no mesmo arquivo) com a palavra-chave ",e.jsx("code",{children:"enum"}),". Cada nome listado entre chaves vira uma ",e.jsx("strong",{children:"constante"})," — um valor fixo que não pode ser modificado em tempo de execução."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Declaração simples — valores numéricos automáticos a partir de 0
enum DiaSemana {
    Domingo,    // = 0
    Segunda,    // = 1
    Terca,      // = 2
    Quarta,     // = 3
    Quinta,     // = 4
    Sexta,      // = 5
    Sabado      // = 6
}

class Programa {
    static void Main() {
        DiaSemana hoje = DiaSemana.Quarta;
        Console.WriteLine(hoje);          // imprime: Quarta
        Console.WriteLine((int)hoje);     // imprime: 3
    }
}`})}),e.jsxs("p",{children:["Note três coisas importantes: (1) o tipo de ",e.jsx("code",{children:"hoje"})," é ",e.jsx("code",{children:"DiaSemana"}),", não ",e.jsx("code",{children:"int"})," — o compilador impede que você atribua, por exemplo, ",e.jsx("code",{children:"DiaSemana hoje = 99;"})," sem um cast explícito. (2) ",e.jsx("code",{children:"Console.WriteLine"})," imprime o ",e.jsx("em",{children:"nome"})," da constante, não o número. (3) Para obter o número por trás, faça um cast com ",e.jsx("code",{children:"(int)"}),"."]}),e.jsxs(o,{type:"info",title:"Por que começar do zero?",children:["A numeração automática começa em ",e.jsx("strong",{children:"0"})," (e não em 1) porque enums em C# herdam essa convenção da linguagem C, onde índices e valores numéricos quase sempre são baseados em zero."]}),e.jsx("h2",{children:"Atribuindo valores manualmente e mudando o tipo base"}),e.jsxs("p",{children:["Por padrão, os valores são ",e.jsx("code",{children:"int"})," (32 bits). Se você precisa de menos memória — útil em estruturas grandes, jogos, ou comunicação binária — pode escolher outro tipo inteiro como ",e.jsx("code",{children:"byte"})," (0 a 255), ",e.jsx("code",{children:"short"})," ou ",e.jsx("code",{children:"long"}),". Você também pode atribuir números específicos para casar com códigos de protocolo, status HTTP etc."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Tipo base byte (1 byte) e valores explícitos
enum StatusHttp : byte {
    Ok = 200,
    NaoEncontrado = 244,   // limites de byte: 0 a 255
    ErroServidor = 250
}

enum Prioridade : short {
    Baixa = 10,
    Media = 20,
    Alta  = 30,
    Critica = 99
}`})}),e.jsxs("p",{children:["O tipo base aparece após o nome do enum, separado por ",e.jsx("code",{children:":"}),". Se um valor não couber no tipo escolhido, o compilador acusa erro — é uma rede de proteção embutida."]}),e.jsxs("h2",{children:["Enums como bandeiras: ",e.jsx("code",{children:"[Flags]"})]}),e.jsxs("p",{children:["Às vezes um valor não é só um item, mas uma ",e.jsx("em",{children:"combinação"})," de várias opções. Pense em permissões de arquivo: um usuário pode ",e.jsx("em",{children:"ler"}),", ",e.jsx("em",{children:"escrever"}),", ",e.jsx("em",{children:"executar"}),", ou qualquer combinação dessas três. O atributo ",e.jsx("code",{children:"[Flags]"})," sinaliza que cada constante representa um bit independente, e operações bit a bit (",e.jsx("code",{children:"|"})," para combinar, ",e.jsx("code",{children:"&"})," para testar) passam a ter sentido."]}),e.jsx("pre",{children:e.jsx("code",{children:`[Flags]
enum Permissao {
    Nenhuma   = 0,
    Ler       = 1 << 0,   // 0001 = 1
    Escrever  = 1 << 1,   // 0010 = 2
    Executar  = 1 << 2,   // 0100 = 4
    Tudo      = Ler | Escrever | Executar  // 0111 = 7
}

class Programa {
    static void Main() {
        Permissao p = Permissao.Ler | Permissao.Escrever;
        Console.WriteLine(p);                          // "Ler, Escrever"
        bool podeEscrever = (p & Permissao.Escrever) != 0;
        Console.WriteLine(podeEscrever);              // True

        // Adicionar uma flag:
        p |= Permissao.Executar;
        // Remover uma flag:
        p &= ~Permissao.Escrever;
    }
}`})}),e.jsxs("p",{children:["Os valores devem ser ",e.jsx("strong",{children:"potências de 2"}),' (1, 2, 4, 8, 16…) para que cada bit fique em uma "posição" diferente. O operador ',e.jsx("code",{children:"<<"}),' ("shift left") é um atalho elegante para escrever potências de 2 sem decorar a tabela.']}),e.jsxs(o,{type:"warning",title:"Sem [Flags], o ToString fica feio",children:["Se você combinar bits sem ter marcado o enum com ",e.jsx("code",{children:"[Flags]"}),", ",e.jsx("code",{children:"ToString()"})," imprime apenas o número resultante (por exemplo ",e.jsx("code",{children:"3"}),") em vez de ",e.jsx("code",{children:'"Ler, Escrever"'}),". O atributo é mais que decoração — ele orienta a serialização."]}),e.jsx("h2",{children:"Convertendo entre texto, número e enum"}),e.jsxs("p",{children:["Frequentemente você lê um valor vindo de um banco de dados, formulário ou API, e precisa transformá-lo em um membro do enum. A família ",e.jsx("code",{children:"Enum.Parse"})," e ",e.jsx("code",{children:"Enum.TryParse"})," faz esse trabalho. Sempre prefira ",e.jsx("code",{children:"TryParse"})," em entradas externas, porque ele ",e.jsx("em",{children:"não lança exceção"})," em valores inválidos — apenas devolve ",e.jsx("code",{children:"false"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Texto -> enum (lança exceção se não existir)
DiaSemana d1 = Enum.Parse<DiaSemana>("Sexta");

// Versão segura, recomendada
if (Enum.TryParse<DiaSemana>("PalavraInvalida", out var d2)) {
    Console.WriteLine($"Convertido: {d2}");
} else {
    Console.WriteLine("Valor inválido.");
}

// Número -> enum (cuidado: aceita qualquer int, mesmo fora do intervalo)
DiaSemana d3 = (DiaSemana)4;
bool existe = Enum.IsDefined(typeof(DiaSemana), 99); // false

// Listar todos os valores
foreach (DiaSemana d in Enum.GetValues<DiaSemana>()) {
    Console.WriteLine($"{(int)d} = {d}");
}`})}),e.jsxs("p",{children:["Repare em ",e.jsx("code",{children:"Enum.IsDefined"}),": ele responde se o número corresponde a algum membro declarado. Use-o sempre que aceitar números de fontes não confiáveis, porque o cast ",e.jsx("code",{children:"(DiaSemana)99"})," compila tranquilamente — só explode em comportamento depois."]}),e.jsxs("h2",{children:["Enums dentro de ",e.jsx("code",{children:"switch"})]}),e.jsxs("p",{children:["Enums combinam perfeitamente com a expressão ",e.jsx("code",{children:"switch"}),": o compilador detecta se você esqueceu de tratar algum caso (com a ajuda do warning ",e.jsx("em",{children:"CS8524"}),") e o código fica autoexplicativo."]}),e.jsx("pre",{children:e.jsx("code",{children:`string DescreverDia(DiaSemana d) => d switch {
    DiaSemana.Sabado or DiaSemana.Domingo => "Final de semana — descansa!",
    DiaSemana.Segunda                     => "Começo da semana",
    DiaSemana.Sexta                       => "Sexta-feira, sextou!",
    _                                     => "Dia comum de trabalho"
};`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"[Flags]"}),":"]})," ainda assim você consegue combinar valores com ",e.jsx("code",{children:"|"}),", mas o ",e.jsx("code",{children:"ToString()"})," e a serialização ficam confusos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar valores sem ser potência de 2 em flags:"})," ",e.jsx("code",{children:"Ler = 1, Escrever = 2, Executar = 3"})," faz ",e.jsx("code",{children:"Ler | Escrever"})," virar exatamente ",e.jsx("code",{children:"Executar"}),". Bug silencioso e horrível de depurar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Cast direto sem ",e.jsx("code",{children:"IsDefined"}),":"]})," ",e.jsx("code",{children:"(DiaSemana)999"})," compila e o programa roda — mas em ",e.jsx("code",{children:"switch"})," você vai cair em ",e.jsx("code",{children:"default"})," e nem perceberá."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Renomear membros sem cuidado:"})," se você persiste o ",e.jsx("em",{children:"nome"})," em um banco/JSON, renomear quebra dados antigos. Se persiste o ",e.jsx("em",{children:"número"}),", renomear é seguro mas mudar a ordem não."]})]}),e.jsxs(o,{type:"success",title:"Quando usar enum em vez de classe",children:["Use enum quando o conjunto de valores é ",e.jsx("strong",{children:"fechado"}),", ",e.jsx("strong",{children:"pequeno"})," e ",e.jsx("strong",{children:"conhecido em tempo de compilação"})," (status, dias, modos). Para conjuntos abertos ou que carregam comportamento, prefira classes ou o padrão ",e.jsx("em",{children:"smart enum"}),"."]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Enums dão nome a constantes inteiras, tornando o código legível e seguro."}),e.jsxs("li",{children:["O tipo base padrão é ",e.jsx("code",{children:"int"}),", mas pode ser qualquer inteiro (",e.jsx("code",{children:"byte"}),", ",e.jsx("code",{children:"short"}),", ",e.jsx("code",{children:"long"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"[Flags]"})," + potências de 2 permitem combinar opções com operadores bit a bit."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"Enum.TryParse"})," para entrada do usuário e ",e.jsx("code",{children:"Enum.IsDefined"})," para validar números."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Enum.GetValues<T>()"})," itera por todos os membros."]}),e.jsxs("li",{children:["Combinados com ",e.jsx("code",{children:"switch"}),", enums geram código exaustivo e auto-documentado."]})]})]})}export{i as default};
