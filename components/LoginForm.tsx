"use client";

import { useActionState } from "react";
import { Button } from "@/components/Button";
import { login, type LoginFormState } from "@/app/connexion/actions";

const initialState: LoginFormState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="flex flex-col gap-4 max-w-sm">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs uppercase tracking-wide text-noir/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs uppercase tracking-wide text-noir/60">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border border-bois/20 rounded-sm px-3 py-2 text-sm bg-white"
        />
      </div>

      {state.error && <p className="text-sm text-terracotta">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-2 self-start">
        {pending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
