import * as HttpClient from "@effect/platform/HttpClient"
import * as HttpClientRequest from "@effect/platform/HttpClientRequest"
import { Effect, Schedule } from "effect"

export interface DownloadResult {
  readonly content: string
  readonly status: number
}

export const downloadFile = (url: string): Effect.Effect<DownloadResult, Error, HttpClient.HttpClient> =>
  Effect.gen(function*() {
    const client = yield* HttpClient.HttpClient
    const request = HttpClientRequest.get(url)
    const response = yield* client.execute(request)
    const status = response.status

    if (status !== 200) {
      return yield* Effect.fail(
        new Error(`Failed to download file from ${url}: HTTP ${status}`)
      )
    }

    const content = yield* response.text
    return { content, status }
  })

export const downloadFileWithRetry = (
  url: string,
  maxRetries = 3
): Effect.Effect<DownloadResult, Error, HttpClient.HttpClient> =>
  downloadFile(url).pipe(
    Effect.retry(
      Schedule.exponential("100 millis").pipe(
        Schedule.intersect(Schedule.recurs(maxRetries))
      )
    )
  )
