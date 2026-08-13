"use client";

import { useState } from "react";

import { apiFetch } from "../../services/api";

export default function ApiTestPage() {
  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [resultado, setResultado] =
    useState("");

  const [carregando, setCarregando] =
    useState(false);

  async function executar(action) {
    setCarregando(true);
    setResultado("");

    try {
      const response = await action();

      setResultado(
        JSON.stringify(
          response ?? {
            status: "sucesso",
          },
          null,
          2
        )
      );
    } catch (error) {
      setResultado(
        JSON.stringify(
          {
            status: error.status,
            code: error.code,
            message: error.message,
          },
          null,
          2
        )
      );
    } finally {
      setCarregando(false);
    }
  }

  function login() {
    return executar(() =>
      apiFetch("/api/auth/login", {
        method: "POST",

        body: JSON.stringify({
          email,
          senha,
        }),
      })
    );
  }

  function me() {
    return executar(() =>
      apiFetch("/api/auth/me")
    );
  }

  function logout() {
    return executar(() =>
      apiFetch("/api/auth/logout", {
        method: "POST",
      })
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Teste Frontend → Backend
        </h1>

        <p className="mt-2 text-gray-600">
          Teste temporário da autenticação.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-1 block text-sm font-medium"
            >
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) =>
                setSenha(event.target.value)
              }
              className="w-full rounded border p-2"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={login}
            disabled={carregando}
            className="rounded bg-gray-900 px-4 py-2 text-white"
          >
            Login
          </button>

          <button
            type="button"
            onClick={me}
            disabled={carregando}
            className="rounded border px-4 py-2"
          >
            /me
          </button>

          <button
            type="button"
            onClick={logout}
            disabled={carregando}
            className="rounded border px-4 py-2"
          >
            Logout
          </button>
        </div>

        <pre className="mt-8 overflow-auto rounded bg-gray-900 p-4 text-sm text-white">
          {resultado ||
            "Nenhuma requisição realizada."}
        </pre>
      </div>
    </main>
  );
}