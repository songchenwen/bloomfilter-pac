# bloomfilter-pac

Convert GFW list to a pac file with bloomfilter

## Bloom Filter

A Bloom filter is a space-efficient probabilistic data structure, conceived by Burton Howard Bloom in 1970, that is used to test whether an element is a member of a set.

Bloom proposed the technique for applications where the amount of source data would require an impracticably large hash area in memory if "conventional" error-free hashing techniques were applied.

[Wikipedia](http://en.wikipedia.org/wiki/Bloom_filter)

## Usage

~~~ bash
npm install
node index.js
~~~

The output pac file will be `bloomfilter.pac`.

## Config

Edit `config.json` to provide proxy and white and black list configuration.

User defined white and black list has privilege over GFW list.
