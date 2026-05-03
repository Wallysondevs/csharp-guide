import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(o,{title:"Generic Math: aritmética genérica com INumber<T>",subtitle:"Como o .NET 7 finalmente permitiu escrever 'somar duas coisas' sem saber se são int, double ou decimal.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsxs("p",{children:["Por décadas, programadores de C# bateram a cabeça com um problema aparentemente trivial: escrever um método ",e.jsx("code",{children:"Somar<T>(T a, T b)"}),". O obstáculo? Operadores como ",e.jsx("code",{children:"+"}),", ",e.jsx("code",{children:"-"})," e ",e.jsx("code",{children:"*"})," não fazem parte de nenhuma interface — eles são ",e.jsx("em",{children:"operadores estáticos"})," definidos no próprio tipo. Como restringir ",e.jsx("code",{children:"T"}),' a "tipos que sabem somar"? Era preciso escrever uma versão para ',e.jsx("code",{children:"int"}),", outra para ",e.jsx("code",{children:"double"}),", outra para ",e.jsx("code",{children:"decimal"}),"... A solução chegou no .NET 7 / C# 11 com ",e.jsx("strong",{children:"Generic Math"}),', uma família de interfaces que finalmente expõe os operadores. Pense numa receita de bolo que aceita "qualquer farinha" — antes você precisava de receitas separadas, agora uma só serve.']}),e.jsx("h2",{children:"O problema histórico"}),e.jsx("p",{children:"Tente escrever isso em C# pré-7:"}),e.jsx("pre",{children:e.jsx("code",{children:`public static T Somar<T>(T a, T b) {
    return a + b;   // ERRO CS0019: Operator '+' cannot be applied to operands of type 'T' and 'T'
}`})}),e.jsxs("p",{children:["O compilador não tem ideia de que ",e.jsx("code",{children:"T"})," tenha o operador ",e.jsx("code",{children:"+"}),". Restrições como ",e.jsx("code",{children:"where T : IComparable"})," ajudam para ",e.jsx("code",{children:"CompareTo"}),", mas não há ",e.jsx("code",{children:"IAddable"})," no .NET clássico. As soluções ",e.jsx("em",{children:"workarounds"})," envolviam ",e.jsx("code",{children:"dynamic"})," (lento) ou ",e.jsx("code",{children:"Expression"})," (complicado)."]}),e.jsxs("h2",{children:["O ingrediente novo: ",e.jsx("code",{children:"static abstract"})," em interfaces"]}),e.jsxs("p",{children:["Para que uma interface possa exigir um operador, ela precisa exigir ",e.jsx("strong",{children:"membros estáticos"}),". Isso era impossível antes — interfaces só podiam ter membros de instância. O C# 11 introduziu ",e.jsx("code",{children:"static abstract"})," e ",e.jsx("code",{children:"static virtual"}),' em interfaces. Isso significa: "todo tipo que implementa esta interface tem que fornecer este método estático."']}),e.jsx("pre",{children:e.jsx("code",{children:`// Versão simplificada do que existe em System.Numerics
public interface IAdicionavel<T> where T : IAdicionavel<T> {
    static abstract T operator +(T a, T b);
}

public struct Moeda : IAdicionavel<Moeda> {
    public decimal Valor;
    public static Moeda operator +(Moeda a, Moeda b) =>
        new Moeda { Valor = a.Valor + b.Valor };
}`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"where T : IAdicionavel<T>"})," é o ",e.jsx("strong",{children:'"curiously recurring template pattern" (CRTP)'})," — o tipo aparece como parâmetro de si mesmo, garantindo que o operador retorne o tipo concreto."]}),e.jsxs("h2",{children:["As interfaces do ",e.jsx("code",{children:"System.Numerics"})]}),e.jsx("p",{children:"O .NET 7+ trouxe um catálogo extenso. As principais para o dia-a-dia:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Interface"}),e.jsx("th",{children:"O que exige"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"INumber<T>"})}),e.jsx("td",{children:"União de quase tudo: aritmética, comparação, parsing. Implementada por todos os tipos numéricos do .NET."})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"INumberBase<T>"})}),e.jsxs("td",{children:["Base mínima — operadores ",e.jsx("code",{children:"+ - * /"}),", ",e.jsx("code",{children:"Zero"}),", ",e.jsx("code",{children:"One"}),"."]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"IAdditionOperators<TSelf,TOther,TResult>"})}),e.jsxs("td",{children:["Apenas o operador ",e.jsx("code",{children:"+"}),"."]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"IComparisonOperators<TSelf,TOther,TResult>"})}),e.jsxs("td",{children:[e.jsx("code",{children:"<"}),", ",e.jsx("code",{children:"<="}),", ",e.jsx("code",{children:">"}),", ",e.jsx("code",{children:">="}),"."]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"IFloatingPoint<T>"})}),e.jsxs("td",{children:["Adicionais para ",e.jsx("code",{children:"double"}),", ",e.jsx("code",{children:"float"}),": ",e.jsx("code",{children:"Sqrt"}),", ",e.jsx("code",{children:"Pi"}),", etc."]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"IBinaryInteger<T>"})}),e.jsx("td",{children:"Operações bitwise específicas de inteiros."})]})]})]}),e.jsxs("h2",{children:["Exemplo prático: ",e.jsx("code",{children:"Sum"})," genérico"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Numerics;

public static class MeuMath {
    public static T Soma<T>(IEnumerable<T> valores) where T : INumber<T> {
        T total = T.Zero;   // 'Zero' é membro estático exigido por INumber
        foreach (var v in valores) total += v;
        return total;
    }

    public static T Media<T>(IEnumerable<T> valores) where T : INumber<T> {
        T total = T.Zero;
        int n = 0;
        foreach (var v in valores) { total += v; n++; }
        return total / T.CreateChecked(n);
    }
}

int s1 = MeuMath.Soma(new[] { 1, 2, 3 });             // 6
double s2 = MeuMath.Soma(new[] { 1.5, 2.5, 3.0 });    // 7.0
decimal s3 = MeuMath.Soma(new decimal[] { 10m, 20m });// 30m
double m = MeuMath.Media(new[] { 10.0, 20.0, 30.0 }); // 20.0`})}),e.jsxs("p",{children:["Note os elementos novos: ",e.jsx("code",{children:"T.Zero"})," (chamada estática direta no parâmetro genérico — só possível com ",e.jsx("code",{children:"static abstract"}),") e ",e.jsx("code",{children:"T.CreateChecked(n)"}),", que converte um ",e.jsx("code",{children:"int"})," para o tipo ",e.jsx("code",{children:"T"})," validando overflow."]}),e.jsx(r,{type:"info",title:"Performance é nativa",children:'O JIT especializa o método para cada tipo concreto, gerando código tão rápido quanto se você tivesse escrito uma versão dedicada. Não há reflexão nem boxing — é "monomorfização" típica de generics em C#.'}),e.jsxs("h2",{children:["Conversões genéricas: ",e.jsx("code",{children:"CreateChecked"})," e amigos"]}),e.jsx("p",{children:"Quando você precisa converter de um tipo numérico genérico para outro, use os métodos estáticos da interface. Existem três variantes para cada destino:"}),e.jsx("pre",{children:e.jsx("code",{children:`// CreateChecked: lança OverflowException se não couber
int i1 = int.CreateChecked(300L);          // 300

// CreateSaturating: trunca ao valor máximo/mínimo
int i2 = int.CreateSaturating(long.MaxValue);  // int.MaxValue

// CreateTruncating: descarta bits que sobram (tipo cast em C-style)
byte b = byte.CreateTruncating(257);            // 1 (257 % 256)`})}),e.jsxs("h2",{children:["Restrições mais finas que ",e.jsx("code",{children:"INumber"})]}),e.jsx("p",{children:"Se seu método precisa só de uma operação (digamos, somar e multiplicar), use a interface mais específica. Isso permite que mais tipos sirvam — inclusive os que você criar:"}),e.jsx("pre",{children:e.jsx("code",{children:`public static T Triplo<T>(T x) where T : IAdditionOperators<T, T, T> {
    return x + x + x;
}

// Para operações que exijam apenas comparações:
public static bool MaiorQue<T>(T a, T b) where T : IComparisonOperators<T, T, bool> {
    return a > b;
}`})}),e.jsx("h2",{children:"Implementando seu próprio tipo numérico"}),e.jsx("p",{children:"Você pode criar tipos compatíveis com Generic Math implementando as interfaces relevantes. Útil para domínios como dinheiro, vetores, matrizes:"}),e.jsx("pre",{children:e.jsx("code",{children:`public readonly struct Vetor2 :
    IAdditionOperators<Vetor2, Vetor2, Vetor2>,
    IMultiplyOperators<Vetor2, double, Vetor2>
{
    public double X { get; }
    public double Y { get; }
    public Vetor2(double x, double y) { X = x; Y = y; }

    public static Vetor2 operator +(Vetor2 a, Vetor2 b) => new(a.X + b.X, a.Y + b.Y);
    public static Vetor2 operator *(Vetor2 v, double k)  => new(v.X * k, v.Y * k);
}

// Agora Triplo<Vetor2> compila!
var v = MeuMath.Soma(new[] { new Vetor2(1, 0), new Vetor2(0, 1) });`})}),e.jsxs(r,{type:"warning",title:"Requer .NET 7 ou superior",children:["Generic Math depende de ",e.jsx("code",{children:"static abstract"})," em interfaces, recurso introduzido no C# 11 + .NET 7 (2022). Em projetos anteriores, você não terá ",e.jsx("code",{children:"INumber<T>"})," nem conseguirá declarar membros estáticos abstratos. Atualize o TFM (",e.jsx("code",{children:"net8.0"})," ou superior) e o ",e.jsx("code",{children:"LangVersion"}),"."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer o ",e.jsx("code",{children:"using System.Numerics;"}),":"]})," as interfaces de Generic Math vivem nesse namespace."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"T.Zero"})," sem ",e.jsx("code",{children:"where T : INumber<T>"}),":"]})," a chamada estática só está disponível depois da restrição."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer o CRTP:"})," ao definir suas próprias interfaces estáticas, declare ",e.jsx("code",{children:"where T : IMinha<T>"})," para o operador devolver o tipo concreto."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Convert.ToInt32(t)"})," em código genérico:"]})," prefira ",e.jsx("code",{children:"int.CreateChecked(t)"}),", que respeita a interface."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Confundir overflow:"})," escolha entre ",e.jsx("code",{children:"CreateChecked"})," (lança), ",e.jsx("code",{children:"CreateSaturating"})," (clamp) e ",e.jsx("code",{children:"CreateTruncating"})," (rolagem) conforme sua intenção."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Generic Math (.NET 7+) permite escrever aritmética genuinamente genérica."}),e.jsxs("li",{children:["Possível graças a ",e.jsx("code",{children:"static abstract"})," em interfaces (C# 11)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"INumber<T>"})," cobre todos os tipos numéricos do framework."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"T.Zero"}),", ",e.jsx("code",{children:"T.One"}),", ",e.jsx("code",{children:"T.CreateChecked(...)"})," para operar genericamente."]}),e.jsx("li",{children:"Implemente as interfaces relevantes para tornar seus tipos compatíveis."})]})]})}export{a as default};
