import type { CreateProblemFormDTO } from "../schemas/problemSchema";

export const DEFAULT_PROBLEM_TEMPLATE: CreateProblemFormDTO = {
  slug: "count-vowels",
  title: "Count Vowels",
  description:
    "Given a string, count the number of vowels (a, e, i, o, u) in it. Vowels can be uppercase or lowercase.",

  difficulty: "EASY",
  no: 1,

  originalSource: {
    name: "GFG",
    logo: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
    link: "https://www.geeksforgeeks.org/dsa/program-count-vowels-string-iterative-recursive/",
  },

  hints: [
    "Remember that vowels include both uppercase and lowercase letters: a, e, i, o, u, A, E, I, O, U.",
    "You can iterate through each character in the string and check if it is a vowel.",
    "Using a set or list to store vowels can help you check membership efficiently.",
  ],

  constraints: "1 <= length of input string <= 10^5",

  metadata: {
    topics: ["String"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  tags: ["string", "math", "counting", "vowel"],
  companies: ["Google", "Microsoft"],

  examples: [
    {
      input: "hello",
      output: "2",
      explanation: "The vowels are 'e' and 'o'.",
    },
    {
      input: "OpenAI",
      output: "4",
      explanation: "The vowels are 'O', 'e', 'A', and 'I'.",
    },
    {
      input: "rhythm",
      output: "0",
      explanation: "There are no vowels in this string.",
    },
    {
      input: "AEIOUaeiou",
      output: "10",
      explanation: "All vowels in both uppercase and lowercase are present.",
    },
    {
      input: "Python Programming",
      output: "4",
      explanation: "The vowels are 'o', 'o', 'a', and 'i'.",
    },
  ],

  starterCodes: {
    JAVASCRIPT: `function countVowels(str) {
  // your code here
}`,
    PYTHON: `def count_vowels(s):
    # your code here
    pass`,
    CPP: `int countVowels(string s) {
  // your code here
}`,
    JAVA: `public static int countVowels(String s) {
    // your code here
    return 0;
}`,
  },

  wrapperCodes: {
    JAVASCRIPT: `// JavaScript wrapper

PLACEHOLDER

const fs = require("fs");
const input = fs.readFileSync(0, "utf-8").trim();
console.log(countVowels(input));`,

    PYTHON: `# Python wrapper

PLACEHOLDER

import sys
input_data = sys.stdin.read().strip()
print(count_vowels(input_data))`,

    CPP: `// C++ wrapper
#include <iostream>
#include <string>
using namespace std;

PLACEHOLDER

int main() {
    string input;
    getline(cin, input);
    cout << countVowels(input) << endl;
    return 0;
}`,

    JAVA: `import java.util.Scanner;

public class Main {

    PLACEHOLDER

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        System.out.println(countVowels(input));
    }
}`,
  },

  referenceSolutions: {
    JAVASCRIPT: `function countVowels(str) {
  return (str.match(/[aeiou]/gi) || []).length;
}`,
    PYTHON: `def count_vowels(s):
    return sum(1 for c in s.lower() if c in 'aeiou')`,
    CPP: `int countVowels(string s) {
  int count = 0;
  for (char c : s) {
    c = tolower(c);
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
      count++;
  }
  return count;
}`,
    JAVA: `public static int countVowels(String s) {
    int count = 0;
    for (char c : s.toLowerCase().toCharArray()) {
        if ("aeiou".indexOf(c) != -1)
            count++;
    }
    return count;
}`,
  },
  testCases: [
    { input: "aeiou", output: "5" },
    { input: "bcdfg", output: "0" },
    { input: "ABCDE", output: "2" },
    { input: "The quick brown fox", output: "5" },
    { input: "JUMPED OVER THE LAZY DOG", output: "7" },
    { input: "xyz", output: "0" },
    { input: "Artificial Intelligence", output: "10" },
    { input: "aaaAAA", output: "6" },
    { input: "eIoU", output: "4" },
    { input: "vowel", output: "2" },
    { input: "consonant", output: "3" },
    { input: "Supercalifragilisticexpialidocious", output: "16" },
    { input: "Why?", output: "0" },
    { input: "Are you sure?", output: "6" },
    { input: "Unbelievable!", output: "6" },
    { input: " ", output: "0" },
    { input: "A", output: "1" },
    { input: "B", output: "0" },
  ],
};
