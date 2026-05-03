import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NullableReference() {
  return (
    <PageContainer
      title="Nullable reference types: o C# que avisa antes do crash"
      subtitle="Aprenda a deixar o compilador caçar NullReferenceException por você, sem precisar mudar como pensa em código."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        A exceção <code>NullReferenceException</code> é tão famosa que seu inventor, Tony Hoare, a chamou de "o erro de um bilhão de dólares". Ela acontece quando você tenta usar uma variável de referência (uma <em>class</em>, um <em>delegate</em>, um <em>array</em>) que vale <code>null</code> — como tentar abrir uma porta de um endereço que não existe. Desde o C# 8, o compilador ganhou uma arma poderosa contra esse problema: os <strong>nullable reference types</strong>. A ideia: você diz explicitamente quais variáveis <em>podem</em> ser null, e o compilador avisa toda vez que você arrisca usar uma sem checar.
      </p>

      <h2>Ligando o recurso</h2>
      <p>
        Em projetos modernos (.NET 6+), o template já vem com o recurso ligado por padrão no <code>.csproj</code>: <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code>. Em projetos antigos ou para ativar/desativar arquivo a arquivo, use as diretivas do compilador:
      </p>
      <pre><code>{`#nullable enable    // ativa análise neste arquivo
#nullable disable   // desativa
#nullable restore   // volta ao padrão do projeto

#nullable enable
string nome = null;     // AVISO: cannot convert null to non-nullable
string? talvezNome = null;  // OK — '?' diz "pode ser null"
#nullable restore`}</code></pre>
      <p>
        A grande mudança de mentalidade: antes, <code>string</code> aceitava silenciosamente <code>null</code>. Com nullable refs ligado, <code>string</code> significa <strong>"nunca null"</strong> e <code>string?</code> significa <strong>"pode ser null"</strong>. O compilador trata isso como contrato.
      </p>

      <h2>Análise de fluxo: o compilador é esperto</h2>
      <p>
        O compilador não exige que você use <code>!</code> (null-forgiving) toda hora — ele acompanha o <em>fluxo</em> do código e entende quando uma variável <em>já foi verificada</em>. Esse processo é chamado de <strong>flow analysis</strong>.
      </p>
      <pre><code>{`void Imprimir(string? texto) {
    // texto pode ser null aqui
    Console.WriteLine(texto.Length);  // AVISO: dereference of possibly null

    if (texto is null) return;
    // a partir daqui, o compilador SABE que texto não é null
    Console.WriteLine(texto.Length);  // OK!
}

void Outro(string? s) {
    if (string.IsNullOrEmpty(s)) return;
    Console.WriteLine(s.Length);   // OK — IsNullOrEmpty está marcado para o compilador
}`}</code></pre>
      <p>
        O segundo exemplo só funciona porque <code>string.IsNullOrEmpty</code> tem atributos especiais (<code>[NotNullWhen(false)]</code>) que ensinam ao compilador o que o método garante.
      </p>

      <h2>O operador <code>!</code> — null-forgiving</h2>
      <p>
        Às vezes você sabe coisas que o compilador não consegue deduzir (porque vieram de uma chamada externa, de um teste, de um cache que você acabou de preencher). Para esses casos existe o <strong>null-forgiving operator</strong> <code>!</code>. Ele diz "confie em mim, isso não é null" — sem nenhuma verificação em tempo de execução.
      </p>
      <pre><code>{`string? VemDoBanco() => "valor";

string s = VemDoBanco()!;     // promete: não é null
Console.WriteLine(s.Length);

// CUIDADO: se mentir, NullReferenceException volta
string? n = null;
string ruim = n!;             // compila!
Console.WriteLine(ruim.Length); // BOOM em runtime`}</code></pre>

      <AlertBox type="warning" title="Use o ! com parcimônia">
        Cada <code>!</code> no código é uma "promessa não verificada". Se aparecerem dezenas, você essencialmente desligou o recurso. Prefira reorganizar o código para que o compilador <em>prove</em> a não-nulidade — ou use atributos como <code>[MemberNotNull]</code>, <code>[NotNull]</code> e <code>[NotNullWhen]</code>.
      </AlertBox>

      <h2>Atributos avançados: ensinando o compilador</h2>
      <p>
        A análise tem alguns "buracos" que você preenche com atributos do namespace <code>System.Diagnostics.CodeAnalysis</code>. Os mais úteis no dia a dia:
      </p>
      <pre><code>{`using System.Diagnostics.CodeAnalysis;

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
    entrada ?? "padrão";`}</code></pre>
      <p>
        Esses atributos não mudam o comportamento em runtime — eles só aumentam a precisão da análise. Use-os em bibliotecas e código-base grande para diminuir avisos falsos.
      </p>

      <h2>Warnings vs erros</h2>
      <p>
        Tudo isso aparece como <strong>warnings</strong>, não como erros. Em um time disciplinado, vale ligar <code>&lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;</code> no <code>.csproj</code> ou pelo menos os warnings nullable específicos (CS8600, CS8602, CS8603...). Assim, código que arrisca null nem chega ao build.
      </p>
      <pre><code>{`<!-- Trecho do .csproj -->
<PropertyGroup>
  <Nullable>enable</Nullable>
  <WarningsAsErrors>nullable</WarningsAsErrors>
</PropertyGroup>`}</code></pre>

      <h2>Padrões comuns no dia a dia</h2>
      <p>
        Nullable refs combinam muito bem com <em>pattern matching</em>, com o operador <code>??</code> (coalescência nula) e com <code>?.</code> (acesso seguro). Veja como a leitura fica natural:
      </p>
      <pre><code>{`Cliente? c = Buscar(id);

// 1) Default seguro
string nome = c?.Nome ?? "(sem cadastro)";

// 2) Padrão de checagem positiva
if (c is { Email: { } email }) {
    EnviarConfirmacao(email);  // 'email' é string (não-nulo)
}

// 3) Throw helper para argumentos
ArgumentNullException.ThrowIfNull(c);
Console.WriteLine(c.Nome);  // sem aviso, pois 'ThrowIfNull' marca 'c' como não-nulo`}</code></pre>

      <AlertBox type="info" title="Não muda nada em runtime">
        Nullable reference types existem só em tempo de compilação. O tipo de runtime é o mesmo — não há boxing, sobrecarga, ou metadata extra. É puro contrato analisado pelo compilador.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Inicializar campo não-nulo no construtor por engano:</strong> warning CS8618. Inicialize na declaração, no construtor, ou marque como <code>required</code>/nullable.</li>
        <li><strong>Usar <code>!</code> para "calar o compilador":</strong> esconde bug. Reorganize ou checke.</li>
        <li><strong>Passar <code>null</code> para método de biblioteca antiga:</strong> a biblioteca pode aceitar mas seu próprio código não compila — use <code>?</code> no parâmetro local ou <code>[AllowNull]</code>.</li>
        <li><strong>Esquecer de propagar <code>?</code> em DTOs vindos de JSON:</strong> em desserialização, propriedades podem chegar nulas mesmo se você não permitir. Marque corretamente ou valide.</li>
        <li><strong>Misturar arquivos com e sem nullable:</strong> warnings inconsistentes. Padronize no <code>.csproj</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Nullable reference types fazem o compilador alertar sobre acessos a possíveis nulls.</li>
        <li>Ative com <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> no projeto ou <code>#nullable enable</code> no arquivo.</li>
        <li><code>string</code> = nunca null; <code>string?</code> = pode ser null.</li>
        <li>O compilador faz análise de fluxo: depois de checar, a variável é considerada não-nula.</li>
        <li><code>!</code> suprime o aviso, mas é uma promessa não verificada — use com cuidado.</li>
        <li>Atributos como <code>[NotNullWhen]</code>, <code>[MemberNotNull]</code> e <code>[AllowNull]</code> ensinam o compilador.</li>
        <li>Combine com <code>??</code>, <code>?.</code> e pattern matching para código curto e seguro.</li>
      </ul>
    </PageContainer>
  );
}
