"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="http://localhost:3000/auth/login">
        <button className="btn btn-primary">Login with spotify</button>
      </Link>
    </main>
  );
}
