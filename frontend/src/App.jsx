import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import About from "./components/About";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Products />
        <About />
        <ContactForm />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

export default App;
