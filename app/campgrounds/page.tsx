import { CampgroundCard } from "@/components/CampgroundCard";

const dummyData = [
  {
    title: "Pine Valley Retreat",
    author: "John Doe",
    price: 75,
    location: "Colorado Springs, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Mountain View Camp",
    author: "Jane Smith",
    price: 85,
    location: "Boulder, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Sunny Meadows",
    author: "Alice Johnson",
    price: 65,
    location: "Denver, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "River Bend",
    author: "Bob Brown",
    price: 70,
    location: "Fort Collins, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Forest Haven",
    author: "Carol White",
    price: 80,
    location: "Aspen, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Lakeside Camp",
    author: "David Green",
    price: 90,
    location: "Lakewood, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Desert Oasis",
    author: "Eve Black",
    price: 60,
    location: "Grand Junction, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Hilltop Hideaway",
    author: "Frank Blue",
    price: 95,
    location: "Golden, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Canyon Creek",
    author: "Grace Yellow",
    price: 85,
    location: "Durango, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Prairie Point",
    author: "Hank Red",
    price: 75,
    location: "Pueblo, CO",
    imageUrl: "/placeholder.svg?height=400&width=600",
  },
];

export default function Page() {
  return (
    <section className="py-12 bg-white w-full">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyData.map((campground, index) => (
            <CampgroundCard
              key={index}
              title={campground.title}
              author={campground.author}
              price={campground.price}
              location={campground.location}
              imageUrl={campground.imageUrl}
            />
          ))}
          {/* Add more CampgroundCard components as needed */}
        </div>
      </div>
    </section>
  );
}
