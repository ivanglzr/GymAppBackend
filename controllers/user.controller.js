export async function loginUser(req, res) {
  const user = req.body;

  return res.status(200).json({
    user,
  });
}
