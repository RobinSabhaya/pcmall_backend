const {
  createShipment,
  buyLabel,
  trackShipment,
} = require("../../src/services/shipping/carriers/shippo");
const shippingService = require("../../src/services/shipping/shipping.service");

// Create a shipment, buy label, and save to DB
const createAndBuyLabel = async (req, res) => {
  try {
    const { from_address, to_address, parcel, metadata } = req.body;

    // 1. Create shipment
    const shippoShipment = await createShipment({
      from_address,
      to_address,
      parcel,
    });

    const rates = shippoShipment.rates;
    const selectedRate = rates[0]; // Pick cheapest for now

    const label = await buyLabel(selectedRate.objectId);

    const payload = {
      shippo_shipment_id: shippoShipment.objectId,
      from_address,
      to_address,
      parcel,
      rates,
      selected_rate: selectedRate,
      label: {
        label_url: label.labelUrl,
        label_type: label.labelFileType,
        tracking_number: label.trackingNumber,
        carrier: label.trackingUrlProvider,
        transaction_id: label.objectId,
      },
      tracking_status: label.trackingStatus || {},
      tracking_history: label.trackingStatus ? [label.trackingStatus] : [],
      status: label.trackingStatus || "UNKNOWN",
      metadata,
      shipment_type: "OUTGOING",
      is_return: false,
    };

    const shipment = shippingService.createAndUpdateShipping(payload, payload, {
      new: true,
      upsert: true,
    });

    return res.status(200).json({
      success: true,
      data: shipment,
      message: "Shipping created successfully!",
    });
  } catch (error) {
    console.error("Create shipment error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// Manual tracking endpoint (optional)
const track = async (req, res) => {
  try {
    const { carrier, tracking_number } = req.params;

    const tracking = await trackShipment(carrier, tracking_number);
    console.log("🚀 ~ track ~ tracking:", tracking);

    // Optional: update DB with fresh status
    // await shippingService.createAndUpdateShipping(
    //   { "label.tracking_number": tracking_number },
    //   {
    //     tracking_status: tracking.,
    //     $push: { tracking_history: tracking.tracking_status },
    //     status: tracking.tracking_status?.status || "UNKNOWN",
    //   }
    // );

    res.status(200).json({
      success: true,
      data: tracking,
      message: "Shipping created successfully!",
    });
  } catch (error) {
    console.error("Create shipment error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  createAndBuyLabel,
  track,
};
