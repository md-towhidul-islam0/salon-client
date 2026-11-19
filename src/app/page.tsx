import Footer from "@/components/Global/Footer";
import NavBar from "@/components/Global/NavBar";
import Banner from "@/components/Home/Banner";

const page = () => {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Banner />
      </main>
      <Footer />
    </div>
  );
};

export default page;
