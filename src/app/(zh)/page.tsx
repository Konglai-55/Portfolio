import Home from "@/components/home-page";
// The unprefixed entry negotiates language; never cache it across visitors.
export const dynamic = "force-dynamic";
export default function HomePage() { return <Home />; }
