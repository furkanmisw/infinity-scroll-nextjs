import data from "./data.json";

export default function handler(req, res) {
  let { skip } = req.query;
  skip = parseInt(skip) || 0;

  const filter = data.filter((todo) => todo.id > skip && todo.id <= skip + 20); 

  res.status(200).json(filter);
}
