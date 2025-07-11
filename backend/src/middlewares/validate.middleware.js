import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Will throw if invalid
    next();
  } catch (error) {
    // Only catch Zod errors — fallback for all others
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.reduce((acc, curr) => {
          const field = curr.path[0];
          acc[field] = curr.message;
          return acc;
        }, {}),
      });
    }
    // Some other unexpected runtime error
    console.error("❌ Unexpected validation middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal validation error",
    });
  }
};

export { validate };
