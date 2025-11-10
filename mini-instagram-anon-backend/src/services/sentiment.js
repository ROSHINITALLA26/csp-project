import Sentiment from 'sentiment';
const sentiment = new Sentiment();

export function analyzeText(text) {
  if (!text) return { score: 0, comparative: 0, label: 'neutral' };
  const res = sentiment.analyze(text);
  const label = res.score > 1 ? 'positive' : res.score < -1 ? 'negative' : 'neutral';
  return { score: res.score, comparative: res.comparative, label };
}
