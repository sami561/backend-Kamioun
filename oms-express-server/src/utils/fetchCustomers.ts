import axios from 'axios';
import Customer, { ICustomer } from '../model/customer.model';

// Define the type for custom attributes
interface CustomAttribute {
  attribute_code: string;
  value: string | null;
}

const fetchAndStoreCustomers = async (): Promise<void> => {
  try {
    const response = await axios.get(
      'https://uat.kamioun.com/rest/default/V1/customers/search?searchCriteria[pageSize]=8000&fields=items[id,created_at,updated_at,gender,store_id,website_id,addresses,custom_attributes]',
      {
        headers: { Authorization: `Bearer pd2as4cqycmj671bga4egknw2csoa9b6` }
      }
    );

    const customers = response.data.items.map((customer: any) => {
      // Extract custom attributes like zone, retailer_profile, and governorate
      const customAttributes = Object.fromEntries(
        (customer.custom_attributes || []).map((attr: any) => [attr.attribute_code, attr.value])
      );

      // Extract zone, retailer_profile, and governorate
      const zone = customAttributes.zone || '';
      const retailer_profile = customAttributes.retailer_profile || '';
      const governorate = customAttributes.governorate || '';

      return {
        id: customer.id,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        gender: customer.gender,
        store_id: customer.store_id,
        website_id: customer.website_id,
        addresses: customer.addresses || [],
        zone, // Add the extracted zone
        retailer_profile, // Add the extracted retailer_profile
        governorate, // Add the extracted governorate
      };
    });

    if (customers.length === 0) {
      console.log('⚠️ No customers found.');
      return;
    }

    // ✅ Bulk update/insert
    await Customer.bulkWrite(
      customers.map((customer: ICustomer) => ({
        updateOne: {
          filter: { id: customer.id },
          update: { $set: customer },
          upsert: true,
        },
      }))
    );

    console.log('✅ Customers stored successfully.');
  } catch (error) {
    console.error('❌ Error fetching/storing customers:', error);
  }
};

export default fetchAndStoreCustomers;
