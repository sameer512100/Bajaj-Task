const { processData } = require("../services/hierarchyService");

function postBfhl(req, res) {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "`data` must be an array of strings." });
    }

    const result = processData(data);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

function getHealth(req, res) {
  return res.json({ status: "SRM BFHL API is running", endpoint: "POST /bfhl" });
}

module.exports = {
  postBfhl,
  getHealth,
};
