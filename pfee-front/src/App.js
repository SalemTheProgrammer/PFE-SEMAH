import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: `url('/images/company-photo.jpg')` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white">Always a Cut Above the Rest</h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 max-w-2xl">
            Experience the best in hair styling and grooming with our expert team of barbers and stylists.
          </p>
          <button className="mt-6 w-48 bg-orange-500 text-white py-2 px-4 rounded-md text-base hover:bg-orange-600 transition duration-200">
            Get a Haircut Now !
          </button>
        </div>
      </div>

      <div className="services-container py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
          <div className="service-card bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-4">Haircuts</h3>
            <p>From classic cuts to the latest trends, our expert barbers will give you the perfect look.</p>
          </div>
          <div className="service-card bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-4">Shaves</h3>
            <p>Enjoy a traditional hot towel shave that will leave your skin feeling smooth and refreshed.</p>
          </div>
          <div className="service-card bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-4">Hair Coloring</h3>
            <p>Whether you're covering grays or looking for a bold new color, we've got you covered.</p>
          </div>
          <div className="service-card bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-4">Beard Trimming</h3>
            <p>Keep your beard looking sharp with our precision trimming and grooming services.</p>
          </div>
          <div className="service-card bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-4">Scalp Treatments</h3>
            <p>Rejuvenate your scalp with our relaxing treatments that promote healthy hair growth.</p>
          </div>
          <div className="service-card bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-4">Special Occasions</h3>
            <p>Look your best for any event with our special occasion styling services.</p>
          </div>
        </div>
      </div>

      <div className="testimonials-container py-20 bg-gray-800 text-white">
        <h2 className="text-4xl font-bold text-center mb-10">What Our Clients Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
          <div className="testimonial-card bg-gray-700 p-6 rounded-lg shadow-md">
            <p>"The best haircut I've ever had! The attention to detail is unmatched."</p>
            <h4 className="mt-4 font-semibold">- John D.</h4>
          </div>
          <div className="testimonial-card bg-gray-700 p-6 rounded-lg shadow-md">
            <p>"I always leave feeling fresh and confident. Highly recommend!"</p>
            <h4 className="mt-4 font-semibold">- Sarah L.</h4>
          </div>
          <div className="testimonial-card bg-gray-700 p-6 rounded-lg shadow-md">
            <p>"Amazing service and great atmosphere. My go-to spot for grooming."</p>
            <h4 className="mt-4 font-semibold">- Mike R.</h4>
          </div>
        </div>
      </div>

      <div className="gallery-container py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Our Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
          <img src="/images/gallery1.jpg" alt="Gallery 1" className="rounded-lg shadow-md object-cover w-full h-64"/>
          <img src="/images/gallery2.jpg" alt="Gallery 2" className="rounded-lg shadow-md object-cover w-full h-64"/>
          <img src="/images/gallery3.jpg" alt="Gallery 3" className="rounded-lg shadow-md object-cover w-full h-64"/>
          <img src="/images/gallery4.jpg" alt="Gallery 4" className="rounded-lg shadow-md object-cover w-full h-64"/>
          <img src="/images/gallery5.jpg" alt="Gallery 5" className="rounded-lg shadow-md object-cover w-full h-64"/>
          <img src="/images/gallery6.jpg" alt="Gallery 6" className="rounded-lg shadow-md object-cover w-full h-64"/>
        </div>
      </div>

      <div className="footer-container py-10 bg-gray-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-6 text-lg">
            Have questions or want to book an appointment? We’d love to hear from you!
          </p>
          

          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="text-lg mb-2">
              <i className="fas fa-phone-alt"></i> <a href="tel:+1234567890" className="hover:underline">+ (216) 52060101</a>
            </p>
            <p className="text-lg mb-2">
              <i className="fas fa-envelope"></i> <a href="mailto:info@icoiff.com" className="hover:underline">iCoiff@gmail.com</a>
            </p>
            <p className="text-lg">
              <i className="fas fa-map-marker-alt"></i> Sidi Daoud la Marsa
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm">&copy; {new Date().getFullYear()} iCoiff. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
