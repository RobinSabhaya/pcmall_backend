const EasyPost = require("@easypost/api");
const api = new EasyPost(process.env.EASYPOST_API_KEY);

async function easypostShippingStrategy(order, session) {
  const shipment = new api.Shipment({
    to_address: {
      name: order.shipping.name,
      street1: order.shipping.address,
      city: order.shipping.city,
      state: order.shipping.state,
      zip: order.shipping.zip,
      country: order.shipping.country,
    },
    from_address: {
      company: "My Company",
      street1: "123 Origin St",
      city: "San Francisco",
      state: "CA",
      zip: "94111",
      country: "US",
    },
    parcel: {
      length: 10,
      width: 6,
      height: 4,
      weight: 16,
    },
  });

  await shipment.save();

  const lowestRate = shipment.lowestRate();
  order.shippingLabel = lowestRate;
  await order.save({ session });

  return shipment;
}

module.exports = easypostShippingStrategy;
