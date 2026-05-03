import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CsprojAnatomy() {
  return (
    <PageContainer
      title="Entendendo o arquivo .csproj"
      subtitle="O XML que diz ao MSBuild o que compilar, em qual versão do .NET, com quais pacotes e quais opções."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Todo projeto C# tem um arquivo com extensão <code>.csproj</code> — abreviação de <em>C-Sharp Project</em>. É um documento XML que descreve <strong>como construir o projeto</strong>: qual versão do .NET, quais pacotes externos, quais arquivos compilar, quais opções passar ao compilador. Pense nele como o <code>package.json</code> do mundo Node ou o <code>pom.xml</code> do Java/Maven, mas mais minimalista no formato moderno.
      </p>

      <h2>O .csproj moderno: simples e enxuto</h2>
      <p>
        Antes do .NET Core, arquivos <code>.csproj</code> tinham centenas de linhas com listas explícitas de cada arquivo <code>.cs</code> do projeto. Hoje, graças ao SDK Style, um <code>.csproj</code> típico cabe em 7 linhas:
      </p>
      <pre><code>{`<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>`}</code></pre>
      <p>
        Vamos quebrar cada elemento.
      </p>

      <h2>O atributo <code>Sdk</code></h2>
      <p>
        A primeira linha — <code>&lt;Project Sdk="Microsoft.NET.Sdk"&gt;</code> — escolhe um <strong>SDK MSBuild</strong>. SDK aqui não é o ".NET SDK" instalado: é um conjunto de regras de build pré-configuradas. O SDK <code>Microsoft.NET.Sdk</code> diz: "este é um projeto comum; compile todos os arquivos <code>.cs</code> da pasta automaticamente, gere DLL, lide com obj/bin do jeito padrão". Existem outros SDKs:
      </p>
      <ul>
        <li><code>Microsoft.NET.Sdk.Web</code> — para apps ASP.NET Core (adiciona refs implícitas, suporta wwwroot, etc.).</li>
        <li><code>Microsoft.NET.Sdk.Worker</code> — para serviços background.</li>
        <li><code>Microsoft.NET.Sdk.BlazorWebAssembly</code> — para apps Blazor WASM.</li>
        <li><code>Microsoft.NET.Sdk.Razor</code> — para bibliotecas de componentes Razor.</li>
      </ul>

      <h2>PropertyGroup: opções do projeto</h2>
      <p>
        Dentro de <code>&lt;PropertyGroup&gt;</code> ficam pares chave/valor que controlam a compilação:
      </p>
      <table>
        <thead><tr><th>Propriedade</th><th>Significado</th></tr></thead>
        <tbody>
          <tr><td><code>OutputType</code></td><td><code>Exe</code> (executável) ou <code>Library</code> (DLL)</td></tr>
          <tr><td><code>TargetFramework</code></td><td>Versão alvo: <code>net9.0</code>, <code>net8.0</code>, <code>netstandard2.0</code></td></tr>
          <tr><td><code>TargetFrameworks</code></td><td>Plural: compila múltiplos alvos. Ex.: <code>net8.0;net9.0</code></td></tr>
          <tr><td><code>Nullable</code></td><td><code>enable</code> ativa nullable reference types</td></tr>
          <tr><td><code>ImplicitUsings</code></td><td><code>enable</code> adiciona usings comuns automaticamente</td></tr>
          <tr><td><code>LangVersion</code></td><td>Força versão da linguagem (<code>preview</code>, <code>13</code>)</td></tr>
          <tr><td><code>RootNamespace</code></td><td>Namespace base usado por novos arquivos</td></tr>
          <tr><td><code>AssemblyName</code></td><td>Nome do DLL gerado (sem extensão)</td></tr>
          <tr><td><code>TreatWarningsAsErrors</code></td><td><code>true</code> faz warnings quebrarem o build</td></tr>
          <tr><td><code>GenerateDocumentationFile</code></td><td>Gera <code>.xml</code> a partir dos comentários <code>///</code></td></tr>
        </tbody>
      </table>

      <h2>Adicionando dependências (ItemGroup + PackageReference)</h2>
      <p>
        Pacotes NuGet entram em um <code>&lt;ItemGroup&gt;</code> com elementos <code>&lt;PackageReference&gt;</code>. Você pode editar à mão ou (mais comum) usar <code>dotnet add package</code>, que faz isso por você:
      </p>
      <pre><code>{`<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Serilog" Version="4.0.1" />
    <PackageReference Include="Serilog.Sinks.Console" Version="6.0.0" />
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  </ItemGroup>

</Project>`}</code></pre>
      <p>
        O atributo <code>Include</code> é o nome exato do pacote no NuGet.org; <code>Version</code> é a versão (suporta ranges como <code>[1.0,2.0)</code>). Após editar, rode <code>dotnet restore</code> ou simplesmente <code>dotnet build</code> — o restore acontece automaticamente.
      </p>

      <h2>Referenciando outros projetos</h2>
      <p>
        Para usar uma classe definida em outro projeto da mesma solução, use <code>ProjectReference</code>:
      </p>
      <pre><code>{`<ItemGroup>
  <ProjectReference Include="..\\MinhaLib\\MinhaLib.csproj" />
</ItemGroup>`}</code></pre>
      <p>
        Atalho: <code>dotnet add reference ../MinhaLib/MinhaLib.csproj</code>.
      </p>

      <h2>ImplicitUsings: o que é isso?</h2>
      <p>
        Quando <code>&lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;</code> está ligado (padrão a partir do .NET 6), o SDK adiciona automaticamente vários <code>using</code> globais ao seu projeto. Para um SDK <code>Microsoft.NET.Sdk</code>, isso inclui:
      </p>
      <pre><code>{`global using System;
global using System.Collections.Generic;
global using System.IO;
global using System.Linq;
global using System.Net.Http;
global using System.Threading;
global using System.Threading.Tasks;`}</code></pre>
      <p>
        Por isso seu top-level <code>Console.WriteLine</code> funciona sem <code>using System;</code> visível. Se quiser desligar, mude para <code>disable</code>. Para SDK Web, ainda mais usings são adicionados (<code>Microsoft.AspNetCore.*</code>).
      </p>

      <AlertBox type="info" title="Vendo os usings implícitos">
        Eles ficam num arquivo gerado em <code>obj/Debug/net9.0/MeuApp.GlobalUsings.g.cs</code>. Abra e confira — útil quando algo "magicamente" funciona ou some.
      </AlertBox>

      <h2>Excluindo ou incluindo arquivos manualmente</h2>
      <p>
        Por padrão, o SDK compila todo arquivo <code>.cs</code> abaixo da pasta do <code>.csproj</code>. Se você precisar excluir algo:
      </p>
      <pre><code>{`<ItemGroup>
  <!-- Não compila esta pasta inteira -->
  <Compile Remove="ScriptsAuxiliares\\**\\*.cs" />

  <!-- Inclui um arquivo específico de fora -->
  <Compile Include="..\\Compartilhado\\Helpers.cs" Link="Helpers.cs" />

  <!-- Embute um arquivo como recurso -->
  <EmbeddedResource Include="dados\\config.json" />

  <!-- Copia para o diretório de saída -->
  <None Update="appsettings.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </None>
</ItemGroup>`}</code></pre>

      <h2>Multi-targeting: rodar em várias versões</h2>
      <p>
        Bibliotecas que querem servir tanto .NET Framework quanto .NET moderno usam <code>TargetFrameworks</code> (note o S):
      </p>
      <pre><code>{`<TargetFrameworks>netstandard2.0;net8.0;net9.0</TargetFrameworks>`}</code></pre>
      <p>
        O build gera um DLL para cada alvo. Útil para autores de bibliotecas; raro em apps finais.
      </p>

      <h2>Conceitos MSBuild que vale conhecer</h2>
      <ul>
        <li><strong>MSBuild</strong> é o motor de build da Microsoft. O <code>dotnet build</code> chama o MSBuild internamente.</li>
        <li><strong>Targets</strong> são "tarefas" definidas no SDK (Build, Clean, Restore, Publish). Você pode adicionar customizadas.</li>
        <li><strong>Properties</strong> (no PropertyGroup) podem ser sobrescritas via linha de comando: <code>dotnet build -p:Configuration=Release</code>.</li>
        <li><strong>Conditions</strong>: blocos podem ser condicionais. Ex.: <code>&lt;PackageReference Include="X" Condition="'$(TargetFramework)'=='net8.0'" /&gt;</code>.</li>
      </ul>

      <AlertBox type="warning" title="Não duplique pacotes em projetos transitivos">
        Se Projeto A referencia B, e B referencia o pacote <code>Newtonsoft.Json</code>, você não precisa adicioná-lo de novo em A — o NuGet resolve transitivamente. Adicione manualmente só se precisar de uma versão diferente.
      </AlertBox>

      <h2>Editando o .csproj à mão x via CLI</h2>
      <pre><code>{`# Adiciona pacote (edita o .csproj automaticamente)
dotnet add package Dapper --version 2.1.66

# Remove pacote
dotnet remove package Dapper

# Adiciona referência a outro projeto
dotnet add reference ../OutroProj/OutroProj.csproj

# Lista pacotes
dotnet list package`}</code></pre>
      <p>
        Em projetos pequenos, editar à mão é ok. Em projetos com muitos pacotes, prefira a CLI — ela mantém ordenação consistente e evita typos.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>XML mal formado:</strong> uma tag não fechada quebra todo o build com mensagem confusa do MSBuild. Use editor com syntax highlight.</li>
        <li><strong>TargetFramework inexistente:</strong> "The reference assemblies for net99.0 were not found" → versão errada ou SDK não instalado.</li>
        <li><strong>Versões conflitantes de pacote:</strong> NuGet escolhe a maior. Se quebrar, force versão específica em <code>PackageReference</code>.</li>
        <li><strong>Editando .csproj com app aberto:</strong> em IDEs antigas, alterações fora podem desincronizar. Recarregue o projeto.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>.csproj</code> é XML que descreve o projeto para o MSBuild.</li>
        <li><code>Sdk="Microsoft.NET.Sdk"</code> ativa convenções padrão.</li>
        <li><code>TargetFramework</code> define qual .NET; <code>OutputType</code> diz se é Exe ou Library.</li>
        <li>Dependências NuGet vão em <code>&lt;PackageReference&gt;</code>.</li>
        <li><code>ImplicitUsings</code> e <code>Nullable</code> são opt-in/opt-out de comportamentos modernos.</li>
        <li>Use a CLI <code>dotnet add</code> para evitar editar XML à mão.</li>
      </ul>
    </PageContainer>
  );
}
