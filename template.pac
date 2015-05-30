var PAC_DIRECT = 'DIRECT;';
var PAC_PROXY = 'SOCKS5 {{&proxy}}; SOCKS {{&proxy}}; PROXY {{&proxy}}; DIRECT;';

var hashFuncCount = {{&hashFuncCount}};
var white = {{&white}};

function FindProxyForURL(url, host) {
    if (isPlainHostName(host) || host === '127.0.0.1') {
        return PAC_DIRECT;
    }

    var pos = host.lastIndexOf('.');
    var suffix = host.substring(pos + 1);

    if (suffix === 'cn' || suffix === 'local') {
        return PAC_DIRECT;
    }

    if(white.length > 0){ 
        if (isDomainSafe(host)) {
            return PAC_DIRECT;
        }
    }

    if (isDomainInBloomFilter(host)){
        return PAC_PROXY;
    }

    return PAC_DIRECT;
}

function isDomainSafe(target) {
    var pos = target.lastIndexOf('.');
    pos = target.lastIndexOf('.', pos - 1);

    while (pos > 0) {
        suffix = target.substring(pos + 1);

        if (white.indexOf(suffix) >= 0) {
            return true;
        }

        pos = target.lastIndexOf('.', pos - 1);
    }

    return white.indexOf(target) >= 0;
}

function isDomainInBloomFilter(target){
    var pos = target.lastIndexOf('.');
    pos = target.lastIndexOf('.', pos - 1);

    while (pos > 0) {
        suffix = target.substring(pos + 1);
        if (bloomFilterTest(suffix)) {
            return true;
        }

        pos = target.lastIndexOf('.', pos - 1);
    }

    return bloomFilterTest(target);
}

function bloomFilterTest(host) {
    var l = bloomFilterLocations(host),
        i = -1,
        b;
    while (++i < hashFuncCount) {
      b = l[i];
      if (bloomfilter.charAt(b) === '0') {
        return false;
      }
    }
    return true;
}

function bloomFilterLocations(v){
    var m = bloomfilter.length,
        r = [],
        a = fnv_1a(v),
        b = fnv_1a_b(a),
        i = -1,
        x = a % m;
    while (++i < hashFuncCount) {
      r[i] = x < 0 ? (x + m) : x;
      x = (x + b) % m;
    }
    return r;
}

function fnv_1a(v) {
    var n = v.length,
        a = 2166136261,
        c,
        d,
        i = -1;
    while (++i < n) {
      c = v.charCodeAt(i);
      if (d = c & 0xff000000) {
        a ^= d >> 24;
        a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
      }
      if (d = c & 0xff0000) {
        a ^= d >> 16;
        a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
      }
      if (d = c & 0xff00) {
        a ^= d >> 8;
        a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
      }
      a ^= c & 0xff;
      a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
    }
    // From http://home.comcast.net/~bretm/hash/6.html
    a += a << 13;
    a ^= a >> 7;
    a += a << 3;
    a ^= a >> 17;
    a += a << 5;
    return a & 0xffffffff;
}

function fnv_1a_b(a) {
    a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
    a += a << 13;
    a ^= a >> 7;
    a += a << 3;
    a ^= a >> 17;
    a += a << 5;
    return a & 0xffffffff;
}

var bloomfilter = '{{&bloomfilter}}';
