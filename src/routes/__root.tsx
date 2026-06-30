import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "@/lib/i18n";
import { ClientOnly } from "@/components/ClientOnly";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { useStore } from "@/lib/store";
import { setLanguage } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground" data-i18n-key="app.notFound">Page not found.</p>
        <Link to="/" className="mt-6 inline-flex h-10 px-4 items-center rounded-full bg-foreground text-background text-sm font-medium">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium"
          >
            Try again
          </button>
          <a href="/" className="h-10 px-4 inline-flex items-center rounded-full border border-border text-sm font-medium">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" },
      { name: "theme-color", content: "#FBFAF7" },
      { title: "Nazwa — نزوة — لذّة الشراء بلا دفع" },
      { name: "description", content: "Nazwa — the joy of shopping without paying. A polished mobile-first simulation marketplace." },
      { property: "og:title", content: "Nazwa — نزوة — لذّة الشراء بلا دفع" },
      { property: "og:description", content: "Nazwa — the joy of shopping without paying. A polished mobile-first simulation marketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Nazwa — نزوة — لذّة الشراء بلا دفع" },
      { name: "twitter:description", content: "Nazwa — the joy of shopping without paying. A polished mobile-first simulation marketplace." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eb626c5f-53d5-4e3a-bacc-aab8ee50d1e2/id-preview-8c3315c7--3e9c88f0-8323-4c7f-8745-67e61d263ea0.lovable.app-1782855128067.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eb626c5f-53d5-4e3a-bacc-aab8ee50d1e2/id-preview-8c3315c7--3e9c88f0-8323-4c7f-8745-67e61d263ea0.lovable.app-1782855128067.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppFrame() {
  const { prefs } = useStore();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", prefs.theme === "dark");
    document.documentElement.lang = prefs.lang;
    document.documentElement.dir = prefs.lang === "ar" ? "rtl" : "ltr";
    setLanguage(prefs.lang);
  }, [prefs.theme, prefs.lang]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DisclaimerBar />
      <TopBar />
      <main className="max-w-md mx-auto pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <Toaster position="top-center" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
        <AppFrame />
      </ClientOnly>
    </QueryClientProvider>
  );
}
