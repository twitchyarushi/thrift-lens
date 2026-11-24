import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = { title: "Profile / Thrift Lens" };

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-5xl uppercase leading-none sm:text-6xl">
        Your <span className="font-serif font-bold normal-case italic text-red">closet</span>
      </h1>
      <ProfileView />
    </main>
  );
}
