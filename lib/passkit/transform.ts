function transform(str: string) {
  return str
    .split("\n")
    .map((line) => (line ? JSON.parse(line)?.result : null))
    .filter(Boolean);
}

export default transform;
