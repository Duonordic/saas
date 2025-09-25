"use client";
import Head from "next/head";
import { Button } from "@dn/ui/components/button";

export default function Home() {
  return (
    <div>
      <Head>
        <title>ascend</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome to ascend!</h1>
        <Button onClick={() => alert("Hello!")}>Click Me</Button>
      </main>
    </div>
  );
}
