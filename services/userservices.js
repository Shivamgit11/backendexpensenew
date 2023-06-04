const getExpense = (req) => {
  return req.user.getExpense();
};

module.exports = {
  getExpense,
};
