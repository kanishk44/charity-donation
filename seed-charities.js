const sequelize = require("./config/database");
const Charity = require("./models/charity");
const bcrypt = require("bcryptjs");

const charityData = [
  {
    name: "Education For All",
    email: "info@educationforall.org",
    password: "charity123",
    description:
      "We work to provide quality education to underprivileged children across the country. Our programs include school infrastructure development, teacher training, and student scholarships.",
    mission:
      "To ensure every child has access to quality education regardless of their economic background.",
    website: "https://educationforall.org",
    phone: "+91-9876543210",
    address: "123 Education Street, Knowledge Park",
    category: "education",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    registrationNumber: "EDU123456",
    status: "approved",
  },
  {
    name: "Green Earth Initiative",
    email: "info@greenearth.org",
    password: "charity123",
    description:
      "Dedicated to environmental conservation through tree planting, waste management, and community awareness programs. We've planted over 100,000 trees and established recycling programs in 50 communities.",
    mission: "To create a sustainable and green future for coming generations.",
    website: "https://greenearth.org",
    phone: "+91-9876543211",
    address: "45 Green Avenue, Nature Valley",
    category: "environment",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    registrationNumber: "GEF345678",
    status: "approved",
  },
  {
    name: "Healthcare Heroes",
    email: "support@healthcareheroes.org",
    password: "charity123",
    description:
      "Providing medical care to remote villages through mobile clinics and telemedicine. We also conduct regular health camps and awareness programs.",
    mission: "Making quality healthcare accessible to everyone.",
    website: "https://healthcareheroes.org",
    phone: "+91-9876543212",
    address: "789 Health Avenue, Medical District",
    category: "healthcare",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    registrationNumber: "HCI789012",
    status: "approved",
  },
  {
    name: "Animal Rescue Network",
    email: "help@animalrescue.org",
    password: "charity123",
    description:
      "We rescue, rehabilitate, and rehome abandoned and injured animals. Our network includes veterinary care, shelter facilities, and adoption programs.",
    mission: "To protect and care for animals in need.",
    website: "https://animalrescue.org",
    phone: "+91-9876543213",
    address: "56 Paw Street, Pet Haven",
    category: "animals",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    registrationNumber: "ANR456789",
    status: "approved",
  },
  {
    name: "Hunger Relief Foundation",
    email: "contact@hungerrelief.org",
    password: "charity123",
    description:
      "Fighting hunger through food banks, community kitchens, and sustainable farming initiatives. We serve over 10,000 meals daily to those in need.",
    mission: "To eliminate hunger and promote food security.",
    website: "https://hungerrelief.org",
    phone: "+91-9876543214",
    address: "321 Food Street, Community Center",
    category: "poverty",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    registrationNumber: "HRF567890",
    status: "approved",
  },
];

async function seedCharities() {
  try {
    // Sync database
    await sequelize.sync({ alter: true });

    // Check if charities already exist
    const existingCharities = await Charity.count();
    if (existingCharities === 0) {
      // Hash passwords and create charities
      for (const charity of charityData) {
        const hashedPassword = await bcrypt.hash(charity.password, 10);
        await Charity.create({
          ...charity,
          password: hashedPassword,
        });
      }
      console.log("Charities seeded successfully!");
    } else {
      console.log("Charities already exist, skipping seed");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding charities:", error);
    process.exit(1);
  }
}

seedCharities();
