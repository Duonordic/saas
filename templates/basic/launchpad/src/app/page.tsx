"use client";

import { Button } from "@dn/ui/components/button";

export default function Home() {
  return (
    <div>
      <header>
        <title>launchpad</title>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome to launchpad!</h1>
        <Button onClick={() => console.log("Hello!")}>Click Me</Button>
      </main>
    </div>
  );
}
