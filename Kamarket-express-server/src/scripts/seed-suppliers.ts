import mongoose from "mongoose";
import supplierModel from "../Model/supplier.model";
import dotenv from "dotenv";

dotenv.config();

const suppliers = [
  {
    code: "SUP001",
    company_nameAr: "شركة المورد الأول",
    company_nameFr: "Société Fournisseur Un",
    contact_name: "أحمد محمد",
    phone_number: "+212 600-000001",
    postal_code: "20000",
    city: "الدار البيضاء",
    country: "المغرب",
    capital: "1000000",
    email: "supplier1@example.com",
    tax_registration_number: "123456789",
    address: "123 شارع الرئيسي، الدار البيضاء",
  },
  {
    code: "SUP002",
    company_nameAr: "شركة المورد الثاني",
    company_nameFr: "Société Fournisseur Deux",
    contact_name: "محمد علي",
    phone_number: "+212 600-000002",
    postal_code: "10000",
    city: "الرباط",
    country: "المغرب",
    capital: "800000",
    email: "supplier2@example.com",
    tax_registration_number: "234567890",
    address: "456 شارع الحسن الثاني، الرباط",
  },
  {
    code: "SUP003",
    company_nameAr: "شركة المورد الثالث",
    company_nameFr: "Société Fournisseur Trois",
    contact_name: "فاطمة الزهراء",
    phone_number: "+212 600-000003",
    postal_code: "40000",
    city: "مراكش",
    country: "المغرب",
    capital: "600000",
    email: "supplier3@example.com",
    tax_registration_number: "345678901",
    address: "789 شارع محمد الخامس، مراكش",
  },
  {
    code: "SUP004",
    company_nameAr: "شركة المورد الرابع",
    company_nameFr: "Société Fournisseur Quatre",
    contact_name: "عبد الله",
    phone_number: "+212 600-000004",
    postal_code: "90000",
    city: "طنجة",
    country: "المغرب",
    capital: "500000",
    email: "supplier4@example.com",
    tax_registration_number: "456789012",
    address: "321 شارع ابن سينا، طنجة",
  },
  {
    code: "SUP005",
    company_nameAr: "شركة المورد الخامس",
    company_nameFr: "Société Fournisseur Cinq",
    contact_name: "سارة",
    phone_number: "+212 600-000005",
    postal_code: "80000",
    city: "أكادير",
    country: "المغرب",
    capital: "400000",
    email: "supplier5@example.com",
    tax_registration_number: "567890123",
    address: "654 شارع محمد السادس، أكادير",
  },
];

const seedSuppliers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/kamarket"
    );
    console.log("Connected to MongoDB");

    // Clear existing suppliers
    await supplierModel.deleteMany({});
    console.log("Cleared existing suppliers");

    // Insert new suppliers
    const insertedSuppliers = await supplierModel.insertMany(suppliers);
    console.log(`Successfully inserted ${insertedSuppliers.length} suppliers`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding suppliers:", error);
    process.exit(1);
  }
};

// Run the seed function
seedSuppliers();
