import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Identity() {
  return (
    <PageContainer
      title={"ASP.NET Identity"}
      subtitle={"Sistema completo de auth: usuários, roles, claims, MFA."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`builder.Services.AddDbContext<AppDb>(...);
builder.Services.AddIdentity<AppUser, IdentityRole>(opt =>
{
    opt.Password.RequireDigit = true;
    opt.Password.RequiredLength = 12;
    opt.Lockout.MaxFailedAccessAttempts = 5;
    opt.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDb>()
.AddDefaultTokenProviders();

// uso
public class AuthSvc(UserManager<AppUser> users, SignInManager<AppUser> signIn) { }`}
      />

      <AlertBox type="info" title={".NET 8 minimal"}>
        <p>O .NET 8 trouxe endpoints de Identity em uma linha: <code>app.MapIdentityApi&lt;AppUser&gt;()</code>.</p>
      </AlertBox>
    </PageContainer>
  );
}
