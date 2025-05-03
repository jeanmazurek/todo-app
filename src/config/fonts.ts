import { Fira_Code as FontMono, Cormorant as FontSerif } from "next/font/google";

// Definindo Helvetica como fonte do sistema
export const fontSans = {
  variable: "--font-sans",
  style: {
    fontFamily: '"Helvetica", "Helvetica Neue", Arial, sans-serif',
  },
};

export const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
