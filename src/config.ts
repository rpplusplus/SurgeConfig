const kSurgeConfig = [
    //["NAME", "CONFIG_URL"], 
]

const kRuleSet = {
    "Apple": {
        "url": [
            "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Apple/Apple.list",
            //            "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Apple/Apple_Domain.list",
        ],
        "type": "proxy"
    },
    "OpenAI": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/OpenAI/OpenAI.list"],
        "type": "proxy",
        "excludeHKAndTW": true
    },
    "TikTok": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/TikTok/TikTok.list"],
        "type": "proxy"
    },
    "Disney": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Disney/Disney.list"],
        "type": "proxy"
    },
    "Netflix": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Netflix/Netflix.list"],
        "type": "proxy"
    },
    "Microsoft": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Microsoft/Microsoft.list"],
        "type": "proxy"
    },
    "Claude": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Claude/Claude.list"],
        "type": "proxy",
        "excludeHKAndTW": true
    },
    "Gemini": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Gemini/Gemini.list"],
        "type": "proxy",
        "excludeHKAndTW": true
    },
    "Google": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Google/Google.list"],
        "type": "proxy"
    },
    "Global": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Global/Global.list"],
        "type": "proxy"
    },
    "Github": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/GitHub/GitHub.list"],
        "type": "proxy"
    },
    "China": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/China/China_All.list"],
        "type": "direct"
    },
    "ChinaIP": {
        "url": ["https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/ChinaIPs/ChinaIPs.list"],
        "type": "direct"
    }
}

const kRules = [
    "IP-CIDR,192.168.0.0/16,Direct",
    "IP-CIDR,10.0.0.0/8,Direct",
    "IP-CIDR,172.16.0.0/12,Direct",
    "IP-CIDR,127.0.0.0/8,Direct",
    "IP-CIDR,100.64.0.0/10,Direct",
    "IP-CIDR,224.0.0.0/4,Direct",
    "FINAL,Final,dns-failed",
]

const kSetting = {
    "General": {
        "http-listen": "0.0.0.0:8888",
        "socks5-listen": "0.0.0.0:8889",
        "external-controller-access": "yourpassword@0.0.0.0:6170",//password
        "internet-test-url": "http://www.gstatic.com/generate_204",
        "proxy-test-url": "http://www.gstatic.com/generate_204",
        "test-timeout": "3",
        "ipv6": "false",
        "show-error-page-for-reject": "true",
        "dns-server": "8.8.8.8, 114.114.114.114, 119.28.28.28",
        "loglevel": "notify",
        "skip-proxy": "127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, 100.64.0.0/10, 17.0.0.0/8, localhost, *.local, *.crashlytics.com",
        "exclude-simple-hostnames": "true",
        "use-default-policy-if-wifi-not-primary": "false",
        "allow-wifi-access": "true",
        "enhanced-mode-by-rule": "false",
    },
    "Replica": {
        "hide-apple-request": "true",
        "hide-crashlytics-request": "true",
        "hide-udp": "false",
        "keyword-filter-type": "false",
    },
}

const kDNS = [
    //[domain, ip]
];
export { kDNS, kRuleSet, kRules, kSetting, kSurgeConfig };

