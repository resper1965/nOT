import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* ness. Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-tight">
            <span className="text-foreground">ness</span>
            <span className="text-[#00ade8]">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            OT GRC - Governance, Risk & Compliance
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cliente: TBE - Setor Elétrico
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              baseTheme: undefined,
              elements: {
                rootBox: "w-full",
                card: "bg-gray-900 text-gray-50 border border-gray-700 shadow-xl rounded-lg",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formFieldLabel: "text-gray-300 text-sm font-medium",
                formFieldInput: "bg-gray-800 border-gray-600 text-gray-50 rounded-md focus:border-[#00ade8] focus:ring-[#00ade8]/20",
                formButtonPrimary: "bg-[#00ade8] hover:bg-[#00ade8]/90 text-gray-950 font-medium rounded-md transition-colors",
                formButtonSecondary: "bg-gray-700 hover:bg-gray-600 text-gray-50 border-gray-600 rounded-md",
                footerActionText: "text-gray-400 text-sm",
                footerActionLink: "text-[#00ade8] hover:text-[#00ade8]/80 font-medium",
                socialButtonsBlockButton: "bg-gray-800 border-gray-600 text-gray-50 hover:bg-gray-700 rounded-md transition-colors",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-500 text-sm",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                alertText: "text-yellow-400"
              },
              variables: {
                colorPrimary: "#00ade8",
                colorText: "#e2e8f0",
                colorBackground: "#111827",
                colorInputBackground: "#1f2937",
                colorInputText: "#f9fafb",
                borderRadius: "0.375rem"
              }
            }}
            routing="path"
            path="/sign-up"
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Acesso restrito a usuários autorizados
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Powered by <span className="font-medium">ness.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

