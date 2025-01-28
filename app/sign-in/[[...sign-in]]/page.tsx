import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="py-12 container mx-auto flex justify-center">
      <SignIn />
    </section>
  );
}
