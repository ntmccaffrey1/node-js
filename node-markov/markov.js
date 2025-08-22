/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};
    const words = this.words;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const nextWord = words[i + 1] ?? null;

      if (!this.chains[word]) {
        this.chains[word] = [];
      }  

      this.chains[word].push(nextWord);
    }

    return this.chains;
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    if (!this.chains || !Object.keys(this.chains).length) return "";

    const keys = Object.keys(this.chains);
    let startingWord = keys[Math.floor(Math.random() * keys.length)];
    const output = [startingWord];

    while (output.length < numWords) {
      const currentWord = output[output.length - 1];
      const nextWords = this.chains[currentWord];

      if (!nextWords) break;

      const next = nextWords[Math.floor(Math.random() * nextWords.length)];

      if (next === null) {
        break; 
      } else {
        output.push(next);
      }
    }

    return output.join(" ");
  }
}

module.exports = { MarkovMachine };