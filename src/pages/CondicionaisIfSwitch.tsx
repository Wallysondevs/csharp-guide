import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CondicionaisIfSwitch() {
  return (
    <PageContainer
      title="Condicionais: if, else, switch e switch expression"
      subtitle="Como o programa toma decisões: comparar valores e escolher caminhos."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Programar é, em grande parte, dizer ao computador: "se isso acontecer, faça aquilo; senão, faça outra coisa". Esses pontos de bifurcação no fluxo do programa são chamados <strong>condicionais</strong>. C# oferece duas grandes ferramentas: o clássico <code>if/else</code>, presente em quase toda linguagem, e o <code>switch</code>, especializado em comparar um mesmo valor contra várias possibilidades — modernizado nos últimos anos com <em>switch expressions</em> e <em>pattern matching</em>. Saber escolher entre eles deixa o código mais legível e correto.
      </p>

      <h2><code>if</code>, <code>else if</code> e <code>else</code></h2>
      <p>
        A forma básica testa uma <strong>expressão booleana</strong> (algo que avalia para <code>true</code> ou <code>false</code>) e executa o bloco se for verdadeira. <code>else</code> executa se for falsa; <code>else if</code> testa outra condição quando a anterior falhou.
      </p>
      <pre><code>{`int idade = 17;

if (idade >= 18) {
    Console.WriteLine("Maior de idade");
} else if (idade >= 12) {
    Console.WriteLine("Adolescente");
} else {
    Console.WriteLine("Criança");
}`}</code></pre>
      <p>
        As chaves <code>{`{ }`}</code> são opcionais quando o corpo tem só uma instrução, mas <strong>sempre escreva-as</strong>. Sem chaves, adicionar uma segunda linha por engano vira bug silencioso (a famosa "armadilha do <code>goto fail</code>" da Apple foi exatamente isso).
      </p>

      <AlertBox type="warning" title="Sempre use chaves">
        <code>if (x &gt; 0) Faz();</code> funciona, mas é uma cilada. Mantenha o hábito de sempre abrir e fechar chaves — seu eu do futuro agradece.
      </AlertBox>

      <h2>Combinando condições</h2>
      <p>
        Use <code>&amp;&amp;</code> (E lógico) e <code>||</code> (OU lógico) para juntar várias condições. Lembre-se do <em>curto-circuito</em>: se o primeiro lado de <code>&amp;&amp;</code> já é <code>false</code>, o segundo nem é avaliado.
      </p>
      <pre><code>{`if (idade >= 18 && temCnh) {
    Console.WriteLine("Pode dirigir");
}

if (status == "ATIVO" || status == "PENDENTE") {
    Console.WriteLine("Conta utilizável");
}

// Curto-circuito evita NullReferenceException:
if (cliente != null && cliente.Idade >= 18) { … }`}</code></pre>

      <h2><code>switch</code> clássico</h2>
      <p>
        Quando uma única variável é comparada contra <strong>vários valores fixos</strong>, <code>switch</code> deixa o código mais limpo. Cada <code>case</code> trata um valor; <code>default</code> trata "qualquer outro".
      </p>
      <pre><code>{`int dia = 3;
string nome;

switch (dia) {
    case 1: nome = "Domingo"; break;
    case 2: nome = "Segunda"; break;
    case 3: nome = "Terça";   break;
    case 4: nome = "Quarta";  break;
    case 5: nome = "Quinta";  break;
    case 6: nome = "Sexta";   break;
    case 7: nome = "Sábado";  break;
    default: nome = "Inválido"; break;
}

// Múltiplos cases para o mesmo bloco:
switch (dia) {
    case 1:
    case 7:
        Console.WriteLine("Fim de semana");
        break;
    default:
        Console.WriteLine("Dia útil");
        break;
}`}</code></pre>
      <p>
        Em C#, <code>break</code> é obrigatório no fim de cada <code>case</code> (ou <code>return</code>, <code>throw</code>, <code>goto case</code>). Diferente do C/C++/Java, <strong>fall-through</strong> implícito (cair de um case para o próximo) é proibido — o compilador acusa erro.
      </p>

      <h2><code>switch</code> expression (forma moderna)</h2>
      <p>
        Desde o C# 8, existe uma forma compacta que <em>devolve um valor</em>. Usa a sintaxe <code>=&gt;</code> (chamada "arrow") e o caractere <code>_</code> para "qualquer outro caso".
      </p>
      <pre><code>{`string nome = dia switch {
    1 => "Domingo",
    2 => "Segunda",
    3 => "Terça",
    4 => "Quarta",
    5 => "Quinta",
    6 => "Sexta",
    7 => "Sábado",
    _ => "Inválido"
};`}</code></pre>
      <p>
        O switch expression é <strong>uma expressão</strong> — produz um valor que você atribui a algo. O switch tradicional é <strong>uma instrução</strong> — apenas executa código. Quando o objetivo é mapear entrada para saída, prefira a forma expression: ela é mais curta e o compilador exige que todos os casos sejam cobertos.
      </p>

      <h2>Pattern matching e <code>when</code></h2>
      <p>
        Cada <code>case</code> não precisa ser um valor exato; pode ser um <strong>padrão</strong>: tipo, intervalo, propriedade. A cláusula <code>when</code> adiciona uma condição extra.
      </p>
      <pre><code>{`object obj = 42;

string descricao = obj switch {
    int n when n < 0      => "Negativo",
    int 0                 => "Zero",
    int n when n < 10     => "Pequeno",
    int n                 => $"Inteiro: {n}",
    string s              => $"Texto de {s.Length} chars",
    null                  => "Nada",
    _                     => "Desconhecido"
};

// Pattern matching com propriedades:
record Ponto(int X, int Y);

string quadrante = ponto switch {
    { X: > 0, Y: > 0 } => "1º quadrante",
    { X: < 0, Y: > 0 } => "2º quadrante",
    { X: < 0, Y: < 0 } => "3º quadrante",
    { X: > 0, Y: < 0 } => "4º quadrante",
    _                  => "Sobre um eixo"
};`}</code></pre>

      <AlertBox type="info" title="Padrões aceitos">
        Em switch moderno, você pode combinar: tipo (<code>int n</code>), constantes (<code>42</code>), relacionais (<code>&gt;= 18</code>), lógicos (<code>&gt; 0 and &lt; 100</code>, <code>not null</code>), propriedades (<code>{`{ Idade: > 18 }`}</code>), tuplas (<code>(0, 0)</code>) e mais.
        </AlertBox>

      <h2>Quando usar cada um</h2>
      <p>
        Use <code>if/else if</code> quando as condições são <em>diferentes entre si</em> (uma testa idade, outra status, outra horário). Use <code>switch</code> quando você compara <strong>a mesma variável</strong> contra muitos valores. Use <code>switch expression</code> quando o objetivo é traduzir entrada para saída.
      </p>
      <pre><code>{`// Bom uso de if (condições heterogêneas):
if (usuario == null) return "Faça login";
if (!usuario.EmailConfirmado) return "Confirme seu e-mail";
if (usuario.Bloqueado) return "Conta bloqueada";

// Bom uso de switch expression (mapeamento):
decimal aliquota = uf switch {
    "SP" or "RJ" => 0.18m,
    "MG"         => 0.18m,
    _            => 0.17m
};`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>break</code>:</strong> em switch clássico, dá erro de compilação. Não tente "cair" para o próximo case sem usar <code>goto case</code>.</li>
        <li><strong>Não cobrir todos os casos no switch expression:</strong> o compilador avisa, e em runtime falta um case lança <code>SwitchExpressionException</code>.</li>
        <li><strong>Comparar string sem cuidar de case:</strong> <code>"sp" == "SP"</code> é <code>false</code>. Use <code>StringComparer.OrdinalIgnoreCase</code> ou normalize com <code>.ToUpperInvariant()</code>.</li>
        <li><strong>Encadear muito if/else:</strong> mais de 4 níveis indica que talvez um <code>switch</code> ou um polimorfismo seria mais limpo.</li>
        <li><strong>Comparar <code>double</code> com <code>==</code>:</strong> use intervalos (<code>x &gt; 0.99 and x &lt; 1.01</code>) por causa de imprecisão.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>if/else if/else</code> testa condições heterogêneas, sempre com chaves.</li>
        <li><code>&amp;&amp;</code> e <code>||</code> combinam condições com curto-circuito.</li>
        <li><code>switch</code> clássico exige <code>break</code> em cada case; sem fall-through implícito.</li>
        <li>Switch expression devolve um valor e usa <code>=&gt;</code> e <code>_</code>.</li>
        <li>Pattern matching deixa testar tipo, intervalo, propriedades.</li>
        <li><code>when</code> adiciona uma condição extra a um padrão.</li>
      </ul>
    </PageContainer>
  );
}
