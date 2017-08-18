import { writeFileSync } from "fs"
import { resolve } from "path"
import { sync as mkdirpSync } from "mkdirp"
import { minify } from "uglify-es"
import { sync as rimraf } from "rimraf"

function mergeData(...sources) {
  return sources.reduce(
    (data, source) => {
      Object.keys(source || {}).forEach((locale) => {
        data[locale] = Object.assign(data[locale] || {}, source[locale])
      })

      return data
    },
    {}
  )
}

function reviver(k, v) {
  let idx

  if (k === "locale")
    return v
  else if (typeof v === "string") {
    idx = prims.indexOf(v)
    valCount++

    if (idx === -1) idx += prims.push(v)

    return `###prims[${idx}]###`
  } else if (typeof v === "object" && v !== null) {
    const str = JSON.stringify(v)
    objCount++

    if (objStrs.hasOwnProperty(str)) return objStrs[str]

    // We need to make sure this object is not added to the same
    // array as an object it references (and we need to check
    // this recursively)
    let depth
    let objDepths = [ 0 ]

    for (let key in v) {
      if (
        typeof v[key] === "string" && (depth = v[key].match(/^###objs\[(\d+)/))
      )
        objDepths.push(+depth[1] + 1)
    }

    depth = Math.max(...objDepths)

    if (!Array.isArray(objs[depth])) objs[depth] = []

    idx = objs[depth].push(v) - 1
    objStrs[str] = `###objs[${depth}][${idx}]###`

    return objStrs[str]
  }

  return v
}

// -----------------------------------------------------------------------------

console.log("Cleaning up...")

rimraf("locale-data")
mkdirpSync("locale-data/")

// extracting data into CLDR

// Regex for converting locale JSON to object grammar, obviously simple and
// incomplete but should be good enough for the CLDR JSON
const jsonpExp = /"(?!default)([\w$][\w\d$]+)":/g

import reduceLocaleData from "./utils/reduce"

import extractCalendars from "./utils/extract-calendars"
import extractNumbersFields from "./utils/extract-numbers"
import { getAllLocales } from "./utils/locales"

console.log("Extracting data...")

// Default to all CLDR locales.
const locales = getAllLocales()

// Each type of data has the structure: `{"<locale>": {"<key>": <value>}}`,
// which is well suited for merging into a single object per locale. This
// performs that deep merge and returns the aggregated result.
let locData = mergeData(
  extractCalendars(locales),
  extractNumbersFields(locales)
)

const allScriptified = []
Object.keys(locData).forEach((locale) => {
  // Ignore en-US-POSIX and root
  if (locale.toLowerCase() === "en-us-posix") {
    return
  }

  console.log("Writing data for:", locale)
  const obj = reduceLocaleData(locale, locData[locale])
  const stringified = JSON.stringify(obj, null, 0)
  writeFileSync(`locale-data/${locale}.json`, stringified)
  const scriptified = minify(`global.IntlPolyfill = require("lean-intl"); IntlPolyfill.__addLocaleData(${stringified})`)
  if (scriptified.error) {
    throw new Error("Error during JS compression: " + scriptified.error)
  }
  writeFileSync(`locale-data/${locale}.js`, scriptified.code)
  allScriptified.push(`IntlPolyfill.__addLocaleData(${stringified})`)
})

console.log("Writing complete data package (for tests)...")
writeFileSync(`tests/nodedata.js`, allScriptified.join("\n"))

console.log(`Total number of locales is ${Object.keys(locData).length}`)

process.on("unhandledRejection", (reason) => {
  throw reason
})
