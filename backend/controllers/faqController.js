import FAQ from "../models/faqModel.js";

// Create a new FAQ
export const createFAQ = async (req, res) => {
  const { question, answer, category } = req.body;

  try {
    const newFAQ = new FAQ({ question, answer, category });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all FAQs
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get FAQ by ID
export const getFAQById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer, category } = req.body;

  try {
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.category = category || faq.category;

    await faq.save();
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.status(200).json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Chatbot response
export const chatbotResponse = async (req, res) => {
  const { question } = req.body;

  try {
    const faq = await FAQ.findOne({
      question: { $regex: question, $options: "i" },
    });
    if (!faq) {
      return res.status(404).json({ message: "No matching FAQ found" });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};