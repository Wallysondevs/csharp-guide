import{j as e}from"./index-CzLAthD5.js";import{P as i,A as s}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(i,{title:"sealed, virtual, override e abstract na prática",subtitle:"As quatro palavras que governam herança e polimorfismo em C#. Domine quando combinar cada uma.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsxs("p",{children:['Imagine um manual de funcionário: algumas regras são "obrigatórias para todos" (tem que assinar o ponto), outras são "padrão, mas você pode mudar se quiser" (uniforme), outras são "está fechado, ninguém mexe" (segurança da empresa). Em C#, os modificadores ',e.jsx("code",{children:"virtual"}),", ",e.jsx("code",{children:"override"}),", ",e.jsx("code",{children:"abstract"})," e ",e.jsx("code",{children:"sealed"})," formam exatamente esse vocabulário: cada um diz quem pode (ou não pode) substituir um comportamento na hierarquia. Combiná-los corretamente é a diferença entre uma hierarquia de classes elegante e um pesadelo de manutenção."]}),e.jsx("h2",{children:"O quarteto, em uma frase cada"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"virtual"})}),': "permite que filhas substituam".']}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"override"})}),': "estou substituindo um método virtual da pai".']}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"abstract"})}),': "é obrigatório que filhas substituam (não há corpo)".']}),e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"sealed"})}),': "esta é a última palavra; ninguém mais pode substituir / herdar".']})]}),e.jsx("h2",{children:"Tabela de combinações válidas"}),e.jsx("p",{children:"A tabela abaixo resume o que cada combinação significa. Note como elas se complementam:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Combinação"}),e.jsx("th",{children:"Significado"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"virtual"})}),e.jsx("td",{children:"Tem corpo padrão; filhas podem substituir."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"abstract"})}),e.jsx("td",{children:"Sem corpo; filhas devem substituir."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"override"})}),e.jsx("td",{children:"Substitui virtual/abstract da pai. Por padrão, ainda é virtual para netas."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"sealed override"})}),e.jsx("td",{children:"Substitui e impede netas de substituírem de novo."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"sealed class"})}),e.jsx("td",{children:"Classe que não pode ter filhas."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"abstract class"})}),e.jsx("td",{children:"Classe que não pode ser instanciada diretamente."})]})]})]}),e.jsxs("h2",{children:[e.jsx("code",{children:"virtual"})," + ",e.jsx("code",{children:"override"}),": o caso clássico"]}),e.jsx("p",{children:"A pai oferece um comportamento padrão; a filha pode aceitar como está ou substituir."}),e.jsx("pre",{children:e.jsx("code",{children:`public class Documento
{
    // virtual: tem corpo, mas filhas podem mudar
    public virtual void Imprimir()
    {
        Console.WriteLine("Imprimindo documento genérico.");
    }
}

public class DocumentoPdf : Documento
{
    public override void Imprimir()
    {
        Console.WriteLine("Renderizando PDF e enviando à impressora.");
    }
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"abstract"}),": forçar a substituição"]}),e.jsxs("p",{children:["Quando o corpo padrão não faz sentido, marque o método como ",e.jsx("code",{children:"abstract"}),". A classe ",e.jsx("em",{children:"inteira"})," também precisa ser ",e.jsx("code",{children:"abstract"}),", e filhas concretas são obrigadas a implementar."]}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract class Forma
{
    public abstract double CalcularArea(); // sem corpo
}

public class Circulo : Forma
{
    public double Raio { get; init; }
    public override double CalcularArea() => Math.PI * Raio * Raio;
}`})}),e.jsxs("h2",{children:[e.jsx("code",{children:"sealed override"}),": a filha que fecha a porta"]}),e.jsxs("p",{children:["Por padrão, um método ",e.jsx("code",{children:"override"}),' continua sendo "abrível" para netas. Se você quer congelar a partir daqui, use ',e.jsx("code",{children:"sealed override"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class Animal
{
    public virtual void Comer() => Console.WriteLine("Comendo...");
}

public class Cachorro : Animal
{
    public sealed override void Comer()
        => Console.WriteLine("Cachorro comendo ração.");
}

public class Bulldog : Cachorro
{
    // public override void Comer() { } // ERRO: foi sealed
}`})}),e.jsxs(s,{type:"info",title:"Por que selar?",children:["Selar evita surpresas: você garante que o comportamento daquele método jamais será alterado por descendentes. Isso ajuda quem mantém o código (não precisa pensar em sub-tipos esquisitos) e ",e.jsx("em",{children:"às vezes"})," permite ao JIT do .NET otimizar a chamada."]}),e.jsxs("h2",{children:[e.jsx("code",{children:"sealed class"}),": classe que não pode ser herdada"]}),e.jsxs("p",{children:["Aplicado à classe inteira, ",e.jsx("code",{children:"sealed"}),' diz "esta classe é folha; ninguém pode herdar". Isso é comum em classes de valor finalizadas, como ',e.jsx("code",{children:"string"}),", ou em classes utilitárias que você quer manter sob controle."]}),e.jsx("pre",{children:e.jsx("code",{children:`public sealed class Cnpj
{
    public string Numero { get; }
    public Cnpj(string numero) { Numero = numero; }
}

// public class CnpjFalso : Cnpj { } // ERRO: Cnpj é sealed`})}),e.jsx("h2",{children:"Performance: o impacto real"}),e.jsxs("p",{children:["Métodos ",e.jsx("code",{children:"virtual"}),' são despachados via uma "tabela virtual" (vtable), que tem um custo mínimo a cada chamada. Métodos não-virtuais (incluindo ',e.jsx("code",{children:"sealed override"})," ou aqueles em uma ",e.jsx("code",{children:"sealed class"}),") podem ser ",e.jsx("em",{children:"devirtualized"})," pelo JIT — o compilador resolve a chamada em tempo de compilação, e até consegue fazer ",e.jsx("em",{children:"inlining"})," (colar o corpo do método no chamador). Em código quente (loops apertados), isso pode fazer diferença mensurável."]}),e.jsx("pre",{children:e.jsx("code",{children:`public sealed class CalculadoraRapida
{
    // Como a classe é sealed, o JIT pode otimizar agressivamente
    public int Dobrar(int x) => x * 2;
}`})}),e.jsxs(s,{type:"warning",title:"Não otimize prematuramente",children:["Não saia selando todas as classes pensando em performance. Selar é uma ",e.jsx("em",{children:"decisão de design"}),' — diga "esta classe não foi planejada para ser herdada". A otimização vem de brinde quando o design pede; não como objetivo principal.']}),e.jsx("h2",{children:"Hierarquia completa, juntando tudo"}),e.jsx("p",{children:"Vejamos um exemplo que combina os quatro modificadores:"}),e.jsx("pre",{children:e.jsx("code",{children:`public abstract class Animal
{
    public string Nome { get; init; } = "";

    // Filha DEVE implementar
    public abstract void EmitirSom();

    // Filha PODE substituir
    public virtual void Apresentar()
        => Console.WriteLine($"Sou {Nome}.");
}

public class Gato : Animal
{
    public override void EmitirSom() => Console.WriteLine("Miau!");

    // Bloqueia netas de mexer em Apresentar
    public sealed override void Apresentar()
    {
        base.Apresentar();
        Console.WriteLine("Sou um gato.");
    }
}

public sealed class GatoPersa : Gato
{
    public override void EmitirSom() => Console.WriteLine("Miaaaau (chique)");
    // Não pode override Apresentar porque foi selado em Gato
    // Não pode ter filhas porque a classe é sealed
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"virtual"})," e tentar ",e.jsx("code",{children:"override"})]}),": o compilador acusa que o método não é overridable."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Tentar ",e.jsx("code",{children:"abstract"})," em classe não-abstrata"]}),": se algum método é abstract, a classe inteira tem que ser abstract."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confundir ",e.jsx("code",{children:"sealed override"})," com ",e.jsx("code",{children:"sealed class"})]}),": o primeiro fecha um método; o segundo fecha a classe toda."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"protected"})," em ",e.jsx("code",{children:"sealed class"})]}),": o compilador alerta — sem filhas, ",e.jsx("code",{children:"protected"})," equivale a ",e.jsx("code",{children:"private"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"virtual"})," permite override; ",e.jsx("code",{children:"override"})," realiza-o."]}),e.jsxs("li",{children:[e.jsx("code",{children:"abstract"})," obriga override e impede instanciação direta."]}),e.jsxs("li",{children:[e.jsx("code",{children:"sealed override"})," congela um método; ",e.jsx("code",{children:"sealed class"})," congela a classe."]}),e.jsx("li",{children:"O JIT pode otimizar chamadas a métodos não-virtuais (devirtualization, inlining)."}),e.jsxs("li",{children:["Use cada modificador como uma ",e.jsx("em",{children:"declaração de intenção de design"}),", não como otimização cega."]})]})]})}export{o as default};
