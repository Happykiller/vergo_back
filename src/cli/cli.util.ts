// src\cli\cli.util.ts
import * as readline from 'readline';

export function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}
