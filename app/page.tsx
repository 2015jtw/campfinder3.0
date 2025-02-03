import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col h-screen">
      <div
        className="relative flex-1 flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">CampFinder</h1>
          <p className="text-lg md:text-xl mb-8">
            This is a place for people who are looking for authentic campsites.
            Once you&apos;ve spent the night at a site, post and rate it here,
            so others will know where to go or where not to.
          </p>
          <Link
            href="/campgrounds"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            View Campgrounds
          </Link>
        </div>
      </div>
    </main>
  );
}
