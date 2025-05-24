const shippingWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    if (!event || !data) return res.status(400).send("Invalid webhook");

    switch (event) {
      case "track_updated":
        const { tracking_number, tracking_status } = data;

        const updated = await Shipment.findOneAndUpdate(
          { "label.tracking_number": tracking_number },
          {
            tracking_status,
            $push: { tracking_history: tracking_status },
            status: tracking_status?.status || "UNKNOWN",
          },
          { new: true }
        );

        if (updated) {
          console.log(
            `Webhook: Tracking updated for ${tracking_number} to ${tracking_status.status}`
          );
        } else {
          console.warn(`Webhook: No shipment found for ${tracking_number}`);
        }

        break;

      default:
        console.log(`Webhook: Event "${event}" received, but not handled.`);
        break;
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  shippingWebhook,
};
