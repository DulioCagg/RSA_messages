const bigInt = require('big-integer');

class RSA {

  // Generates a random number within the number of bites passed
  static randomPrime(numberBits) {
    const min = bigInt.one.shiftLeft(numberBits - 1);
    const max = bigInt.one.shiftLeft(numberBits).prev();

    while (true) {
      let p = bigInt.randBetween(min, max);
      if (p.isProbablePrime(256)) {
        return p;
      }
    }
  }

  // Generates a random value for e in range(1, max)
  static randomE(max) {
    while (true) {
      let e = bigInt.randBetween(1, max);
      if (bigInt.gcd(e, max).equals(1)) {
        return e;
      }
    }
  }

  static toKey(str) {
    return str.split("").map(i => i.charCodeAt()).reduce((acc, x) => acc += x);
  }

  // Initializes the values for the user, returning e, n and d
  static generate(keySize) {
    let p;
    let q;
    let totient;
    let n;
    let e;
    const num = Math.floor(keySize / 2);
    do {


      p = this.randomPrime(num);
      q = this.randomPrime(num);
      n = p.multiply(q);
      totient = p.prev().multiply(q.prev());
      e = this.randomE(totient);
    } while (bigInt.gcd(e, totient).notEquals(1));

    return {
      n,
      e,
      d: e.modInv(totient),
    };
  }

  static encrypt(message, n, e) {
    return bigInt(message).modPow(e, n);
  }

  static decrypt(message, d, n) {
    return bigInt(message).modPow(d, n);
  }

  static encode(str) {
    const code = str.split("").map(i => i.charCodeAt()).join("");

    return bigInt(code);
  }

  static decode(code) {
    const str = code.toString();
    let result = "";

    for (let i = 0; i < str.length; i += 2) {
      let num = Number(str.substr(i, 2));

      if (num <= 30) {
        result += String.fromCharCode(Number(str.substr(i, 3)));
        i++
      } else {
        result += String.fromCharCode(num);
      }
    }

    return result;
  }
}

const user = "dulio";
const message = "meet me after the toga party"
const key = RSA.toKey(user);

const userKeys = RSA.generate(key);

const encoded_message = RSA.encode(message);
const encrypted_message = RSA.encrypt(encoded_message, userKeys.n, userKeys.e);
const decrypted_message = RSA.decrypt(encrypted_message, userKeys.d, userKeys.n);
const decoded_message = RSA.decode(decrypted_message);

console.log("message: ", message);
console.log("Encrypted: ", encrypted_message.toString());
console.log("Decoded: ", decoded_message.toString());


exports.RSA = RSA;