"use client";

import { useEffect } from "react";
import { Button } from "@heroui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="bg-white p-8 rounded-xl shadow-xl border max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
        <p className="text-gray-700 mb-6">{error.message || "Ocorreu um erro inesperado."}</p>
        <Button color="primary" onPress={reset}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
