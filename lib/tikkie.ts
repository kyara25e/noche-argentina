
export const TIKKIE_LINKS: Record<number, string> = {
  1: "https://tikkie.me/pay/65h509jg0v1q2f9jt9es",
  2: "https://tikkie.me/pay/pidlvkt36sllnjiqihof",
  3: "https://tikkie.me/pay/veb31qv3lmpc6rdob4u6",
  4: "https://tikkie.me/pay/2ha833iselk4rtlfdavo",
  5: "https://tikkie.me/pay/n3824f0deh7jpidsk86e",
  6: "https://tikkie.me/pay/5rglurculqo73ecd0rcc",
  7: "https://tikkie.me/pay/fr7h8vphfnq67db3145p",
  8: "https://tikkie.me/pay/peqlptlpprntpasr8pk8",
};

export function getTikkieLink(
  people: number
): string | null {
  return TIKKIE_LINKS[people] ?? null;
}