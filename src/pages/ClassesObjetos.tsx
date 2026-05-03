import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ClassesObjetos() {
  return (
    <PageContainer
      title="Classes e objetos: a base da POO"
      subtitle="Entenda de uma vez o que é uma classe, o que é um objeto e por que eles são o coração de C#."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine a planta arquitetônica de uma casa: ela descreve quantos cômodos existem, onde ficam as portas, qual é o tamanho da cozinha. A planta <strong>não é uma casa</strong> — é apenas um <em>projeto</em>. A partir da mesma planta você pode construir 1, 10 ou 1000 casas, e cada uma será uma casa real, com endereço próprio, cor própria e moradores próprios. Em C#, a <strong>classe</strong> é a planta, e cada <strong>objeto</strong> é uma casa construída a partir dela. Esse é o pilar central da <strong>Programação Orientada a Objetos</strong> (POO).
      </p>

      <h2>O que é uma classe?</h2>
      <p>
        Uma <strong>classe</strong> é uma estrutura que agrupa <em>dados</em> (chamados de campos ou propriedades) e <em>comportamentos</em> (chamados de métodos) que andam juntos. Em vez de espalhar variáveis soltas pelo programa, você as agrupa em uma "caixa" coerente. Por exemplo, em vez de ter as variáveis <code>nomeCarro1</code>, <code>velocidadeCarro1</code>, <code>nomeCarro2</code>, <code>velocidadeCarro2</code> espalhadas, você cria uma classe <code>Carro</code> que conhece <em>como</em> um carro deve se comportar.
      </p>
      <pre><code>{`// Definição da classe (a "planta")
public class Carro
{
    // Campos: dados que cada carro carrega
    public string Modelo;
    public string Cor;
    public int Velocidade;

    // Método: comportamento que todo carro sabe fazer
    public void Acelerar(int incremento)
    {
        Velocidade += incremento;
        Console.WriteLine($"{Modelo} agora está a {Velocidade} km/h.");
    }
}`}</code></pre>
      <p>
        Repare: a classe <code>Carro</code> sozinha não faz nada. Ela apenas <em>descreve</em> que todo carro tem modelo, cor, velocidade e sabe acelerar. Para usá-la, você precisa <strong>instanciar</strong> — ou seja, fabricar um carro real a partir dessa planta.
      </p>

      <h2>Criando objetos com <code>new</code></h2>
      <p>
        A palavra-chave <code>new</code> é o "pedreiro" que constrói uma casa a partir da planta. Ela aloca memória para um novo objeto e devolve uma referência a ele. Você guarda essa referência em uma variável.
      </p>
      <pre><code>{`// Cria dois objetos (instâncias) independentes da mesma classe
Carro fusca = new Carro();
fusca.Modelo = "Fusca 1972";
fusca.Cor = "Azul";
fusca.Velocidade = 0;

Carro ferrari = new Carro();
ferrari.Modelo = "Ferrari F40";
ferrari.Cor = "Vermelha";
ferrari.Velocidade = 0;

fusca.Acelerar(20);     // Fusca 1972 agora está a 20 km/h.
ferrari.Acelerar(150);  // Ferrari F40 agora está a 150 km/h.`}</code></pre>
      <p>
        Note como cada objeto tem sua própria velocidade. Acelerar a Ferrari não muda a velocidade do Fusca, porque cada chamada de <code>new Carro()</code> reservou um pedaço diferente de memória. Esses pedaços são <em>instâncias</em>: cópias vivas da planta.
      </p>

      <AlertBox type="info" title="Tipo valor x tipo referência">
        Classes em C# são <strong>tipos por referência</strong>: a variável <code>fusca</code> não guarda o objeto em si, e sim um <em>endereço de memória</em> apontando para ele. Por isso, se você atribuir <code>Carro outro = fusca;</code>, ambas as variáveis enxergam o mesmo carro.
      </AlertBox>

      <h2>Campos vs propriedades</h2>
      <p>
        No exemplo acima, usamos <strong>campos públicos</strong> (<code>public string Modelo;</code>) para simplicidade. Funciona, mas em código profissional você quase sempre usará <strong>propriedades</strong>, que parecem campos por fora, mas permitem validar e controlar o acesso por dentro. A versão idiomática moderna usa <em>auto-properties</em>:
      </p>
      <pre><code>{`public class Pessoa
{
    // Auto-properties: o compilador cria o "campo escondido" para você
    public string Nome { get; set; } = "";
    public int Idade { get; set; }

    public void Apresentar()
    {
        Console.WriteLine($"Olá, eu sou {Nome} e tenho {Idade} anos.");
    }
}

var maria = new Pessoa { Nome = "Maria", Idade = 30 };
maria.Apresentar(); // Olá, eu sou Maria e tenho 30 anos.`}</code></pre>
      <p>
        A diferença visual é pequena (<code>{`{ get; set; }`}</code> no fim), mas o ganho é enorme: amanhã você pode adicionar regras como "idade não pode ser negativa" sem mudar uma linha sequer no código que <em>usa</em> a classe. Veremos isso a fundo no capítulo de Propriedades.
      </p>

      <h2>Métodos de instância e a palavra <code>this</code></h2>
      <p>
        Quando você chama <code>fusca.Acelerar(20)</code>, dentro do método <code>Acelerar</code> a palavra <code>this</code> se refere automaticamente ao Fusca. Use <code>this</code> quando precisar deixar claro que está mexendo num campo da própria instância — especialmente quando um parâmetro tem o mesmo nome de um campo.
      </p>
      <pre><code>{`public class ContaBancaria
{
    public string Titular { get; set; } = "";
    public decimal Saldo { get; private set; }

    public void Depositar(decimal valor)
    {
        // 'this.Saldo' deixa explícito que estamos atualizando o
        // Saldo desta instância em particular
        this.Saldo += valor;
        Console.WriteLine($"{Titular} depositou {valor:C}. Saldo: {Saldo:C}");
    }
}

var conta = new ContaBancaria { Titular = "João", Saldo = 0 };
conta.Depositar(500m); // João depositou R$ 500,00. Saldo: R$ 500,00`}</code></pre>

      <AlertBox type="warning" title="Cuidado com referências compartilhadas">
        Como objetos são por referência, passar um objeto para um método pode permitir que o método o modifique. Se você quer evitar isso, considere usar <code>record</code> (com semântica de valor) ou expor apenas propriedades de leitura.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>new</code></strong>: declarar <code>Carro c;</code> sem instanciar deixa <code>c</code> valendo <code>null</code>; usar <code>c.Acelerar(...)</code> resulta em <code>NullReferenceException</code>.</li>
        <li><strong>Confundir classe com objeto</strong>: você não chama métodos na classe (<code>Carro.Acelerar</code>), você chama no objeto (<code>fusca.Acelerar</code>). Métodos chamados na classe diretamente são <code>static</code>, assunto futuro.</li>
        <li><strong>Modificar um objeto pensando que é cópia</strong>: <code>var b = a;</code> não copia o objeto, copia a referência. Mudanças em <code>b</code> afetam <code>a</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Classe é a planta; objeto é a casa construída a partir dela.</li>
        <li>Use <code>new NomeDaClasse()</code> para criar uma instância.</li>
        <li>Cada instância tem seus próprios dados, independentes das outras.</li>
        <li>Prefira propriedades (<code>{`{ get; set; }`}</code>) a campos públicos.</li>
        <li>Métodos de instância operam sobre o objeto chamado e podem usar <code>this</code> para se referir a ele.</li>
        <li>Classes são tipos por <em>referência</em>: cuidado ao "copiar" variáveis.</li>
      </ul>
    </PageContainer>
  );
}
