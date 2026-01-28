import { writeFileSync, existsSync } from "fs"

const logFile = process.env.LOG_FILE
const logFileEnrcihed = process.env.LOG_FILE_ENRICHED

export const logService = (
  decs: string,
  res: string,
  resEnrcihed: string
) => {
  const timestamp = (new Date()).toString()
  if(logFile && existsSync(logFile)) {
    writeFileSync(logFile, `[${timestamp}]\n${decs}\n${JSON.stringify(res)}\n`, { flag: "a" })
  }

  if(logFileEnrcihed && existsSync(logFileEnrcihed)) {
    writeFileSync(logFileEnrcihed, `[${timestamp}]\n${decs}\n${JSON.stringify(resEnrcihed)}\n`, { flag: "a" })
  }

  console.log(`[${timestamp}]\n${decs}\n${JSON.stringify(res)}\n`)
}