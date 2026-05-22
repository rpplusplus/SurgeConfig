import { env } from 'bun'
import { Hono } from 'hono'
import { kDNS, kManualProxy, kRuleSet, kRules, kSetting, kSurgeConfig } from './config'

const app = new Hono()

type ConfigSection = string[][]

type ParsedConfig = {
  proxy: ConfigSection
  host: ConfigSection
}

const downloadConfig = async (url: string): Promise<string> => {
  console.log(`Downloading ${url}`)
  let resp = await fetch(url)
  let data = await resp.text()
  console.log(`Downloaded ${url}`)
  return data
}

const parseSection = (config: string, sectionName: string): ConfigSection => {
  let result: ConfigSection = []
  let currentSection = ""

  for (let line of config.split(/\r?\n/)) {
    let trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";")) {
      continue
    }

    let section = trimmed.match(/^\[(.+)\]$/)
    if (section) {
      currentSection = section[1]
      continue
    }

    if (currentSection !== sectionName) {
      continue
    }

    let separatorIndex = line.indexOf("=")
    if (separatorIndex < 0) {
      continue
    }

    let key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()
    if (key) {
      result.push([key, value])
    }
  }

  return result
}

const parseConfig = (config: string): ParsedConfig => {
  return {
    proxy: parseSection(config, "Proxy").filter(([name]) => name.toLowerCase() !== "direct"),
    host: parseSection(config, "Host"),
  }
}

const downloadConfigs = async (): Promise<[string, ParsedConfig][]> => {
  let resp = await Promise.all(kSurgeConfig.map(async ([name, url]) => {
    return [name, parseConfig(await downloadConfig(url))] as [string, ParsedConfig]
  }))

  return resp
}

const _buildSetting = (): string => {
  let result = ""
  let setting: any = kSetting
  Object.keys(setting).forEach((key) => {
    result += `[${key}]\n`
    let v = setting[key]
    Object.keys(v).forEach((key) => {
      result += `${key} = ${v[key]}\n`
    })

    result += "\n"
  })
  return result
}

const _buildProxy = (proxy: string[][]): string => {
  let result = "[Proxy]\n"
  result += "Direct = direct\n"
  result += proxy.map((x) => `${x[0]}=${x[1]}`).join("\n")
  result += "\n"
  return result
}

const _buildProxyGroup = (proxyNames: string[]): string => {
  let result = "[Proxy Group]\n"
  result += "Proxy = select, " + proxyNames.join(", ") + "\n"
  result += "Domestic = select, Direct, Proxy\n"

  for (let item of Object.keys(kRuleSet)) {
    if ((kRuleSet as any)[item].type === "direct") {
      continue
    }
    if ((kRuleSet as any)[item].excludeHKAndTW) {
      result += `${item} = select, ${proxyNames.filter((x) => !x.includes("HK") && !x.includes("香港") && !x.includes("Bandwidth") && !x.includes("中转") && !x.includes("TW")).join(", ")}\n`
    } else {
      result += `${item} = select, Direct, Proxy, ${proxyNames.join(", ")}\n`
    }
  }

  result += "Final = select, Direct, Proxy, " + proxyNames.join(", ") + "\n\n"

  return result
}

const _buildRules = (): string => {
  let result = "[Rule]\n"

  for (let [name, value] of Object.entries(kRuleSet)) {
    for (let url of value.url) {
      if (value.type === "direct") {
        result += `RULE-SET, ${url}, Direct\n`
      }

      if (value.type === "proxy") {
        result += `RULE-SET, ${url}, ${name}\n`
      }

    }
  }

  result += kRules.join("\n")
  result += "\n"
  return result
}

const _buildDNS = (hosts: ConfigSection): string => {
  let result = "[Host]\n"

  for (let [domain, ip] of hosts) {
    result += `${domain} = ${ip}\n`
  }

  return result;
}

app.get('/surge.conf', async (c) => {
  let r = `#!MANAGED-CONFIG http://${env.HOSTNAME}:${env.PORT}/surge.conf interval=43200\n`
  r += _buildSetting()
  let configs = await downloadConfigs()
  let proxy: string[][] = [...kManualProxy]
  let hosts: string[][] = [...kDNS]
  for (let [name, config] of configs) {
    for (let [key, value] of config.proxy) {
      proxy.push([`${name}-${key}`, value])
    }
    hosts.push(...config.host)
  }

  r += _buildProxy(proxy)
  let proxyNames = proxy.map((x) => x[0])
  r += _buildProxyGroup(proxyNames)
  r += _buildRules()
  r += _buildDNS(hosts)
  return c.text(r);
})

export default {
  port: env.PORT,
  fetch: app.fetch,
  hostname: env.HOSTNAME
} 
