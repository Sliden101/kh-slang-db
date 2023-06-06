// src/pages/index.tsx

import { signIn, signOut, useSession } from "next-auth/react";

import React, { useState } from 'react'
import { api } from "../utils/api";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">Slang Database</h1>
      <p>
        Slang Database For <code>Khmer Language</code>
      </p>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <p className="mb-4 text-center">Hi {session.user?.name}!</p>
              <button
                type="button"
                className="mx-auto block rounded-md bg-neutral-800 py-3 px-6 text-center hover:bg-neutral-700"
                onClick={() => {
                  signOut().catch(console.log);
                }}
              >
                Logout
              </button>
              <div className="pt-6">
                <Form />
              </div>
            </>
          ) : (
            <button
              type="button"
              className="mx-auto block rounded-md bg-neutral-800 py-3 px-6 text-center hover:bg-neutral-700"
              onClick={() => {
                signIn("discord").catch(console.log);
              }}
            >
              Login with Discord
            </button>
          )}
        <div className="pt-10">
          <SlangEntries />
        </div>
        </div>
      </div>
    </main>
  );
};
const SlangEntries = () => {
  const { data: slangEntries, isLoading } = api.slang.getAll.useQuery();

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      {slangEntries?.map((entry, index) => {
        return (
          <div key={index}>
            <p> Slang: {entry.messageSlang}</p>
            <p> Khmer: {entry.messageTranslated}</p>
            <span>Submitted by: {entry.name}</span>
          </div>
        );
      })}
    </div>
  );
};
const Form = () => {
  let [messageSlang, setMessageSlang] = useState("");
  let [messageTranslated, setMessageTranslated] = useState("");

  const { data: session, status } = useSession();

  const postMessage = api.slang.postMessage.useMutation();

  if (status !== "authenticated") return null;

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        postMessage.mutate({
          name: session.user?.name as string,
          messageSlang,
          messageTranslated,
        });
        setMessageSlang("");
        setMessageTranslated("");
      }}
    >
      <input
        type="text"
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
        placeholder="Slang in english, Ex: bong"
        minLength={2}
        maxLength={100}
        value={messageSlang}
        onChange={(event) => setMessageSlang(event.target.value)}
      />
      <input
        type="text"
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
        placeholder="Original in khmer, Ex: បង"
        minLength={2}
        maxLength={100}
        value={messageTranslated}
        onChange={(event) => setMessageTranslated(event.target.value)}
      />

      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

export default Home;