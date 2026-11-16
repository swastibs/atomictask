import { Github } from "lucide-react";
import { config } from "@/config";
import { authApi } from "@/api/auth";

const providers = [
  { id: "google", name: "Google", enabled: config.oauth.google, icon: <span className="font-bold">G</span> },
  { id: "github", name: "GitHub", enabled: config.oauth.github, icon: <Github className="size-4" /> },
];

export default function OAuthButtons() {
  return (
    <div className="oauth-buttons grid grid-cols-2 gap-3">
      {providers.map((provider) => (
        <div className="group relative" key={provider.id}>
          <button
            aria-label={
              provider.enabled
                ? `Continue with ${provider.name}`
                : `${provider.name} OAuth coming soon`
            }
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.035] text-xs font-medium transition hover:bg-white/[.07] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            disabled={!provider.enabled}
            onClick={() => authApi.beginOAuth(provider.id)}
            title={!provider.enabled ? "Coming soon — OAuth provider isn't enabled yet." : undefined}
            type="button"
          >
            {provider.icon} Continue with {provider.name}
          </button>
          {!provider.enabled && (
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#15151e] px-3 py-2 text-xs text-muted opacity-0 shadow-xl transition group-hover:opacity-100">
              Coming soon
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
