"use client";
import Head from "next/head";
import { Button } from "@dn/ui/components/button";

export default function Home() {
  return (
    <div>
      <Head>
        <title>horizon</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-3xl font-bold">Welcome to horizon!</h1>
        <Button variant={"default"} onClick={() => alert("Hello!")}>
          Click Me
        </Button>
      </main>
    </div>
  );
}
