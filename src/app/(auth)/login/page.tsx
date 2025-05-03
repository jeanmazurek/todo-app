import Login from "@/components/login";
import React from "react";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";

export default async function LoginPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // O middleware já está gerenciando redirecionamentos quando o usuário está autenticado
    // Esta página só será renderizada para usuários não autenticados
    return <Login />;
};