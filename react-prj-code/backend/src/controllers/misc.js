const show404 = (req, res) => {
  res.status(404).json({ message: "ERROR: Resource not found." });
};

const showDefault = (req, res) => {
  res.status(200).json({ message: "INFO: CI Central v2 API." });
};

module.exports = {
  show404: show404,
  showDefault: showDefault,
};
