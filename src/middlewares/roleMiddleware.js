export const isOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({
      message: "Access denied: owner only",
    });
  }
  next();
};

export const isStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({
      message: "Access denied: staff only",
    });
  }
  next();
};
