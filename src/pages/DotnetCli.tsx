import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DotnetCli() {
  return (
    <PageContainer
      title={"dotnet CLI essencial"}
      subtitle={"O CLI do .NET é como o npm/cargo do mundo Microsoft: cria projetos, restaura pacotes, builda, testa, publica."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>Comandos do dia a dia</h2>

      <CodeBlock
        language="bash"
        code={`dotnet new list                 # lista templates
dotnet new console -o app       # cria app console
dotnet new webapi -o api        # cria Web API
dotnet new sln                  # cria solution
dotnet sln add ./api/api.csproj # adiciona projeto à solution

dotnet restore                  # baixa pacotes
dotnet build                    # compila
dotnet run                      # build + executa
dotnet test                     # roda testes
dotnet publish -c Release       # gera artefato pra deploy`}
      />

      <h2>NuGet em 30 segundos</h2>

      <CodeBlock
        language="bash"
        code={`dotnet add package Serilog
dotnet add package Newtonsoft.Json --version 13.0.3
dotnet remove package Serilog
dotnet list package
dotnet list package --outdated`}
      />

      <AlertBox type="warning" title={"Workloads"}>
        <p>MAUI, WebAssembly e Android precisam de "workloads" extras: <code>dotnet workload install maui</code>. Sem isso, os templates não aparecem.</p>
      </AlertBox>
    </PageContainer>
  );
}
