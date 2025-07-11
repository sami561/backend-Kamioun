import axios from 'axios';
import Order, { IOrder } from '../model/order.model';

const fetchAndStoreOrders = async (): Promise<void> => {
  try {
    const response = await axios.get(
      'https://uat.kamioun.com/rest/default/V1/orders?searchCriteria[currentPage]=1&searchCriteria[pageSize]=800&fields=items[entity_id,state,status,base_grand_total,created_at,updated_at,customer_id,discount_amount,store_id,items[item_id,order_id,product_id,name,qty_invoiced,row_total_incl_tax,qty_refunded,amount_refunded]]',
      {
        headers: { Authorization: `Bearer pd2as4cqycmj671bga4egknw2csoa9b6` }
      }
    );

    const orders: IOrder[] = response.data.items;

    if (!orders || orders.length === 0) {
      console.log('⚠️ No orders found.');
      return;
    }

    // ✅ Insert/update orders efficiently
    await Order.bulkWrite(
      orders.map((order) => ({
        updateOne: {
          filter: { entity_id: order.entity_id },
          update: { $set: order },
          upsert: true
        }
      }))
    );

    console.log('✅ Orders stored successfully.');
  } catch (error) {
    console.error('❌ Error fetching/storing orders:', error);
  }
};

export default fetchAndStoreOrders;
