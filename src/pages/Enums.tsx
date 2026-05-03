import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Enums() {
  return (
    <PageContainer
      title="Enums: conjuntos nomeados de constantes"
      subtitle="Aprenda a substituir números mágicos e strings frágeis por nomes legíveis e seguros usando enumerações."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que você está escrevendo um sistema de agendamento e precisa representar dias da semana. Você poderia usar números: <code>1</code> para segunda, <code>2</code> para terça, e assim por diante. Mas, quando o leitor encontrar <code>if (dia == 3)</code> três meses depois, ninguém saberá se "3" é quarta-feira, sábado ou o número de cafés do Bob. Os <strong>enums</strong> (de <em>enumeration</em>, "enumeração") resolvem isso: você dá <em>nomes</em> a um conjunto fechado de valores constantes, e o compilador passa a entender o que cada nome significa.
      </p>

      <h2>Declarando seu primeiro enum</h2>
      <p>
        Um enum é declarado fora de classes (geralmente no mesmo arquivo) com a palavra-chave <code>enum</code>. Cada nome listado entre chaves vira uma <strong>constante</strong> — um valor fixo que não pode ser modificado em tempo de execução.
      </p>
      <pre><code>{`// Declaração simples — valores numéricos automáticos a partir de 0
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
}`}</code></pre>
      <p>
        Note três coisas importantes: (1) o tipo de <code>hoje</code> é <code>DiaSemana</code>, não <code>int</code> — o compilador impede que você atribua, por exemplo, <code>DiaSemana hoje = 99;</code> sem um cast explícito. (2) <code>Console.WriteLine</code> imprime o <em>nome</em> da constante, não o número. (3) Para obter o número por trás, faça um cast com <code>(int)</code>.
      </p>

      <AlertBox type="info" title="Por que começar do zero?">
        A numeração automática começa em <strong>0</strong> (e não em 1) porque enums em C# herdam essa convenção da linguagem C, onde índices e valores numéricos quase sempre são baseados em zero.
      </AlertBox>

      <h2>Atribuindo valores manualmente e mudando o tipo base</h2>
      <p>
        Por padrão, os valores são <code>int</code> (32 bits). Se você precisa de menos memória — útil em estruturas grandes, jogos, ou comunicação binária — pode escolher outro tipo inteiro como <code>byte</code> (0 a 255), <code>short</code> ou <code>long</code>. Você também pode atribuir números específicos para casar com códigos de protocolo, status HTTP etc.
      </p>
      <pre><code>{`// Tipo base byte (1 byte) e valores explícitos
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
}`}</code></pre>
      <p>
        O tipo base aparece após o nome do enum, separado por <code>:</code>. Se um valor não couber no tipo escolhido, o compilador acusa erro — é uma rede de proteção embutida.
      </p>

      <h2>Enums como bandeiras: <code>[Flags]</code></h2>
      <p>
        Às vezes um valor não é só um item, mas uma <em>combinação</em> de várias opções. Pense em permissões de arquivo: um usuário pode <em>ler</em>, <em>escrever</em>, <em>executar</em>, ou qualquer combinação dessas três. O atributo <code>[Flags]</code> sinaliza que cada constante representa um bit independente, e operações bit a bit (<code>|</code> para combinar, <code>&amp;</code> para testar) passam a ter sentido.
      </p>
      <pre><code>{`[Flags]
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
}`}</code></pre>
      <p>
        Os valores devem ser <strong>potências de 2</strong> (1, 2, 4, 8, 16…) para que cada bit fique em uma "posição" diferente. O operador <code>&lt;&lt;</code> ("shift left") é um atalho elegante para escrever potências de 2 sem decorar a tabela.
      </p>

      <AlertBox type="warning" title="Sem [Flags], o ToString fica feio">
        Se você combinar bits sem ter marcado o enum com <code>[Flags]</code>, <code>ToString()</code> imprime apenas o número resultante (por exemplo <code>3</code>) em vez de <code>"Ler, Escrever"</code>. O atributo é mais que decoração — ele orienta a serialização.
      </AlertBox>

      <h2>Convertendo entre texto, número e enum</h2>
      <p>
        Frequentemente você lê um valor vindo de um banco de dados, formulário ou API, e precisa transformá-lo em um membro do enum. A família <code>Enum.Parse</code> e <code>Enum.TryParse</code> faz esse trabalho. Sempre prefira <code>TryParse</code> em entradas externas, porque ele <em>não lança exceção</em> em valores inválidos — apenas devolve <code>false</code>.
      </p>
      <pre><code>{`// Texto -> enum (lança exceção se não existir)
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
}`}</code></pre>
      <p>
        Repare em <code>Enum.IsDefined</code>: ele responde se o número corresponde a algum membro declarado. Use-o sempre que aceitar números de fontes não confiáveis, porque o cast <code>(DiaSemana)99</code> compila tranquilamente — só explode em comportamento depois.
      </p>

      <h2>Enums dentro de <code>switch</code></h2>
      <p>
        Enums combinam perfeitamente com a expressão <code>switch</code>: o compilador detecta se você esqueceu de tratar algum caso (com a ajuda do warning <em>CS8524</em>) e o código fica autoexplicativo.
      </p>
      <pre><code>{`string DescreverDia(DiaSemana d) => d switch {
    DiaSemana.Sabado or DiaSemana.Domingo => "Final de semana — descansa!",
    DiaSemana.Segunda                     => "Começo da semana",
    DiaSemana.Sexta                       => "Sexta-feira, sextou!",
    _                                     => "Dia comum de trabalho"
};`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>[Flags]</code>:</strong> ainda assim você consegue combinar valores com <code>|</code>, mas o <code>ToString()</code> e a serialização ficam confusos.</li>
        <li><strong>Usar valores sem ser potência de 2 em flags:</strong> <code>Ler = 1, Escrever = 2, Executar = 3</code> faz <code>Ler | Escrever</code> virar exatamente <code>Executar</code>. Bug silencioso e horrível de depurar.</li>
        <li><strong>Cast direto sem <code>IsDefined</code>:</strong> <code>(DiaSemana)999</code> compila e o programa roda — mas em <code>switch</code> você vai cair em <code>default</code> e nem perceberá.</li>
        <li><strong>Renomear membros sem cuidado:</strong> se você persiste o <em>nome</em> em um banco/JSON, renomear quebra dados antigos. Se persiste o <em>número</em>, renomear é seguro mas mudar a ordem não.</li>
      </ul>

      <AlertBox type="success" title="Quando usar enum em vez de classe">
        Use enum quando o conjunto de valores é <strong>fechado</strong>, <strong>pequeno</strong> e <strong>conhecido em tempo de compilação</strong> (status, dias, modos). Para conjuntos abertos ou que carregam comportamento, prefira classes ou o padrão <em>smart enum</em>.
      </AlertBox>

      <h2>Resumo</h2>
      <ul>
        <li>Enums dão nome a constantes inteiras, tornando o código legível e seguro.</li>
        <li>O tipo base padrão é <code>int</code>, mas pode ser qualquer inteiro (<code>byte</code>, <code>short</code>, <code>long</code>).</li>
        <li><code>[Flags]</code> + potências de 2 permitem combinar opções com operadores bit a bit.</li>
        <li>Use <code>Enum.TryParse</code> para entrada do usuário e <code>Enum.IsDefined</code> para validar números.</li>
        <li><code>Enum.GetValues&lt;T&gt;()</code> itera por todos os membros.</li>
        <li>Combinados com <code>switch</code>, enums geram código exaustivo e auto-documentado.</li>
      </ul>
    </PageContainer>
  );
}
