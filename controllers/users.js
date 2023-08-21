import mongoose from "mongoose";
import User from "../models/auth.js";
import Question from "../models/Question.js";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51NhTGGSBub0lWKavECwZUC5CQqXW8lEuxZqAwx1UtcOQ45sFNjhhfQsx4Om80Z1RyM2isXYUQRGxneG8fSYr4uUH00nNqBBWRz"
);

// export const updateProfile = async (req, res) => {
//   const { id: _id } = req.params;
//   const { name, about, tags } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).send("Profile unavailable...");
//   }

//   try {
//     const updatedProfile = await Question.findByIdAndUpdate(
//       _id,
//       { $set: { name: name, about: about, tags: tags } },
//       { new: true }
//     );
//     res.status(200).json(updatedProfile);
//   } catch (error) {
//     res.status(405).json({ message: error.message });
//   }
// };

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  const { id, type } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("User unavailable...");
  }
  try {
    const updatedSubscription = await User.findByIdAndUpdate(
      id,
      { $set: { subscription: type } },
      { new: true }
    );
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    if (req.method != "POST") return res.status(400);
    const { name, email, paymentMethod, productId } = req.body;
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });
    // Create a product
    const product = await stripe.products.retrieve(productId);
    // Create a subscription
    let amount = "0";
    if (productId === "prod_O9pjsBVkDvAtrb") {
      amount = "10000";
    } else if (productId === "prod_O9q8GjzCtGxnD4");
    {
      amount = "100000";
    }
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "INR",
            product: product.id,
            unit_amount: amount,
            recurring: {
              interval: "month",
            },
          },
        },
      ],

      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });
    // Send back the client secret for payment

    res.json({
      message: "Subscription successfully initiated",
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const currentUser = async (req, res) => {
  const { id } = req.params;
  const { noOfQuestionsPosted, lastPostedDate } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("User unavailable...");
  }
  try {
    const data = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          noOfQuestionsPosted: noOfQuestionsPosted,
          lastPostedDate: lastPostedDate,
        },
      },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("User unavailable...");
  }
  try {
    const data = await User.findById(_id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// export const updateProfile = async (req, res) => {
//   const { id: _id } = req.params;
//   const { name, about, tags } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).send("question unavailable...");
//   }

//   try {
//     const updatedProfile = await User.findByIdAndUpdate(
//       _id,
//       { $set: { name: name, about: about, tags: tags } },
//       { new: true }
//     );
//     res.status(200).json(updatedProfile);
//   } catch (error) {
//     res.status(405).json({ message: error.message });
//   }
// };

export const getallUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    const allUserDetails = [];
    allUsers.forEach((users) => {
      allUserDetails.push({
        _id: users._id,
        name: users.name,
        about: users.about,
        tags: users.tags,
        joinedOn: users.joinedOn,
        subscription: users.subscription,
        noOfQuestionsPosted: users.noOfQuestionsPosted,
        lastPostedDate: users.lastPostedDate,
        username: users.username,
        profilePicture: users.profilePicture,
      });
    });
    res.status(200).json(allUserDetails);
  } catch (error) {
    res.status(404).json({ message: "User fetch failed" });
  }
};
