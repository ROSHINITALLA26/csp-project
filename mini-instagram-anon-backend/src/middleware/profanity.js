import Filter from 'bad-words';
const filter = new Filter();

export function blockProfanity(req, res, next) {
  const text = (req.body.text || '').toString();
  if (!text) return next();
  if (filter.isProfane(text)) {
    return res.status(400).json({ error: 'Comment contains disallowed language.' });
  }
  next();
}
