import React from 'react';

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg mb-6">
          Welcome to iCoiff, where style meets excellence! At iCoiff, we are dedicated to providing the highest quality grooming services for men of all ages. Our skilled barbers bring a wealth of experience and passion to every cut, shave, and style, ensuring you leave our shop looking and feeling your best.
          <br /><br />
          At iCoiff, we believe a great haircut is more than just a routine – it’s an experience. From the moment you walk through our doors, you'll be greeted with a warm, friendly atmosphere and exceptional customer service. Our barbers take the time to understand your unique preferences and work with you to achieve the perfect look.
          <br /><br />
          We offer a wide range of services, including traditional haircuts, modern styles, beard trims, and hot towel shaves. Whether you're looking for a quick trim or a complete makeover, our barbers are here to help you look your best.
          <br /><br />
          Our shop is designed with your comfort and relaxation in mind. Sit back and enjoy a complimentary beverage while you wait, and let our talented team take care of the rest. We use only the finest products to ensure that your hair and skin receive the best care possible.
        </p>
        <img src="/images/company-photo.jpg" alt="Company" className="w-full h-auto max-w-xl mx-auto" />
      </div>
      
    </div>
    
  );
  
}

export default AboutUs;
