const validationSources = {
  body: "body",
  params: "params",
  query: "query",
};

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    if (!validationSources[source]) {
      return res.status(500).json({
        success: false,
        message: `Invalid validation source: ${source}`,
      });
    }

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req[source] = result.data;

    next();
  };
};